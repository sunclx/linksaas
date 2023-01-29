import { Card, Form, Input, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import type { USER_STATE, UserInfo } from '@/api/user';
import { USER_STATE_NORMAL, USER_STATE_FORBIDDEN } from '@/api/user';
import { list as list_user } from '@/api/user_admin';
import type { ColumnsType } from 'antd/es/table';
import { request } from "@/utils/request";
import { get_admin_session } from '@/api/admin_auth';
import Pagination from "@/components/Pagination";
import moment from 'moment';
import s from './UserList.module.less';
import { LinkOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { UserDetailState } from "./UserDetail";
import { ADMIN_PATH_USER_DETAIL_SUFFIX } from "@/utils/constant";

const PAGE_SIZE = 10;

const UserList = () => {

    const history = useHistory();

    const [keyword, setKeyword] = useState("");
    const [userList, setUserList] = useState<UserInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [userState, setUserState] = useState<USER_STATE | null>(null);

    const loadUserList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_user({
            admin_session_id: sessionId,
            filter_by_keyword: keyword.trim() != "",
            keyword: keyword.trim(),
            filter_by_user_state: userState != null,
            user_state: userState == null ? USER_STATE_NORMAL : userState,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setUserList(res.user_info_list);
    };

    const columns: ColumnsType<UserInfo> = [
        {
            title: "用户名",
            width: 150,
            render: (_, row: UserInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const state: UserDetailState = {
                        userId: row.user_id,
                    };
                    history.push(ADMIN_PATH_USER_DETAIL_SUFFIX, state);
                }}>{row.user_name}&nbsp;&nbsp;<LinkOutlined /></a>
            ),
        },
        {
            title: "昵称",
            dataIndex: ["basic_info", "display_name"],
            width: 150,
        },
        {
            title: "状态",
            width: 100,
            render: (_, row: UserInfo) => (
                <span>
                    {row.user_state == USER_STATE_NORMAL && "正常"}
                    {row.user_state == USER_STATE_FORBIDDEN && "禁用"}
                </span>
            ),
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, row: UserInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "更新时间",
            width: 150,
            render: (_, row: UserInfo) => moment(row.update_time).format("YYYY-MM-DD HH:mm:ss"),
        },
    ];

    useEffect(() => {
        loadUserList();
    }, [curPage, keyword, userState]);

    return (
        <Card title="用户列表" extra={
            <Form layout="inline">
                <Form.Item label="昵称">
                    <Input value={keyword} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKeyword(e.target.value);
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
            <div className={s.content_wrap}>
                <Table rowKey="user_id" columns={columns} dataSource={userList} pagination={false} />
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </div>
        </Card>
    )
};

export default UserList;