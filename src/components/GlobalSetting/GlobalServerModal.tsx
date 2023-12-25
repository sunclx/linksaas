import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal, message } from "antd";
import { useStores } from "@/hooks";
import { get_global_server_addr, set_global_server_addr } from "@/api/client_cfg";

const GlobalServerModal = () => {
    const appStore = useStores('appStore');
    const [serverAddr, setServerAddr] = useState("");

    const loadServerAddr = async () => {
        const res = await get_global_server_addr();
        setServerAddr(res.replaceAll("http://", ""));
    };

    const saveServerAddr = async () => {
        await set_global_server_addr(serverAddr.replaceAll("http://", ""));
        appStore.showGlobalServerModal = false;
        message.info("设置成功");
    };

    useEffect(() => {
        loadServerAddr();
    }, []);

    return (
        <Modal open title="设置全局服务器地址"
            okText="设置" okButtonProps={{ disabled: serverAddr == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                appStore.showGlobalServerModal = false;
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                saveServerAddr();
            }}>
            <Form>
                <Form.Item label="服务地址" help={
                    <div>
                        <p>官方服务器地址:serv.linksaas.pro:5000,您可以改为你私有部署地址。</p>
                        <p>只有公共资源和开发环境软件包受这个配置影响。</p>
                    </div>
                }>
                    <Input value={serverAddr} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setServerAddr(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(GlobalServerModal);