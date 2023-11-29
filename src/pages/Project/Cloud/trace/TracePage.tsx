import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import type { AttrInfo, TraceInfo, SORT_BY } from "@/api/trace_proxy";
import { list_trace, list_root_span_name, SORT_BY_CONSUME_TIME, SORT_BY_START_TIME } from "@/api/trace_proxy";
import { Card, Descriptions, Form, Input, List, Popover, Select, Space, Table } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import TraceDetailModal from "./TraceDetailModal";
import { InfoCircleOutlined } from "@ant-design/icons";

export interface TracePageProps {
    svcName: string;
}

const TracePage = (props: TracePageProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [traceList, setTraceList] = useState<TraceInfo[]>([]);
    const [rootSpanNameList, setRootSpanNameList] = useState<string[]>([]);
    const [curRootSpanName, setCurRootSpanName] = useState("");
    const [filterAttr, setFilterAttr] = useState<AttrInfo | null>(null);
    const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY_START_TIME);
    const [showTraceInfo, setShowTraceInfo] = useState<TraceInfo | null>(null);

    const loadTraceList = async () => {
        const servAddr = projectStore.curProject?.setting.trace_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const res = await request(list_trace(servAddr, {
            token: tokenRes.token,
            filter_by_service_name: props.svcName != "",
            service_name: props.svcName,
            filter_by_root_span_name: curRootSpanName != "",
            root_span_name: curRootSpanName,
            filter_by_attr: filterAttr != null,
            attr: filterAttr == null ? {
                key: "",
                value: ""
            } : filterAttr,
            limit: 20,
            sort_by: sortBy,
        }));
        setTraceList(res.trace_list);
    };

    const loadRootSpanNameList = async () => {
        const servAddr = projectStore.curProject?.setting.trace_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const res = await request(list_root_span_name(servAddr, {
            token: tokenRes.token,
            filter_by_service_name: props.svcName != "",
            service_name: props.svcName,
        }));
        setRootSpanNameList(res.root_span_name_list);
        if (curRootSpanName != "" && !res.root_span_name_list.includes(curRootSpanName)) {
            if (res.root_span_name_list.length > 0) {
                setCurRootSpanName(res.root_span_name_list[0]);
            } else {
                setCurRootSpanName("");
            }
        }
    };

    const columns: ColumnsType<TraceInfo> = [
        {
            title: "入口名称",
            render: (_, row: TraceInfo) => (
                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "220px" }}>
                    <a title={row.root_span.span_name} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowTraceInfo(row);
                    }}>
                        {row.root_span.span_name}
                    </a>
                </div>
            ),
        },
        {
            title: "服务名称",
            dataIndex: ["root_span", "service_name"],
            width: 100,
            render: (_, row: TraceInfo) => (
                <Space>
                    {row.root_span.service_name}
                    <Popover trigger="hover" placement="left" content={
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="属性">
                                <List rowKey="key" dataSource={row.root_span.attr_list} renderItem={item => (
                                    <List.Item>
                                        {item.key}={item.value}
                                    </List.Item>
                                )} />
                            </Descriptions.Item>
                        </Descriptions>
                    }>
                        <InfoCircleOutlined />
                    </Popover>
                </Space>

            ),
        },
        {
            title: "开始时间",
            render: (_, row: TraceInfo) => moment(row.root_span.start_time_stamp).format("YYYY-MM-DD HH:mm:ss"),
            width: 150,
        },
        {
            title: "时间开销",
            render: (_, row: TraceInfo) => `${row.root_span.end_time_stamp - row.root_span.start_time_stamp}ms`,
            width: 80,
        }
    ];

    useEffect(() => {
        loadRootSpanNameList();
    }, [props.svcName]);

    useEffect(() => {
        loadTraceList();
    }, [props.svcName, curRootSpanName, filterAttr, sortBy]);

    return (
        <Card style={{ width: "100%" }}
            bodyStyle={{ overflowY: "scroll", height: "calc(100vh - 210px)" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="入口名称">
                        <Select value={curRootSpanName} onChange={value => setCurRootSpanName(value)} style={{ width: "150px" }}>
                            <Select.Option value="">全部入口</Select.Option>
                            {rootSpanNameList.map(item => (
                                <Select.Option key={item} value={item}>{item}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="过滤属性">
                        <Input value={filterAttr == null ? "" : `${filterAttr.key}=${filterAttr.value}`} placeholder="key=value"
                            style={{ width: "100px" }} allowClear
                            onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const value = e.target.value.trim()
                                if (value == "") {
                                    setFilterAttr(null);
                                    return;
                                }
                                const pos = value.indexOf("=")
                                if (pos == -1) {
                                    setFilterAttr({
                                        key: value,
                                        value: "",
                                    });
                                } else {
                                    setFilterAttr({
                                        key: value.substring(0, pos),
                                        value: value.substring(pos + 1),
                                    });
                                }
                            }} />
                    </Form.Item>
                    <Form.Item>
                        <Select style={{ width: "80px" }} value={sortBy} onChange={value => setSortBy(value)}>
                            <Select.Option value={SORT_BY_CONSUME_TIME}>时间开销</Select.Option>
                            <Select.Option value={SORT_BY_START_TIME}>开始时间</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            }>
            <Table rowKey="trace_id" dataSource={traceList} columns={columns} pagination={false} />
            {showTraceInfo != null && (
                <TraceDetailModal traceInfo={showTraceInfo} onClose={() => setShowTraceInfo(null)} />
            )}
        </Card>
    );
};

export default observer(TracePage);