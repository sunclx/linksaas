import React, { useEffect, useState } from "react";
import { Card, Space, Image, Spin, Divider, Table, Modal, Descriptions, Empty, List, Popover } from "antd";
import type { AppWithTemplateInfo, TemplateInfo, CateInfo, AppImage } from "@/api/docker_template";
import { update_app, remove_app, remove_template, add_image, remove_image } from "@/api/docker_template_admin";
import { get_admin_perm, get_admin_session, type AdminPermInfo } from "@/api/admin_auth";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/es/table';
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import moment from "moment";
import { download_file } from "@/api/fs";
import { open as shell_open } from '@tauri-apps/api/shell';
import CreateVersionModal from "./CreateVersionModal";
import { EditText } from "@/components/EditCell/EditText";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import { EditTextArea } from "@/components/EditCell/EditTextArea";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { write_thumb_image_file, write_file, set_file_owner, FILE_OWNER_TYPE_DOCKER_TEMPLATE } from "@/api/fs";
import { open as open_shell } from '@tauri-apps/api/shell';
import { MoreOutlined } from "@ant-design/icons";
import SetImageWeightModal from "./SetImageWeightModal";


export interface AppPanelProps {
    appInfo: AppWithTemplateInfo;
    cateList: CateInfo[];
    onChange: () => void;
    onRemove: () => void;
}

const AppPanel = (props: AppPanelProps) => {
    const appStore = useStores('appStore');

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [curDownloadFileId, setCurDownloadFileId] = useState("");
    const [createTemplateAppId, setCreateTemplateAppId] = useState("");
    const [removeVersion, setRemoveVersion] = useState("");
    const [changeImageInfo, setChangeImageInfo] = useState<AppImage | null>(null);
    const [removeImageInfo, setRemoveImageInfo] = useState<AppImage | null>(null);

    const getIconUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        }
    }

    const downloadFile = async (fileId: string) => {
        const sessionId = await get_admin_session();
        setCurDownloadFileId(fileId);
        try {
            const res = await download_file(sessionId, appStore.clientCfg?.docker_template_fs_id ?? "", fileId, "", "template.zip");
            if (res.exist_in_local) {
                shell_open(res.local_dir);
            }
        } catch (e) {
            console.log(e);
        }
        setCurDownloadFileId("");
    };

    const removeApp = async () => {
        const sessionId = await get_admin_session();
        await request(remove_app({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_info.app_id,
        }));
        props.onRemove();
    };

    const removeTemplate = async () => {
        const sessionId = await get_admin_session();
        await request(remove_template({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_info.app_id,
            version: removeVersion,
        }));
        props.onChange();
        setRemoveVersion("");
    };

    const updateIconFile = async () => {
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
        const res = await request(write_file(sessionId, appStore.clientCfg?.docker_template_fs_id ?? "", selectd, ""));
        await request(set_file_owner({
            session_id: sessionId,
            fs_id: appStore.clientCfg?.docker_template_fs_id ?? "",
            file_id: res.file_id,
            owner_type: FILE_OWNER_TYPE_DOCKER_TEMPLATE,
            owner_id: props.appInfo.app_info.app_id,
        }));
        await request(update_app({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_info.app_id,
            name: props.appInfo.app_info.name,
            desc: props.appInfo.app_info.desc,
            icon_file_id: res.file_id,
            cate_id: props.appInfo.app_info.cate_id,
            official_url: props.appInfo.app_info.official_url,
            doc_url: props.appInfo.app_info.doc_url,
        }));
        props.onChange();
    };

    const addImage = async () => {
        const selectd = await open_dialog({
            title: "选择截图",
            filters: [
                {
                    name: "图片",
                    extensions: ["jpg", "jpeg", "png", "bmp"]
                }
            ],
        });
        if (Array.isArray(selectd) || selectd == null) {
            return;
        }
        //上传图片
        const sessionId = await get_admin_session();
        const thumbUploadRes = await request(write_thumb_image_file(sessionId,
            appStore.clientCfg?.docker_template_fs_id ?? "", selectd, "", 200, 150));
        const rawUploadRes = await request(write_file(sessionId,
            appStore.clientCfg?.docker_template_fs_id ?? "", selectd, ""));
        //设置owner
        await set_file_owner({
            session_id: sessionId,
            fs_id: appStore.clientCfg?.docker_template_fs_id ?? "",
            file_id: thumbUploadRes.file_id,
            owner_type: FILE_OWNER_TYPE_DOCKER_TEMPLATE,
            owner_id: props.appInfo.app_info.app_id,
        });
        await set_file_owner({
            session_id: sessionId,
            fs_id: appStore.clientCfg?.docker_template_fs_id ?? "",
            file_id: rawUploadRes.file_id,
            owner_type: FILE_OWNER_TYPE_DOCKER_TEMPLATE,
            owner_id: props.appInfo.app_info.app_id,
        });
        //增加image
        await request(add_image({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_info.app_id,
            app_image: {
                thumb_file_id: thumbUploadRes.file_id,
                raw_file_id: rawUploadRes.file_id,
                weight: (props.appInfo.app_info.image_list ?? []).length,
            },
        }));
        //重载app信息
        props.onChange();
    };

    const getImageUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/image.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/image.png`;
        }
    };

    const removeImage = async () => {
        if (removeImageInfo == null) {
            return;
        }
        const sessionId = await get_admin_session();
        await request(remove_image({
            admin_session_id: sessionId,
            app_id: props.appInfo.app_info.app_id,
            thumb_file_id: removeImageInfo.thumb_file_id,
            raw_file_id: removeImageInfo.raw_file_id,
        }));
        setRemoveImageInfo(null);
        props.onChange();
    };

    const columns: ColumnsType<TemplateInfo> = [
        {
            title: "版本",
            dataIndex: "version",
        },
        {
            title: "模板文件",
            render: (_, row) => (
                <Space>
                    <Button type="link" style={{ padding: "0px 0px", minWidth: 0 }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        downloadFile(row.file_id);
                    }}>template.zip</Button>
                    {curDownloadFileId == row.file_id && (
                        <Spin tip="下载中" size="small" />
                    )}
                </Space>
            ),
        },
        {
            title: "操作",
            render: (_, row) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                    disabled={!(permInfo?.docker_template_perm.remove_template ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveVersion(row.version);
                        console.log(row.version);
                    }}>删除模板</Button>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card style={{ width: "100%" }} title={
            <EditText editable={permInfo?.docker_template_perm.update_app ?? false} content={props.appInfo.app_info.name}
                showEditIcon={true} onChange={async (value) => {
                    if (value.trim() == "") {
                        return false;
                    }
                    const sessionId = await get_admin_session();
                    try {
                        await request(update_app({
                            admin_session_id: sessionId,
                            app_id: props.appInfo.app_info.app_id,
                            name: value,
                            desc: props.appInfo.app_info.desc,
                            icon_file_id: props.appInfo.app_info.icon_file_id,
                            cate_id: props.appInfo.app_info.cate_id,
                            official_url: props.appInfo.app_info.official_url,
                            doc_url: props.appInfo.app_info.doc_url,
                        }));
                        props.onChange();
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    return true;
                }} />
        } extra={
            <Button type="link" danger disabled={(props.appInfo.template_info_list.length > 0) || !(permInfo?.docker_template_perm.remove_app ?? false)}
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeApp();
                }}>删除模板</Button>
        }>
            <div style={{ display: "flex" }}>
                <div style={{ width: "100px" }}>
                    <Image style={{ width: "80px", cursor: "pointer" }}
                        src={getIconUrl(props.appInfo.app_info.icon_file_id)}
                        preview={false}
                        fallback={defaultIcon}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateIconFile();
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Descriptions>
                        <Descriptions.Item label="模板类别">
                            <EditSelect editable={permInfo?.docker_template_perm.update_app ?? false} curValue={props.appInfo.app_info.cate_id}
                                itemList={props.cateList.map(item => ({
                                    value: item.cate_id,
                                    label: item.cate_name,
                                    color: "black",
                                }))} showEditIcon={true} allowClear={false} width="100%" onChange={async (value) => {
                                    const sessionId = await get_admin_session();
                                    try {
                                        await request(update_app({
                                            admin_session_id: sessionId,
                                            app_id: props.appInfo.app_info.app_id,
                                            name: props.appInfo.app_info.name,
                                            desc: props.appInfo.app_info.desc,
                                            icon_file_id: props.appInfo.app_info.icon_file_id,
                                            cate_id: value as string,
                                            official_url: props.appInfo.app_info.official_url,
                                            doc_url: props.appInfo.app_info.doc_url,
                                        }));
                                        props.onChange();
                                    } catch (e) {
                                        console.log(e);
                                        return false;
                                    }
                                    return true;
                                }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="官网地址">
                            <EditText editable={permInfo?.docker_template_perm.update_app ?? false} content={props.appInfo.app_info.official_url}
                                showEditIcon={true} onClick={() => {
                                    if (props.appInfo.app_info.official_url != "") {
                                        open_shell(props.appInfo.app_info.official_url);
                                    }
                                }} onChange={async (value) => {
                                    const sessionId = await get_admin_session();
                                    try {
                                        await request(update_app({
                                            admin_session_id: sessionId,
                                            app_id: props.appInfo.app_info.app_id,
                                            name: props.appInfo.app_info.name,
                                            desc: props.appInfo.app_info.desc,
                                            icon_file_id: props.appInfo.app_info.icon_file_id,
                                            cate_id: props.appInfo.app_info.cate_id,
                                            official_url: value as string,
                                            doc_url: props.appInfo.app_info.doc_url,
                                        }));
                                        props.onChange();
                                    } catch (e) {
                                        console.log(e);
                                        return false;
                                    }
                                    return true;
                                }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="文档地址">
                            <EditText editable={permInfo?.docker_template_perm.update_app ?? false} content={props.appInfo.app_info.doc_url}
                                showEditIcon={true} onClick={() => {
                                    if (props.appInfo.app_info.doc_url != "") {
                                        open_shell(props.appInfo.app_info.doc_url);
                                    }
                                }} onChange={async (value) => {
                                    const sessionId = await get_admin_session();
                                    try {
                                        await request(update_app({
                                            admin_session_id: sessionId,
                                            app_id: props.appInfo.app_info.app_id,
                                            name: props.appInfo.app_info.name,
                                            desc: props.appInfo.app_info.desc,
                                            icon_file_id: props.appInfo.app_info.icon_file_id,
                                            cate_id: props.appInfo.app_info.cate_id,
                                            official_url: props.appInfo.app_info.official_url,
                                            doc_url: value as string,
                                        }));
                                        props.onChange();
                                    } catch (e) {
                                        console.log(e);
                                        return false;
                                    }
                                    return true;
                                }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {moment(props.appInfo.app_info.create_time).format("YYYY-MM-DD HH:mm:ss")}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {moment(props.appInfo.app_info.update_time).format("YYYY-MM-DD HH:mm:ss")}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
            <Divider orientation="left">模板描述</Divider>
            <div style={{ padding: "0px 10px 30px 10px" }}>
                <EditTextArea editable={permInfo?.docker_template_perm.update_app ?? false} content={props.appInfo.app_info.desc}
                    showEditIcon={true} onChange={async (value) => {
                        const sessionId = await get_admin_session();
                        try {
                            await request(update_app({
                                admin_session_id: sessionId,
                                app_id: props.appInfo.app_info.app_id,
                                name: props.appInfo.app_info.name,
                                desc: value,
                                icon_file_id: props.appInfo.app_info.icon_file_id,
                                cate_id: props.appInfo.app_info.cate_id,
                                official_url: props.appInfo.app_info.official_url,
                                doc_url: props.appInfo.app_info.doc_url,
                            }));
                            props.onChange();
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        return true;
                    }} />
            </div>
            <Divider orientation="left">项目截图</Divider>
            <Card style={{ border: "none" }} extra={
                <Button disabled={!(permInfo?.docker_template_perm.update_app ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addImage();
                    }}>上传截图</Button>}>
                {(props.appInfo.app_info.image_list ?? []).length == 0 && (
                    <Empty />
                )}
                {(props.appInfo.app_info.image_list ?? []).length > 0 && (
                    <Image.PreviewGroup>
                        <List rowKey="thumb_file_id" dataSource={props.appInfo.app_info.image_list ?? []} grid={{ gutter: 16 }}
                            renderItem={(imageItem, imageIndex) => (
                                <List.Item>
                                    <Card title={`图片${imageIndex + 1}(权重${imageItem.weight})`} extra={
                                        <Popover trigger="click" placement="bottom" content={
                                            <Space direction="vertical">
                                                <Button type="link" disabled={!(permInfo?.docker_template_perm.update_app ?? false)}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setChangeImageInfo(imageItem);
                                                    }}>调整权重</Button>
                                                <Button type="link" disabled={!(permInfo?.docker_template_perm.update_app ?? false)} danger
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setRemoveImageInfo(imageItem);
                                                    }}>删除截图</Button>
                                            </Space>
                                        }>
                                            <MoreOutlined />
                                        </Popover>
                                    }>
                                        <Image src={getImageUrl(imageItem.thumb_file_id)} width={200} height={150}
                                            preview={{ src: getImageUrl(imageItem.raw_file_id) }} />
                                    </Card>
                                </List.Item>
                            )} />
                    </Image.PreviewGroup>
                )}
            </Card>
            <Divider orientation="left">模板版本</Divider>
            <Card style={{ border: "none" }} extra={
                <Button disabled={!(permInfo?.docker_template_perm.create_template ?? false)} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCreateTemplateAppId(props.appInfo.app_info.app_id);
                }}>上传模板</Button>
            }>
                <Table rowKey="version" dataSource={props.appInfo.template_info_list} columns={columns} pagination={false} />
            </Card>
            {createTemplateAppId !== "" && (
                <CreateVersionModal appId={createTemplateAppId} onCancel={() => setCreateTemplateAppId("")} onOk={() => {
                    props.onChange();
                    setCreateTemplateAppId("");
                }} />
            )}
            {removeVersion !== "" && (
                <Modal open title="删除模板版本" okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveVersion("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeTemplate();
                    }}>
                    是否删除模板版本&nbsp;{removeVersion}&nbsp;?
                </Modal>
            )}
            {changeImageInfo != null && (
                <SetImageWeightModal appId={props.appInfo.app_info.app_id} appImage={changeImageInfo}
                    onCancel={() => setChangeImageInfo(null)}
                    onOk={() => {
                        setChangeImageInfo(null);
                        props.onChange();
                    }} />
            )}
            {removeImageInfo != null && (
                <Modal open title="删除截图" okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveImageInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeImage();
                    }}>
                    是否删除截图?
                </Modal>
            )}
        </Card>
    );
};

export default AppPanel;