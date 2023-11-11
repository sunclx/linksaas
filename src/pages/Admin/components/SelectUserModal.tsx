import { Card, Checkbox, Form, Input, List, Modal, Select, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import type { USER_STATE, UserInfo } from '@/api/user';
import { get_admin_session } from '@/api/admin_auth';
import { list as list_user } from '@/api/user_admin';
import { request } from "@/utils/request";
import { USER_STATE_NORMAL, USER_STATE_FORBIDDEN } from '@/api/user';
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export interface SelectUserModalProps {
    title: string;
    showUser: boolean;
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
            </Tabs>
        </Modal>
    );
};

export default SelectUserModal;