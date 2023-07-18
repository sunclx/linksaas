import { Button, Card, Form, List, Popover, Select, Space, Image, Descriptions, Divider, Tag } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo, AppWithTemplateInfo } from "@/api/docker_template";
import { list_cate, list_app_with_template, check_unpark, unpack_template } from "@/api/docker_template";
import { request } from "@/utils/request";
import { MoreOutlined } from "@ant-design/icons";
import LocalDockerTemplateModal from "./LocalDockerTemplateModal";
import DockerTemplateModal from "./DockerTemplateModal";
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { useStores } from "@/hooks";
import moment from "moment";
import { download_file } from "@/api/fs";
import { observer } from 'mobx-react';

const PAGE_SIZE = 10;

const DockerTemplatePanel = () => {
    const appStore = useStores('appStore');
    const userStore = useStores('userStore');

    const [curCateId, setCurCateId] = useState("");
    const [cateInfoList, setCateInfoList] = useState<CateInfo[]>([]);

    const [curPage, setCurPage] = useState(0);
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
            filter_by_cate_id: curCateId !== "",
            cate_id: curCateId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setAwtInfoList(res.info_list);
        setTotalCount(res.total_count);
    };

    const getIconUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/x.png`;
        }
    }

    const prepareTemplate = async (fileId: string) => {
        const downloadRes = await download_file(userStore.sessionId, appStore.clientCfg?.docker_template_fs_id ?? "", fileId, "", "template.zip");
        const checkRes = await check_unpark(appStore.clientCfg?.docker_template_fs_id ?? "", fileId);
        if (!checkRes) {
            await unpack_template(appStore.clientCfg?.docker_template_fs_id ?? "", fileId);
        }
        if (appStore.isOsWindows) {
            setTemplatePath(`${downloadRes.local_dir}\\template`);
        } else {
            setTemplatePath(`${downloadRes.local_dir}/template`);
        }
    };

    useEffect(() => {
        loadCateInfoList();
    }, []);

    useEffect(() => {
        loadAwtInfoList();
    }, [curPage, curCateId]);

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Space size="middle">
                    <Form layout="inline">
                        <Form.Item label="模板类别">
                            <Select value={curCateId} onChange={value => setCurCateId(value)} style={{ width: "100px" }}>
                                <Select.Option value="">全部</Select.Option>
                                {cateInfoList.map(cateInfo => (
                                    <Select.Option key={cateInfo.cate_id} value={cateInfo.cate_id}>{cateInfo.cate_name}</Select.Option>
                                ))}
                            </Select>
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
                    <div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "100px" }}>
                                <Image style={{ width: "80px" }}
                                    src={getIconUrl(item.app_info.icon_file_id)}
                                    preview={false}
                                    fallback={defaultIcon}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                />
                            </div>
                            <div style={{ paddingLeft: "20px" }}>
                                <Descriptions column={1}>
                                    <Descriptions.Item label="模板名称">{item.app_info.name}</Descriptions.Item>
                                    <Descriptions.Item label="模板类别">{item.app_info.cate_name}</Descriptions.Item>
                                    <Descriptions.Item label="创建时间">{moment(item.app_info.create_time).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                                    <Descriptions.Item label="更新时间">{moment(item.app_info.update_time).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>
                        <Divider orientation="left">模板描述</Divider>
                        <pre>{item.app_info.desc}</pre>
                        <Divider orientation="left">模板版本</Divider>
                        <Space>
                            {item.template_info_list.map(template => (
                                <Tag key={template.version}>
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        prepareTemplate(template.file_id);
                                    }}>{template.version}</Button>
                                </Tag>
                            ))}
                        </Space>
                    </div>
                </List.Item>
            )} pagination={{
                total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE,
                onChange: page => setCurPage(page - 1), hideOnSinglePage: true
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