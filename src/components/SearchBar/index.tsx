import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './index.module.less';
import { Button, DatePicker, Form, Input, Modal, Popover, Select } from "antd";
import { useLocation } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH, APP_PROJECT_KB_BOOK_MARK_PATH, APP_PROJECT_KB_DOC_PATH, PROJECT_CHAT_TYPE } from "@/utils/constant";
import { useStores } from "@/hooks";
import type moment from 'moment';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { WebviewWindow } from '@tauri-apps/api/window';



export type SEARCH_SCOPE = string;

export const SEARCH_SCOPE_CUR_CHANNEL: SEARCH_SCOPE = "curChannel";
export const SEARCH_SCOPE_ALL_CHANNEL: SEARCH_SCOPE = "allChannel";
export const SEARCH_SCOPE_CUR_DOC_SPACE: SEARCH_SCOPE = "curDocSpace";
export const SEARCH_SCOPE_ALL_DOC_SPACE: SEARCH_SCOPE = "allDocSpace";
export const SEARCH_SCOPE_TASK: SEARCH_SCOPE = "task"
export const SEARCH_SCOPE_BUG: SEARCH_SCOPE = "bug"
export const SEARCH_SCOPE_CUR_BOOKMARK_CATE: SEARCH_SCOPE = "curBookMarkCate"
export const SEARCH_SCOPE_ALL_BOOKMARK_CATE: SEARCH_SCOPE = "allBookMarkCate"



interface SearchScopeItem {
    label: string;
    value: SEARCH_SCOPE;
}

const SearchBar = () => {
    const location = useLocation();

    const appStore = useStores('appStore');
    const docSpaceStore = useStores('docSpaceStore');
    const channelStore = useStores('channelStore');
    const projectStore = useStores('projectStore');

    const [curScope, setCurScope] = useState("");
    const [scopeList, setScopeList] = useState<SearchScopeItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [dateRange, setDateRange] = useState<moment.Moment[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const calcScopeList = () => {
        const tmpList: SearchScopeItem[] = [];
        if (location.pathname.startsWith(APP_PROJECT_CHAT_PATH)) {
            if (projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_CHANNEL) {
                tmpList.push({
                    label: "当前频道",
                    value: SEARCH_SCOPE_CUR_CHANNEL,
                });
                setCurScope(SEARCH_SCOPE_CUR_CHANNEL);
            } else {
                setCurScope(SEARCH_SCOPE_ALL_CHANNEL);
            }
            tmpList.push({
                label: "全部频道",
                value: SEARCH_SCOPE_ALL_CHANNEL,
            });
            if (!projectStore.curProject?.setting.disable_kb) {
                tmpList.push({
                    label: "全部文档空间",
                    value: SEARCH_SCOPE_ALL_DOC_SPACE,
                });
                tmpList.push({
                    label: "全部书签分类",
                    value: SEARCH_SCOPE_ALL_BOOKMARK_CATE,
                });
            }
        }
        if (location.pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
            if (docSpaceStore.curDocSpaceId != "") {
                tmpList.push({
                    label: "当前文档空间",
                    value: SEARCH_SCOPE_CUR_DOC_SPACE,
                });
                setCurScope(SEARCH_SCOPE_CUR_DOC_SPACE);
            } else {
                setCurScope(SEARCH_SCOPE_ALL_DOC_SPACE);
            }
            tmpList.push({
                label: "全部文档空间",
                value: SEARCH_SCOPE_ALL_DOC_SPACE,
            });
            if (!projectStore.curProject?.setting.disable_chat) {
                tmpList.push({
                    label: "全部频道",
                    value: SEARCH_SCOPE_ALL_CHANNEL,
                });
            }
            tmpList.push({
                label: "全部书签分类",
                value: SEARCH_SCOPE_ALL_BOOKMARK_CATE,
            });
        }
        if (location.pathname.startsWith(APP_PROJECT_KB_BOOK_MARK_PATH)) {
            tmpList.push({
                label: "当前书签分类",
                value: SEARCH_SCOPE_CUR_BOOKMARK_CATE
            });
            setCurScope(SEARCH_SCOPE_CUR_BOOKMARK_CATE);
            tmpList.push({
                label: "全部书签分类",
                value: SEARCH_SCOPE_ALL_BOOKMARK_CATE,
            });
            tmpList.push({
                label: "全部文档空间",
                value: SEARCH_SCOPE_ALL_DOC_SPACE,
            });
            if (!projectStore.curProject?.setting.disable_chat) {
                tmpList.push({
                    label: "全部频道",
                    value: SEARCH_SCOPE_ALL_CHANNEL,
                });
            }
        }

        tmpList.push({
            label: "任务",
            value: SEARCH_SCOPE_TASK,
        });
        tmpList.push({
            label: "缺陷",
            value: SEARCH_SCOPE_BUG,
        });
        setScopeList(tmpList);
    };

    const showSearchResult = async (simpleMode: boolean) => {
        const label = "search-result";
        const view = WebviewWindow.getByLabel(label);
        let x: number | undefined = undefined;
        let y: number | undefined = undefined;
        let width: number | undefined = undefined;
        let height: number | undefined = undefined;

        if (view != null) {
            const pos = await view.outerPosition();
            x = pos.x;
            y = pos.y;
            const size = await view.outerSize();
            width = size.width;
            height = size.height;
            await view.close();
        }
        let searchScope = curScope;
        if (simpleMode) {
            searchScope = scopeList[0].value;
        }
        let scopeValue = "";
        if (searchScope == SEARCH_SCOPE_CUR_CHANNEL) {
            scopeValue = channelStore.curChannelId;
        } else if (searchScope == SEARCH_SCOPE_CUR_DOC_SPACE) {
            scopeValue = docSpaceStore.curDocSpaceId;
        } else if (searchScope == SEARCH_SCOPE_CUR_BOOKMARK_CATE) {
            scopeValue = projectStore.curBookMarkCateId
        }
        let fromTime = ""
        let toTime = ""
        if (dateRange.length == 2 && simpleMode == false) {
            fromTime = dateRange[0].valueOf().toFixed(0);
            toTime = dateRange[1].valueOf().toFixed(0);
        }

        new WebviewWindow(label, {
            url: `search_result.html?projectId=${projectStore.curProjectId}&keyword=${encodeURIComponent(keyword)}&scope=${searchScope}&scopeValue=${scopeValue}&fromTime=${fromTime}&toTime=${toTime}`,
            width: width ?? 800,
            minWidth: 300,
            height: height ?? 600,
            minHeight: 200,
            decorations: false,
            alwaysOnTop: false,
            skipTaskbar: false,
            fileDropEnabled: false,
            transparent: false,
            x: x,
            y: y,
        });
        setDateRange([]);
        setCurScope(scopeList[0].value);
        setShowAdvanced(false);
    }

    useEffect(() => {
        calcScopeList();
        setKeyword("");
        setDateRange([]);
    }, [location.pathname, docSpaceStore.curDocSpaceId, channelStore.curChannelId]);

    if (appStore.clientCfg?.enable_search == true) {
        return (
            <div className={s.search_wrap}>
                <Input onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setKeyword(e.target.value);
                }} onKeyDown={e => {
                    if (e.key == "Escape") {
                        e.stopPropagation();
                        e.preventDefault();
                        setKeyword("");
                    } else if (e.key == "Enter") {
                        e.stopPropagation();
                        e.preventDefault();
                        if (keyword.trim() != "") {
                            showSearchResult(true);
                        }
                    }
                }}
                    suffix={<SearchOutlined onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (keyword.trim() != "") {
                            showSearchResult(true);
                        }
                    }} />}
                    value={keyword}
                    style={{ width: "200px" }}
                    placeholder="请搜索..." />
                <Popover placement="bottom" trigger="click" content={
                    <div style={{ padding: "10px 10px" }}>
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowAdvanced(true);
                        }}>高级搜索</Button>
                    </div>
                }>
                    <MoreOutlined className={s.more} />
                </Popover>

                {showAdvanced == true && (
                    <Modal open title="高级搜索"
                        okText="搜索" okButtonProps={{ disabled: keyword.trim() == "" }}
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDateRange([]);
                            setCurScope(scopeList[0].value);
                            setShowAdvanced(false);
                        }} onOk={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            showSearchResult(true);
                        }}>
                        <Form labelCol={{ span: 4 }}>
                            <Form.Item label="关键词">
                                <Input onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setKeyword(e.target.value);
                                }}
                                    value={keyword}
                                    className={s.keyword}
                                    placeholder="搜索......" />
                            </Form.Item>
                            <Form.Item label="搜索范围">
                                <Select className={s.scope} value={curScope} onChange={value => setCurScope(value)}>
                                    {scopeList.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="时间区间">
                                <DatePicker.RangePicker className={s.date_range} popupStyle={{ zIndex: 9999 }} onChange={values => {
                                    if ((values != null) && (values.length == 2)) {
                                        if ((values[0] != null) && (values[1] != null)) {
                                            setDateRange([values[0], values[1]]);
                                        }
                                    }
                                }} />
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
            </div>
        );
    } else {
        return (<></>);
    }
}

export default observer(SearchBar);