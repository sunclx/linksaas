
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { useDrag } from 'react-dnd';
import type { IssueInfo } from "@/api/project_issue";
import { ISSUE_STATE_PROCESS, ISSUE_TYPE_TASK, ISSUE_TYPE_BUG, ISSUE_STATE_PLAN, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE } from "@/api/project_issue";
import { Progress, Space, Tag } from "antd";
import { ISSUE_STATE_COLOR_ENUM, bugLevel, bugPriority, taskPriority } from "@/utils/constant";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { EditOutlined, ExportOutlined, WarningOutlined } from "@ant-design/icons";
import { showShortNote } from "@/utils/short_note";
import { SHORT_NOTE_BUG, SHORT_NOTE_TASK } from "@/api/short_note";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import s from "./KanbanCard.module.less";
import classNames from "classnames";

export const DND_ITEM_TYPE = "issue";

interface KanbanCardProps {
    issue: IssueInfo;
}

const getColor = (v: number) => {
    switch (v) {
        case ISSUE_STATE_PLAN:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
        case ISSUE_STATE_PROCESS:
            return ISSUE_STATE_COLOR_ENUM.处理颜色;
        case ISSUE_STATE_CHECK:
            return ISSUE_STATE_COLOR_ENUM.验收颜色;
        case ISSUE_STATE_CLOSE:
            return ISSUE_STATE_COLOR_ENUM.关闭颜色;
        default:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
    }
};

const KanbanCard: React.FC<KanbanCardProps> = (props) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const memberStore = useStores('memberStore');

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: props.issue,
        canDrag: props.issue.user_issue_perm.next_state_list.length != 0,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [hover, setHover] = useState(false);

    return (
        <div ref={drag} style={{
            display: isDragging ? "none" : "block",
            cursor: isDragging ? "pointer" : "move",
        }} onMouseEnter={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(true);
        }}
            onMouseLeave={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(false);
            }}>
            <div className={classNames(s.card_wrap, props.issue.user_issue_perm.next_state_list.length == 0 ? s.disable : "")} style={{ borderLeft: `6px solid rgb(${getColor(props.issue.state)} / 80%)` }}>
                <div className={s.head}>
                    <div style={{ flex: 1, fontSize: "14px", fontWeight: 600 }}>{`${props.issue.issue_type == ISSUE_TYPE_TASK ? "任务" : "缺陷"} #${props.issue.issue_index}`}</div>
                    {hover == true && (
                        <Space>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                showShortNote(userStore.sessionId, {
                                    shortNoteType: props.issue.issue_type == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
                                    data: props.issue,
                                }, projectStore.curProject?.basic_info.project_name ?? "");

                            }}><ExportOutlined style={{ width: "20px" }} /></a>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (props.issue.issue_type == ISSUE_TYPE_TASK) {
                                    linkAuxStore.goToLink(new LinkTaskInfo("", props.issue.project_id, props.issue.issue_id), history);
                                } else if (props.issue.issue_type == ISSUE_TYPE_BUG) {
                                    linkAuxStore.goToLink(new LinkBugInfo("", props.issue.project_id, props.issue.issue_id), history);
                                }
                            }}><EditOutlined style={{ width: "20px" }} /></a>
                        </Space>
                    )}
                </div>
                <h4 className={s.title}><a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.issue.issue_type == ISSUE_TYPE_TASK) {
                        linkAuxStore.goToLink(new LinkTaskInfo("", props.issue.project_id, props.issue.issue_id), history);
                    } else if (props.issue.issue_type == ISSUE_TYPE_BUG) {
                        linkAuxStore.goToLink(new LinkBugInfo("", props.issue.project_id, props.issue.issue_id), history);
                    }
                }}>{props.issue.basic_info.title}</a></h4>
                {props.issue.exec_user_id != "" && (
                    <div className={s.member}>
                        <Space>
                            <span>执行人:</span>
                            <UserPhoto logoUri={memberStore.getMember(props.issue.exec_user_id)?.member.logo_uri ?? ""} width="16px"
                                style={{ borderRadius: "10px" }} />
                            <span>{props.issue.exec_display_name}</span>
                        </Space>
                    </div>
                )}
                {props.issue.check_user_id != "" && (
                    <div className={s.member}>
                        <Space>
                            <span>检查人:</span>
                            <UserPhoto logoUri={memberStore.getMember(props.issue.check_user_id)?.member.logo_uri ?? ""} width="16px"
                                style={{ borderRadius: "10px" }} />
                            <span>{props.issue.check_display_name}</span>
                        </Space>
                    </div>
                )}
                {props.issue.estimate_minutes > 0 && props.issue.remain_minutes >= 0 && props.issue.state == ISSUE_STATE_PROCESS && (
                    <div>
                        <Progress
                            percent={Math.round((props.issue.estimate_minutes - props.issue.remain_minutes) / props.issue.estimate_minutes * 100)}
                            size="small"
                            showInfo={false} />
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "10px" }}>
                            {props.issue.remain_minutes > props.issue.estimate_minutes && <WarningOutlined style={{ fontSize: "16px", paddingRight: "6px", color: "red" }} />}
                            {(props.issue.remain_minutes / 60).toFixed(1)}小时(剩余)&nbsp;/&nbsp;{(props.issue.estimate_minutes / 60).toFixed(1)}小时(预估)
                        </div>
                    </div>
                )}
                <div className={s.tips}>
                    {props.issue.exec_user_id == "" && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea", color: "red" }}>
                            <span style={{ color: "red" }}><WarningOutlined />&nbsp;未设置执行人</span>
                        </Tag>
                    )}
                    {props.issue.check_user_id == "" && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span style={{ color: "red" }}><WarningOutlined />&nbsp;未设置检查人</span>
                        </Tag>
                    )}
                    {props.issue.re_open_count > 0 && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span style={{ color: "red" }}><WarningOutlined />&nbsp;重新打开次数&nbsp;{props.issue.re_open_count}</span>
                        </Tag>
                    )}
                    {props.issue.msg_count > 0 && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span>&nbsp;评论数&nbsp;{props.issue.msg_count}</span>
                        </Tag>
                    )}
                    {props.issue.state == ISSUE_STATE_PROCESS && props.issue.estimate_minutes <= 0 && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span style={{ color: "red" }}><WarningOutlined />&nbsp;未设置预估时间</span>
                        </Tag>
                    )}
                    {props.issue.issue_type == ISSUE_TYPE_TASK && (
                        <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                            <span style={{ color: taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].color }}>
                                优先级{taskPriority[props.issue.extra_info.ExtraTaskInfo?.priority ?? 0].label}
                            </span>
                        </Tag>
                    )}
                    {props.issue.issue_type == ISSUE_TYPE_BUG && (
                        <>
                            <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                                <span style={{ color: bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].color }}>{bugPriority[props.issue.extra_info.ExtraBugInfo?.priority ?? 0].label}</span>
                            </Tag>
                            <Tag style={{ border: "none", backgroundColor: "#fffaea" }}>
                                缺陷级别:&nbsp;
                                <span style={{ color: bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].color }}>{bugLevel[props.issue.extra_info.ExtraBugInfo?.level ?? 0].label}</span>
                            </Tag>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(KanbanCard);