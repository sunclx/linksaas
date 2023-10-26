import React, { useEffect, useState } from "react";
import s from "./index.module.less";
import { observer } from 'mobx-react';
import { Button, Card, Divider, Form, Input, List, Select, Space, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import { useStores } from "@/hooks";
import type { ENTRY_TYPE, ListParam, EntryInfo } from "@/api/project_entry";
import { list as list_entry, list_sys as list_sys_entry, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC } from "@/api/project_entry";
import { request } from "@/utils/request";
import { CreditCardFilled, FilterTwoTone, PlusOutlined } from "@ant-design/icons";
import EntryCard from "./EntryCard";

const PAGE_SIZE = 24;

const ProjectHome = () => {
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

    const [activeKey, setActiveKey] = useState("open");

    const [sysEntryList, setSysEntryList] = useState<{ id: string; content: string | EntryInfo; }[]>([]);

    const loadEntryList = async () => {
        let listParam: ListParam | null = null;
        if (activeKey == "open") {
            listParam = {
                filter_by_watch: false,
                watch: false,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: true,
                mark_remove: false,
                filter_by_entry_type: entryTypeList.length > 0,
                entry_type_list: entryTypeList,
            };
        } else if (activeKey == "close") {
            listParam = {
                filter_by_watch: false,
                watch: false,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: true,
                mark_remove: true,
                filter_by_entry_type: entryTypeList.length > 0,
                entry_type_list: entryTypeList,
            };
        } else if (activeKey == "myWatch") {
            listParam = {
                filter_by_watch: true,
                watch: true,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: false,
                mark_remove: false,
                filter_by_entry_type: entryTypeList.length > 0,
                entry_type_list: entryTypeList,
            };
        }
        if (listParam == null) {
            return;
        }

        const res = await request(list_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: listParam,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        entryStore.entryList = res.entry_list;
    };

    const loadSysEntryList = async () => {
        const res = await request(list_sys_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        entryStore.sysEntryList = res.entry_list;
    };

    const entryList = (
        <List rowKey="entry_id" dataSource={entryStore.entryList} grid={{ gutter: 16 }}
            renderItem={item => (
                <List.Item>
                    <EntryCard entryInfo={item} onRemove={() => loadEntryList()}
                        onMarkSys={() => {
                            loadSysEntryList();
                            loadEntryList();
                        }} />
                </List.Item>
            )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
    );

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
        if (showFilterBar) {
            setShowFilterBar(false);
        }
        setDataVersion(oldValue => oldValue + 1);
    }, [projectStore.curProjectId]);

    useEffect(() => {
        loadEntryList();
    }, [curPage, dataVersion, keyword, tagIdList, entryTypeList, activeKey]);

    useEffect(() => {
        loadSysEntryList();
    }, [projectStore.curProjectId]);

    useEffect(() => {
        setSysEntryList([
            {
                id: "mywork",
                content: "",
            },
            {
                id: "summary",
                content: "",
            },
            ...(entryStore.sysEntryList.map(sysEntry => (
                {
                    id: sysEntry.entry_id,
                    content: sysEntry,
                }
            )))
        ]);
    }, [entryStore.sysEntryList]);

    return (
        <div className={s.home_wrap}>
            <h1 className={s.header}><CreditCardFilled />&nbsp;&nbsp;系统面板</h1>
            <List rowKey="id"
                grid={{ gutter: 16 }}
                dataSource={sysEntryList}
                renderItem={item => (
                    <List.Item>
                        {item.id == "mywork" && (
                            <div className={s.card} style={{ backgroundColor: "#A8E0A3" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                history.push(APP_PROJECT_MY_WORK_PATH);
                            }}>
                                <h1>我的工作</h1>
                            </div>
                        )}
                        {item.id == "summary" && (
                            <div className={s.card} style={{ backgroundColor: "#E8EDC9" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    history.push(APP_PROJECT_OVERVIEW_PATH);
                                }}>
                                <h1>项目概览</h1>
                            </div>
                        )}
                        {["mywork", "summary"].includes(item.id) == false && (
                            <EntryCard entryInfo={item.content as EntryInfo} onRemove={() => loadEntryList()}
                                onMarkSys={() => {
                                    loadSysEntryList();
                                    loadEntryList();
                                }} />
                        )}
                    </List.Item>
                )} />
            <Divider style={{ margin: "4px 0px" }} />
            <Card title={<h1 className={s.header}><CreditCardFilled />&nbsp;&nbsp;内容面板</h1>}
                headStyle={{ paddingLeft: "0px" }} bodyStyle={{ padding: "4px 0px" }}
                bordered={false} extra={
                    <Space size="small">
                        <Form layout="inline">
                            <FilterTwoTone style={{ fontSize: "24px", marginRight: "10px" }} />
                            <Form.Item>
                                <Input style={{ minWidth: "100px" }} value={keyword} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setKeyword(e.target.value.trim());
                                }} placeholder="过滤标题" size="large" allowClear />
                            </Form.Item>
                            <Form.Item>
                                <Select mode="multiple" style={{ minWidth: "100px" }} size="large"
                                    placeholder="过滤标签"
                                    allowClear value={tagIdList} onChange={value => setTagIdList(value)}>
                                    {(projectStore.curProject?.tag_list ?? []).filter(item => item.use_in_entry).map(item => (
                                        <Select.Option key={item.tag_id} value={item.tag_id}>
                                            <div style={{ backgroundColor: item.bg_color, padding: "0px 4px" }}>{item.tag_name}</div></Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Select mode="multiple" value={entryTypeList} onChange={value => setEntryTypeList(value)}
                                    allowClear placeholder="过滤内容类型"
                                    style={{ minWidth: "100px" }} size="large">
                                    <Select.Option value={ENTRY_TYPE_SPRIT}>工作计划</Select.Option>
                                    <Select.Option value={ENTRY_TYPE_DOC}>文档</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            entryStore.createEntryType = ENTRY_TYPE_SPRIT;
                        }} icon={<PlusOutlined />}>创建内容</Button>
                    </Space>
                }>
                <Tabs accessKey={activeKey} onChange={value => setActiveKey(value)}
                    animated tabBarStyle={{ height: "40px" }}
                    items={[
                        {
                            key: "open",
                            label: <span style={{ fontSize: "16px" }}>打开状态</span>,
                            children: (
                                <>
                                    {activeKey == "open" && (<>{entryList}</>)}

                                </>
                            ),
                        },
                        {
                            key: "close",
                            label: <span style={{ fontSize: "16px" }}>关闭状态</span>,
                            children: (
                                <>
                                    {activeKey == "close" && (<>{entryList}</>)}

                                </>
                            ),
                        },
                        {
                            key: "myWatch",
                            label: <span style={{ fontSize: "16px" }}>我的关注</span>,
                            children: (
                                <>
                                    {activeKey == "myWatch" && (<>{entryList}</>)}

                                </>
                            ),
                        },
                    ]} type="card" />
            </Card>

        </div>
    );
};

export default observer(ProjectHome);