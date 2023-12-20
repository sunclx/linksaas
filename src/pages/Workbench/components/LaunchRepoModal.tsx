import React, { useEffect, useState } from "react";
import type { LocalRepoInfo } from "@/api/local_repo";
import { Button, Modal, Select, Table, Tabs, message } from "antd";
import type { SimpleDevInfo, DevPkgVersion, DevForwardPort } from "@/api/dev_container";
import { list_package, load_simple_dev_info, save_simple_dev_info, list_package_version } from "@/api/dev_container";
import type { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { request } from "@/utils/request";
import { EditNumber } from "@/components/EditCell/EditNumber";
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';

interface PkgVersionItemProps {
    package: string;
    version: string;
    onChange: (version: string) => void;
}

const PkgVersionItem = (props: PkgVersionItemProps) => {
    const [versionList, setVersionList] = useState<string[]>([]);

    const loadVersionList = async () => {
        setVersionList([]);
        if (props.package == "") {
            return;
        }
        const res = await request(list_package_version({
            package_name: props.package,
        }));
        setVersionList(res.version_list);
    };

    useEffect(() => {
        loadVersionList();
    }, [props.package]);

    return (
        <EditSelect editable={true} curValue={props.version} itemList={versionList.map(item => ({
            value: item,
            label: item,
            color: "black",
        }))} showEditIcon={true}
            allowClear={false} onChange={async value => {
                props.onChange(value as string);
                return true;
            }} />
    );
};

export interface LaunchRepoModalProps {
    repo: LocalRepoInfo;
    onClose: () => void;
}

const LaunchRepoModal = (props: LaunchRepoModalProps) => {
    const [pkgNameList, setPkgNameList] = useState<string[]>([]);
    const [hasChange, setHasChange] = useState(false);
    const [simpleDevInfo, setSimpleDevInfo] = useState<SimpleDevInfo | null>(null);

    const [activeKey, setActiveKey] = useState("pkg");

    const loadPkgNameList = async () => {
        const res = await list_package({});
        setPkgNameList(res.package_name_list);
    };

    const loadSimpleDevInfo = async () => {
        const res = await load_simple_dev_info(props.repo.path);
        setSimpleDevInfo(res);
    };

    const saveAndLaunch = async () => {
        if (simpleDevInfo == null) {
            return;
        }
        if (hasChange) {
            await save_simple_dev_info(props.repo.path, simpleDevInfo);
        }

        const pos = await appWindow.innerPosition();
        const label = `devc:${props.repo.id}`
        const oldWin = WebviewWindow.getByLabel(label)
        if (oldWin != null) {
            oldWin.setAlwaysOnTop(true);
            setTimeout(() => oldWin.setAlwaysOnTop(false), 1000);
            message.warn("已启动开发环境");
            props.onClose();
            return;
        }
        new WebviewWindow(label, {
            url: `devc.html?repoId=${encodeURIComponent(props.repo.id)}&repoPath=${encodeURIComponent(props.repo.path)}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: `开发环境(${props.repo.name})`,
            resizable: true,
            x: pos.x + Math.floor(Math.random() * 200),
            y: pos.y + Math.floor(Math.random() * 200),
        });
        props.onClose();
    };


    const pkgColumns: ColumnsType<DevPkgVersion> = [
        {
            title: "软件包",
            width: 190,
            render: (_, row: DevPkgVersion) => (
                <EditSelect editable={true} curValue={row.package}
                    itemList={pkgNameList.map(item => ({
                        value: item,
                        label: item,
                        color: "",
                    }))} showEditIcon={true}
                    onChange={async (value) => {
                        if (simpleDevInfo == null) {
                            return false;
                        }
                        const tmpList = simpleDevInfo.pkg_version_list.slice();
                        const index = tmpList.findIndex(item => item.id == row.id);
                        console.log(tmpList, index);
                        if (index != -1) {
                            tmpList[index].package = value as string;
                            tmpList[index].version = "";
                            setSimpleDevInfo({ ...simpleDevInfo, pkg_version_list: tmpList });
                            setHasChange(true);
                        }
                        return true;
                    }} allowClear={false} />
            ),
        },
        {
            title: "版本",
            width: 190,
            render: (_, row: DevPkgVersion) => (
                <PkgVersionItem package={row.package} version={row.version} onChange={version => {
                    if (simpleDevInfo == null) {
                        return;
                    }
                    const tmpList = simpleDevInfo.pkg_version_list.slice();
                    const index = tmpList.findIndex(item => item.package == row.package);
                    if (index != -1) {
                        tmpList[index].version = version;
                        setSimpleDevInfo({ ...simpleDevInfo, pkg_version_list: tmpList });
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "操作",
            render: (_, row: DevPkgVersion) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (simpleDevInfo == null) {
                        return;
                    }
                    const tmpList = simpleDevInfo.pkg_version_list.filter(item => item.id != row.id);
                    setSimpleDevInfo({ ...simpleDevInfo, pkg_version_list: tmpList });
                    setHasChange(true);
                }}>移除</Button>
            ),
        }
    ];


    const portColumns: ColumnsType<DevForwardPort> = [
        {
            title: "容器端口",
            width: 170,
            render: (_, row: DevForwardPort) => (
                <EditNumber editable={true} value={row.container_port} showEditIcon={true}
                    fixedLen={0} min={1} max={65534} onChange={async value => {
                        if (simpleDevInfo == null) {
                            return false;
                        }
                        const tmpList = simpleDevInfo.forward_port_list.slice();
                        const index = tmpList.findIndex(item => item.id == row.id);
                        if (index != -1) {
                            tmpList[index].container_port = value;
                            setSimpleDevInfo({ ...simpleDevInfo, forward_port_list: tmpList });
                            setHasChange(true);
                        }
                        return true;
                    }} />
            ),
        },
        {
            title: "本地端口",
            width: 170,
            render: (_, row: DevForwardPort) => (
                <EditNumber editable={true} value={row.host_port} showEditIcon={true}
                    fixedLen={0} min={10000} max={60000} onChange={async value => {
                        if (simpleDevInfo == null) {
                            return false;
                        }
                        const tmpList = simpleDevInfo.forward_port_list.slice();
                        const index = tmpList.findIndex(item => item.id == row.id);
                        if (index != -1) {
                            tmpList[index].host_port = value;
                            setSimpleDevInfo({ ...simpleDevInfo, forward_port_list: tmpList });
                            setHasChange(true);
                        }
                        return true;
                    }} />
            ),
        },
        {
            title: "公共端口",
            width: 80,
            render: (_, row: DevForwardPort) => (
                <Select style={{ width: "70" }} value={row.public} onChange={value => {
                    if (simpleDevInfo == null) {
                        return;
                    }
                    const tmpList = simpleDevInfo.forward_port_list.slice();
                    const index = tmpList.findIndex(item => item.id == row.id);
                    if (index != -1) {
                        tmpList[index].public = value;
                        setSimpleDevInfo({ ...simpleDevInfo, forward_port_list: tmpList });
                        setHasChange(true);
                    }
                }}>
                    <Select.Option value={true}>是</Select.Option>
                    <Select.Option value={false}>否</Select.Option>
                </Select>
            ),
        },
        {
            title: "操作",
            render: (_, row: DevForwardPort) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (simpleDevInfo == null) {
                        return;
                    }
                    const tmpList = simpleDevInfo.forward_port_list.filter(item => item.id != row.id);
                    setSimpleDevInfo({ ...simpleDevInfo, forward_port_list: tmpList });
                    setHasChange(true);
                }}>移除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadPkgNameList();
        loadSimpleDevInfo();
    }, []);

    return (
        <Modal open title="启动开发环境(需安装Docker)" bodyStyle={{ padding: "4px 4px" }}
            okText={hasChange ? "保存并启动" : "启动"} okButtonProps={{ disabled: simpleDevInfo == null }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                saveAndLaunch();
            }}
        >
            {simpleDevInfo != null && (
                <Tabs type="card" activeKey={activeKey} onChange={key => setActiveKey(key)}
                    tabBarExtraContent={
                        <div style={{ marginRight: "20px" }}>
                            {activeKey == "pkg" && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSimpleDevInfo({
                                        ...simpleDevInfo, pkg_version_list: [...simpleDevInfo.pkg_version_list, {
                                            id: uniqId(),
                                            package: "",
                                            version: "",
                                        }]
                                    });
                                    setHasChange(true);
                                }}>增加软件包</Button>
                            )}
                            {activeKey == "port" && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSimpleDevInfo({
                                        ...simpleDevInfo, forward_port_list: [...simpleDevInfo.forward_port_list, {
                                            id: uniqId(),
                                            container_port: 0,
                                            host_port: 0,
                                            public: false,
                                        }]
                                    });
                                    setHasChange(true);
                                }}>增加转发端口</Button>
                            )}
                        </div>
                    }
                    items={[
                        {
                            label: "安装软件",
                            key: "pkg",
                            children: (
                                <div style={{ height: "200px", overflowY: "scroll" }}>
                                    <Table rowKey="id" dataSource={simpleDevInfo.pkg_version_list} pagination={false} columns={pkgColumns} />
                                </div>
                            ),
                        },
                        {
                            label: "转发端口",
                            key: "port",
                            children: (
                                <div style={{ height: "200px", overflowY: "scroll" }}>
                                    <Table rowKey="id" dataSource={simpleDevInfo.forward_port_list} pagination={false} columns={portColumns} />
                                </div>
                            ),
                        },
                    ]} />
            )}
        </Modal >
    );
}

export default LaunchRepoModal;