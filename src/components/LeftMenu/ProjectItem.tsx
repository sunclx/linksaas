import React, { useState } from "react";
import cls from './index.module.less';
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Badge, Input, Popover, message } from "antd";
import { APP_PROJECT_CHAT_PATH, PROJECT_STATE_OPT_ENUM } from "@/utils/constant";
import { DoubleRightOutlined, FolderFilled, VideoCameraOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { WebProjectInfo } from "@/stores/project";
import type { ProjectInfo } from "@/api/project";
import { useSetState } from "ahooks";
import ActionModal from '../ActionModal';
import Button from '../Button';
import { request } from "@/utils/request";
import { close, open, remove } from '@/api/project';
import { leave } from '@/api/project_member';
import PrjTodoIssueList from "./PrjTodoIssueList";
import { ISSUE_TYPE_TASK, ISSUE_TYPE_BUG } from '@/api/project_issue';

const ProjectItem: React.FC<{ item: WebProjectInfo }> = ({ item }) => {
    const [hover, setHover] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [pjChangeObj, setPjChangeObj] = useSetState({
        visible: false,
        type: PROJECT_STATE_OPT_ENUM.FINISH,
        text: '结束',
        name: '',
        pjId: '',
    });

    const history = useHistory();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const docSpaceStore = useStores('docSpaceStore');
    const memberStore = useStores('memberStore');
    const userStore = useStores('userStore');

    const pjItemChange = (obj: ProjectInfo, type: PROJECT_STATE_OPT_ENUM) => {
        switch (type) {
            case PROJECT_STATE_OPT_ENUM.FINISH:
                setDisableBtn(false);
                setPjChangeObj({
                    visible: true,
                    type: PROJECT_STATE_OPT_ENUM.FINISH,
                    text: '结束',
                    name: obj.basic_info.project_name,
                    pjId: obj.project_id,
                });
                return;
            case PROJECT_STATE_OPT_ENUM.ACTIVATE:
                setDisableBtn(false);
                setPjChangeObj({
                    visible: true,
                    type: PROJECT_STATE_OPT_ENUM.ACTIVATE,
                    text: '激活',
                    name: obj.basic_info.project_name,
                    pjId: obj.project_id,
                });
                return;
            case PROJECT_STATE_OPT_ENUM.QUIT:
                setDisableBtn(false);
                setPjChangeObj({
                    visible: true,
                    type: PROJECT_STATE_OPT_ENUM.QUIT,
                    text: '退出',
                    name: obj.basic_info.project_name,
                    pjId: obj.project_id,
                });
                return;
            case PROJECT_STATE_OPT_ENUM.REMOVE:
                setDisableBtn(true);
                setPjChangeObj({
                    visible: true,
                    type: PROJECT_STATE_OPT_ENUM.REMOVE,
                    text: '删除',
                    name: obj.basic_info.project_name,
                    pjId: obj.project_id,
                });
                return;
            default:
                break;
        }
    };

    const submitPjItem = async () => {
        if (pjChangeObj.type === PROJECT_STATE_OPT_ENUM.FINISH) {
            try {
                await request(close(userStore.sessionId, pjChangeObj.pjId));
                message.success('项目结束成功');
                setPjChangeObj({ visible: false });
                projectStore.updateProject(pjChangeObj.pjId);
            } catch (error) { }
            return;
        } else if (pjChangeObj.type === PROJECT_STATE_OPT_ENUM.ACTIVATE) {
            try {
                await request(open(userStore.sessionId, pjChangeObj.pjId));
                message.success('项目激活成功');
                setPjChangeObj({ visible: false });
                projectStore.updateProject(pjChangeObj.pjId);
            } catch (error) { }
            return;
        } else if (pjChangeObj.type === PROJECT_STATE_OPT_ENUM.QUIT) {
            try {
                await request(leave(userStore.sessionId, pjChangeObj.pjId));
                message.success('项目退出成功');
                setPjChangeObj({ visible: false });
                projectStore.removeProject(pjChangeObj.pjId, history);
            } catch (error) {
                console.log(error);
            }
            return;
        } else if (pjChangeObj.type == PROJECT_STATE_OPT_ENUM.REMOVE) {
            try {
                await request(remove(userStore.sessionId, pjChangeObj.pjId));
                message.success("项目删除成功");
                setPjChangeObj({ visible: false });
                projectStore.removeProject(pjChangeObj.pjId, history);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const rendePjOpenOrClose = (obj: ProjectInfo) => {
        return (
            <div
                className={cls.contextmenu}
            >
                {obj.closed == false && obj.user_project_perm.can_admin && obj.project_id == projectStore.curProjectId && appStore.clientCfg?.can_invite && (
                    <div
                        className={cls.item}
                        style={{ color: "black" }}
                        onClick={() => memberStore.showInviteMember = true}
                    >
                        邀请成员
                    </div>
                )}
                {obj.user_project_perm.can_close && (
                    <div
                        className={cls.item}
                        onClick={() => pjItemChange(obj, PROJECT_STATE_OPT_ENUM.FINISH)}
                    >
                        结束项目
                    </div>
                )}
                {obj.user_project_perm.can_open && (
                    <div
                        className={cls.item}
                        style={{ color: "black" }}
                        onClick={() => pjItemChange(obj, PROJECT_STATE_OPT_ENUM.ACTIVATE)}
                    >
                        激活项目
                    </div>
                )}
                {obj.user_project_perm.can_leave && (
                    <div
                        className={cls.item}
                        onClick={() => pjItemChange(obj, PROJECT_STATE_OPT_ENUM.QUIT)}
                    >
                        退出项目
                    </div>
                )}
                {obj.user_project_perm.can_remove && (
                    <div
                        className={cls.item}
                        onClick={() => pjItemChange(obj, PROJECT_STATE_OPT_ENUM.REMOVE)}
                    >
                        删除项目
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={cls.project_child_wrap}
            onMouseOver={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(true);
            }}
            onMouseOut={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(false);
            }}
        >
            <div className={`${cls.project_child_title} ${item.closed && cls.close} ${item.project_id == projectStore.curProjectId ? cls.active_menu : ""}`}>
                {item.project_id !== projectStore.curProjectId &&
                    <Badge count={item.project_status.total_count} className={cls.badge} dot={appStore.simpleMode}
                        style={{ top: appStore.simpleMode ? "12px" : undefined, left: appStore.simpleMode ? "10px" : undefined }} />
                }
                {item.project_id !== projectStore.curProjectId && <FolderFilled />}
                {item.project_id == projectStore.curProjectId &&
                    item.project_status.work_snap_shot_enable && <VideoCameraOutlined />}
                {item.project_id == projectStore.curProjectId &&
                    !item.project_status.work_snap_shot_enable && <FolderFilled />}
                <span className={cls.name} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (docSpaceStore.inEdit) {
                        docSpaceStore.showCheckLeave(() => {
                            history.push(APP_PROJECT_CHAT_PATH);
                            projectStore.setCurProjectId(item.project_id);
                            appStore.simpleModeExpand = null;
                        });
                        return;
                    }
                    history.push(APP_PROJECT_CHAT_PATH);
                    projectStore.setCurProjectId(item.project_id);
                    appStore.simpleModeExpand = null;
                }}>&nbsp;{item.basic_info.project_name} </span>
                {appStore.simpleMode == false && (
                    <Popover content={rendePjOpenOrClose(item)} placement="right" autoAdjustOverflow={false} trigger="click">
                        {hover && <i className={cls.more} />}
                    </Popover>
                )}
                {appStore.simpleMode == true && (
                    <i style={{ cursor: "pointer", paddingLeft: "20px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        appStore.simpleMode = false;
                        history.push(APP_PROJECT_CHAT_PATH);
                        projectStore.setCurProjectId(item.project_id);
                    }}><DoubleRightOutlined /></i>
                )}
            </div>
            {projectStore.curProjectId == item.project_id && appStore.simpleMode && (
                <div className={cls.project_info_wrap}>
                    <PrjTodoIssueList issueType={ISSUE_TYPE_TASK} />
                    <PrjTodoIssueList issueType={ISSUE_TYPE_BUG} />
                </div>
            )}
            {pjChangeObj.visible && (
                <ActionModal
                    open={pjChangeObj.visible}
                    title={`${pjChangeObj.text}项目`}
                    width={pjChangeObj.type == PROJECT_STATE_OPT_ENUM.REMOVE ? 430 : 330}
                    mask={false}
                    onCancel={() => setPjChangeObj({ visible: false })}
                >
                    <div className={cls.pj_change_model}>
                        <h1>
                            是否要{pjChangeObj.text} {pjChangeObj.name} 项目?
                        </h1>
                        {pjChangeObj.type === PROJECT_STATE_OPT_ENUM.FINISH && (
                            <p>结束后项目将会封存，无法创建新的聊天/任务/缺陷</p>
                        )}
                        {pjChangeObj.type === PROJECT_STATE_OPT_ENUM.REMOVE && (
                            <>
                                <p style={{ color: "red" }}>项目被删除后，将无法再访问该项目的任何内容</p>
                                <Input addonBefore="请输入要删除的项目名称" onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (e.target.value == pjChangeObj.name) {
                                        setDisableBtn(false);
                                    } else {
                                        setDisableBtn(true);
                                    }
                                }} />
                            </>
                        )}
                        <div className={cls.btn_wrap}>
                            <Button ghost onClick={() => setPjChangeObj({ visible: false })}>
                                取消
                            </Button>
                            <Button onClick={submitPjItem} disabled={disableBtn}>确定</Button>
                        </div>
                    </div>
                </ActionModal>
            )}
        </div>
    );
};

export default observer(ProjectItem);