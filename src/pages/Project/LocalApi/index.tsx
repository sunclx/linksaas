import React, { useEffect, useState } from "react";
import CardWrap from '@/components/CardWrap';
import { observer } from 'mobx-react';
import s from './index.module.less';
import { useStores } from "@/hooks";
import { get_port } from "@/api/local_api";
import { request } from '@/utils/request';
import { get_local_api_token, remove_local_api_token, renew_local_api_token } from '@/api/project';
import Button from "@/components/Button";
import { WarningTwoTone } from "@ant-design/icons";
import { Input, Modal, Space, message } from "antd";
import { writeText } from '@tauri-apps/api/clipboard';
import { WebviewWindow } from '@tauri-apps/api/window';


const LocalApi = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [port, setPort] = useState(0);
    const [token, setToken] = useState("");
    const [showToken, setShowToken] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const loadPort = async () => {
        const res = await get_port();
        setPort(res);
    };

    const loadToken = async () => {
        const res = await request(get_local_api_token(userStore.sessionId, projectStore.curProjectId));
        if (res) {
            setToken(res.token);
        }
    };

    const renewToken = async () => {
        const res = await request(renew_local_api_token(userStore.sessionId, projectStore.curProjectId));
        if (res) {
            setToken(res.token);
            setShowUpdateModal(false);
        }
    }

    const removeToken = async () => {
        const res = await request(remove_local_api_token(userStore.sessionId, projectStore.curProjectId));
        if (res) {
            setShowRemoveModal(false);
            setToken("");
        }
    };

    const copyText = async (txt: string) => {
        await writeText(txt);
        message.info("复制成功");
    }

    const openApiConsole = async () => {
        const label = "localapi"
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.close();
        }
        new WebviewWindow(label, {
            url: `local_api.html?port=${port}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: "本地接口调试",
            resizable: true,
        });
    };

    useEffect(() => {
        loadPort();
        loadToken();
    }, []);

    return (
        <CardWrap title="项目接口" halfContent>
            <div className={s.content_wrap}>
                <div className={s.api_btn_wrap}>
                    <Button
                        title={port == 0 ? "本地服务没有启动" : ""}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            openApiConsole();
                        }} disabled={port == 0}>调试接口</Button>
                </div>
                <div>
                    <div className={s.info_wrap}>
                        <div className={s.info_label}>项目ID：</div>
                        <div className={s.info_value}>
                            <Space>
                                {projectStore.curProjectId}
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    copyText(projectStore.curProjectId);
                                }}>复制</a>
                            </Space>
                        </div>
                    </div>
                    <div className={s.info_wrap}>
                        <div className={s.info_label}>访问令牌：</div>
                        <div className={s.info_value}>
                            {token == "" && (
                                <Space>
                                    无令牌
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        renewToken();
                                    }}>创建令牌</a>
                                </Space>
                            )}
                            {token != "" && (
                                <Space>
                                    {showToken ? <Input value={token} disabled /> : <Input value="*********************" disabled />}
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowToken(!showToken);
                                    }}>{showToken ? "隐藏" : "显示"}</a>
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        copyText(token);
                                    }}>复制</a>
                                </Space>
                            )}
                        </div>
                    </div>
                    {token != "" && (
                        <div className={s.info_wrap}>
                            <div className={s.info_label} />
                            <div className={s.info_value}>
                                <Space>
                                    <Button type="ghost" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowUpdateModal(true);
                                    }}>更新令牌</Button>
                                    <Button type="ghost" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRemoveModal(true);
                                    }}>删除令牌</Button>
                                </Space>
                            </div>
                        </div>
                    )}

                    <div className={s.info_wrap}>
                        <div className={s.info_label}>服务地址：</div>
                        <div>
                            {port == 0 && "本地服务未启动"}
                            {port != 0 && (
                                <Space>
                                    <span>127.0.0.1:{port}</span>
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        copyText(`127.0.0.1:${port}`);
                                    }}>复制</a>
                                </Space>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showUpdateModal && (
                <Modal
                    title="更新访问令牌"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowUpdateModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        renewToken();
                    }}>
                    <p><WarningTwoTone twoToneColor="red" />&nbsp;更新令牌后，使用先前令牌的接口调用都将失败</p>
                </Modal>
            )}
            {showRemoveModal && (
                <Modal
                    title="删除访问令牌"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeToken();
                    }}>
                    <p><WarningTwoTone twoToneColor="red" />&nbsp;删除令牌后，当前项目的数据将不能通过接口获取</p>
                </Modal>
            )}
        </CardWrap>
    );
};

export default observer(LocalApi);