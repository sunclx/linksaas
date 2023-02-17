import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal, message } from "antd";
import { update_space } from '@/api/user_kb';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

interface UpdateSpaceNameModalProps {
    spaceId: string;
    spaceName: string;
    onCancel: () => void;
    onOk: (newName: string) => void;
}

const UpdateSpaceNameModal: React.FC<UpdateSpaceNameModalProps> = (props) => {
    const userStore = useStores('userStore');

    const [title, setTitle] = useState(props.spaceName)

    const updateSpaceName = async () => {
        const titleValue = title.trim();
        if (titleValue.length < 2 || titleValue.length > 6) {
            message.error("知识库空间名称只能2-6个字符");
            return;
        }
        await request(update_space({
            session_id: userStore.sessionId,
            space_id: props.spaceId,
            basic_info: {
                space_name: titleValue,
            },
        }));
        props.onOk(titleValue);
    };
    return (
        <Modal open title="修改知识库空间名称"
            okText="修改"
            okButtonProps={{ disabled: title.trim().length < 2 || title.trim().length > 6 }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateSpaceName();
            }}>
            <Form>
                <Form.Item label="知识库空间名称" help={
                    <>
                        {(title.trim().length < 2 || title.trim().length > 6) && (
                            <span style={{ color: "red" }}>知识库空间名称只能2-6个字符</span>
                        )}
                    </>
                }>
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(UpdateSpaceNameModal);