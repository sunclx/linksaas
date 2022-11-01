import { Form, Modal, Input, Select, message } from "antd";
import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { create as create_robot } from '@/api/robot';
import { request } from '@/utils/request';


const MemberSelect: React.FC<{ name: string }> = observer(({ name }) => {
    const memberStore = useStores('memberStore');
    return (
        <Form.Item name={name}>
            <Select
                mode="multiple"
                placeholder="选择成员"
                showSearch={false}
                allowClear
            >
                {memberStore.memberList.map(item => (
                    <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                        <UserPhoto logoUri={item.member.logo_uri} style={{
                            with: "18px",
                            height: "18px",
                            borderRadius: "999px",
                            pointerEvent: "none",
                            marginRight: "4px",
                        }} />
                        {item.member.display_name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
});

interface AddRobotModalProps {
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    name: string | undefined;
    metricUserId: string[] | undefined;
}

const AddRobotModal: React.FC<AddRobotModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const [form] = Form.useForm();

    const createRobot = async () => {
        const formValue = form.getFieldsValue() as FormValue;
        if (formValue.name == undefined || formValue.name.length == 0) {
            message.error("请输入机器人名称");
            return;
        }
        if (formValue.metricUserId == undefined) {
            formValue.metricUserId = [];
        }

        const res = await request(create_robot({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            basic_info: {
                name: formValue.name,
            },
            access_user_id_list: formValue.metricUserId,
        }));
        if (res) {
            message.info("创建机器人成功");
            props.onOk();
        }
    }

    return <Modal
        title="添加机器人"
        open={true}
        mask={false}
        onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            props.onCancel();
        }}
        onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            createRobot();
        }}>
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
        >
            <Form.Item label="机器人名称" name="name" rules={[{ min: 2, type: "string", whitespace: false, required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="监控权限">
                <MemberSelect name="metricUserId" />
            </Form.Item>
        </Form>
    </Modal>
};

export default observer(AddRobotModal);