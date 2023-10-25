import React, { useEffect, useState } from "react";
import s from "./index.module.less";
import { observer } from 'mobx-react';
import { Button, Card, Divider, Form, Input, List, Popover, Radio, Select, Space, Switch, Tooltip } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { APP_PROJECT_HOME_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import { useStores } from "@/hooks";
import type { ENTRY_TYPE } from "@/api/project_entry";
import { list as list_entry, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC } from "@/api/project_entry";
import { request } from "@/utils/request";
import { CreditCardFilled, PlusOutlined } from "@ant-design/icons";
import EntryCard from "./EntryCard";

const PAGE_SIZE = 24;

const ProjectHome = () => {
    const location = useLocation();
    const history = useHistory();

    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");
    const entryStore = useStores("entryStore");

    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [dataVersion, setDataVersion] = useState(0); //防止两次加载

    const [keyword, setKeyword] = useState("");
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [entryTypeList, setEntryTypeList] = useState<ENTRY_TYPE[]>([]);
    const [markRemove, setMarkRemove] = useState(false);
    const [myWatch, setMyWatch] = useState(false);

    const [preClose, setPreClose] = useState(false);

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
        entryStore.entryList = res.entry_list;
    };

    useEffect(() => {
        if (curPage != 0) {
            setCurPage(0);
        }
        if (keyword != "") {
            setKeyword("");
        }
        if (tagIdList.length != 0) {
            setTagIdList([]);
        }
        if (entryTypeList.length != 0) {
            setEntryTypeList([]);
        }
        if (markRemove) {
            setMarkRemove(false);
        }
        if (myWatch) {
            setMyWatch(false);
        }
        if (showFilterBar) {
            setShowFilterBar(false);
        }
        setDataVersion(oldValue => oldValue + 1);
    }, [projectStore.curProjectId]);

    useEffect(() => {
        loadEntryList();
    }, [curPage, dataVersion, keyword, tagIdList, entryTypeList, markRemove, myWatch]);

    return (
        <div className={s.home_wrap}>
            <h1 className={s.header}><CreditCardFilled />&nbsp;&nbsp;系统面板</h1>
            <List rowKey="id"
                grid={{ gutter: 16 }}
                dataSource={[
                    {
                        id: "mywork",
                        content: (
                            <div className={s.card} style={{ backgroundColor: "#A8E0A3" }} onClick={e => {
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
                            <div className={s.card} style={{ backgroundColor: "#E8EDC9" }}
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
            <Card title={<h1 className={s.header}><CreditCardFilled />&nbsp;&nbsp;内容面板</h1>}
                headStyle={{ paddingLeft: "0px" }} bodyStyle={{ paddingLeft: "0px" }}
                bordered={false} extra={
                    <Space size="small">
                        <Form layout="inline">
                            <Form.Item label="我的关注">
                                <Switch checked={myWatch} onChange={value => setMyWatch(value)} />
                            </Form.Item>
                            <Form.Item label="面板状态">
                                <Tooltip open={preClose} placement="right" title="从这里切换 打开/关闭 状态">
                                    <Radio.Group optionType="button" buttonStyle="solid" value={markRemove} onChange={e => {
                                        e.stopPropagation();
                                        setMarkRemove(e.target.value);
                                    }}>
                                        <Radio value={false}>打开</Radio>
                                        <Radio value={true}>关闭</Radio>
                                    </Radio.Group>
                                </Tooltip>
                            </Form.Item>
                            <Form.Item label="更多条件">
                                <Popover placement="top" open={showFilterBar && (location.pathname == APP_PROJECT_HOME_PATH)}
                                    content={
                                        <Form style={{ padding: "10px 10px" }}>
                                            <Form.Item label="标题">
                                                <Input style={{ width: "200px" }} value={keyword} onChange={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setKeyword(e.target.value.trim());
                                                }} />
                                            </Form.Item>
                                            <Form.Item label="标签">
                                                <Select mode="multiple" style={{ width: "200px" }} size="large"
                                                    allowClear value={tagIdList} onChange={value => setTagIdList(value)}>
                                                    {(projectStore.curProject?.tag_list ?? []).filter(item => item.use_in_entry).map(item => (
                                                        <Select.Option key={item.tag_id} value={item.tag_id}>
                                                            <div style={{ backgroundColor: item.bg_color, padding: "0px 4px" }}>{item.tag_name}</div></Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="类型">
                                                <Select mode="multiple" value={entryTypeList} onChange={value => setEntryTypeList(value)}
                                                    allowClear
                                                    style={{ width: "200px" }}>
                                                    <Select.Option value={ENTRY_TYPE_SPRIT}>工作计划</Select.Option>
                                                    <Select.Option value={ENTRY_TYPE_DOC}>文档</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Form>
                                    }>
                                    <Switch checked={showFilterBar} onChange={value => {
                                        setShowFilterBar(value);
                                        if (value == false) {
                                            setTagIdList([]);
                                            setEntryTypeList([]);
                                            setKeyword("");
                                        }
                                    }} />
                                </Popover>
                            </Form.Item>
                        </Form>
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            entryStore.createEntryType = ENTRY_TYPE_SPRIT;
                        }} icon={<PlusOutlined />}>创建内容</Button>
                    </Space>
                }>
                <List rowKey="entry_id" dataSource={entryStore.entryList} grid={{ gutter: 16 }}
                    renderItem={item => (
                        <List.Item>
                            <EntryCard entryInfo={item} onRemove={() => loadEntryList()}
                                onPreClose={value => {
                                    if (value != preClose) {
                                        setPreClose(value);
                                    }
                                }} />
                        </List.Item>
                    )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            </Card>

        </div>
    );
};

export default observer(ProjectHome);