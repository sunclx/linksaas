import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { PluginEvent } from '@/api/events';
import { EVENT_REF_TYPE_REQUIRE_MENT, EVENT_TYPE_REQUIRE_MENT } from '@/api/events';
import type { RequirementInfo, CateInfo } from "@/api/project_requirement";
import { list_cate, set_requirement_cate } from "@/api/project_requirement";
import s from './RequirementDetailRight.module.less';
import { EditSelect } from "@/components/EditCell/EditSelect";
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

    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [timeLine, setTimeLine] = useState<TimeLineType[]>();

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        res.cate_info_list.unshift({
            cate_id: "",
            project_id: projectStore.curProjectId,
            cate_name: "未分类需求",
            requirement_count: -1,
            create_user_id: "",
            create_time: 0,
            create_display_name: "",
            create_logo_uri: "",
            update_user_id: "",
            update_time: 0,
            update_display_name: "",
            update_logo_uri: "",
        })
        setCateList(res.cate_info_list);
    };

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
        loadCateList();
    }, []);

    useEffect(() => {
        loadEvent();
    }, [props.requirement.cate_id, props.dataVersion]);

    return (
        <div className={s.RightCom}>
            <div className={s.basic_info_wrap}>
                <div className={s.basic_info}>
                    <span>需求分类</span>
                    <div>
                        <EditSelect
                            allowClear={false}
                            editable={true}
                            curValue={props.requirement.cate_id}
                            itemList={cateList.map(item => ({
                                value: item.cate_id,
                                label: item.cate_name,
                                color: "black",
                            }))} onChange={async (value) => {
                                try {
                                    await request(set_requirement_cate({
                                        session_id: userStore.sessionId,
                                        project_id: projectStore.curProjectId,
                                        requirement_id: props.requirement.requirement_id,
                                        cate_id: value as string,
                                    }));
                                    return true;
                                } catch (e) {
                                    console.log(e);
                                }
                                return false;
                            }} showEditIcon={true} /></div>
                </div>
            </div>
            <div className={s.hr} />
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