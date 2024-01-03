import React from "react";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio } from "antd";
import { open as open_dialog } from '@tauri-apps/api/dialog';

export interface AuthSelectProps {
    authType: "none" | "password" | "privkey";
    userName: string;
    password: string;
    privKey: string;
    onChange: (authType: "none" | "password" | "privkey", userName: string, password: string, privKey: string) => void;
}

const AuthSelect = (props: AuthSelectProps) => {

    const choicePrivKey = async () => {
        const selected = await open_dialog({
            title: "选择ssh私钥",
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        props.onChange(props.authType, props.userName, props.password, selected);
    };

    return (
        <Form labelCol={{ span: 3 }}>
            <Form.Item label="验证方式">
                <Radio.Group value={props.authType} onChange={e => {
                    e.stopPropagation();
                    props.onChange(e.target.value, props.userName, props.password, props.privKey);
                }}>
                    <Radio value="none">无需验证</Radio>
                    <Radio value="password">账号密码</Radio>
                    <Radio value="privkey">SSH公钥</Radio>
                </Radio.Group>
            </Form.Item>
            {props.authType == "password" && (
                <>
                    <Form.Item label="账号">
                        <Input value={props.userName} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onChange(props.authType, e.target.value.trim(), props.password, props.privKey);
                        }} />
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input.Password value={props.password} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onChange(props.authType, props.userName, e.target.value.trim(), props.privKey);
                        }} />
                    </Form.Item>
                </>
            )}
            {props.authType == "privkey" && (
                <Form.Item label="SSH密钥">
                    <Input value={props.privKey} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        props.onChange(props.authType, props.userName, props.password, e.target.value.trim());
                    }}
                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            choicePrivKey();
                        }} />} />
                </Form.Item>
            )}
        </Form>
    );
};

export default (AuthSelect);