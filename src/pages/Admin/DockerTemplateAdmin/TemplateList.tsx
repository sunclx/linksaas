import { Card, Form, Input, List, Select } from "antd";
import React, { useEffect, useState } from "react";
import type { CateInfo, AppWithTemplateInfo } from "@/api/docker_template";
import { list_cate, list_app_with_template, get_app_with_template } from "@/api/docker_template";
import Button from "@/components/Button";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_perm } from '@/api/admin_auth';
import CreateAppModal from "./components/CreateAppModal";
import AppPanel from "./components/AppPanel";

const PAGE_SIZE = 10;

const TemplateList = () => {

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [curCateId, setCurCateId] = useState("");
    const [keyword, setKeyword] = useState("");

    const [awtList, setAwtList] = useState<AppWithTemplateInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showCreateAppModal, setShowCreateAppModal] = useState(false);



    const loadCateList = async () => {
        const res = await list_cate({});
        setCateList(res.cate_info_list);
    };

    const loadAwtList = async () => {
        const res = await list_app_with_template({
            filter_by_cate_id: curCateId !== "",
            cate_id: curCateId,
            filter_by_keyword: keyword !== "",
            keyword: keyword,
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


    useEffect(() => {
        loadAwtList();
    }, [curPage, curCateId, keyword]);

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
                <Form layout="inline">
                    <Form.Item label="关键词">
                        <Input value={keyword} allowClear onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setKeyword(e.target.value.trim());
                        }} />
                    </Form.Item>
                    <Form.Item label="模板类别">
                        <Select style={{ width: "100px" }} value={curCateId} onChange={value => {
                            setCurPage(0);
                            setCurCateId(value);
                        }}>
                            <Select.Option value="">全部</Select.Option>
                            {cateList.map(cate => (
                                <Select.Option key={cate.cate_id} value={cate.cate_id}>{cate.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowCreateAppModal(true);
                        }} disabled={!((permInfo?.docker_template_perm.create_app ?? false) && cateList.length > 0)}>增加模板</Button>
                    </Form.Item>

                </Form >
            }
        >
            <List style={{ height: "calc(100vh - 110px)", overflowY: "scroll" }} dataSource={awtList} renderItem={item => (
                <List.Item key={item.app_info.app_id}>
                    <AppPanel appInfo={item} cateList={cateList}
                        onChange={() => loadAwtInfo(item.app_info.app_id)} onRemove={() => {
                            const tmpList = awtList.filter(tmpItem => tmpItem.app_info.app_id != item.app_info.app_id);
                            setAwtList(tmpList);
                        }} />
                </List.Item>
            )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true, showSizeChanger: false }} />
            {
                showCreateAppModal == true && (
                    <CreateAppModal onCancel={() => setShowCreateAppModal(false)} onOk={() => {
                        if (curCateId == "" && curPage == 0) {
                            loadAwtList();
                        } else {
                            setCurCateId("");
                            setCurPage(0);
                        }
                        setShowCreateAppModal(false);
                    }} />
                )
            }
        </Card >
    );
};

export default TemplateList;