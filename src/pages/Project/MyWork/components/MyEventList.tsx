import { Card, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { list_project_event } from '@/api/events';
import type { PluginEvent } from '@/api/events';
import { request } from "@/utils/request";
import moment from "moment";
import EventCom from '@/components/EventCom';
import { timeToDateString } from '@/utils/utils';
import { EVENT_ICON_LIST } from '@/pages/Project/Record/common';
import style from './MyEventList.module.less';


const MyEventList = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores('projectStore');
    const memberStore = useStores("memberStore");

    const [eventList, setEventList] = useState<PluginEvent[]>([]);

    const loadEventList = async () => {
        const now = moment().valueOf();
        const res = await request(list_project_event({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_member_user_id: true,
            member_user_id: userStore.userInfo.userId,
            from_time: now - 3 * 24 * 3600 * 1000,
            to_time: now,
            offset: 0,
            limit: 999,
        }));

        setEventList(res.event_list);
    };

    useEffect(() => {
        loadEventList();
    }, [projectStore.curProjectId, memberStore.myLastEventId]);

    return (
        <Card title="工作记录" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }}>
            {eventList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            <div className={style.record}>
                {eventList.reverse().map(event => (
                    <div key={event.event_id} className={style.recordItem}>
                        <EventCom item={event} skipProjectName={true} skipLink={false} showMoreLink={false}>
                            <img
                                className={style.icon}
                                src={
                                    event.event_type > 99 ? EVENT_ICON_LIST[event.event_type]?.icon : EVENT_ICON_LIST[0]?.icon
                                }
                                alt=""
                            />
                            <span className={style.time}>{timeToDateString(event.event_time)}</span>
                        </EventCom>
                    </div>
                ))}
            </div>

        </Card>
    )
};

export default observer(MyEventList);