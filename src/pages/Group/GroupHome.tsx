import React, { useEffect, useMemo, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { List, Tabs } from "antd";
import type { GroupInfo } from "@/api/group";
import { list_my, list_pub, get as get_group } from "@/api/group";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrJoinGroupModal from "./components/CreateOrJoinGroupModal";
import GroupCard from "./components/GroupCard";


const PAGE_SIZE = 12;

const GroupHome = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const groupStore = useStores('groupStore');

    const [activeKey, setActiveKey] = useState("pub");
    const [groupInfoList, setGroupInfoList] = useState<GroupInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showCreateOrJoinModal, setShowCreateOrJoinModal] = useState(false);

    const loadPubGroupList = async () => {
        setGroupInfoList([]);
        const res = await request(list_pub({
            session_id: userStore.sessionId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setGroupInfoList(res.group_list);
    };

    const loadMyGroupList = async () => {
        setGroupInfoList([]);
        const res = await request(list_my({
            session_id: userStore.sessionId,
        }));
        setGroupInfoList(res.group_list);
    };

    const updateGroupInfo = async (groupId: string) => {
        const res = await request(get_group({
            session_id: userStore.sessionId,
            group_id: groupId,
        }));
        const tmpList = groupInfoList.slice();
        const index = tmpList.findIndex(item => item.group_id == groupId);
        if (index != -1) {
            tmpList[index] = res.group;
            setGroupInfoList(tmpList);
        }
    };

    useMemo(() => {
        projectStore.setCurProjectId('');
        groupStore.curGroup = null;
        groupStore.curPostKey = null;
    }, []);

    useEffect(() => {
        if (activeKey == "pub") {
            loadPubGroupList();
        } else if (activeKey == "my") {
            loadMyGroupList();
        }
    }, [activeKey, curPage]);

    return (
        <div>
            <Tabs type="card" activeKey={activeKey} onChange={value => {
                setActiveKey(value);
                setCurPage(0);
            }}
                tabBarStyle={{ height: "40px" }}
                tabBarExtraContent={
                    <>
                        {activeKey == "my" && (
                            <Button style={{ marginRight: "20px" }} icon={<PlusOutlined />}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowCreateOrJoinModal(true);
                                }}>创建/加入兴趣组</Button>
                        )}
                    </>
                }
                items={[
                    {
                        key: "pub",
                        label: <span style={{ fontSize: "16px", fontWeight: 500 }}>公共兴趣组</span>,
                        children: (
                            <div style={{ height: "calc(100vh - 90px)", overflowY: "scroll", margin: "0px 10px" }}>
                                {activeKey == "pub" && (
                                    <List dataSource={groupInfoList} rowKey="group_id" grid={{ gutter: 16 }} renderItem={item => (
                                        <List.Item>
                                            <GroupCard groupInfo={item} onChange={() => updateGroupInfo(item.group_id)}
                                                onRemove={() => loadPubGroupList()} />
                                        </List.Item>
                                    )} pagination={false} />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: "my",
                        label: <span style={{ fontSize: "16px", fontWeight: 500 }}>我的兴趣组</span>,
                        children: (
                            <div style={{ height: "calc(100vh - 90px)", overflowY: "scroll", margin: "0px 10px" }}>
                                {activeKey == "my" && (
                                    <List dataSource={groupInfoList} rowKey="group_id" grid={{ gutter: 16 }} renderItem={item => (
                                        <List.Item>
                                            <GroupCard groupInfo={item} onChange={() => updateGroupInfo(item.group_id)}
                                                onRemove={() => loadMyGroupList()} />
                                        </List.Item>
                                    )} pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
                                )}
                            </div>
                        ),
                    },
                ]} />
            {showCreateOrJoinModal == true && (
                <CreateOrJoinGroupModal onCancel={() => setShowCreateOrJoinModal(false)} onOk={() => {
                    if (activeKey == "pub") {
                        loadPubGroupList();
                    } else if (activeKey == "my") {
                        loadMyGroupList();
                    }
                    setShowCreateOrJoinModal(false);
                }} />
            )}
        </div>
    )
};

export default observer(GroupHome);