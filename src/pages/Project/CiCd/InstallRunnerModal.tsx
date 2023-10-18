import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { Button, Modal, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { get_runner_token } from "@/api/project_cicd";
import { platform as get_platform } from '@tauri-apps/api/os';
import { get_conn_server_addr } from "@/api/main";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { writeText } from '@tauri-apps/api/clipboard';

export interface InstallRunnerModalProps {
    onCancel: () => void;
}

const InstallRunnerModal = (props: InstallRunnerModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [token, setToken] = useState("");
    const [downOsType, setDownOsType] = useState("");
    const [installOsType, setInstallOsType] = useState("");
    const [linkOsType, setLinkOsType] = useState("");
    const [servAddr, setServAddr] = useState("");

    const loadToken = async () => {
        const res = await request(get_runner_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setToken(res.token);
    };

    const loadOsType = async () => {
        const platformName = await get_platform();
        if (platformName == "win32") {
            setDownOsType("windows");
            setInstallOsType("windows");
            setLinkOsType("windows");
        } else if (platformName == "darwin") {
            setDownOsType("macos");
            setInstallOsType("macos");
            setLinkOsType("macos");
        } else {
            setDownOsType("linux");
            setInstallOsType("linux");
            setLinkOsType("linux");
        }
    };

    const loadServAddr = async () => {
        let res = await get_conn_server_addr();
        if (!res.includes(":")) {
            res += ":5000";
        }
        setServAddr(res.replace("http://", ""));
    };

    useEffect(() => {
        loadToken();
        loadOsType();
        loadServAddr();
    }, []);

    return (
        <Modal open title="安装执行代理" width={800} footer={null}
            bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflow: "scroll" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <h1 style={{ fontSize: "16px", fontWeight: 600 }}>下载执行代理程序</h1>
            {downOsType != "" && (
                <Tabs activeKey={downOsType} type="card"
                    onChange={value => setDownOsType(value)}
                    items={[
                        {
                            key: "windows",
                            label: "windows",
                            children: (
                                <p>
                                    下载&nbsp;<a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>easy_runner_windows.exe</a>
                                </p>
                            ),
                        },
                        {
                            key: "macos",
                            label: "macos",
                            children: (
                                <p>
                                    下载&nbsp;<a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>easy_runner_macos</a>
                                </p>
                            ),
                        },
                        {
                            key: "linux",
                            label: "linux",
                            children: (
                                <p>
                                    下载&nbsp;<a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>easy_runner_linux</a>
                                </p>
                            ),
                        }
                    ]} />
            )}
            <h1 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px" }}>安装执行代理</h1>
            <p>打开具有管理员权限的终端界面</p>
            {installOsType != "" && (
                <Tabs activeKey={installOsType} type="card"
                    onChange={value => setInstallOsType(value)}
                    items={[
                        {
                            key: "windows",
                            label: "windows",
                            children: (
                                <CodeEditor
                                    value="easy_runner_windows.exe install --runnerAddr=YOUR_RUNNER_ADDR"
                                    language="powershell"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        },
                        {
                            key: "macos",
                            label: "macos",
                            children: (
                                <CodeEditor
                                    value="./easy_runner_macos install --runnerAddr=YOUR_RUNNER_ADDR"
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        },
                        {
                            key: "linux",
                            label: "linux",
                            children: (
                                <CodeEditor
                                    value="./easy_runner_linux install --runnerAddr=YOUR_RUNNER_ADDR"
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        }
                    ]} tabBarExtraContent={
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (installOsType == "windows") {
                                writeText("easy_runner_windows.exe install --runnerAddr=YOUR_RUNNER_ADDR");
                            } else if (installOsType == "macos") {
                                writeText("./easy_runner_macos install --runnerAddr=YOUR_RUNNER_ADDR");
                            } else {
                                writeText("./easy_runner_linux install --runnerAddr=YOUR_RUNNER_ADDR");
                            }
                            message.info("复制成功");
                        }}>复制</Button>
                    } />
            )}
            <h1 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px" }}>添加项目令牌</h1>
            <p>打开具有管理员权限的终端界面</p>
            {linkOsType != "" && (
                <Tabs activeKey={linkOsType} type="card"
                    onChange={value => setLinkOsType(value)}
                    items={[
                        {
                            key: "windows",
                            label: "windows",
                            children: (
                                <CodeEditor
                                    value={`easy_runner_windows.exe config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`}
                                    language="powershell"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        },
                        {
                            key: "macos",
                            label: "macos",
                            children: (
                                <CodeEditor
                                    value={`./easy_runner_macos config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`}
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        },
                        {
                            key: "linux",
                            label: "linux",
                            children: (
                                <CodeEditor
                                    value={`./easy_runner_linux config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`}
                                    language="bash"
                                    disabled
                                    style={{
                                        fontSize: 14,
                                        backgroundColor: '#f5f5f5',
                                    }}
                                />
                            ),
                        }
                    ]} tabBarExtraContent={
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (linkOsType == "windows") {
                                writeText(`easy_runner_windows.exe config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`);
                            } else if (linkOsType == "macos") {
                                writeText(`./easy_runner_macos config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`);
                            } else {
                                writeText(`./easy_runner_linux config linkProject --projectId=${projectStore.curProjectId} --serverAddr=${servAddr} --token=${token}`);
                            }
                            message.info("复制成功");
                        }}>复制</Button>
                    } />
            )}
            <h1 style={{ fontSize: "16px", fontWeight: 600, marginTop: "20px" }}>启动执行代理</h1>
            <p>TODO</p>
        </Modal>
    );
};

export default InstallRunnerModal;