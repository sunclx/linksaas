import React, { useEffect, useState } from "react";
import type { POST_AUDIT_STATE, PostKeyInfo } from "@/api/group_post";
import { POST_AUDIT_AGREE, POST_AUDIT_APPLY, POST_AUDIT_NONE, POST_AUDIT_REFUSE, list_post_key, update_post_essence } from "@/api/group_post";
import { Card, Form, Input, Popover, Space, Switch, Table, Tag } from "antd";
import { useHistory } from "react-router-dom";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { CloseOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import { APP_GROUP_HOME_PATH, APP_GROUP_MEMBER_LIST_PATH, APP_GROUP_POST_DETAIL_PATH, APP_GROUP_POST_EDIT_PATH } from "@/utils/constant";
import type { ColumnsType } from 'antd/lib/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import { observer } from 'mobx-react';
import InviteModal from "./components/InviteModal";
import InviteHistoryModal from "./components/InviteHistoryModal";
import LeaveGroupModal from "./components/LeaveGroupModal";
import RemoveGroupModal from "./components/RemoveGroupModal";

const PAGE_SIZE = 20;

const PostList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [postKeyInfoList, setPostKeyInfoList] = useState<PostKeyInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [filterEssence, setFilterEssence] = useState(false);
    const [filterTag, setFilterTag] = useState("");
    const [keyword, setKeyword] = useState("");

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showInviteHistoryModal, setShowInviteHistoryModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const loadPostKeyInfoList = async () => {
        const res = await request(list_post_key({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            list_param: {
                filter_essence: filterEssence,
                filter_by_tag: filterTag != "",
                tag: filterTag,
                filter_by_keyword: keyword != "",
                keyword: keyword,
            },
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setPostKeyInfoList(res.post_key_list);
    };

    const updateEssence = async (postId: string, essence: boolean) => {
        await request(update_post_essence({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: postId,
            essence: essence,
        }));
        const tmpList = postKeyInfoList.slice();
        const index = tmpList.findIndex(item => item.post_id == postId);
        if (index != -1) {
            tmpList[index].essence = essence;
            setPostKeyInfoList(tmpList);
        }
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
            title: "标题",
            render: (_, row: PostKeyInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    groupStore.curPostKey = row;
                    history.push(APP_GROUP_POST_DETAIL_PATH);
                }}>{row.title}</a>
            ),
        },
        {
            title: "精华贴",
            width: 60,
            render: (_, row: PostKeyInfo) => (
                <Switch checked={row.essence} disabled={!row.user_perm.can_mark_essence} size="small"
                    onChange={checked => {
                        updateEssence(row.post_id, checked);
                    }} />
            ),
        },
        {
            title: "推荐状态",
            key: "audit_state",
            width: 100,
            render: (_, row: PostKeyInfo) => (
                <span style={{ color: getStateColor(row.audit_state) }}>
                    {row.audit_state == POST_AUDIT_NONE && "未申请推荐"}
                    {row.audit_state == POST_AUDIT_APPLY && "已申请推荐"}
                    {row.audit_state == POST_AUDIT_REFUSE && "拒绝进入推荐"}
                    {row.audit_state == POST_AUDIT_AGREE && "同意进入推荐"}
                </span>
            ),
        },
        {
            title: "标签",
            width: 200,
            render: (_, row: PostKeyInfo) => (
                <Space>
                    {row.tag_list.map(tag => (
                        <Tag key={tag} style={{ color: "orange", cursor: "pointer" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFilterTag(tag);
                        }}>{tag}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "评论数",
            width: 60,
            dataIndex: "comment_count",
        },
        {
            title: "发布人",
            width: 100,
            render: (_, row: PostKeyInfo) => (
                <Space style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100px" }}>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    <span>{row.create_display_name}</span>
                </Space>
            ),
        },
        {
            title: "发布时间",
            width: 150,
            render: (_, row: PostKeyInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm"),
        }
    ];

    useEffect(() => {
        loadPostKeyInfoList();
    }, [groupStore.curGroup, curPage, filterEssence, filterTag, keyword]);

    useEffect(() => {
        setCurPage(0);
    }, [filterEssence, filterTag, keyword]);

    return (
        <Card bordered={false} title={
            <span style={{ fontSize: "18px", fontWeight: 600 }}>帖子列表</span>
        } extra={
            <Form layout="inline">
                <Form.Item label="只看精华">
                    <Switch checked={filterEssence} onChange={checked => setFilterEssence(checked)} />
                </Form.Item>
                <Form.Item label="过滤标题">
                    <Input value={keyword} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setKeyword(e.target.value.trim());
                    }} allowClear />
                </Form.Item>
                {filterTag != "" && (
                    <Form.Item label="过滤标签">
                        <Tag closable style={{ border: "none", lineHeight: "24px", color: "orange" }} closeIcon={<CloseOutlined style={{ color: "red" }} />}
                            onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setFilterTag("");
                            }}>{filterTag}&nbsp;&nbsp;</Tag>
                    </Form.Item>
                )}
                {groupStore.curGroup?.user_perm.can_add_post && (
                    <Form.Item>
                        <Button icon={<PlusOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            groupStore.curPostKey = null;
                            history.push(APP_GROUP_POST_EDIT_PATH);
                        }}>发布内容</Button>
                    </Form.Item>
                )}
                <Form.Item>
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowInviteModal(true);
                            }} disabled={!(groupStore.curGroup?.user_perm.can_invite ?? false)}>邀请成员</Button>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowInviteHistoryModal(true);
                            }} disabled={!(groupStore.curGroup?.user_perm.can_invite ?? false)}>查看邀请记录</Button>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                groupStore.curPostKey = null;
                                history.push(APP_GROUP_MEMBER_LIST_PATH);
                            }} disabled={!(groupStore.curGroup?.user_perm.can_list_member ?? false)}>查看成员</Button>
                            {groupStore.curGroup?.owner_user_id != userStore.userInfo.userId && (
                                <Button type="link" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowLeaveModal(true);
                                }} danger>退出兴趣组</Button>
                            )}
                            {groupStore.curGroup?.owner_user_id == userStore.userInfo.userId && (
                                <Button type="link" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowRemoveModal(true);
                                }} danger>删除兴趣组</Button>
                            )}
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Form.Item>
            </Form>
        }>
            <div style={{ height: "calc(100vh - 110px)", overflowY: "scroll" }}>
                <Table rowKey="post_id" dataSource={postKeyInfoList} columns={columns.filter(item => {
                    if (item.key == "audit_state" && (groupStore.curGroup?.owner_user_id != userStore.userInfo.userId || groupStore.curGroup?.pub_group == false)) {
                        return false;
                    } else {
                        return true;
                    }
                })}
                    pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            </div>
            {showInviteModal == true && (
                <InviteModal onClose={() => setShowInviteModal(false)} />
            )}
            {showInviteHistoryModal == true && (
                <InviteHistoryModal onClose={() => setShowInviteHistoryModal(false)} />
            )}
            {showLeaveModal == true && groupStore.curGroup !== null && (
                <LeaveGroupModal groupInfo={groupStore.curGroup} onCancel={() => setShowLeaveModal(false)}
                    onOk={() => {
                        groupStore.curGroup = null;
                        groupStore.curPostKey = null;
                        history.push(APP_GROUP_HOME_PATH);
                        setShowLeaveModal(false);
                    }} />
            )}
            {showRemoveModal == true && groupStore.curGroup !== null && (
                <RemoveGroupModal groupInfo={groupStore.curGroup} onCancel={() => setShowRemoveModal(false)}
                    onOk={() => {
                        groupStore.curGroup = null;
                        groupStore.curPostKey = null;
                        history.push(APP_GROUP_HOME_PATH);
                        setShowRemoveModal(false);
                    }} />
            )}
        </Card>
    )
};

export default observer(PostList);