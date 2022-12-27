import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Form, Input, Modal, Table, message } from "antd";
import Button from "@/components/Button";
import type { Rule, BasicRule } from '@/api/project_test_case';
import { list_rule, add_rule, remove_rule, update_rule } from '@/api/project_test_case';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { EditTextArea } from "@/components/EditCell/EditTextArea";

interface RulePanelProps {
    entryId: string;
}

interface FormValue {
    desc: string | undefined;
    preCondition: string | undefined;
    expectResult: string | undefined;
}

const RulePanel: React.FC<RulePanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [form] = Form.useForm();

    const [ruleList, setRuleList] = useState<Rule[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [removeRuleId, setRemoveRuleId] = useState("");

    const loadRuleList = async () => {
        const res = await request(list_rule({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
        }));
        setRuleList(res.rule_list);
    };

    const addRule = async () => {
        const values = form.getFieldsValue() as FormValue;
        if (values.desc == undefined || values.desc == "") {
            message.warn("规则描述不能为空");
            return;
        }
        if (values.expectResult == undefined || values.expectResult == "") {
            message.warn("预期结果不能为空");
            return;
        }
        let preCondition = "";
        if (values.preCondition !== undefined && values.preCondition != "") {
            preCondition = values.preCondition;
        }
        await request(add_rule({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            basic_rule: {
                desc: values.desc!,
                pre_condition: preCondition,
                expect_result: values.expectResult!,
            },
        }));
        form.resetFields();
        setShowAddModal(false);
        loadRuleList();
    };

    const removeRule = async () => {
        await request(remove_rule({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            rule_id: removeRuleId,
        }));
        setRemoveRuleId("");
        loadRuleList();
    }

    const updateRule = async (ruleId: string, basicRule: BasicRule) => {
        try {
            const res = await update_rule({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: props.entryId,
                rule_id: ruleId,
                basic_rule: basicRule,
            });
            if (res.code == 0) {
                const tmpList = ruleList.slice();
                const index = tmpList.findIndex(item => item.rule_id == ruleId);
                if (index != -1) {
                    tmpList[index].basic_rule = basicRule;
                    setRuleList(tmpList);
                }
                return true;
            }
        } catch (e) {
            console.log(e)
            return false;
        }
        return false;
    };

    const columns: ColumnsType<Rule> = [
        {
            title: "规则描述",
            width: 260,
            render: (_, record: Rule) => <EditTextArea editable={true} content={record.basic_rule.desc} onChange={async (content: string) => {
                if (content == "") {
                    message.warn("规则描述不能为空");
                    return false;
                }
                return updateRule(record.rule_id, {
                    desc: content,
                    pre_condition: record.basic_rule.pre_condition,
                    expect_result: record.basic_rule.expect_result,
                });
            }} showEditIcon={true} />
        },
        {
            title: "前置条件",
            width: 260,
            render: (_, record: Rule) => <EditTextArea editable={true} content={record.basic_rule.pre_condition} onChange={async (content: string) => {
                return updateRule(record.rule_id, {
                    desc: record.basic_rule.desc,
                    pre_condition: content,
                    expect_result: record.basic_rule.expect_result,
                });
            }} showEditIcon={true} />
        },
        {
            title: "预期结果",
            width: 260,
            render: (_, record: Rule) => <EditTextArea editable={true} content={record.basic_rule.expect_result} onChange={async (content: string) => {
                if (content == "") {
                    message.warn("预期结果不能为空");
                    return false;
                }
                return updateRule(record.rule_id, {
                    desc: record.basic_rule.desc,
                    pre_condition: record.basic_rule.pre_condition,
                    expect_result: content,
                });
            }} showEditIcon={true} />
        },
        {
            title: "操作",
            width: 60,
            render: (_, record: Rule) => (
                <Button type="link" danger style={{ minWidth: "10px", padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRemoveRuleId(record.rule_id);
                }}>删除</Button>
            ),
        },
        {
            title: "创建人",
            dataIndex: "create_display_name"
        },
        {
            title: "创建时间",
            render: (_, record: Rule) => <span>{moment(record.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
        {
            title: "最后更新人",
            dataIndex: "update_display_name",
        },
        {
            title: "最后更新时间",
            render: (_, record: Rule) => <span>{moment(record.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
    ];

    useEffect(() => {
        loadRuleList();
    }, [props.entryId]);

    return (
        <Card
            title="验证规则"
            bordered={false}
            extra={
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddModal(true);
                }}>
                    新增验证规则
                </Button>}>
            <Table rowKey="rule_id" columns={columns} dataSource={ruleList} pagination={false} scroll={{ x: 1400 }} />
            {showAddModal == true && (
                <Modal open title="新增验证规则"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addRule();
                    }}>
                    <Form form={form} labelCol={{ span: 4 }}>
                        <Form.Item label="规则描述" name="desc" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="前置条件" name="preCondition">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="预期结果" name="expectResult" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeRuleId != "" && (
                <Modal open title="删除验证规则"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveRuleId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeRule();
                    }}>
                    是否删除验证规则？
                </Modal>
            )}
        </Card>
    );
};

export default observer(RulePanel);