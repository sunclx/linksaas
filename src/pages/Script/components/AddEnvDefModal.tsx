import { Form, Modal, Input, message } from "antd";
import React from "react";
import type { EnvParamDef } from '@/api/robot_script';

interface AddEnvDefModalProps {
    onCancel: () => void,
    onOk: (value: EnvParamDef) => void,
}

interface FormValue {
    envName?: string;
    desc?: string;
    defaultValue?: string;
}

const AddEnvDefModal: React.FC<AddEnvDefModalProps> = (props) => {
    const [form] = Form.useForm();

    const addDef = () => {
        const values = form.getFieldsValue() as FormValue;
        if (values.envName == undefined || values.envName == "") {
            message.error("未设置环境变量名称");
            return;
        }
        if (values.envName.startsWith("ARG_") == false) {
            message.error("环境变量名称必须以ARG_开始");
            return;
        }
        if (values.defaultValue == undefined || values.defaultValue == "") {
            message.error("未设置默认值");
            return;
        }
        props.onOk({
            env_name: (values.envName ?? "").trim(),
            desc: values.desc ?? "",
            default_value: (values.defaultValue ?? "").trim(),
        });
    };

    return (
        <Modal title="增加环境参数定义" open
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addDef();
            }}>
            <Form form={form} labelCol={{ span: 5 }}>
                <Form.Item label="环境变量名称" name="envName" rules={[{ whitespace: false }, { required: true }, { pattern: /^ARG_/ }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="环境变量描述" name="desc">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="默认值" name="defaultValue" rules={[{ whitespace: false }, { required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEnvDefModal;