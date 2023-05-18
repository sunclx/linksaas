import React, { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { observer } from 'mobx-react';
import type { EVENT_SOURCE } from '@/api/external_events';
import { create, gen_id_and_secret, EVENT_SOURCE_GITLAB, EVENT_SOURCE_GITEE } from '@/api/external_events';
import style from '../index.module.less';
import iconGitee from '@/assets/allIcon/icon-gitee.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import { clipboard } from '@tauri-apps/api';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";


interface AddModalProps {
    eventSource: EVENT_SOURCE;
    onCancel: () => void;
    onOk: () => void;
}

const AddModal: React.FC<AddModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [title, setTitle] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");
    const [secret, setSecret] = useState("");
    const [eventSourceId, setEventSourceId] = useState("");
    const [displaySecret, setDisplaySecret] = useState(false);

    const init = async () => {
        const res = await request(gen_id_and_secret(userStore.sessionId, projectStore.curProjectId));
        setSourceUrl(res.event_source_url);
        setSecret(res.secret);
        setEventSourceId(res.event_source_id);
    };

    const createEventSource = async () => {
        await request(create({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            event_source: props.eventSource,
            title: title.trim(),
            event_source_id: eventSourceId,
            secret: secret,
        }));
        props.onOk();
    };

    useEffect(() => {
        init();
    }, [])
    return (
        <Modal open title="创建第三方系统连接" className={style.externalModal}
            okText="创建" okButtonProps={{ disabled: title.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createEventSource();
            }}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
            >
                <Form.Item label="接入平台">
                    <div className={style.souceItem}>
                        {props.eventSource == EVENT_SOURCE_GITLAB && (
                            <>
                                <img src={iconGitlab} alt="" />
                                <span>GitLab</span>
                            </>
                        )}
                        {props.eventSource == EVENT_SOURCE_GITEE && (
                            <>
                                <img src={iconGitee} alt="" />
                                <span>Gitee</span>
                            </>
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="名称">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="地址">
                    <span className={style.text}>{sourceUrl}</span>
                    <span
                        className={style.copy}
                        onClick={() => {
                            clipboard.writeText(sourceUrl);
                            message.success('复制成功！');
                        }}
                    >
                        复制
                    </span>
                </Form.Item>
                <Form.Item label="密钥">
                    {displaySecret ? (
                        <span className={style.text}>{secret}</span>
                    ) : (
                        <span className={style.text}>*****************************************</span>
                    )}
                    <span
                        className={style.copy}
                        onClick={() => {
                            clipboard.writeText(secret);
                            message.success('复制成功！');
                        }}
                    >
                        复制
                    </span>
                    {displaySecret ? (
                        <span className={style.hide} onClick={() => setDisplaySecret(false)}>
                            隐藏
                        </span>
                    ) : (
                        <span className={style.watch} onClick={() => setDisplaySecret(true)}>
                            查看
                        </span>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default observer(AddModal);