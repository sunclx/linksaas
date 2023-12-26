import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Card, Checkbox, Empty, List, Modal, Space, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import type { Site, SiteCate } from '@/api/pub_search';
import { list_my_site, get_search_history, add_search_history, set_my_site, list_site_cate, list_site } from '@/api/pub_search';
import AsyncImage from "@/components/AsyncImage";
import { open as shell_open, Command } from '@tauri-apps/api/shell';
import { uniqId } from "@/utils/utils";

interface SearchProxyProps {
    src: string;
}

type SearchEntry = {
    id: string;
    title: string;
    url: string;
    summary: string;
}

const SearchProxy = (props: SearchProxyProps) => {
    const [entryList, setEntryList] = useState<SearchEntry[]>([]);

    const search = async () => {
        setEntryList([]);
        const command = Command.sidecar('bin/search', [props.src]);
        const result = await command.execute();
        const itemList = JSON.parse(result.stdout) as SearchEntry[];
        setEntryList(itemList.map(item => ({
            ...item,
            id: uniqId(),
        })));
    };
    useEffect(() => {
        search();
    }, [props.src]);

    return (
        <List rowKey="id" dataSource={entryList}
            style={{ height: "calc(100vh - 300px)", overflow: "scroll" }}
            renderItem={item => (
                <List.Item>
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 600 }}>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                shell_open(item.url);
                            }}>{item.title}</a>
                        </h2>
                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.summary}</pre>
                    </div>
                </List.Item>
            )} />
    );
};

interface AddModalProps {
    siteIdList: string[];
    onCancel: () => void;
    onOk: () => void;
}

const AddModal = (props: AddModalProps) => {

    const [cateList, setCateList] = useState<SiteCate[]>([]);
    const [curCateId, setCurCateId] = useState("");
    const [siteList, setSiteList] = useState<Site[]>([]);
    const [newSiteIdList, setNewSiteIdList] = useState<string[]>(props.siteIdList);

    const loadCateList = async () => {
        const res = await list_site_cate();
        setCateList(res);
        if (res.length > 0) {
            const index = res.findIndex(item => item.cateId == curCateId);
            if (index == -1) {
                setCurCateId(res[0].cateId);
            }
        }
    };

    const addSite = async () => {
        await set_my_site(newSiteIdList);
        props.onOk();
        message.info("添加搜索站点成功");
    };

    const loadSiteList = async () => {
        setSiteList([]);
        const res = await list_site(curCateId);
        setSiteList(res);
    };

    useEffect(() => {
        loadCateList();
    }, []);

    useEffect(() => {
        loadSiteList();
    }, [curCateId]);

    return (
        <Modal open title="添加搜索站点"
            okText="添加" okButtonProps={{ disabled: props.siteIdList.length == newSiteIdList.length }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addSite();
            }}>
            <Tabs type='card' onChange={key => setCurCateId(key)}
                style={{ height: "calc(100vh - 400px)" }}
                items={cateList.map(item => ({
                    key: item.cateId,
                    label: item.cateName,
                    children: <List grid={{ gutter: 16 }} dataSource={siteList}
                        renderItem={innerItem => (
                            <List.Item style={{ width: 150 }}>
                                <Checkbox disabled={props.siteIdList.includes(innerItem.siteId)} checked={newSiteIdList.includes(innerItem.siteId)}
                                    onChange={e => {
                                        e.preventDefault();
                                        if (e.target.checked) {
                                            setNewSiteIdList([...newSiteIdList, innerItem.siteId]);
                                        } else {
                                            setNewSiteIdList(newSiteIdList.filter(tmpItem => tmpItem != innerItem.siteId));
                                        }
                                    }}>
                                    <Space>
                                        <AsyncImage useRawImg={true} src={`/static/images/pubsearch/${innerItem.siteId}.png`} style={{ width: "20px" }} />
                                        <div style={{ whiteSpace: "nowrap" }}>{innerItem.siteName}</div>
                                    </Space>
                                </Checkbox>
                            </List.Item>
                        )} />
                }))} />
        </Modal>
    );
}

const PubSearchPanel = () => {
    const [activeKey, setActiveKey] = useState("");
    const [searchStrList, setSearchStrList] = useState<string[]>([]);
    const [tmpKeyword, setTmpKeyword] = useState("");
    const [keyword, setKeyword] = useState("");

    const [siteList, setSitelList] = useState<Site[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const loadSiteList = async () => {
        const res = await list_my_site();
        setSitelList(res);
        if (res.length > 0) {
            const index = res.findIndex(item => item.siteId == activeKey);
            if (index == -1) {
                setActiveKey(res[0].siteId);
            }
        }
    };

    const loadHistoryList = async () => {
        const res = await get_search_history();
        setSearchStrList(res);
    };

    const addSearchHistory = async (kw: string) => {
        await add_search_history(kw);
        await loadHistoryList();
    }

    const removeSite = async (siteId: string) => {
        if (siteList.length <= 1) {
            return;
        }
        const newSiteIdList = siteList.filter(item => item.siteId != siteId).map(item => item.siteId);
        await set_my_site(newSiteIdList);
        await loadSiteList();
        message.info("移除搜索站点成功");
    }

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            setShowAddModal(true);
        } else {
            removeSite(targetKey as string);
        }
    };


    useEffect(() => {
        loadSiteList();
        loadHistoryList();
    }, []);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 0px" }}>
                <Space style={{ margin: "auto" }}>
                    <AutoComplete style={{ width: "300px" }} onChange={value => setTmpKeyword(value.trim())}
                        options={tmpKeyword.length == 0 ? [] : searchStrList.filter(item => item.includes(tmpKeyword)).map(item => ({ value: item }))}
                        onKeyDown={e => {
                            if (e.key == "Enter") {
                                setKeyword(tmpKeyword);
                                addSearchHistory(tmpKeyword);
                            }
                        }} onSelect={value => {
                            setKeyword(value);
                            addSearchHistory(value);
                        }} />
                    <Button type="primary" disabled={tmpKeyword == ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKeyword(tmpKeyword);
                        addSearchHistory(tmpKeyword);
                    }}><SearchOutlined />&nbsp;搜索</Button>
                </Space>
            </div>
            <Tabs type="editable-card" onChange={key => {
                setActiveKey(key);
            }}
                activeKey={activeKey}
                onEdit={onEdit} items={siteList.map(item => (
                    {
                        key: item.siteId,
                        closeIcon: siteList.length > 1 ? undefined : <span />,
                        disabled: keyword == "",
                        label: (
                            <Space>
                                <AsyncImage useRawImg={true} width="16px" src={`/static/images/pubsearch/${item.siteId}.png`} />
                                {item.siteName}
                            </Space>
                        ),
                        children: (
                            <>
                                {keyword == "" && (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )}
                                {item.siteId == activeKey && keyword != "" && (
                                    <Card bordered={false} extra={
                                        <Button type="link" onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            shell_open(item.searchTpl.replace("KEYWORD", encodeURIComponent(keyword)));
                                        }}>使用浏览器打开</Button>}>
                                        {item.useProxy == true && (
                                            <SearchProxy src={item.searchTpl.replace("KEYWORD", encodeURIComponent(keyword))} />
                                        )}
                                        {item.useProxy == false && (
                                            <iframe style={{ width: "calc(100vw - 250px)", height: "calc(100vh - 300px)", overflow: "scroll" }}
                                                referrerPolicy="no-referrer"
                                                src={item.searchTpl.replace("KEYWORD", encodeURIComponent(keyword))} />
                                        )}
                                    </Card>
                                )}
                            </>
                        ),
                    }
                ))} />
            {showAddModal == true && (
                <AddModal siteIdList={siteList.map(item => item.siteId)} onCancel={() => setShowAddModal(false)}
                    onOk={() => {
                        setShowAddModal(false);
                        loadSiteList();
                    }} />
            )}
        </div>
    );
};

export default PubSearchPanel;