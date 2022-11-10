import { Modal, Form, Input, Tooltip, message } from "antd";
import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { ActionInfo, ExecActionRequest } from '@/api/robot_earthly';
import { QuestionCircleOutlined } from "@ant-design/icons";
import { exec_action } from '@/api/robot_earthly';
import { request } from '@/utils/request';


interface ExecModalProps {
    repoId: string;
    actionInfo: ActionInfo;
    onCancel: () => void;
    onOk: (execId: string) => void;
}

const ExecModal: React.FC<ExecModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores("projectStore");

    const [form] = Form.useForm();

    const execAction = async () => {
        const formValue = form.getFieldsValue();
        const req: ExecActionRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            action_id: props.actionInfo.action_id,
            branch: "",
            param_list: [],
        };
        for (const k in formValue) {
            if (k == "branch") {
                const branch = formValue[k] ?? "";
                req.branch = branch;

            } else if (k.startsWith("param_")) {
                const value = formValue[k] ?? "";
                req.param_list.push({
                    name: k.substring(6),
                    value: value,
                });
            }
        }
        if (req.branch == "") {
            message.error("请输入对应分支或标签");
            return;
        }
        const res = await request(exec_action(req));
        if (res) {
            props.onOk(res.exec_id);
        }
    };

    return (
        <Modal
            title={`执行命令 ${props.actionInfo.basic_info.action_name}`}
            open={true}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                execAction();
            }}
        >
            <Form
                form={form}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 18 }}>
                <Form.Item label="仓库分支/标签" rules={[{ required: true }]} name="branch">
                    <Input />
                </Form.Item>
                {props.actionInfo.basic_info.param_def_list.map((pd,index) => (
                    <>
                        <Form.Item key={index}
                            label={
                                <span>参数{pd.name}&nbsp;
                                    <Tooltip title={pd.desc}>
                                        <a><QuestionCircleOutlined /></a>
                                    </Tooltip>
                                </span>
                            } name={`param_${pd.name}`} initialValue={pd.default_value}>
                            <Input />
                        </Form.Item>
                    </>
                ))}
            </Form>
        </Modal>
    );
}

export default observer(ExecModal);