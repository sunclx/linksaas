import React, { useEffect, useRef, useState } from "react";
import { observer } from 'mobx-react';
import type { Metric, MetricData as MetricDataResult, METRIC_UNIT_TYPE } from '@/api/robot_metric';
import { Card, Form, Select } from "antd";
import { req_metric_data, read_metric_data, METRIC_UNIT_BYTE_SIZE, METRIC_UNIT_PERCENT, METRIC_UNIT_BOOL } from '@/api/robot_metric';
import { request } from '@/utils/request';
import { uniqId } from '@/utils/utils';
import { useStores } from "@/hooks";
import moment from 'moment';
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useSize } from "ahooks";
import Button from "@/components/Button";
import { SyncOutlined } from "@ant-design/icons";


const timeRangeList = [
    {
        label: "最近五分钟",
        value: 300 * 1000,
    },
    {
        label: "最近十分钟",
        value: 600 * 1000,
    },
    {
        label: "最近半小时",
        value: 1800 * 1000,
    },
    {
        label: "最近一小时",
        value: 3600 * 1000,
    },
    {
        label: "最近三小时",
        value: 3600 * 1000 * 3,
    },
    {
        label: "最近六小时",
        value: 3600 * 1000 * 6,
    },
    {
        label: "最近十二小时",
        value: 3600 * 1000 * 12,
    },
    {
        label: "最近一天",
        value: 3600 * 1000 * 24,
    },
    {
        label: "最近三天",
        value: 3600 * 1000 * 24 * 3,
    },
];

interface MetricDataProps {
    metric: Metric;
}

const MetricData: React.FC<MetricDataProps> = (props) => {
    const labelUnitTypeMap: Map<string, METRIC_UNIT_TYPE> = new Map();
    props.metric.label_list.forEach(item => {
        labelUnitTypeMap.set(item.label, item.unit_type);
    })

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [reqId] = useState(uniqId());
    const [label, setLabel] = useState(props.metric.label_list[0].label);
    const [timeRange, setTimeRange] = useState(timeRangeList[0].value);
    const [metricData, setMetricData] = useState<MetricDataResult | null>(null);
    const [recvVersion, setRecvVersion] = useState(0);

    const domRef = useRef<HTMLDivElement>(null);
    const domRefSize = useSize(domRef);

    const sendDataReq = async () => {
        setMetricData(null);
        const nowTime = moment().valueOf();
        await request(req_metric_data({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            robot_id: props.metric.robot_id,
            metric_id: props.metric.metric_id,
            req_id: reqId,
            label: label,
            read_history: true,
            from_time: nowTime - timeRange,
            to_time: nowTime,
            read_cur_value: false,
        }));
    };

    const recvMetricData = async () => {
        const res = await request(read_metric_data({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            robot_id: props.metric.robot_id,
            metric_id: props.metric.metric_id,
            req_id: reqId,
            label: label,
        }));
        if (res) {
            setMetricData(res.metric_data);
        }
    };

    const getChartData = () => {
        if (metricData == null) {
            return [];
        }
        return metricData.item_list.map(item => {
            return {
                name: moment(item.time_stamp).format("YYYY-MM-DD HH:mm:ss"),
                data: item.value,
            };
        })
    };

    useEffect(() => {
        const unlisten = listen<NoticeType.AllNotice>(`metric_data_${reqId}`, () => {
            setRecvVersion(value => value + 1);
        })
        return () => {
            unlisten.then(f => f());
        };
    }, [reqId]);

    useEffect(() => {
        sendDataReq();
    }, [label, timeRange]);

    useEffect(() => {
        if (recvVersion > 0) {
            recvMetricData();
        }
    }, [recvVersion]);

    const getMetricValueStr = (value: number) => {
        const unitType = labelUnitTypeMap.get(label);
        if (unitType == undefined) {
            return `${value.toFixed(1)}`;
        }
        if (unitType == METRIC_UNIT_BYTE_SIZE) {
            let retValue = value;
            if (retValue < 1024.0) {
                return `${retValue.toFixed(1)}B`;
            }
            retValue = retValue / 1024;
            if (retValue < 1024.0) {
                return `${retValue.toFixed(1)}K`;
            }
            retValue = retValue / 1024;
            if (retValue < 1024.0) {
                return `${retValue.toFixed(1)}M`;
            }
            retValue = retValue / 1024;
            if (retValue < 1024.0) {
                return `${retValue.toFixed(1)}G`;
            }
            retValue = retValue / 1024;
            return `${retValue.toFixed(1)}T`;
        } else if (unitType == METRIC_UNIT_PERCENT) {
            return `${value.toFixed(1)}%`;
        } else if (unitType == METRIC_UNIT_BOOL) {
            if (value < 0.05) {
                return "false";
            } else {
                return "true";
            }
        }
        return `${value.toFixed(1)}`;
    }

    return (
        <Card title={props.metric.name} extra={
            <Form layout="inline">
                <Form.Item label="数据项">
                    <Select defaultValue={label} style={{ width: "100px" }} onChange={value => setLabel(value)}>
                        {props.metric.label_list.map(item => (
                            <Select.Option key={item.label} value={item.label}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="时间周期">
                    <Select defaultValue={timeRange} style={{ width: "100px" }} onChange={value => setTimeRange(value)}>
                        {timeRangeList.map(item => (
                            <Select.Option key={item.label} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button onClick={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        sendDataReq();
                    }}><SyncOutlined/>刷新</Button>
                </Form.Item>
            </Form>}>
            <div ref={domRef}>
                {metricData != null && (
                    <LineChart height={300} width={(domRefSize?.width ?? 600) * 0.95} data={getChartData()}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value: number) => getMetricValueStr(value)} interval={labelUnitTypeMap.get(label) == METRIC_UNIT_BOOL ? 3 : 0} />
                        <Tooltip />
                        <Line type="monotone" dataKey="data" stroke="#82ca9d" />
                    </LineChart>
                )}
            </div>
        </Card>
    );
};

export default observer(MetricData);