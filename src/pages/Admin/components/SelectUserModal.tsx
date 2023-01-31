import { Card, Checkbox, Form, Input, List, Modal, Select, Space, Tabs, Tree } from "antd";
import React, { useEffect, useState } from "react";
import type { USER_STATE, UserInfo } from '@/api/user';
import { get_admin_session } from '@/api/admin_auth';
import { list as list_user } from '@/api/user_admin';
import { request } from "@/utils/request";
import { USER_STATE_NORMAL, USER_STATE_FORBIDDEN } from '@/api/user';
import Pagination from "@/components/Pagination";
import type { DataNode } from "antd/lib/tree";
import { list_depart_ment, list_depart_ment_user } from "@/api/org_admin";
import { UserOutlined } from "@ant-design/icons";

const PAGE_SIZE = 10;

const KEY_PERFIX_DEPARTMNET = "departMent:"
const KEY_PERFIX_USER = "user:"

export interface SelectUserModalProps {
    title: string;
    showUser: boolean;
    showOrg: boolean;
    selectUserIdList: string[];
    onOk: (userIdList: string[]) => void;
    onCancel: () => void;
};

const SelectUserModal: React.FC<SelectUserModalProps> = (props) => {
    const [selectUserIdList, setSelectUserIdList] = useState(props.selectUserIdList);
    const [userInfoList, setUserInfoList] = useState<UserInfo[]>([]);

    const [userKeyword, setUserKeyword] = useState("");
    const [userState, setUserState] = useState<USER_STATE | null>(null);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const loadUserInfo = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_user({
            admin_session_id: sessionId,
            filter_by_keyword: userKeyword.trim() != "",
            keyword: userKeyword.trim(),
            filter_by_user_state: userState != null,
            user_state: userState == null ? USER_STATE_NORMAL : userState,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setUserInfoList(res.user_info_list);
    };

    const addSelectUserId = (userId: string) => {
        const tmpList = selectUserIdList.slice();
        tmpList.push(userId);
        setSelectUserIdList(tmpList);
    };

    const removeSelectUserId = (userId: string) => {
        const tmpList = selectUserIdList.filter(item => item != userId);
        setSelectUserIdList(tmpList);
    };

    const [treeData, setTreeData] = useState<DataNode[]>([
        {
            key: `${KEY_PERFIX_DEPARTMNET}`,
            title: "组织结构",
            children: [],
            checkable: false,
            selectable: false,
        },
    ]);

    const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }
            return node;
        });

    const loadData = async (node: DataNode) => {
        let nodeKey = node.key as string;
        if (!nodeKey.startsWith(KEY_PERFIX_DEPARTMNET)) {
            return;
        }
        nodeKey = nodeKey.substring(KEY_PERFIX_DEPARTMNET.length);
        const sessionId = await get_admin_session();
        const departMentRes = await request(list_depart_ment({
            admin_session_id: sessionId,
            parent_depart_ment_id: nodeKey,
        }));
        if (departMentRes.depart_ment_list.length > 0) {
            setTreeData((origin) =>
                updateTreeData(origin, node.key, departMentRes.depart_ment_list.map(item => ({
                    key: `${KEY_PERFIX_DEPARTMNET}${item.depart_ment_id}`,
                    title: item.name,
                    children: [],
                    checkable: false,
                    selectable: false,
                })))
            );
        }
        if (nodeKey == "") {
            return;
        }
        const memberRes = await request(list_depart_ment_user({
            admin_session_id: sessionId,
            depart_ment_id: nodeKey,
            offset: 0,
            limit: 999,
        }));
        if (memberRes.user_info_list.length > 0) {
            setTreeData((origin) =>
                updateTreeData(origin, node.key, memberRes.user_info_list.map(item => ({
                    key: `${KEY_PERFIX_USER}${item.user_id}`,
                    title: () => (
                        <Space>
                            <UserOutlined />{item.user_display_name}
                        </Space>),
                    children: [],
                    isLeaf: true,
                })))
            );
        }
    };

    useEffect(() => {
        if (props.showUser) {
            loadUserInfo();
        }
    }, [curPage, userKeyword, userState]);

    return (
        <Modal open title={props.title}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(selectUserIdList);
            }}>
            <Tabs type="card">
                {props.showUser && (
                    <Tabs.TabPane tab="用户" key="user">
                        <Card extra={
                            <Form layout="inline">
                                <Form.Item label="用户昵称">
                                    <Input value={userKeyword} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setUserKeyword(e.target.value);
                                    }} />
                                </Form.Item>
                                <Form.Item label="用户状态">
                                    <Select value={userState} style={{ width: 100 }} onChange={value => setUserState(value)}>
                                        <Select.Option value={null}>全部</Select.Option>
                                        <Select.Option value={USER_STATE_NORMAL}>正常</Select.Option>
                                        <Select.Option value={USER_STATE_FORBIDDEN}>禁用</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        }>
                            <List dataSource={userInfoList}
                                style={{ height: "calc(100vh - 450px)", overflowY: "scroll" }}
                                renderItem={item => (
                                    <List.Item key={item.user_id}>
                                        <Space>
                                            <Checkbox checked={selectUserIdList.includes(item.user_id)} onChange={e => {
                                                e.stopPropagation();
                                                if (e.target.checked) {
                                                    addSelectUserId(item.user_id);
                                                } else {
                                                    removeSelectUserId(item.user_id);
                                                }
                                            }} />
                                            <span>{item.basic_info.display_name}</span>
                                        </Space>
                                    </List.Item>
                                )} />
                            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                        </Card>
                    </Tabs.TabPane>
                )}
                {props.showOrg && (
                    <Tabs.TabPane tab="组织结构" key="org">
                        <Tree treeData={treeData} loadData={loadData} showLine={true}
                            checkable checkedKeys={selectUserIdList.map(item => `${KEY_PERFIX_USER}${item}`)}
                            style={{ height: "calc(100vh - 330px)", overflowY: "scroll" }}
                            onCheck={checked => {
                                if (Array.isArray(checked)) {
                                    const tmpList = checked.map(item => item.toString().substring(KEY_PERFIX_USER.length));
                                    setSelectUserIdList(tmpList);
                                } else {
                                    const tmpList = checked.checked.map(item => item.toString().substring(KEY_PERFIX_USER.length));
                                    setSelectUserIdList(tmpList);
                                }
                            }}
                        />
                    </Tabs.TabPane>
                )}
            </Tabs>
        </Modal>
    );
};

export default SelectUserModal;