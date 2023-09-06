import { get_admin_session } from "@/api/admin_auth";
import { add_site } from "@/api/pub_search_admin";
import { request } from "@/utils/request";
import { Checkbox, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { write_file, set_file_owner, FILE_OWNER_TYPE_SEARCH_SITE } from "@/api/fs";
import { useStores } from "@/hooks";
import s from "./AddSiteModal.module.less";
import AsyncImage from "@/components/AsyncImage";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { list_site_cate, type SiteCate } from "@/api/pub_search";

export interface AddSiteModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const AddSiteModal = (props: AddSiteModalProps) => {
    const appStore = useStores('appStore');

    const [siteName, setSiteName] = useState("");
    const [iconFileId, setIconFileId] = useState("");
    const [searchTpl, setSearchTpl] = useState("");
    const [cateId, setCateId] = useState("");
    const [defaultSite, setDefaultSite] = useState(false);
    const [useBrowser, setUseBrowser] = useState(false);

    const [cateList, setCateList] = useState<SiteCate[]>([]);

    const addSite = async () => {
        if (siteName == "" || iconFileId == "" || searchTpl == "" || cateId == "") {
            return;
        }
        //创建站点
        const sessionId = await get_admin_session();
        const addRes = await request(add_site({
            admin_session_id: sessionId,
            site_name: siteName,
            icon_file_id: iconFileId,
            search_tpl: searchTpl,
            cate_id: cateId,
            default_site: defaultSite,
            use_browser: useBrowser,
        }));
        //设置文件owner
        await request(set_file_owner({
            session_id: sessionId,
            fs_id: appStore.clientCfg?.pub_search_fs_id ?? "",
            file_id: iconFileId,
            owner_type: FILE_OWNER_TYPE_SEARCH_SITE,
            owner_id: addRes.site_id,
        }));
        message.info("增加站点成功");
        props.onOk();
    };

    const changeIcon = async () => {
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
            setIconFileId(res.file_id);
        }
    };

    const getIconUrl = () => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        }
    };

    const loadCateList = async () => {
        const res = await list_site_cate({});
        setCateList(res.cate_list);
    };

    useEffect(() => {
        loadCateList();
    }, []);

    return (
        <Modal open title="增加站点"
            okText="增加" okButtonProps={{ disabled: (siteName == "" || iconFileId == "" || searchTpl == "" || cateId == "") }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addSite();
            }}>
            <div className={s.head}>
                <div className={s.left}>
                    <AsyncImage style={{ width: "80px", cursor: "pointer" }}
                        src={getIconUrl()}
                        preview={false}
                        fallback={defaultIcon}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            changeIcon();
                        }}
                        useRawImg={false}
                    />
                </div>
                <div className={s.right}>
                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="名称">
                            <Input value={siteName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSiteName(e.target.value.trim());
                            }} />
                        </Form.Item>
                        <Form.Item label="搜索路径" help={
                            <>
                                {searchTpl.includes("KEYWORD") == false && searchTpl != "" && (
                                    <span style={{ color: "red" }}>路径中必须包含KEYWORD字符串</span>
                                )}
                            </>
                        }>
                            <Input value={searchTpl} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSearchTpl(e.target.value.trim());
                            }} />
                        </Form.Item>
                        <Form.Item label="站点类别">
                            <Select value={cateId} onSelect={value => setCateId(value)}>
                                <Select.Option value="">未选择类别</Select.Option>
                                {cateList.map(item => (
                                    <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="默认站点">
                            <Checkbox checked={defaultSite} onChange={e => {
                                e.stopPropagation();
                                setDefaultSite(e.target.checked);
                            }} />
                        </Form.Item>
                        <Form.Item label="使用浏览器打开">
                            <Checkbox checked={useBrowser} onChange={e => {
                                e.stopPropagation();
                                setUseBrowser(e.target.checked);
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default AddSiteModal;