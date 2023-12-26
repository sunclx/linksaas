import { Divider, Form, Input, Modal, Select,message } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo } from "@/api/docker_template";
import { list_cate } from "@/api/docker_template";
import { create_app } from "@/api/docker_template_admin";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { observer } from 'mobx-react';
import { get_admin_session } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { write_file, set_file_owner, FILE_OWNER_TYPE_DOCKER_TEMPLATE, GLOBAL_DOCKER_TEMPLATE_FS_ID } from "@/api/fs";
import { useStores } from "@/hooks";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import AsyncImage from "@/components/AsyncImage";

export interface CreateAppModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateAppModal = (props: CreateAppModalProps) => {
    const appStore = useStores('appStore');

    const [iconFileId, setIconFileId] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [curCateId, setCurCateId] = useState("");
    const [appName, setAppName] = useState("");
    const [appDesc, setAppDesc] = useState("");
    const [officialUrl, setOfficialUrl] = useState("");
    const [docUrl, setDocUrl] = useState("");

    const loadCateList = async () => {
        const res = await list_cate({});
        setCateList(res.cate_info_list);
    };

    const changeIcon = async () => {
        const selectd = await open_dialog({
            title: "更换模板图标",
            filters: [{
                name: "图标",
                extensions: ["ico", "png", "jpg", "jpeg"],
            }],
        });
        if (selectd == null || Array.isArray(selectd)) {
            return;
        }
        const sessionId = await get_admin_session();
        const res = await request(write_file(sessionId, GLOBAL_DOCKER_TEMPLATE_FS_ID, selectd, ""));
        setIconFileId(res.file_id);
        if (appStore.isOsWindows) {
            setIconUrl(`https://fs.localhost/${GLOBAL_DOCKER_TEMPLATE_FS_ID}/${res.file_id}/x.png`);
        } else {
            setIconUrl(`fs://localhost/${GLOBAL_DOCKER_TEMPLATE_FS_ID}/${res.file_id}/x.png`);
        }

    };

    const createApp = async () => {
        if(officialUrl != "" && officialUrl.startsWith("https://") == false){
            message.error("官网地址必须以https://开头");
            return;
        }
        if(docUrl != "" && docUrl.startsWith("https://") == false){
            message.error("文档地址必须以https://开头");
            return;
        }
        const sessionId = await get_admin_session();
        const createRes = await request(create_app({
            admin_session_id: sessionId,
            name: appName,
            desc: appDesc,
            icon_file_id: iconFileId,
            cate_id: curCateId,
            official_url: officialUrl,
            doc_url: docUrl
        }));
        if (iconFileId != "") {
            await request(set_file_owner({
                session_id: sessionId,
                fs_id: GLOBAL_DOCKER_TEMPLATE_FS_ID,
                file_id: iconFileId,
                owner_type: FILE_OWNER_TYPE_DOCKER_TEMPLATE,
                owner_id: createRes.app_id,
            }));
        }
        props.onOk();
    };

    useEffect(() => {
        loadCateList();
    }, []);

    return (
        <Modal open title="创建模板"
            bodyStyle={{ maxHeight: "calc(100vh - 250px)", overflow: "scroll" }}
            okText="创建" okButtonProps={{ disabled: curCateId == "" || appName == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createApp();
            }}>
            <div style={{ display: "flex" }}>
                <div style={{ width: "100px" }}>
                    <AsyncImage style={{ width: "80px", cursor: "pointer" }}
                        src={iconUrl}
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
                <div style={{ flex: 1 }}>
                    <Form>
                        <Form.Item label="名称">
                            <Input value={appName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAppName(e.target.value.trim());
                            }} />
                        </Form.Item>
                        <Form.Item label="类别">
                            <Select value={curCateId} onChange={value => setCurCateId(value)}>
                                {cateList.map(item => (
                                    <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Divider orientation="left">可选参数</Divider>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="官网地址" help={
                    <>
                        {officialUrl.startsWith("https://".substring(0, officialUrl.length)) == false && (
                            <span style={{ color: "red" }}>地址必须以https://开头</span>
                        )}
                    </>
                }>
                    <Input value={officialUrl} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOfficialUrl(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="文档地址" help={
                    <>
                        {docUrl.startsWith("https://".substring(0, docUrl.length)) == false && (
                            <span style={{ color: "red" }}>地址必须以https://开头</span>
                        )}
                    </>
                }>
                    <Input value={docUrl} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDocUrl(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
            <Divider orientation="left">模板描述</Divider>
            <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} value={appDesc} onChange={e => {
                e.stopPropagation();
                e.preventDefault();
                setAppDesc(e.target.value);
            }} />
        </Modal>
    );
};

export default observer(CreateAppModal);