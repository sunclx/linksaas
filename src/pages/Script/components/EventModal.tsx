import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './EventModal.module.less';
import { useStores } from "@/hooks";
import type { PluginEvent } from "@/api/events";
import EventCom from "@/components/EventCom";
import { timeToDateString } from "@/utils/utils";
import { request } from "@/utils/request";
import { EVENT_TYPE_SCRIPT, EVENT_REF_TYPE_SCRIPT, list_event_by_ref } from "@/api/events";
import { Modal, Timeline } from "antd";

interface EventModalProps {
    scriptSuiteId: string;
    onCancel: () => void;
}

const EventModal: React.FC<EventModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [eventList, setEventList] = useState<PluginEvent[]>([]);

    const loadEvent = async () => {
        const res = await request(list_event_by_ref({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            event_type: EVENT_TYPE_SCRIPT,
            ref_type: EVENT_REF_TYPE_SCRIPT,
            ref_id: props.scriptSuiteId,
        }));
        setEventList(res.event_list);
    };

    useEffect(() => {
        loadEvent();
    }, [props.scriptSuiteId]);

    return (
        <Modal open title="事件列表"
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div className={s.time_line_wrap}>
                <Timeline className={s.timeLine} reverse={true}>
                    {eventList.map((item) => (
                        <Timeline.Item color="gray" key={item.event_id}>
                            <p>{item.user_display_name} {timeToDateString(item.event_time)}</p>
                            <EventCom key={item.event_id} item={item} skipProjectName={true} skipLink={true} showMoreLink={false} />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </Modal>
    );
};

export default observer(EventModal);