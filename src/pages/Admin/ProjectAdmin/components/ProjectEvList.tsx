import React, { useEffect, useState } from "react";
import type { MemberInfo } from '@/api/project_member';
import { observer } from 'mobx-react';
import { Button, Card, DatePicker, Form, Select, Table } from "antd";
import { list_project_ev } from '@/api/events_admin';
import { request } from "@/utils/request";
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { PluginEvent } from '@/api/events';
import type { Moment } from 'moment';
import moment from 'moment';
import Pagination from "@/components/Pagination";
import type { ColumnsType } from 'antd/es/table';
import type { AdminPermInfo } from '@/api/admin_auth';
import { LinkOutlined } from "@ant-design/icons";
import EventCom from '@/components/EventCom';
import { useHistory } from "react-router-dom";
import type { UserDetailState } from '../../UserAdmin/UserDetail';
import { ADMIN_PATH_USER_DETAIL_SUFFIX } from "@/utils/constant";

const PAGE_SIZE = 10;

export interface ProjectEvListProps {
    projectId: string;
    memberList: MemberInfo[];
};

const ProjectEvList: React.FC<ProjectEvListProps> = (props) => {
    const history = useHistory();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);

    const [filterMemberUerId, setFilterMemberUerId] = useState<string | null>(null);
    const [fromTime, setFromTime] = useState<Moment | null>(null);
    const [toTime, setToTime] = useState<Moment | null>(null);

    const [eventList, setEventList] = useState<PluginEvent[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadEventList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_project_ev({
            admin_session_id: sessionId,
            project_id: props.projectId,
            filter_by_time: fromTime != null && toTime != null,
            from_time: fromTime == null ? 0 : fromTime.startOf("day").valueOf(),
            to_time: toTime == null ? 0 : toTime.endOf("day").valueOf(),
            filter_by_member_user_id: filterMemberUerId != null,
            member_user_id: filterMemberUerId ?? "",
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setEventList(res.event_list);
    };

    const columns: ColumnsType<PluginEvent> = [
        {
            title: "时间",
            width: 150,
            render: (_, row: PluginEvent) => (
                moment(row.event_time).format("YYYY-MM-DD HH:mm:ss")
            ),
        },
        {
            title: "用户",
            width: 150,
            render: (_, row: PluginEvent) => (
                <Button type="link"
                    style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!(permInfo?.user_perm.read ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const userState: UserDetailState = {
                            userId: row.user_id,
                        };
                        history.push(ADMIN_PATH_USER_DETAIL_SUFFIX, userState);
                    }}>
                    {row.cur_user_display_name == "" ? row.user_display_name : row.cur_user_display_name}&nbsp;<LinkOutlined />
                </Button>
            )
        },
        {
            title: "事件内容",
            render: (_, row: PluginEvent) => (
                <EventCom item={row} skipProjectName={false} skipLink={true} showMoreLink={false} showSource={true} />
            ),
        }
    ];

    useEffect(() => {
        loadEventList();
    }, [filterMemberUerId, fromTime, toTime, curPage]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card extra={
            <Form layout="inline">
                <Form.Item label="项目成员">
                    <Select style={{ width: 100 }} value={filterMemberUerId} onChange={value => setFilterMemberUerId(value)}>
                        <Select.Option value={null}>全部成员</Select.Option>
                        {props.memberList.map(item => (
                            <Select.Option key={item.member_user_id} value={item.member_user_id}>{item.display_name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="时间区间">
                    <DatePicker.RangePicker allowClear value={[fromTime, toTime]} onChange={values => {
                        if (values != null) {
                            setFromTime(values[0]);
                            setToTime(values[0]);
                        } else {
                            setFromTime(null);
                            setToTime(null);
                        }

                    }} />
                </Form.Item>
            </Form>
        }>
            <Table rowKey="event_id" columns={columns} dataSource={eventList} pagination={false} />
            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
        </Card>
    );
};

export default observer(ProjectEvList);