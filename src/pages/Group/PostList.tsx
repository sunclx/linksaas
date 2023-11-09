import React, { useEffect, useState } from "react";
import type { GroupInfo } from "@/api/group";
import type { PostKeyInfo } from "@/api/group_post";
import { list_post_key } from "@/api/group_post";
import { Card, Form, Input, Popover, Space, Switch, Table, Tag } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import AsyncImage from "@/components/AsyncImage";
import { ReadOnlyEditor } from "@/components/Editor";
import logoImg from "@/assets/allIcon/logo.png";
import { CloseOutlined, DoubleLeftOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import Button from "@/components/Button";

const PAGE_SIZE = 20;

export interface PostListState {
    groupInfo: GroupInfo;
}

const PostList = () => {
    const localtion = useLocation();
    const history = useHistory();
    const state = localtion.state as PostListState;

    const userStore = useStores('userStore');

    const [postKeyInfoList, setPostKeyInfoList] = useState<PostKeyInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [filterEssence, setFilterEssence] = useState(false);
    const [filterTag, setFilterTag] = useState("");
    const [keyword, setKeyword] = useState("");

    const loadPostKeyInfoList = async () => {
        const res = await request(list_post_key({
            session_id: userStore.sessionId,
            group_id: state.groupInfo.group_id,
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

    useEffect(() => {
        loadPostKeyInfoList();
    }, [state, curPage, filterEssence, filterTag, keyword]);

    useEffect(() => {
        setCurPage(0);
    }, [filterEssence, filterTag, keyword]);

    return (
        <Card title={
            <Space>
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.goBack();
                }}><DoubleLeftOutlined /></a>
                <span>{state.groupInfo.group_name}</span>
            </Space>
        } extra={
            <Form layout="inline">
                <Form.Item label="只看精华">
                    <Switch />
                </Form.Item>
                <Form.Item label="过滤标题">
                    <Input />
                </Form.Item>
                {filterTag != "" && (
                    <Form.Item label="过滤标签">
                        <Tag closable style={{ border: "none", lineHeight: "24px" }} closeIcon={<CloseOutlined style={{ color: "red" }} />}
                            onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setFilterTag("");
                            }}>{filterTag}&nbsp;&nbsp;</Tag>
                    </Form.Item>
                )}
                {state.groupInfo.user_perm.can_add_post && (
                    <Form.Item>
                        <Button icon={<PlusOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            //TODO
                        }}>发布内容</Button>
                    </Form.Item>
                )}
                <Form.Item>
                    <Popover trigger="click" placement="bottom" content={
                        <Space direction="vertical" style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e=>{
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }} disabled={!state.groupInfo.user_perm.can_invite}>邀请成员</Button>
                            <Button type="link" onClick={e=>{
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }} disabled={!state.groupInfo.user_perm.can_list_member}>查看成员</Button>
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Form.Item>
            </Form>
        }>
            <div style={{ display: "flex", height: "100px" }}>
                <div style={{ width: "100px" }} >
                    {state.groupInfo.icon_file_id == "" && (
                        <img src={logoImg} style={{ width: "90px" }} />
                    )}
                    {state.groupInfo.icon_file_id != "" && (
                        <AsyncImage src={`fs://localhost/${state.groupInfo.fs_id}/${state.groupInfo.icon_file_id}/logo.png`} width="90px" useRawImg />
                    )}
                </div>
                <div style={{ flex: 1, overflowY: "scroll" }}>
                    <ReadOnlyEditor content={state.groupInfo.group_desc} />
                </div>
            </div>
            <Table rowKey="post_id" dataSource={postKeyInfoList} />
        </Card>
    )
};

export default PostList;