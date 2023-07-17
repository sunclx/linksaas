import { Button, Card, Form, List, Popover, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo, AppWithTemplateInfo } from "@/api/docker_template";
import { list_cate, list_app_with_template } from "@/api/docker_template";
import { request } from "@/utils/request";
import { MoreOutlined } from "@ant-design/icons";
import LocalDockerTemplateModal from "./LocalDockerTemplateModal";
import DockerTemplateModal from "./DockerTemplateModal";

const PAGE_SIZE = 10;

const DockerTemplatePanel = () => {
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
                    xx
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
                <DockerTemplateModal templatePath={templatePath} onCancel={()=>setTemplatePath("")}/>
            )}
        </Card>
    );
};

export default DockerTemplatePanel;