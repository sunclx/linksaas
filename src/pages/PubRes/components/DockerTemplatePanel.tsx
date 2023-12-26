import { Button, Card, Form, List, Popover, Select, Space, Input } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo, AppWithTemplateInfo } from "@/api/docker_template";
import { list_cate, list_app_with_template } from "@/api/docker_template";
import { request } from "@/utils/request";
import { MoreOutlined } from "@ant-design/icons";
import LocalDockerTemplateModal from "./LocalDockerTemplateModal";
import DockerTemplateModal from "./DockerTemplateModal";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import { observer } from 'mobx-react';
import { open as open_shell } from '@tauri-apps/api/shell';
import AsyncImage from "@/components/AsyncImage";
import { GLOBAL_DOCKER_TEMPLATE_FS_ID } from "@/api/fs";

const PAGE_SIZE = 10;

const DockerTemplatePanel = () => {
    const appStore = useStores('appStore');
    const pubResStore = useStores('pubResStore');

    const [cateInfoList, setCateInfoList] = useState<CateInfo[]>([]);

    const [awtInfoList, setAwtInfoList] = useState<AppWithTemplateInfo[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [templatePath, setTemplatePath] = useState("");
    const [useLocalTemplate, setUseLocalTemplate] = useState(false);

    const loadCateInfoList = async () => {
        const res = await request(list_cate({}));
        setCateInfoList(res.cate_info_list);
    };

    const loadAwtInfoList = async () => {
        const res = await request(list_app_with_template({
            filter_by_cate_id: pubResStore.dockerCateId !== "",
            cate_id: pubResStore.dockerCateId,
            filter_by_keyword: pubResStore.dockerKeyword !== "",
            keyword: pubResStore.dockerKeyword,
            offset: pubResStore.dockerCurPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setAwtInfoList(res.info_list);
        setTotalCount(res.total_count);
    };

    const getIconUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${GLOBAL_DOCKER_TEMPLATE_FS_ID}/${fileId}/x.png`;
        } else {
            return `fs://localhost/${GLOBAL_DOCKER_TEMPLATE_FS_ID}/${fileId}/x.png`;
        }
    }

    useEffect(() => {
        loadCateInfoList();
    }, []);

    useEffect(() => {
        loadAwtInfoList();
    }, [pubResStore.dockerCurPage, pubResStore.dockerCateId, pubResStore.dockerKeyword]);

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Space size="middle">
                    <Form layout="inline">
                        <Form.Item label="模板类别">
                            <Select value={pubResStore.dockerCateId} onChange={value => pubResStore.dockerCateId = value} style={{ width: "100px" }}>
                                <Select.Option value="">全部</Select.Option>
                                {cateInfoList.map(cateInfo => (
                                    <Select.Option key={cateInfo.cate_id} value={cateInfo.cate_id}>{cateInfo.cate_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="关键词">
                            <Input style={{ width: "150px" }} allowClear value={pubResStore.dockerKeyword} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                pubResStore.dockerKeyword = e.target.value.trim();
                            }} />
                        </Form.Item>
                    </Form>
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setUseLocalTemplate(true);
                            }}>使用本地模板</Button>
                        </Space>
                    }>
                        <MoreOutlined style={{ marginRight: "30px" }} />
                    </Popover>
                </Space>
            }>
            <List dataSource={awtInfoList} renderItem={item => (
                <List.Item key={item.app_info.app_id}>
                    <Card title={
                        <a style={{ fontSize: "16px", fontWeight: 600 }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            pubResStore.dockerAppId = item.app_info.app_id;
                        }}>{item.app_info.name}</a>
                    } bodyStyle={{ margin: "10px 10px" }} style={{ width: "100%" }} bordered={false}
                        extra={
                            <Space size="middle">
                                {item.app_info.official_url != "" && (
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        open_shell(item.app_info.official_url);
                                    }}>官网</a>
                                )}
                                {item.app_info.doc_url != "" && (
                                    <a onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        open_shell(item.app_info.doc_url);
                                    }}>文档</a>
                                )}
                            </Space>
                        }>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "100px" }}>
                                <AsyncImage style={{ width: "80px", cursor: "pointer" }}
                                    src={getIconUrl(item.app_info.icon_file_id)}
                                    preview={false}
                                    fallback={defaultIcon}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        pubResStore.dockerAppId = item.app_info.app_id;
                                    }}
                                    useRawImg={false}
                                />
                            </div>
                            <div style={{ paddingLeft: "20px", flex: 1, height: "120px", overflowY: "scroll" }}>
                                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.app_info.desc}</pre>
                            </div>
                        </div>

                    </Card>
                </List.Item>
            )} pagination={{
                total: totalCount, current: pubResStore.dockerCurPage + 1, pageSize: PAGE_SIZE,
                onChange: page => pubResStore.dockerCurPage = page - 1, hideOnSinglePage: true,
                showSizeChanger: false
            }} />
            {useLocalTemplate == true && (
                <LocalDockerTemplateModal onCancel={() => setUseLocalTemplate(false)}
                    onOk={path => {
                        setTemplatePath(path);
                        setUseLocalTemplate(false);
                    }} />
            )}
            {templatePath !== "" && (
                <DockerTemplateModal templatePath={templatePath} onCancel={() => setTemplatePath("")} />
            )}
        </Card>
    );
};

export default observer(DockerTemplatePanel);