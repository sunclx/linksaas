import { useStores } from "@/hooks";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Card, Checkbox, Empty, List, Modal, Space, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import type { Site, SiteCate } from '@/api/pub_search';
import { list_my_site, get_search_history, add_search_history, set_my_site, list_site_cate, list_site } from '@/api/pub_search';
import { request } from "@/utils/request";
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
    const appStore = useStores('appStore');
    const userStore = useStores('userStore');

    const [cateList, setCateList] = useState<SiteCate[]>([]);
    const [curCateId, setCurCateId] = useState("");
    const [siteList, setSiteList] = useState<Site[]>([]);
    const [newSiteIdList, setNewSiteIdList] = useState<string[]>(props.siteIdList);

    const loadCateList = async () => {
        const res = await list_site_cate({});
        setCateList(res.cate_list);
        if (res.cate_list.length > 0) {
            const index = res.cate_list.findIndex(item => item.cate_id == curCateId);
            if (index == -1) {
                setCurCateId(res.cate_list[0].cate_id);
            }
        }
    };

    const getIconUrl = (iconFileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        }
    };

    const addSite = async () => {
        await request(set_my_site({
            session_id: userStore.sessionId,
            site_id_list: newSiteIdList,
        }));
        props.onOk();
        message.info("添加搜索站点成功");
    };

    const loadSiteList = async () => {
        setSiteList([]);
        const res = await list_site({
            filter_by_cate_id: true,
            cate_id: curCateId,
        });
        setSiteList(res.site_list);
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
                    key: item.cate_id,
                    label: item.cate_name,
                    children: <List grid={{ gutter: 16 }} dataSource={siteList}
                        renderItem={innerItem => (
                            <List.Item style={{ width: 150 }}>
                                <Checkbox disabled={props.siteIdList.includes(innerItem.site_id)} checked={newSiteIdList.includes(innerItem.site_id)}
                                    onChange={e => {
                                        e.preventDefault();
                                        if (e.target.checked) {
                                            setNewSiteIdList([...newSiteIdList, innerItem.site_id]);
                                        } else {
                                            setNewSiteIdList(newSiteIdList.filter(tmpItem => tmpItem != innerItem.site_id));
                                        }
                                    }}>
                                    <Space>
                                        <AsyncImage useRawImg={true} src={getIconUrl(innerItem.icon_file_id)} style={{ width: "20px" }} />
                                        <div style={{ whiteSpace: "nowrap" }}>{innerItem.site_name}</div>
                                    </Space>
                                </Checkbox>
                            </List.Item>
                        )} />
                }))} />
        </Modal>
    );
}

const PubSearchPanel = () => {
    const appStore = useStores('appStore');
    const userStore = useStores('userStore');

    const [activeKey, setActiveKey] = useState("");
    const [searchStrList, setSearchStrList] = useState<string[]>([]);
    const [tmpKeyword, setTmpKeyword] = useState("");
    const [keyword, setKeyword] = useState("");

    const [siteList, setSitelList] = useState<Site[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const loadSiteList = async () => {
        const res = await request(list_my_site({ session_id: userStore.sessionId }));
        setSitelList(res.site_list);
        if (res.site_list.length > 0) {
            const index = res.site_list.findIndex(item => item.site_id == activeKey);
            if (index == -1) {
                setActiveKey(res.site_list[0].site_id);
            }
        }
    };

    const loadHistoryList = async () => {
        const res = await request(get_search_history({
            session_id: userStore.sessionId,
        }));
        setSearchStrList(res.search_str_list);
    };

    const addSearchHistory = async () => {
        await request(add_search_history({
            session_id: userStore.sessionId,
            search_str: tmpKeyword,
        }));
        await loadHistoryList();
    }

    const removeSite = async (siteId: string) => {
        if (siteList.length <= 1) {
            return;
        }
        const newSiteIdList = siteList.filter(item => item.site_id != siteId).map(item => item.site_id);
        await request(set_my_site({
            session_id: userStore.sessionId,
            site_id_list: newSiteIdList,
        }));
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

    const getIconUrl = (iconFileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.pub_search_fs_id ?? ""}/${iconFileId}/image`;
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
                            }
                        }} onSelect={value => setKeyword(value)} />
                    <Button type="primary" disabled={tmpKeyword == ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKeyword(tmpKeyword);
                        addSearchHistory();
                    }}><SearchOutlined />&nbsp;搜索</Button>
                </Space>
            </div>
            <Tabs type="editable-card" onChange={key => {
                setActiveKey(key);
            }}
                activeKey={activeKey}
                onEdit={onEdit} items={siteList.map(item => (
                    {
                        key: item.site_id,
                        closeIcon: siteList.length > 1 ? undefined : <span />,
                        label: (
                            <Space>
                                <AsyncImage useRawImg={true} width="16px" src={getIconUrl(item.icon_file_id)} />
                                {item.site_name}
                            </Space>
                        ),
                        children: (
                            <>
                                {keyword == "" && (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )}
                                {item.site_id == activeKey && keyword != "" && (
                                    <Card bordered={false} extra={
                                        <Button type="link" onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            shell_open(item.search_tpl.replace("KEYWORD", encodeURIComponent(keyword)));
                                        }}>使用浏览器打开</Button>}>
                                        {item.use_browser == true && (
                                            <SearchProxy src={item.search_tpl.replace("KEYWORD", encodeURIComponent(keyword))} />
                                        )}
                                        {item.use_browser == false && (
                                            <iframe style={{ width: "calc(100vw - 250px)", height: "calc(100vh - 300px)", overflow: "scroll" }}
                                                referrerPolicy="no-referrer"
                                                src={item.search_tpl.replace("KEYWORD", encodeURIComponent(keyword))} />
                                        )}
                                    </Card>
                                )}
                            </>
                        ),
                    }
                ))} />
            {showAddModal == true && (
                <AddModal siteIdList={siteList.map(item => item.site_id)} onCancel={() => setShowAddModal(false)}
                    onOk={() => {
                        setShowAddModal(false);
                        loadSiteList();
                    }} />
            )}
        </div>
    );
};

export default PubSearchPanel;