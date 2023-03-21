import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Timeline } from "antd";
import type { PluginEvent } from '@/api/events';
import { list_event_by_ref, EVENT_TYPE_IDEA, EVENT_REF_TYPE_IDEA } from '@/api/events';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import moment from 'moment';
import EventCom from "@/components/EventCom";

interface IdeaEventModalProps {
    ideaId: string;
    onCancel: () => void;
};

const IdeaEventModal: React.FC<IdeaEventModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [eventList, setEventList] = useState<PluginEvent[]>([]);

    const loadEventList = async () => {
        const res = await request(list_event_by_ref({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            event_type: EVENT_TYPE_IDEA,
            ref_type: EVENT_REF_TYPE_IDEA,
            ref_id: props.ideaId,
        }));
        setEventList(res.event_list);
    };

    useEffect(()=>{
        loadEventList();
    },[props.ideaId]);

    return (
        <Modal open title="操作记录" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div style={{ maxHeight: "calc(100vh - 600px)", overflowY: "scroll" }}>
            <Timeline  reverse={true}>
                    {eventList.map((item) => (
                        <Timeline.Item color="gray" key={item.event_id}>
                            <p>{moment(item.event_time).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <EventCom key={item.event_id} item={item} skipProjectName={true} skipLink={true} showMoreLink={false} />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </Modal>
    );
};

export default observer(IdeaEventModal);