import { POST_AUDIT_AGREE, POST_AUDIT_APPLY, POST_AUDIT_NONE, POST_AUDIT_REFUSE } from "@/api/group_post";
import { Button, Card, Form, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import type { PostKeyInfo, POST_AUDIT_STATE } from "@/api/group_post";
import { list_audit, agree_recommend, refuse_recommend } from "@/api/group_post_admin";
import { request } from "@/utils/request";
import { type AdminPermInfo, get_admin_perm, get_admin_session } from "@/api/admin_auth";
import type { ColumnsType } from 'antd/es/table';
import moment from "moment";

const PAGE_SIZE = 20;

const RecommendAuditList = () => {
    const [postKeyList, setPostKeyList] = useState<PostKeyInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [auditState, setAuditState] = useState(POST_AUDIT_APPLY);

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);

    const loadPostKeyList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_audit({
            admin_session_id: sessionId,
            audit_state: auditState,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setPostKeyList(res.post_key_list);
        setTotalCount(res.total_count);
    };

    const updateAuditState = (postId: string, state: POST_AUDIT_STATE) => {
        const tmpList = postKeyList.slice();
        const index = tmpList.findIndex(item => item.post_id == postId);
        if (index != -1) {
            tmpList[index].audit_state = state;
            setPostKeyList(tmpList);
        }
    };

    const agreeAudit = async (groupId: string, postId: string) => {
        const sessionId = await get_admin_session();
        await request(agree_recommend({
            admin_session_id: sessionId,
            group_id: groupId,
            post_id: postId,
        }));
        updateAuditState(postId, POST_AUDIT_AGREE);
    };

    const refuseAudit = async (groupId: string, postId: string) => {
        const sessionId = await get_admin_session();
        await request(refuse_recommend({
            admin_session_id: sessionId,
            group_id: groupId,
            post_id: postId,
        }));
        updateAuditState(postId, POST_AUDIT_REFUSE);
    };

    const getStateColor = (state: POST_AUDIT_STATE) => {
        if (state == POST_AUDIT_AGREE) {
            return "green";
        } else if (state == POST_AUDIT_REFUSE) {
            return "red";
        }
        return "black";
    }

    const columns: ColumnsType<PostKeyInfo> = [
        {
            title: "帖子标题",
            dataIndex: "title",
        },
        {
            title: "兴趣组",
            dataIndex: "group_name",
        },
        {
            title: "状态",
            width: 120,
            render: (_, row: PostKeyInfo) => (
                <span style={{ color: getStateColor(row.audit_state) }}>
                    {row.audit_state == POST_AUDIT_NONE && "未申请推荐"}
                    {row.audit_state == POST_AUDIT_APPLY && "已申请推荐"}
                    {row.audit_state == POST_AUDIT_REFUSE && "已进入推荐"}
                    {row.audit_state == POST_AUDIT_AGREE && "同意进入推荐"}
                </span>
            ),
        },
        {
            title: "创建用户",
            width: 100,
            dataIndex: "create_display_name",
        },
        {
            title: "更新时间",
            width: 150,
            render: (_, row: PostKeyInfo) => moment(row.update_time).format("YYYY-MM-DD HH:mms"),
        },
        {
            title: "操作",
            width: 150,
            render: (_, row: PostKeyInfo) => (
                <Space>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={permInfo?.group_perm.audit_recommend == false || row.audit_state != POST_AUDIT_APPLY}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            agreeAudit(row.group_id, row.post_id);
                        }}>通过申请</Button>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={permInfo?.group_perm.audit_recommend == false || row.audit_state != POST_AUDIT_APPLY}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            refuseAudit(row.group_id, row.post_id);
                        }}>拒绝申请</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadPostKeyList();
    }, [curPage, auditState]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card bordered={false} title="推荐帖子审核"
            bodyStyle={{ height: "calc(100vh - 80px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="审核状态">
                        <Select value={auditState} onChange={value => setAuditState(value)}
                            style={{ width: "100px" }}>
                            <Select.Option value={POST_AUDIT_APPLY}>已申请</Select.Option>
                            <Select.Option value={POST_AUDIT_REFUSE}>已拒绝</Select.Option>
                            <Select.Option value={POST_AUDIT_AGREE}>已同意</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            }>
            <Table rowKey="group_id" dataSource={postKeyList} columns={columns}
                pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
        </Card>
    );

};

export default RecommendAuditList;