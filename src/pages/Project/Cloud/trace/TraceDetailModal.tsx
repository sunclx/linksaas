import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Card, Descriptions, Form, List, Modal, Popover, Select, Space, Table } from "antd";
import type { TraceInfo, SpanInfo } from "@/api/trace_proxy";
import { list_span } from "@/api/trace_proxy";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";
import type { ColumnsType } from 'antd/lib/table';
import { InfoCircleOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import moment from "moment";


export interface TraceDetailModalProps {
    traceInfo: TraceInfo;
    onClose: () => void;
}

type SpanInfoWrap = SpanInfo & {
    child: SpanInfoWrap[];
    expand: boolean;
    level: number;
};

const TraceDetailModal = (props: TraceDetailModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [rootSpanWrap, setRootSpanWrap] = useState<SpanInfoWrap | null>(null);
    const [spanWrapList, setSpanWrapList] = useState<SpanInfoWrap[]>([]);
    const [scale, setScale] = useState(10);

    const calcLevel = (subSpanInfoList: SpanInfoWrap[], level: number) => {
        for (const subSpanInfo of subSpanInfoList) {
            subSpanInfo.level = level;
            calcLevel(subSpanInfo.child, level + 1);
        }
    }

    const loadSpanList = async () => {
        const servAddr = projectStore.curProject?.setting.trace_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const res = await request(list_span(servAddr, {
            token: tokenRes.token,
            trace_id: props.traceInfo.trace_id,
        }));
        const spanList = res.span_list.sort((a, b) => a.start_time_stamp - b.start_time_stamp)
        const tmpMap = new Map<string, SpanInfoWrap>();
        for (const span of spanList) {
            const spanWrap = span as SpanInfoWrap;
            spanWrap.child = [];
            spanWrap.expand = false;
            spanWrap.level = 0;
            tmpMap.set(spanWrap.span_id, spanWrap)
        }
        for (const span of spanList) {
            const spanWrap = tmpMap.get(span.span_id);
            const parentSpanWrap = tmpMap.get(span.parent_span_id);
            if (spanWrap != undefined && parentSpanWrap != undefined) {
                parentSpanWrap.child.push(spanWrap);
            }
        }
        const rootSpan = tmpMap.get(props.traceInfo.root_span.span_id);
        if (rootSpan != undefined) {
            calcLevel(rootSpan.child, 1);
            setRootSpanWrap(rootSpan);
        }
    };

    const expandSpan = (spanId: string) => {
        const tmpList = spanWrapList.slice();
        const index = tmpList.findIndex(item => item.span_id == spanId);
        if (index == -1) {
            return;
        }
        tmpList[index].expand = true;
        tmpList.splice(index + 1, 0, ...(tmpList[index].child));
        setSpanWrapList(tmpList);
    };

    const walkSpan = (span: SpanInfoWrap): SpanInfoWrap[] => {
        const retList = span.child.slice();
        for (const subSpan of span.child) {
            retList.push(...(walkSpan(subSpan)));
        }
        return retList;
    }

    const unExpandSpan = (spanId: string) => {
        const tmpList = spanWrapList.slice();
        const index = tmpList.findIndex(item => item.span_id == spanId);
        if (index == -1) {
            return;
        }
        const childSpanList = walkSpan(tmpList[index]);
        for (const childSpan of childSpanList) {
            childSpan.expand = false;
        }
        const childSpanIdList = childSpanList.map(item => item.span_id);
        tmpList[index].expand = false;
        const newList = tmpList.filter(item => !(childSpanIdList.includes(item.span_id)));
        setSpanWrapList(newList);
    };

    const calcTimeWidth = (): number => {
        if (rootSpanWrap == null) {
            return 100;
        }
        const consumeTime = (rootSpanWrap.end_time_stamp - rootSpanWrap.start_time_stamp) * scale;
        const width = Math.round(consumeTime);
        if (width < 100) {
            return 100;
        }
        return width;
    };

    const calcTimeOffset = (span: SpanInfoWrap): number => {
        if (rootSpanWrap == null) {
            return 0;
        }
        const diffTime = (span.start_time_stamp - rootSpanWrap.start_time_stamp) * scale;
        const diff = Math.round(diffTime);
        return diff;
    }

    const calcSpanTimeWidth = (span: SpanInfoWrap): number => {
        const consumeTime = (span.end_time_stamp - span.start_time_stamp) * scale;
        const width = Math.round(consumeTime);
        if (width < 2) {
            return 2;
        }
        return width;
    };

    const columns: ColumnsType<SpanInfoWrap> = [
        {
            title: "入口名称",
            render: (_, row) => (
                <Space style={{ paddingLeft: `${row.level * 20}px` }}>
                    <div title={row.span_name} style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "200px" }}>{row.span_name}</div>
                    {row.child.length > 0 && (
                        <>
                            {row.expand == false && <Button type="link" icon={<PlusSquareOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                expandSpan(row.span_id);
                            }} />}
                            {row.expand == true && <Button type="link" icon={<MinusSquareOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                unExpandSpan(row.span_id);
                            }} />}

                        </>
                    )}

                </Space>
            ),
            fixed: true,
            width: 240,
        },
        {
            title: "时间轴",
            width: calcTimeWidth(),
            render: (_, row) => (
                <div style={{ width: calcTimeWidth() }}>
                    <div style={{ marginLeft: calcTimeOffset(row) }} >
                        <div style={{ width: calcSpanTimeWidth(row), backgroundColor: "deepskyblue", height: "10px", borderRadius: "10px" }} />
                        <Space>
                            <span>{row.start_time_stamp - props.traceInfo.root_span.start_time_stamp}ms</span>
                            <span>{row.end_time_stamp - row.start_time_stamp}ms</span>
                            <Popover trigger="hover" placement="right" content={
                                <Descriptions style={{ width: "400px" }} column={1} bordered labelStyle={{ width: "100px", verticalAlign: "middle" }}>
                                    <Descriptions.Item label="开始时间">
                                        {moment(row.start_time_stamp).format("YYYY-MM-DD HH:mm:ss")}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="结束时间">
                                        {moment(row.end_time_stamp).format("YYYY-MM-DD HH:mm:ss")}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="开始时差">
                                        {row.start_time_stamp - props.traceInfo.root_span.start_time_stamp}ms
                                    </Descriptions.Item>
                                    <Descriptions.Item label="执行时长">
                                        {row.end_time_stamp - row.start_time_stamp}ms
                                    </Descriptions.Item>
                                    <Descriptions.Item label="属性">
                                        <List rowKey="key" dataSource={row.attr_list} renderItem={item => (
                                            <List.Item>{`${item.key}=${item.value}`}</List.Item>
                                        )} />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="事件">
                                        <List dataSource={row.event_list} renderItem={item => (
                                            <List.Item key={`${item.name}:${item.time_stamp}`}>
                                                <Space>
                                                    <span>{moment(item.time_stamp).format("YYYY-MM-DD HH:mm:ss")}</span>
                                                    <span>{item.name}</span>
                                                </Space>
                                            </List.Item>
                                        )} />
                                    </Descriptions.Item>
                                </Descriptions>
                            }>
                                <InfoCircleOutlined />
                            </Popover>

                        </Space>
                    </div>
                </div>
            )
        },
    ];

    useEffect(() => {
        loadSpanList();
    }, [props.traceInfo.trace_id]);

    useEffect(() => {
        if (rootSpanWrap == null) {
            return;
        }
        setSpanWrapList([rootSpanWrap]);
    }, [rootSpanWrap]);

    return (
        <Modal open footer={null}
            width={"calc(100vw - 200px)"}
            bodyStyle={{ padding: "0px 0px" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Card title={props.traceInfo.root_span.span_name} style={{ margin: "0px" }}
                bodyStyle={{ width: "100%", overflow: "scroll", height: "calc(100vh - 200px)" }}
                extra={
                    <Form layout="inline" style={{ marginRight: "20px" }}>
                        <Form.Item label="缩放比例">
                            <Select style={{ width: "100px" }} value={scale} onChange={value => setScale(value)}>
                                <Select.Option value={1}>1ms 1像素</Select.Option>
                                <Select.Option value={10}>1ms 10像素</Select.Option>
                                <Select.Option value={20}>1ms 20像素</Select.Option>
                                <Select.Option value={50}>1ms 50像素</Select.Option>
                                <Select.Option value={50}>1ms 100像素</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                }>
                <Table rowKey="span_id" dataSource={spanWrapList} columns={columns} pagination={false} />
            </Card>
        </Modal>
    );
};

export default observer(TraceDetailModal);