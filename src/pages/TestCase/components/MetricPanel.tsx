import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Form, Input, InputNumber, Modal, Table, message } from "antd";
import { useStores } from "@/hooks";
import type { Metric, BasicMetric } from '@/api/project_test_case';
import { list_metric, add_metric, update_metric, remove_metric } from '@/api/project_test_case';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Button from "@/components/Button";
import { EditNumber } from "@/components/EditCell/EditNumber";
import { EditTextArea } from "@/components/EditCell/EditTextArea";

interface MetricPanelProps {
    entryId: string;
}

interface FormValue {
    desc: string | undefined;
    value: number | undefined;
}

const MetricPanel: React.FC<MetricPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [form] = Form.useForm();

    const [metricList, setMetricList] = useState<Metric[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [removeMetricId, setRemoveMetricId] = useState("");

    const loadMetricList = async () => {
        const res = await request(list_metric({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
        }));
        setMetricList(res.metric_list);
    };

    const addMetric = async () => {
        const values = form.getFieldsValue() as FormValue;
        if (values.desc == undefined || values.desc == "") {
            message.warn("指标描述不能为空");
            return;
        }
        if (values.value == undefined) {
            message.warn("指标数值不能为空");
            return;
        }
        await request(add_metric({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            basic_metric: {
                desc: values.desc,
                value: values.value,
            },
        }));
        form.resetFields();
        setShowAddModal(false);
        loadMetricList();
    };

    const removeMetric = async () => {
        await request(remove_metric({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            metric_id: removeMetricId,
        }));
        setRemoveMetricId("");
        loadMetricList();
    };

    const updateMetric = async (metricId: string, basicMetric: BasicMetric) => {
        try {
            const res = await update_metric({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: props.entryId,
                metric_id: metricId,
                basic_metric: basicMetric,
            });
            if (res.code == 0) {
                const tmpList = metricList.slice();
                const index = tmpList.findIndex(item => item.metric_id == metricId);
                if (index != -1) {
                    tmpList[index].basic_metric = basicMetric;
                    setMetricList(tmpList);
                }
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
        return false;
    };

    const columns: ColumnsType<Metric> = [
        {
            title: "指标描述",
            width: 270,
            render: (_, record: Metric) => <EditTextArea editable={true} content={record.basic_metric.desc} onChange={async (content: string) => {
                if (content == "") {
                    message.warn("指标描述不能为空");
                    return false;
                }
                return updateMetric(record.metric_id, {
                    desc: content,
                    value: record.basic_metric.value,
                });
            }} showEditIcon={true} />
        },
        {
            title: "指标数值",
            width: 200,
            render: (_, record: Metric) => <EditNumber editable={true} value={record.basic_metric.value} onChange={async (value: number) => {
                return updateMetric(record.metric_id, {
                    desc: record.basic_metric.desc,
                    value: value,
                });
            }} showEditIcon={true} />,
        },
        {
            title: "操作",
            width: 60,
            render: (_, record: Metric) => (
                <Button type="link" danger style={{ minWidth: "10px", padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveMetricId(record.metric_id);
                }}>删除</Button>
            ),
        },
        {
            title: "创建人",
            dataIndex: "create_display_name"
        },
        {
            title: "创建时间",
            render: (_, record: Metric) => <span>{moment(record.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
        {
            title: "最后更新人",
            dataIndex: "update_display_name",
        },
        {
            title: "最后更新时间",
            render: (_, record: Metric) => <span>{moment(record.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
    ];

    useEffect(() => {
        loadMetricList();
    }, [props.entryId]);

    return (
        <Card
            title="测试指标"
            bordered={false}
            extra={
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddModal(true);
                }}>
                    新增测试指标
                </Button>}>
            <Table rowKey="metric_id" columns={columns} dataSource={metricList} pagination={false} scroll={{ x: 1000 }} />
            {showAddModal == true && (
                <Modal open title="新增测试指标"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addMetric();
                    }}>
                    <Form form={form} labelCol={{ span: 4 }}>
                        <Form.Item label="指标描述" name="desc" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="指标数值" name="value" rules={[{ required: true }]}>
                            <InputNumber controls={false} style={{ width: "100%" }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeMetricId != "" && (
                <Modal open title="删除测试指标"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMetricId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMetric();
                    }}>
                    是否删除测试指标?
                </Modal>
            )}
        </Card>
    );
};

export default observer(MetricPanel);