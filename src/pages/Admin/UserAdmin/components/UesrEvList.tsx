import React, { useEffect, useState } from "react";
import type { AdminPermInfo } from '@/api/admin_auth';
import type { Moment } from 'moment';
import moment from 'moment';
import type { PluginEvent } from '@/api/events';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { list_user_ev } from '@/api/events_admin';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import { Button, Card, DatePicker, Form, Table } from "antd";
import Pagination from "@/components/Pagination";
import { LinkOutlined } from "@ant-design/icons";
import EventCom from '@/components/EventCom';
import type { ProjectDetailState } from "../../ProjectAdmin/ProjectDetail";
import { useHistory } from "react-router-dom";
import { ADMIN_PATH_PROJECT_DETAIL_SUFFIX } from "@/utils/constant";


const PAGE_SIZE = 10;

export interface UserEvListProps {
    userId: string;
}

const UserEvList: React.FC<UserEvListProps> = (props) => {
    const history = useHistory();


    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [fromTime, setFromTime] = useState<Moment | null>(null);
    const [toTime, setToTime] = useState<Moment | null>(null);

    const [eventList, setEventList] = useState<PluginEvent[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadEventList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_user_ev({
            admin_session_id: sessionId,
            user_id: props.userId,
            filter_by_time: fromTime != null && toTime != null,
            from_time: fromTime == null ? 0 : fromTime.startOf("day").valueOf(),
            to_time: toTime == null ? 0 : toTime.endOf("day").valueOf(),
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
            title: "项目",
            width: 200,
            render: (_, row: PluginEvent) => (
                <Button type="link"
                    style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!((permInfo?.project_perm.read ?? false) && row.project_id != "")}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const prjState: ProjectDetailState = {
                            projectId: row.project_id,
                        };
                        history.push(ADMIN_PATH_PROJECT_DETAIL_SUFFIX, prjState);
                    }}>
                    {row.project_name}&nbsp;<LinkOutlined />
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
    }, [fromTime, toTime, curPage]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card extra={
            <Form layout="inline">
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

export default UserEvList;