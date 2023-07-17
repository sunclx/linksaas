import { Card, List, Popover, Select, Space, Spin, Table, Image, Form, Divider } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo, AppWithTemplateInfo, TemplateInfo } from "@/api/docker_template";
import { list_cate, list_app_with_template, get_app_with_template } from "@/api/docker_template";
import Button from "@/components/Button";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import CreateAppModal from "./components/CreateAppModal";
import { MoreOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/es/table';
import { download_file } from "@/api/fs";
import { open as shell_open } from '@tauri-apps/api/shell';
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import moment from "moment";
import CreateVersionModal from "./components/CreateVersionModal";

const PAGE_SIZE = 10;

const TemplateList = () => {
    const appStore = useStores('appStore');

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [curCateId, setCurCateId] = useState("");

    const [awtList, setAwtList] = useState<AppWithTemplateInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeAwtInfo, setRemoveAwtInfo] = useState<AppWithTemplateInfo | null>(null);

    const [showCreateAppModal, setShowCreateAppModal] = useState(false);

    const [curDownloadFileId, setCurDownloadFileId] = useState("");

    const [createTemplateAppId, setCreateTemplateAppId] = useState("");


    const loadCateList = async () => {
        const res = await list_cate({});
        setCateList(res.cate_info_list);
    };

    const loadAwtList = async () => {
        const res = await list_app_with_template({
            filter_by_cate_id: curCateId !== "",
            cate_id: curCateId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        });
        setAwtList(res.info_list);
        setTotalCount(res.total_count);
        console.log(res);
    };

    const loadAwtInfo = async (appId: string) => {
        const res = await get_app_with_template({ app_id: appId });
        const tmpList = awtList.slice();
        const index = tmpList.findIndex(item => item.app_info.app_id == appId);
        if (index != -1) {
            tmpList[index] = res.info;
            setAwtList(tmpList);
        }
    };

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

    const getIconUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        }
    }

    const columns: ColumnsType<TemplateInfo> = [
        {
            title: "版本",
            dataIndex: "version",
        },
        {
            title: "模板文件",
            render: (_, row) => (
                <Space>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        downloadFile(row.file_id);
                    }}>template.zip</Button>
                    {curDownloadFileId == row.file_id && (
                        <Spin tip="下载中" size="small" />
                    )}
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadAwtList();
    }, [curPage, curCateId]);

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="模板列表"
            style={{ height: "calc(100vh - 40px)", overflowY: "hidden" }}
            extra={
                <Space size="large">
                    <span>
                        模板类别：
                        <Select style={{ width: "100px" }} value={curCateId} onChange={value => {
                            setCurPage(0);
                            setCurCateId(value);
                        }}>
                            <Select.Option value="">全部</Select.Option>
                            {cateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </span>
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowCreateAppModal(true);
                    }} disabled={!((permInfo?.docker_template_perm.create_app ?? false) && cateList.length > 0)}>增加模板</Button>
                </Space>
            }
        >
            <List dataSource={awtList} renderItem={item => (
                <List.Item key={item.app_info.app_id}>
                    <Card style={{ width: "100%" }} title={item.app_info.name} extra={
                        <Space size="middle">
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }} disabled={!(permInfo?.docker_template_perm.update_app ?? false)}>修改</Button>
                            <Popover trigger="click" placement="bottom" content={
                                <div style={{ padding: "10px 10px" }}>
                                    <Button type="link" danger disabled={(item.template_info_list.length > 0) || !(permInfo?.docker_template_perm.remove_app ?? false)}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setRemoveAwtInfo(item);
                                        }}>删除模板</Button>
                                </div>
                            }>
                                <MoreOutlined style={{ marginRight: "20px" }} />
                            </Popover>
                        </Space>
                    }>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "100px" }}>
                                <Image style={{ width: "80px", cursor: "pointer" }}
                                    src={getIconUrl(item.app_info.icon_file_id)}
                                    preview={false}
                                    fallback={defaultIcon}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Form>
                                    <Form.Item label="模板类别">
                                        {item.app_info.cate_name}
                                    </Form.Item>
                                    <Form.Item label="创建时间">
                                        {moment(item.app_info.create_time).format("YYYY-MM-DD HH:mm:ss")}
                                    </Form.Item>
                                    <Form.Item label="更新时间">
                                        {moment(item.app_info.update_time).format("YYYY-MM-DD HH:mm:ss")}
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <Divider orientation="left">模板描述</Divider>
                        <pre>{item.app_info.desc}</pre>
                        <Card style={{ border: "none" }} extra={
                            <Button disabled={!(permInfo?.docker_template_perm.create_template ?? false)} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCreateTemplateAppId(item.app_info.app_id);
                            }}>上传模板</Button>
                        }>
                            <Table rowKey="version" dataSource={item.template_info_list} columns={columns} pagination={false} />
                        </Card>
                    </Card>
                </List.Item>
            )} />
            {showCreateAppModal == true && (
                <CreateAppModal onCancel={() => setShowCreateAppModal(false)} onOk={() => {
                    if (curCateId == "" && curPage == 0) {
                        loadAwtList();
                    } else {
                        setCurCateId("");
                        setCurPage(0);
                    }
                    setShowCreateAppModal(false);
                }} />
            )}
            {createTemplateAppId != "" && (
                <CreateVersionModal appId={createTemplateAppId} onCancel={() => setCreateTemplateAppId("")} onOk={() => {
                    loadAwtInfo(createTemplateAppId);
                    setCreateTemplateAppId("");
                }} />
            )}
        </Card>
    );
};

export default TemplateList;