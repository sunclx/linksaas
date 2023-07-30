import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { PluginEvent } from '@/api/events';
import { EVENT_REF_TYPE_REQUIRE_MENT, EVENT_TYPE_REQUIRE_MENT } from '@/api/events';
import type { RequirementInfo } from "@/api/project_requirement";
import s from './RequirementDetailRight.module.less';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { list_event_by_ref } from '@/api/events';
import { Timeline } from "antd";
import EventCom from "@/components/EventCom";
import { timeToDateString } from "@/utils/utils";


type TimeLineType = PluginEvent;

interface RequirementDetailRightProps {
    requirement: RequirementInfo;
    dataVersion: number;
    onUpdate: () => void;
}

const RequirementDetailRight: React.FC<RequirementDetailRightProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [timeLine, setTimeLine] = useState<TimeLineType[]>();

    const loadEvent = async () => {
        const res = await request(list_event_by_ref({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            event_type: EVENT_TYPE_REQUIRE_MENT,
            ref_type: EVENT_REF_TYPE_REQUIRE_MENT,
            ref_id: props.requirement.requirement_id,
        }));
        setTimeLine(res.event_list);
    }

    useEffect(() => {
        loadEvent();
    }, [props.dataVersion]);

    return (
        <div className={s.RightCom}>
            <div
                className={s.time_line_wrap}
                style={{
                    height: "calc(100% - 50px)",
                }}
            >
                <h2>动态</h2>
                <Timeline className={s.timeLine} reverse={true}>
                    {timeLine?.map((item) => (
                        <Timeline.Item color="gray" key={item.event_id}>
                            <p>{timeToDateString(item.event_time)}</p>
                            <EventCom key={item.event_id} item={item} skipProjectName={true} skipLink={true} showMoreLink={true} />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </div>
    );
};

export default observer(RequirementDetailRight);