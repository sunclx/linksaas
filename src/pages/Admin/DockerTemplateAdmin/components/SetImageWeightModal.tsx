import React, { useState } from "react";
import type { AppImage } from "@/api/docker_template";
import { set_image_weight } from "@/api/docker_template_admin";
import { Form, InputNumber, Modal } from "antd";
import { get_admin_session } from "@/api/admin_auth";
import { request } from "@/utils/request";

export interface SetImageWeightModalProps {
    appId: string;
    appImage: AppImage;
    onCancel: () => void;
    onOk: () => void;
}

const SetImageWeightModal = (props: SetImageWeightModalProps) => {
    const [weight, setWeight] = useState(props.appImage.weight);

    const adjustWeight = async () => {
        const sessionId = await get_admin_session();
        await request(set_image_weight({
            admin_session_id: sessionId,
            app_id: props.appId,
            app_image: {
                ...props.appImage,
                weight: weight,
            },
        }));
        props.onOk();
    };

    return (
        <Modal open title="调整截图权重" width={200}
            okText="调整" okButtonProps={{ disabled: weight == props.appImage.weight }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                adjustWeight();
            }}>
            <Form>
                <Form.Item label="截图权重">
                    <InputNumber value={weight} min={0} max={65535} precision={0} controls={false}
                        onChange={value => {
                            if (value !== null) {
                                setWeight(value);
                            }
                        }} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default SetImageWeightModal;