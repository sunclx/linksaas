import { Card, Form, Input, Switch, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import type { GroupInfo } from "@/api/group";
import { list as list_group, update_pub } from "@/api/group_admin";
import { get_admin_session } from "@/api/admin_auth";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import moment from "moment";

const PAGE_SIZE = 20;

const GroupList = () => {

    const [filterPub, setFilterPub] = useState(false);
    const [keyword, setKeyword] = useState("");

    const [groupInfoList, setGroupInfoList] = useState<GroupInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadGroupInfoList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_group({
            admin_session_id: sessionId,
            filter_pub: filterPub,
            filter_by_keyword: keyword != "",
            keyword: keyword,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setGroupInfoList(res.group_list);
    };

    const updatePub = async (groupId: string, pub: boolean) => {
        const sessionId = await get_admin_session();
        await request(update_pub({
            admin_session_id: sessionId,
            group_id: groupId,
            pub_group: pub,
        }));
        const tmpList = groupInfoList.slice();
        const index = tmpList.findIndex(item => item.group_id == groupId);
        if (index != -1) {
            tmpList[index].pub_group = pub;
            setGroupInfoList(tmpList);
            message.info("设置成功");
        }
    }

    const columns: ColumnsType<GroupInfo> = [
        {
            title: "名称",
            dataIndex: "group_name",
        },
        {
            title: "是否公开",
            width: 80,
            render: (_, row: GroupInfo) => (
                <Switch size="small" checked={row.pub_group} onChange={checked => updatePub(row.group_id, checked)} />
            ),
        },
        {
            title: "创建人",
            dataIndex: "owner_display_name",
        },
        {
            title: "创建时间",
            render: (_, row: GroupInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        loadGroupInfoList();
    }, [curPage, filterPub, keyword]);

    useEffect(() => {
        setCurPage(0);
    }, [filterPub, keyword]);

    return (
        <Card bordered={false} title="兴趣组列表"
            bodyStyle={{ height: "calc(100vh - 80px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="只看公开兴趣组">
                        <Switch checked={filterPub} onChange={value => setFilterPub(value)} />
                    </Form.Item>
                    <Form.Item label="过滤名称">
                        <Input allowClear value={keyword} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setKeyword(e.target.value.trim());
                        }} />
                    </Form.Item>
                </Form>
            }>
            <Table rowKey="group_id" dataSource={groupInfoList} columns={columns}
                pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
        </Card>
    );
};

export default GroupList;