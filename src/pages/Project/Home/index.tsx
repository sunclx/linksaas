import React, { useEffect, useState } from "react";
import s from "./index.module.less";
import { observer } from 'mobx-react';
import { Button, Card, Divider, Form, Input, List, Radio, Select, Space, Switch } from "antd";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import { useStores } from "@/hooks";
import type { EntryInfo, ENTRY_TYPE } from "@/api/project_entry";
import { list as list_entry, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC } from "@/api/project_entry";
import { request } from "@/utils/request";

const PAGE_SIZE = 24;

const ProjectHome = () => {
    const history = useHistory();

    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [entryList, setEntryList] = useState<EntryInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [dataVersion, setDataVersion] = useState(0); //防止两次加载

    const [keyword, setKeyword] = useState("");
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [entryTypeList, setEntryTypeList] = useState<ENTRY_TYPE[]>([]);
    const [markRemove, setMarkRemove] = useState(false);
    const [myWatch, setMyWatch] = useState(false);

    const loadEntryList = async () => {
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_watch: myWatch,
                watch: myWatch,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: true,
                mark_remove: markRemove,
                filter_by_entry_type: entryTypeList.length > 0,
                entry_type_list: entryTypeList,
            },
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setEntryList(res.entry_list);
    };

    useEffect(() => {
        if (curPage != 0) {
            setCurPage(0);
        }
        setDataVersion(oldValue => oldValue + 1);
    }, [projectStore.curProjectId]);

    useEffect(() => {
        loadEntryList();
    }, [curPage, dataVersion, keyword, tagIdList, entryTypeList, markRemove, myWatch]);

    return (
        <div className={s.home_wrap}>
            <h1 className={s.header}>系统面板</h1>
            <List rowKey="id"
                grid={{ gutter: 16 }}
                dataSource={[
                    {
                        id: "mywork",
                        content: (
                            <div className={s.card} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                history.push(APP_PROJECT_MY_WORK_PATH);
                            }}>
                                <h1>我的工作</h1>
                            </div>
                        ),
                    },
                    {
                        id: "summary",
                        content: (
                            <div className={s.card} style={{ backgroundColor: "orange" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    history.push(APP_PROJECT_OVERVIEW_PATH);
                                }}>
                                <h1>项目概览</h1>
                            </div>
                        ),
                    },
                ]} renderItem={item => (
                    <List.Item>
                        {item.content}
                    </List.Item>
                )} />
            <Divider style={{ margin: "4px 0px" }} />
            <Card title={<h1 className={s.header}>内容面板</h1>}
                headStyle={{ paddingLeft: "0px", border: "none" }} bodyStyle={{ paddingLeft: "0px", paddingTop: "0px" }}
                bordered={false} extra={
                    <Space size="small">
                        <Form layout="inline">
                            <Form.Item label="我的关注">
                                <Switch checkedChildren="是" unCheckedChildren="否" checked={myWatch} onChange={value => setMyWatch(value)} />
                            </Form.Item>
                            <Form.Item label="面板状态">
                                <Radio.Group optionType="button" buttonStyle="solid" value={markRemove} onChange={e => {
                                    e.stopPropagation();
                                    setMarkRemove(e.target.value);
                                }}>
                                    <Radio value={false}>打开</Radio>
                                    <Radio value={true}>关闭</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="更多条件">
                                <Switch checkedChildren="是" unCheckedChildren="否" checked={showFilterBar} onChange={value => {
                                    setShowFilterBar(value);
                                    if (value == false) {
                                        setTagIdList([]);
                                        setEntryTypeList([]);
                                        setKeyword("");
                                    }
                                }} />
                            </Form.Item>
                        </Form>
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            //TODO
                        }}>创建内容</Button>
                    </Space>
                }>

                {showFilterBar == true && (
                    <div className={s.filter_wrap}>
                        <Form layout="inline" className={s.filter}>
                            <Form.Item label="标题">
                                <Input style={{ width: "100px" }} size="large" value={keyword} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setKeyword(e.target.value.trim());
                                }} />
                            </Form.Item>
                            <Form.Item label="标签">
                                <Select mode="multiple" style={{ minWidth: "100px" }} size="large"
                                    allowClear value={tagIdList} onChange={value => setTagIdList(value)}>
                                    {(projectStore.curProject?.tag_list ?? []).filter(item => item.use_in_entry).map(item => (
                                        <Select.Option key={item.tag_id} value={item.tag_id}>
                                            <div style={{ backgroundColor: item.bg_color, padding: "0px 4px" }}>{item.tag_name}</div></Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="类型">
                                <Select mode="multiple" value={entryTypeList} onChange={value => setEntryTypeList(value)}
                                    allowClear size="large"
                                    style={{ minWidth: "100px" }}>
                                    <Select.Option value={ENTRY_TYPE_SPRIT}>工作计划</Select.Option>
                                    <Select.Option value={ENTRY_TYPE_DOC}>文档</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                <Divider style={{ margin: "4px 0px" }} />
                <List rowKey="entry_id" dataSource={entryList} grid={{ gutter: 16 }}
                    renderItem={item => (
                        <List.Item>
                            <div className={s.card}>
                                <h1>{item.entry_title}</h1>
                            </div>
                        </List.Item>
                    )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            </Card>

        </div>
    );
};

export default observer(ProjectHome);