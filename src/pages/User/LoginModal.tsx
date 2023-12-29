import { Button, Divider, Form, Input, Modal, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { PlusOutlined } from "@ant-design/icons";
import type { ServerInfo } from '@/api/client_cfg';
import { list_server, add_server, remove_server } from '@/api/client_cfg';
import { conn_grpc_server } from '@/api/main';
import Reset from "./Reset";
import { AdminLogin } from "./AdminLogin";


const LoginModal = () => {
    const appStore = useStores('appStore');
    const userStore = useStores('userStore');

    const [serverList, setServerList] = useState<ServerInfo[]>([]);
    const [defaultAddr, setDefaultAddr] = useState("");
    const [newAddr, setNewAddr] = useState("");
    const [openSelect, setOpenSelect] = useState(false);
    const [hasConn, setHasConn] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loginTab, setLoginTab] = useState<"login" | "adminLogin" | "reset">("login");

    const loadServerList = async () => {
        const res = await list_server(false);
        setServerList(res.server_list);
        res.server_list.forEach((item) => {
            if (item.default_server) {
                setDefaultAddr(item.addr);
            }
        });
    };

    const addServer = async () => {
        if (newAddr == '') {
            message.warn('请输入正确的地址');
            return;
        }
        await add_server(newAddr);
        setNewAddr('');
        await loadServerList();
    };

    const removeServer = async (addr: string) => {
        await remove_server(addr);
        await loadServerList();
    };

    const connServer = async () => {
        if (defaultAddr == "") {
            return;
        }
        const res = await conn_grpc_server(defaultAddr);
        if (!res) {
            message.error('连接失败');
        }
        setHasConn(res);
        appStore.loadClientCfg();
        appStore.loadLocalProxy();
        setUserName(localStorage.getItem(`${defaultAddr}:username`) ?? "");
    };

    const getLoginTagStr = () => {
        if (loginTab == "login") {
            return "请登录";
        } else if (loginTab == "reset") {
            return "重置密码";
        } else {
            return "登录管理后台";
        }
    }

    useEffect(() => {
        loadServerList();
    }, []);

    useEffect(() => {
        connServer();
    }, [defaultAddr]);

    return (
        <Modal title={getLoginTagStr()} open footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                userStore.showUserLogin = null;
            }}>
            {loginTab == "login" && (
                <Form labelCol={{ span: 3 }}>
                    <Form.Item label="服务器" >
                        <Select
                            style={{ width: '100%' }}
                            value={defaultAddr}
                            onChange={(v) => setDefaultAddr(v)}
                            onDropdownVisibleChange={(v) => setOpenSelect(v)}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider />
                                    <div style={{ paddingLeft: "10px", paddingBottom: "20px", position: "relative" }}>
                                        <Space>
                                            <Input
                                                style={{ width: "200px" }}
                                                placeholder="请输入服务器地址"
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setNewAddr(e.target.value);
                                                }}
                                            />
                                            <Button
                                                style={{ position: "absolute", right: "10px", top: "0px" }}
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    addServer();
                                                }}
                                            >
                                                增加服务器
                                            </Button>
                                        </Space>
                                    </div>
                                </>
                            )}
                        >
                            {serverList.map((item) => (
                                <Select.Option key={item.addr} value={item.addr}>
                                    {item.system ? (
                                        <div style={{ height: "20px", fontSize: "16px" }}>{item.name}</div>
                                    ) : (
                                        <div style={{ height: "20px", fontSize: "16px" }}>
                                            {item.name}
                                            {openSelect && (
                                                <Button style={{ position: "absolute", right: "10px", top: "0px" }}
                                                    type="link"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        removeServer(item.addr);
                                                    }}
                                                >
                                                    删除
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="用户名" help={appStore.clientCfg?.login_prompt ?? ""}>
                        <Input value={userName} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setUserName(e.target.value.trim());
                        }} />
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input.Password value={password} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setPassword(e.target.value.trim());
                        }} />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "14px" }}>
                        <Space size="large">
                            {appStore.clientCfg?.can_register == true && (
                                <a onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLoginTab("reset");
                                }}>
                                    忘记密码
                                </a>
                            )}
                            {appStore.clientCfg?.can_register == true && (
                                <a href="https://www.linksaas.pro/register" target="_blank" rel="noreferrer">
                                    注册新账号
                                </a>
                            )}
                            {appStore.clientCfg?.enable_admin == true && (
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLoginTab("adminLogin");
                                }}>管理后台</a>
                            )}
                        </Space>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e4e4e8", paddingTop: "10px", marginTop: "10px" }}>
                        <Space size="large">
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                userStore.showUserLogin = null;
                            }}>取消</Button>
                            <Button type="primary" disabled={(!hasConn) || userName == "" || password == ""} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                userStore.callLogin(userName, password).then(() => {
                                    localStorage.setItem(`${defaultAddr}:username`, userName);
                                });
                            }}>登录</Button>
                        </Space>
                    </div>
                </Form>
            )}
            {loginTab == "reset" && (<Reset onClose={() => setLoginTab("login")} />)}
            {loginTab == "adminLogin" && (<AdminLogin />)}
        </Modal>
    );
};

export default observer(LoginModal);