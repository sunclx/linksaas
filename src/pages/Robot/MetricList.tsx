import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import type { Metric } from '@/api/robot_metric';
import { list_metric } from '@/api/robot_metric';
import { request } from '@/utils/request';
import { useLocation } from "react-router-dom";
import type { LinkRobotState } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import MetricData from "./components/MetricData";
import type { RobotInfo } from '@/api/robot';
import { get as get_robot } from '@/api/robot';



const MetricList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const location = useLocation();
    const state = location.state as LinkRobotState;

    const [metricList, setMetricList] = useState<Metric[]>([]);
    const [robot, setRobot] = useState<RobotInfo | null>(null);

    const loadMetric = async () => {
        const res = await request(list_metric({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            robot_id: state.robotId,
        }));
        if (res) {
            setMetricList(res.info_list);
        }
    };

    const getRobot = async () => {
        const res = await request(get_robot({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            robot_id: state.robotId,
        }));
        if (res) {
            setRobot(res.robot);
        }
    };

    useEffect(() => {
        getRobot();
        loadMetric();
    }, [projectStore.curProjectId, state.robotId])


    return (<CardWrap>
        <DetailsNav title={`${robot?.basic_info.name ?? ""} 监控信息`} />
        <div style={{ overflowY: "scroll", height: "calc(100% - 50px)" }}>
            {metricList.map(item => <MetricData key={item.metric_id} metric={item} />)}
        </div>
    </CardWrap>)
}

export default observer(MetricList);