import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Card, Collapse, Popover, Space, Tag, message } from "antd";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_perm, get_admin_session } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { list_package, list_package_version } from "@/api/dev_container";
import { remove_package, remove_package_version } from "@/api/dev_container_admin";
import AddPkgModal from "./components/AddPkgModal";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import AddVersionModal from "./components/AddVersionModal";

const DevPkgList = () => {
    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [pkgNameList, setPkgNameList] = useState<string[]>([]);
    const [versionList, setVersionList] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState("");
    const [showAddPkgModal, setShowAddPkgModal] = useState(false);
    const [showAddVersionModal, setShowAddVersionModal] = useState(false);

    const loadPkgNameList = async () => {
        const res = await request(list_package({}));
        setPkgNameList(res.package_name_list);
        if (activeKey == "" && res.package_name_list.length > 0) {
            setActiveKey(res.package_name_list[0]);
        }
    };

    const loadVersionList = async () => {
        setVersionList([]);
        const res = await request(list_package_version({
            package_name: activeKey,
        }));
        setVersionList(res.version_list);
    };

    const removePkg = async () => {
        const sessionId = await get_admin_session();
        await request(remove_package({
            admin_session_id: sessionId,
            package_name: activeKey,
        }));
        message.info(`删除软件包${activeKey}成功`);
        const tmpList = pkgNameList.filter(item => item != activeKey);
        if (tmpList.length > 0) {
            setActiveKey(tmpList[0]);
        } else {
            setActiveKey("");
        }
        setPkgNameList(tmpList);
    };

    const removeVersion = async (version: string) => {
        const sessionId = await get_admin_session();
        await request(remove_package_version({
            admin_session_id: sessionId,
            package_name: activeKey,
            version: version,
        }));
        await loadVersionList();
        message.info(`删除 ${activeKey}:${version} 成功`);
    };

    useEffect(() => {
        loadVersionList();
    }, [activeKey]);

    useEffect(() => {
        loadPkgNameList();
    }, []);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="软件包管理"
            style={{ height: "calc(100vh - 40px)", overflowY: "scroll" }}
            extra={
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddPkgModal(true);
                }} disabled={!(permInfo?.dev_container_perm.add_package ?? false)}>增加软件包</Button>
            }>
            <Collapse accordion activeKey={activeKey} onChange={key => {
                if (typeof key == "string") {
                    setActiveKey(key)
                }
            }}>
                {pkgNameList.map(pkgName => (
                    <Collapse.Panel header={pkgName} key={pkgName} extra={
                        <>
                            {activeKey == pkgName && (
                                <Popover trigger="click" placement="bottom" content={
                                    <Space direction="vertical" style={{ padding: "10px 10px" }}>
                                        <Button type="link" danger disabled={!(versionList.length == 0 && (permInfo?.dev_container_perm.remove_package ?? false))}
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                removePkg();
                                            }}>删除软件包</Button>
                                    </Space>
                                }>
                                    <MoreOutlined />
                                </Popover>
                            )}
                        </>
                    }>
                        {activeKey == pkgName && (
                            <div>
                                {versionList.map(version => (
                                    <Tag key={version} closable onClose={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeVersion(version);
                                    }} style={{ margin: "4px 4px" }}>{version}</Tag>
                                ))}
                                {(permInfo?.dev_container_perm.add_package_version ?? false) == true && (
                                    <Tag icon={<PlusOutlined />} style={{ cursor: "pointer" }} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowAddVersionModal(true);
                                    }}>增加版本</Tag>
                                )}
                            </div>
                        )}
                    </Collapse.Panel>
                ))}
            </Collapse>
            {showAddPkgModal == true && (
                <AddPkgModal onCancel={() => setShowAddPkgModal(false)} onOk={() => {
                    setShowAddPkgModal(false);
                    loadPkgNameList();
                }} />
            )}
            {showAddVersionModal == true && (
                <AddVersionModal pkgName={activeKey} onCancel={() => setShowAddVersionModal(false)}
                    onOk={() => {
                        setShowAddVersionModal(false);
                        loadVersionList();
                    }} />
            )}
        </Card>
    );
};

export default DevPkgList;