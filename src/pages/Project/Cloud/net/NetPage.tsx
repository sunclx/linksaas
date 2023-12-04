import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { EndPoint } from "@/api/net_proxy";
import { list_end_point, create_tunnel, start_listen } from "@/api/net_proxy";
import { Card, Form, Input, InputNumber, List, Modal, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { gen_one_time_token } from "@/api/project_member";

const NetPage = () => {
    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [endPointList, setEndPointList] = useState<EndPoint[]>([]);
    const [proxyEndPoint, setProxyEndPoint] = useState<EndPoint | null>(null);
    const [port, setPort] = useState(0);
    const [password, setPassword] = useState("");

    const loadEndPointList = async () => {
        const servAddr = projectStore.curProject?.setting.net_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const res = await request(list_end_point(servAddr, {
            token: tokenRes.token,
        }));
        setEndPointList(res.end_point_list);
    };

    const startListen = async () => {
        const servAddr = projectStore.curProject?.setting.net_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        if (proxyEndPoint == null) {
            return;
        }
        const res = await request(create_tunnel(servAddr, {
            token: tokenRes.token,
            end_point_id: proxyEndPoint.end_point_id,
            password: password,
        }));
        await start_listen(servAddr, res.tunnel_id, projectStore.curProjectId, proxyEndPoint.end_point_name, port);
        message.info("监听本地端口成功");
        appStore.loadLocalProxy();
        setProxyEndPoint(null);
    };

    useEffect(() => {
        loadEndPointList();
    }, [projectStore.curProjectId]);

    return (
        <div>
            <List rowKey="end_point_id" dataSource={endPointList}
                style={{ height: "calc(100vh - 166px)", overflowY: "scroll", padding: "20px 20px" }}
                grid={{ gutter: 16 }}
                renderItem={item => (
                    <List.Item>
                        <Card style={{ width: "120px" }} bordered={false} bodyStyle={{ backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
                            <a style={{ display: "block", fontSize: "20px", width: "100px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setPort(0);
                                    setPassword("");
                                    setProxyEndPoint(item);
                                }}>{item.end_point_name}</a>
                        </Card>

                    </List.Item>
                )} />
            {proxyEndPoint != null && (
                <Modal open title={`转发端口${proxyEndPoint.end_point_name}到本地`}
                    okText="转发" okButtonProps={{ disabled: port <= 0 }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setProxyEndPoint(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        startListen();
                    }}>
                    <Form>
                        <Form.Item label="本地端口">
                            <InputNumber controls={false} min={10000} max={60000} precision={0} value={port} onChange={value => {
                                if (value != null) {
                                    setPort(value);
                                }
                            }} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item label="端口密码">
                            <Input.Password value={password} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setPassword(e.target.value.trim());
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default observer(NetPage);