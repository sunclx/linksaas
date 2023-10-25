import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { ALARM_TYPE_ISSUE_DELAY_ALERT, ALARM_TYPE_ISSUE_DELAY_HIT, ALARM_TYPE_ISSUE_DEPEND_ALERT, ALARM_TYPE_ISSUE_DEPEND_HIT, ALARM_TYPE_ISSUE_REOPEN_ALERT, ALARM_TYPE_ISSUE_REOPEN_HIT } from "@/api/project_alarm";
import { get_alarm_state, list_alarm, remove_alarm } from "@/api/project_alarm";
import type { Alarm } from "@/api/project_alarm";
import { Badge, Button, Form, Input, Modal, Popover, Space, Table, message } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { ISSUE_TYPE_TASK } from "@/api/project_issue";
import { LinkBugInfo, LinkTaskInfo } from "@/stores/linkAux";
import type { BulletinInfoKey, GetResponse } from "@/api/project_bulletin";
import { list_key as list_bulletin_key, get as get_bulletin, mark_read } from "@/api/project_bulletin";
import UserPhoto from "../Portrait/UserPhoto";
import { ReadOnlyEditor } from "../Editor";
import { AlertTwoTone, BellTwoTone } from "@ant-design/icons";

const PAGE_SIZE = 5;

const BulletinList = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [bulletinList, setBulletinList] = useState<BulletinInfoKey[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [showBulletinInfo, setShowBulletinInfo] = useState<GetResponse | null>(null);

    const loadBulletinList = async () => {
        const res = await request(list_bulletin_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_un_read: true,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBulletinList(res.key_list);
    };

    const loadContent = async (bulletinId: string) => {
        const res = await request(get_bulletin({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            bulletin_id: bulletinId,
        }));
        setShowBulletinInfo(res);
    };

    const columns: ColumnsType<BulletinInfoKey> = [
        {
            title: "标题",
            width: 250,
            render: (_, row: BulletinInfoKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    loadContent(row.bulletin_id);
                }}>{row.title}</a>
            ),
        },
        {
            title: "发布者",
            width: 150,
            render: (_, row: BulletinInfoKey) => (
                <div>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "20px", borderRadius: "10px", marginRight: "10px" }} />
                    {row.create_display_name}
                </div>
            ),
        },
        {
            title: "发布时间",
            width: 150,
            render: (_, row: BulletinInfoKey) => moment(row.create_time).format("YYYY-MM-DD HH:mm"),
        },
    ];
    useEffect(() => {
        loadBulletinList();
    }, [curPage]);

    return (
        <div style={{ padding: "10px 10px", maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
            <Table rowKey="bulletin_id" dataSource={bulletinList} columns={columns}
                pagination={{ current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }} />
            {showBulletinInfo != null && (
                <Modal title="公告内容" open footer={null}
                    width="calc(100vw - 600px)"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowBulletinInfo(null);
                        request(mark_read({
                            session_id: userStore.sessionId,
                            project_id: projectStore.curProjectId,
                            bulletin_id: showBulletinInfo.key_info.bulletin_id,
                        })).then(() => {
                            projectStore.incBulletinVersion(projectStore.curProjectId);
                        });
                    }}>
                    <Form labelCol={{ span: 2 }}>
                        <Form.Item label="标题">
                            <Input value={showBulletinInfo.key_info.title} disabled />
                        </Form.Item>
                        <Form.Item label="内容">
                            <div className="_editChatContext">
                                <ReadOnlyEditor content={showBulletinInfo.content} />
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
}

interface AlarmListProps {
    includeHit: boolean;
    includeAlert: boolean;
}

const AlarmList: React.FC<AlarmListProps> = (props) => {
    const history = useHistory();

    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores("linkAuxStore");

    const [alarmList, setAlarmList] = useState<Alarm[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadAlarmList = async () => {
        const res = await request(list_alarm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            include_hit: props.includeHit,
            include_alert: props.includeAlert,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setAlarmList(res.alarm_list);
    };

    const goToAlarmSource = (alarm: Alarm) => {
        let issueId = "";
        let issueType = ISSUE_TYPE_TASK;

        if (alarm.alarm_type == ALARM_TYPE_ISSUE_DEPEND_HIT) {
            issueId = alarm.content.IssueDependHitInfo?.issue_id ?? "";
            issueType = alarm.content.IssueDependHitInfo?.issue_type ?? 0;
        } else if (alarm.alarm_type == ALARM_TYPE_ISSUE_DEPEND_ALERT) {
            issueId = alarm.content.IssueDependAlertInfo?.issue_id ?? "";
            issueType = alarm.content.IssueDependAlertInfo?.issue_type ?? 0;
        } else if (alarm.alarm_type == ALARM_TYPE_ISSUE_DELAY_HIT) {
            issueId = alarm.content.IssueDelayHitInfo?.issue_id ?? "";
            issueType = alarm.content.IssueDelayHitInfo?.issue_type ?? 0;
        } else if (alarm.alarm_type == ALARM_TYPE_ISSUE_DELAY_ALERT) {
            issueId = alarm.content.IssueDelayAlertInfo?.issue_id ?? "";
            issueType = alarm.content.IssueDelayAlertInfo?.issue_type ?? 0;
        } else if (alarm.alarm_type == ALARM_TYPE_ISSUE_REOPEN_HIT) {
            issueId = alarm.content.IssueReOpenHitInfo?.issue_id ?? "";
            issueType = alarm.content.IssueReOpenHitInfo?.issue_type ?? 0;
        } else if (alarm.alarm_type == ALARM_TYPE_ISSUE_REOPEN_ALERT) {
            issueId = alarm.content.IssueReOpenAlertInfo?.issue_id ?? "";
            issueType = alarm.content.IssueReOpenAlertInfo?.issue_type ?? 0;
        }
        if (issueId != "") {
            if (issueType == ISSUE_TYPE_TASK) {
                linkAuxStore.goToLink(new LinkTaskInfo("", projectStore.curProjectId, issueId), history);
            } else {
                linkAuxStore.goToLink(new LinkBugInfo("", projectStore.curProjectId, issueId), history);
            }
        }
    };

    const removeAlarm = async (alarmId: string) => {
        await request(remove_alarm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            alarm_id: alarmId,
        }));
        await loadAlarmList();
        message.info("删除预警成功");
    };

    const columns: ColumnsType<Alarm> = [
        {
            title: "内容",
            width: 250,
            render: (_, record: Alarm) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToAlarmSource(record);
                }}>{record.title}</a>
            )
        },
        {
            title: "风险类型",
            width: 100,
            render: (_, record: Alarm) => {
                if (record.alarm_type == ALARM_TYPE_ISSUE_DEPEND_HIT || record.alarm_type == ALARM_TYPE_ISSUE_DEPEND_ALERT) {
                    return "被依赖超过阈值";
                } else if (record.alarm_type == ALARM_TYPE_ISSUE_DELAY_HIT || record.alarm_type == ALARM_TYPE_ISSUE_DELAY_ALERT) {
                    return "超时未完成";
                } else if (record.alarm_type == ALARM_TYPE_ISSUE_REOPEN_HIT || record.alarm_type == ALARM_TYPE_ISSUE_REOPEN_ALERT) {
                    return "重新打开次数过多";
                }
                return "";
            },
        },
        {
            title: "预警时间",
            width: 150,
            render: (_, record: Alarm) => moment(record.time_stamp).format("YYYY-MM-DD HH:mm")
        },
        {
            title: "操作",
            width: 60,
            render: (_, record: Alarm) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeAlarm(record.alarm_id);
                    }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadAlarmList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <div style={{ padding: "10px 10px", maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
            <Table rowKey="alarm_id" dataSource={alarmList} columns={columns} pagination={{
                total: totalCount,
                current: curPage + 1,
                pageSize: PAGE_SIZE,
                onChange: (page => setCurPage(page - 1)),
            }} />
        </div>
    );
}

const AlarmHeader = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [hitCount, setHitCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [bulletinCount, setBulletinCount] = useState(0);

    const loadAlarmStat = async () => {
        const res = await request(get_alarm_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setHitCount(res.hit_count);
        setAlertCount(res.alert_count);
    };

    const loadBulletinCount = async () => {
        const res = await request(list_bulletin_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_un_read: true,
            offset: 0,
            limit: 1,
        }));
        setBulletinCount(res.total_count);
    };

    useEffect(() => {
        loadAlarmStat();
    }, [projectStore.alarmVersion, projectStore.curProjectId]);

    useEffect(() => {
        loadBulletinCount();
    }, [projectStore.curProject?.bulletin_version]);

    return (
        <div style={{ marginRight: "80px" }}>
            <Space size="middle">
                {(projectStore.curProject?.setting.hide_bulletin ?? false) == false && (
                    <Popover open={bulletinCount == 0 ? false : undefined} trigger={["hover", "click"]} content={<BulletinList />} placement="topLeft" destroyTooltipOnHide autoAdjustOverflow>
                        <Badge count={bulletinCount} size="small">
                            <BellTwoTone style={{ fontSize: "20px", cursor: bulletinCount == 0 ? "default" : "pointer" }} twoToneColor={bulletinCount == 0 ? "#ccc" : ["#aaa", "cyan"]} title="项目公告" />
                        </Badge>
                    </Popover>
                )}

                <Popover open={hitCount == 0 ? false : undefined} trigger={["hover", "click"]} content={<AlarmList includeHit={true} includeAlert={false} />} placement="topLeft" destroyTooltipOnHide autoAdjustOverflow>
                    <Badge count={hitCount} size="small">
                        <AlertTwoTone style={{ fontSize: "20px", cursor: hitCount == 0 ? "default" : "pointer" }} twoToneColor={hitCount == 0 ? "#ccc" : ["#aaa", "yellow"]} title="风险提示" />
                    </Badge>
                </Popover>


                <Popover open={alertCount == 0 ? false : undefined} trigger={["hover", "click"]} content={<AlarmList includeHit={false} includeAlert={true} />} placement="topLeft" destroyTooltipOnHide autoAdjustOverflow>
                    <Badge count={alertCount} size="small">
                        <AlertTwoTone style={{ fontSize: "20px", cursor: alertCount == 0 ? "default" : "pointer" }} twoToneColor={alertCount == 0 ? "#ccc" : ["#aaa", "red"]} title="风险警告" />
                    </Badge>
                </Popover>

            </Space>
        </div >
    );
};

export default observer(AlarmHeader);