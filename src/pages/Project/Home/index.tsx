import React, { useEffect, useState } from "react";
import s from "./index.module.less";
import { observer } from 'mobx-react';
import { Card, Divider, Dropdown, Form, Input, List, Segmented, Select, Space, Switch, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import { useStores } from "@/hooks";
import type { ENTRY_TYPE, ListParam, EntryInfo } from "@/api/project_entry";
import { list as list_entry, list_sys as list_sys_entry, ENTRY_TYPE_SPRIT, ENTRY_TYPE_DOC, ENTRY_TYPE_NULL, ENTRY_TYPE_PAGES, ENTRY_TYPE_BOARD } from "@/api/project_entry";
import { request } from "@/utils/request";
import { CreditCardFilled, FilterTwoTone } from "@ant-design/icons";
import EntryCard from "./EntryCard";

const PAGE_SIZE = 24;

const ProjectHome = () => {
    const history = useHistory();

    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");
    const entryStore = useStores("entryStore");
    const linkAuxStore = useStores("linkAuxStore");
    const ideaStore = useStores("ideaStore");

    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [dataVersion, setDataVersion] = useState(0); //防止两次加载

    const [keyword, setKeyword] = useState("");
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [entryType, setEntryType] = useState<ENTRY_TYPE>(ENTRY_TYPE_NULL);

    const [activeKey, setActiveKey] = useState("open");
    const [filterByWatch, setFilterByWatch] = useState(false);

    const [sysEntryList, setSysEntryList] = useState<{ id: string; content: string | EntryInfo; }[]>([]);

    const loadEntryList = async () => {
        let listParam: ListParam | null = null;
        if (activeKey == "open") {
            listParam = {
                filter_by_watch: filterByWatch,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: true,
                mark_remove: false,
                filter_by_entry_type: entryType != ENTRY_TYPE_NULL,
                entry_type_list: entryType == ENTRY_TYPE_NULL ? [] : [entryType],
            };
        } else if (activeKey == "close") {
            listParam = {
                filter_by_watch: filterByWatch,
                filter_by_tag_id: tagIdList.length > 0,
                tag_id_list: tagIdList,
                filter_by_keyword: keyword.length > 0,
                keyword: keyword,
                filter_by_mark_remove: true,
                mark_remove: true,
                filter_by_entry_type: entryType != ENTRY_TYPE_NULL,
                entry_type_list: entryType == ENTRY_TYPE_NULL ? [] : [entryType],
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
        if (entryType != ENTRY_TYPE_NULL) {
            setEntryType(ENTRY_TYPE_NULL);
        }
        if (showFilterBar) {
            setShowFilterBar(false);
        }
        setDataVersion(oldValue => oldValue + 1);
    }, [projectStore.curProjectId, entryStore.dataVersion]);

    useEffect(() => {
        loadEntryList();
    }, [curPage, dataVersion, keyword, tagIdList, entryType, activeKey, filterByWatch]);

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
                        </Form>
                        <Dropdown.Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            entryStore.createEntryType = ENTRY_TYPE_SPRIT;
                        }} menu={{
                            items: [
                                {
                                    key: "requirement",
                                    label: "创建需求",
                                    onClick: () => {
                                        linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, history);
                                    },
                                },
                                {
                                    key: "task",
                                    label: "创建任务",
                                    onClick: () => {
                                        linkAuxStore.goToCreateTask("", projectStore.curProjectId, history);
                                    },
                                },
                                {
                                    key: "bug",
                                    label: "创建缺陷",
                                    onClick: () => {
                                        linkAuxStore.goToCreateBug("", projectStore.curProjectId, history);
                                    },
                                },
                                {
                                    key: "idea",
                                    label: "创建知识点",
                                    onClick: () => {
                                        ideaStore.setShowCreateIdea("", "");
                                    },
                                }
                            ],
                        }}>创建内容</Dropdown.Button>
                    </Space>
                }>
                <Tabs accessKey={activeKey} onChange={value => setActiveKey(value)}
                    animated tabBarStyle={{ height: "40px" }}
                    items={[
                        {
                            key: "open",
                            label: <span style={{ fontSize: "16px" }}>正常状态</span>,
                            children: (
                                <>
                                    {activeKey == "open" && (<>{entryList}</>)}

                                </>
                            ),
                        },
                        {
                            key: "close",
                            label: <span style={{ fontSize: "16px" }}>只读状态</span>,
                            children: (
                                <>
                                    {activeKey == "close" && (<>{entryList}</>)}

                                </>
                            ),
                        },
                    ]} type="card" tabBarExtraContent={
                        <Form layout="inline">
                            <Form.Item className={s.seg_wrap} label="内容类型">
                                <Segmented options={[
                                    {
                                        label: "全部",
                                        value: ENTRY_TYPE_NULL,
                                    },
                                    {
                                        label: "工作计划",
                                        value: ENTRY_TYPE_SPRIT,
                                    },
                                    {
                                        label: "文档",
                                        value: ENTRY_TYPE_DOC,
                                    },
                                    {
                                        label: "静态网页",
                                        value: ENTRY_TYPE_PAGES,
                                    },
                                    {
                                        label: "信息面板",
                                        value: ENTRY_TYPE_BOARD,
                                    }

                                ]} value={entryType} onChange={value => setEntryType(value.valueOf() as number)} />
                            </Form.Item>
                            <Form.Item label="只看我的关注">
                                <Switch checked={filterByWatch} onChange={value => setFilterByWatch(value)} />
                            </Form.Item>
                        </Form>
                    } />
            </Card>

        </div >
    );
};

export default observer(ProjectHome);