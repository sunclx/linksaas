import React, { useState } from "react";
import { observer } from 'mobx-react';
import { Form, Modal, Select, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { gen_invite } from "@/api/group_member";
import { writeText } from '@tauri-apps/api/clipboard';
import TextArea from "antd/lib/input/TextArea";

export interface InviteModalProps {
    onClose: () => void;
}

const InviteModal = (props: InviteModalProps) => {
    const appStore = useStores('appStore');
    const userStore = useStores("userStore");
    const groupStore = useStores('groupStore');

    const [linkText, setLinkText] = useState('');
    const [ttl, setTtl] = useState(1);

    const getTtlStr = () => {
        if (ttl < 24) {
            return `${ttl}小时`;
        } else {
            return `${(ttl / 24).toFixed(0)}天`;
        }
    };

    const genInviteText = async () => {
        const res = await request(gen_invite({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            ttl: ttl,
        }));

        if (appStore.clientCfg?.can_register == true) {
            setLinkText(`${userStore.userInfo.displayName} 邀请您加入 ${groupStore.curGroup?.group_name ?? ""} 兴趣组，您的邀请码 ${res.invite_code} (有效期${getTtlStr()}),请在软件内输入邀请码加入兴趣组。如您尚未安装【凌鲨】，可直接点击链接下载 https://www.linksaas.pro`);
        } else {
            setLinkText(`${userStore.userInfo.displayName} 邀请您加入 ${groupStore.curGroup?.group_name ?? ""} 兴趣组，您的邀请码 ${res.invite_code} (有效期${getTtlStr()}),请在软件内输入邀请码加入兴趣组。`);
        }
    };

    const copyAndClose = async () => {
        await writeText(linkText);
        props.onClose();
        message.success('复制成功');
    };

    return (
        <Modal open title="邀请兴趣组成员"
            width={600}
            okText={linkText == "" ? "生成邀请码" : "复制并关闭"}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (linkText == "") {
                    genInviteText();
                } else {
                    copyAndClose();
                }
            }}>
            {linkText == "" && (
                <Form>
                    <Form.Item label="有效期">
                        <Select value={ttl} onChange={value => setTtl(value)}>
                            <Select.Option value={1}>1小时</Select.Option>
                            <Select.Option value={3}>3小时</Select.Option>
                            <Select.Option value={24}>1天</Select.Option>
                            <Select.Option value={24 * 3}>3天</Select.Option>
                            <Select.Option value={24 * 7}>1周</Select.Option>
                            <Select.Option value={24 * 14}>2周</Select.Option>
                            <Select.Option value={24 * 30}>1月</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            )}
            {linkText != "" && (
                <>
                    <div
                        style={{
                            textAlign: 'left',
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: ' #2C2D2E',
                        }}
                    >
                        请发送邀请链接给需要邀请的成员
                    </div>

                    <div style={{ margin: '10px 0' }}>
                        <TextArea placeholder="请输入" value={linkText} autoSize={{ minRows: 2, maxRows: 5 }} readOnly />
                    </div>
                </>
            )}
        </Modal>
    );
};

export default observer(InviteModal);