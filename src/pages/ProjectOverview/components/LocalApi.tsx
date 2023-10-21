import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './LocalApi.module.less';
import { useStores } from "@/hooks";
import { get_port } from "@/api/local_api";
import { Space, message } from "antd";
import { writeText } from '@tauri-apps/api/clipboard';
import { PROTO } from "@/pages/LocalApi/proto";
import { RelProjectList } from "./RelProjectList";


const LocalApi = () => {
    const projectStore = useStores('projectStore');

    const [port, setPort] = useState(0);

    const loadPort = async () => {
        const res = await get_port();
        setPort(res);
    };


    const copyText = async (txt: string) => {
        await writeText(txt);
        message.info("复制成功");
    }

    useEffect(() => {
        loadPort();
    }, []);

    return (
        <>
            <div className={s.content_wrap}>
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
                    {port != 0 && (
                        <div className={s.info_wrap}>
                            <div className={s.info_label}>通讯协议：</div>
                            <div>
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    copyText(PROTO.replace("__PORT__", `${port}`));
                                }}>复制</a>
                            </div>
                        </div>
                    )}
                </div>
                <h2 className={s.head}>相关项目</h2>
                <RelProjectList />
            </div>
        </>
    );
};

export default observer(LocalApi);