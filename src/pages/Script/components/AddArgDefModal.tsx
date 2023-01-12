import React from "react";
import type { ArgParamDef } from '@/api/robot_script';
import { Form, Modal, Input, message } from "antd";

interface AddArgDefModalProps {
    onCancel: () => void,
    onOk: (value: ArgParamDef) => void,
}

interface FormValue {
    desc?: string;
    defaultValue?: string;
}

const AddArgDefModal: React.FC<AddArgDefModalProps> = (props) => {
    const [form] = Form.useForm();

    const addDef = () => {
        const values = form.getFieldsValue() as FormValue;
        if (values.defaultValue == undefined || values.defaultValue == "") {
            message.error("未设置默认值");
            return;
        }
        props.onOk({
            desc: values.desc ?? "",
            default_value: (values.defaultValue ?? "").trim(),
        });
    };

    return (
        <Modal title="增加命令行参数定义" open
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

export default AddArgDefModal;