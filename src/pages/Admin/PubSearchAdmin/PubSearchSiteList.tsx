import { type AdminPermInfo, get_admin_perm, get_admin_session } from "@/api/admin_auth";
import { list_site_cate, list_site, type SiteCate, type Site } from "@/api/pub_search";
import Button from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Checkbox, Modal, Select, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import AddSiteModal from "./components/AddSiteModal";
import type { ColumnsType } from 'antd/es/table';
import { remove_site, update_site } from "@/api/pub_search_admin";
import { request } from "@/utils/request";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { EditText } from "@/components/EditCell/EditText";
import AsyncImage from "@/components/AsyncImage";
import { useStores } from "@/hooks";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { write_file, set_file_owner, FILE_OWNER_TYPE_SEARCH_SITE } from "@/api/fs";

const PubSearchSiteList = () => {
    const appStore = useStores('appStore');

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [cateList, setCateList] = useState<SiteCate[]>([]);
    const [curCateId, setCurCateId] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [siteList, setSiteList] = useState<Site[]>([]);
    const [removeSiteInfo, setRemoveSiteInfo] = useState<Site | null>(null);

    const loadCateList = async () => {
        const res = await list_site_cate({});
        setCateList(res.cate_list);
    };

    const loadSiteList = async () => {
        const res = await list_site({
            filter_by_cate_id: curCateId != "",
            cate_id: curCateId,
        });
        setSiteList(res.site_list);
    };

    const removeSite = async () => {
        if (removeSiteInfo == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_site({
            admin_session_id: sessionId,
            site_id: removeSiteInfo.site_id,
        }));
        const tmpList = siteList.filter(item => item.site_id != removeSiteInfo.site_id);
        setSiteList(tmpList);
        setRemoveSiteInfo(null);
    };

    const setDefaultSite = async (info: Site, defaultSite: boolean) => {
        const sessionId = await get_admin_session();
        await request(update_site({
            admin_session_id: sessionId,
            site_id: info.site_id,
            site_name: info.site_name,
            icon_file_id: info.icon_file_id,
            search_tpl: info.search_tpl,
            cate_id: info.cate_id,
            default_site: defaultSite,
        }));
        const tmpList = siteList.slice();
        const index = tmpList.findIndex(item => item.site_id == info.site_id);
        if (index != -1) {
            tmpList[index].default_site = defaultSite
            setSiteList(tmpList);
        }
    };

    const getIconUrl = (iconFileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        }
    };

    const changeIcon = async (info: Site) => {
        const selectd = await open_dialog({
            title: "更换应用图标",
            filters: [{
                name: "图标",
                extensions: ["ico", "png", "jpg", "jpeg"],
            }],
        });
        if (selectd == null || Array.isArray(selectd)) {
            return;
        } else {
            const sessionId = await get_admin_session();
            const res = await request(write_file(sessionId, appStore.clientCfg?.pub_search_fs_id ?? "", selectd, ""));
            await request(update_site({
                admin_session_id: sessionId,
                site_id: info.site_id,
                site_name: info.site_name,
                icon_file_id: res.file_id,
                search_tpl: info.search_tpl,
                cate_id: info.cate_id,
                default_site: info.default_site,
            }));
            await request(set_file_owner({
                session_id: sessionId,
                fs_id: appStore.clientCfg?.pub_search_fs_id ?? "",
                file_id: res.file_id,
                owner_type: FILE_OWNER_TYPE_SEARCH_SITE,
                owner_id: info.site_id,
            }));

            const tmpList = siteList.slice();
            const index = tmpList.findIndex(item => item.site_id == info.site_id);
            if (index != -1) {
                tmpList[index].icon_file_id = res.file_id;
                setSiteList(tmpList);
            }
        }
    };

    const findCateName = (cateId: string) => {
        const index = cateList.findIndex(item => item.cate_id == cateId);
        if (index == -1) {
            return "";
        } else {
            return cateList[index].cate_name;
        }
    }

    const columns: ColumnsType<Site> = [
        {
            title: "图标",
            width: 80,
            render: (_, row: Site) => (
                <AsyncImage style={{ width: "20px", cursor: "pointer" }}
                    src={getIconUrl(row.icon_file_id)}
                    preview={false}
                    fallback={defaultIcon}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        changeIcon(row);
                    }}
                    useRawImg={false}
                />
            ),
        },
        {
            title: "名称",
            width: 200,
            render: (_, row: Site) => (
                <EditText editable={permInfo?.pub_search_perm.update_site ?? false}
                    content={row.site_name}
                    showEditIcon={true}
                    onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        try {
                            const sessionId = await get_admin_session();
                            await request(update_site({
                                admin_session_id: sessionId,
                                site_id: row.site_id,
                                site_name: value.trim(),
                                icon_file_id: row.icon_file_id,
                                search_tpl: row.search_tpl,
                                cate_id: row.cate_id,
                                default_site: row.default_site,
                            }));
                            const tmpList = siteList.slice();
                            const index = tmpList.findIndex(item => item.site_id == row.site_id);
                            if (index != -1) {
                                tmpList[index].site_name = value.trim();
                                setSiteList(tmpList);
                            }
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }} />
            ),
        },
        {
            title: "搜索路径",
            width: 500,
            render: (_, row: Site) => (
                <EditText editable={permInfo?.pub_search_perm.update_site ?? false}
                    content={row.search_tpl}
                    showEditIcon={true}
                    onChange={async value => {
                        if (value.includes("KEYWORD") == false) {
                            message.warn("搜索路径必须包含KEYWORD单词");
                            return false;
                        }
                        try {
                            const sessionId = await get_admin_session();
                            await request(update_site({
                                admin_session_id: sessionId,
                                site_id: row.site_id,
                                site_name: row.site_name,
                                icon_file_id: row.icon_file_id,
                                search_tpl: value.trim(),
                                cate_id: row.cate_id,
                                default_site: row.default_site,
                            }));
                            const tmpList = siteList.slice();
                            const index = tmpList.findIndex(item => item.site_id == row.site_id);
                            if (index != -1) {
                                tmpList[index].search_tpl = value.trim();
                                setSiteList(tmpList);
                            }
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }} />
            ),
        },
        {
            title: "站点类别",
            width: 150,
            render: (_, row: Site) => (
                <EditSelect editable={permInfo?.pub_search_perm.update_site ?? false}
                    curValue={row.cate_id}
                    itemList={cateList.map(item => ({
                        value: item.cate_id,
                        label: item.cate_name,
                        color: "black",
                    }))}
                    showEditIcon={true}
                    width="100px"
                    allowClear={false}
                    onChange={async value => {
                        try {
                            const sessionId = await get_admin_session();
                            await request(update_site({
                                admin_session_id: sessionId,
                                site_id: row.site_id,
                                site_name: row.site_name,
                                icon_file_id: row.icon_file_id,
                                search_tpl: row.search_tpl,
                                cate_id: value as string,
                                default_site: row.default_site,
                            }));
                            const tmpList = siteList.slice();
                            const index = tmpList.findIndex(item => item.site_id == row.site_id);
                            if (index != -1) {
                                tmpList[index].cate_id = value as string;
                                tmpList[index].cate_name = findCateName(value as string);
                                setSiteList(tmpList);
                            }
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }}
                />
            ),
        },
        {
            title: "默认站点",
            width: 100,
            render: (_, row: Site) => (
                <Checkbox checked={row.default_site}
                    disabled={!(permInfo?.pub_search_perm.update_site ?? false)}
                    onChange={e => {
                        e.stopPropagation();
                        setDefaultSite(row, e.target.checked);
                    }} />
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: Site) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                    disabled={!(permInfo?.pub_search_perm.remove_site ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveSiteInfo(row);
                    }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        loadSiteList();
    }, [curCateId]);

    return (
        <Card title="搜索站点"
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll" }}
            extra={
                <Space size="middle">
                    <Select value={curCateId} onSelect={value => setCurCateId(value)} style={{ width: "100px" }}>
                        <Select.Option value="">全部</Select.Option>
                        {cateList.map(item => (
                            <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                        ))}
                    </Select>
                    <Button
                        disabled={!(permInfo?.pub_search_perm.add_site ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowAddModal(true);
                        }}>
                        <PlusOutlined />&nbsp;&nbsp;添加站点
                    </Button>
                </Space>
            }>
            <Table rowKey="site_id" dataSource={siteList} columns={columns} pagination={false} />
            {showAddModal == true && (
                <AddSiteModal onCancel={() => setShowAddModal(false)} onOk={() => {
                    setShowAddModal(false);
                    if (curCateId != "") {
                        setCurCateId("");
                    } else {
                        loadSiteList();
                    }
                }} />
            )}
            {removeSiteInfo != null && (
                <Modal open title="删除站点" okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveSiteInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSite();
                    }}>
                    是否删除站点&nbsp;{removeSiteInfo.site_name}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default PubSearchSiteList;