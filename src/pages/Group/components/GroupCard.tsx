import { Badge, Button, Card, Popover, Space } from "antd";
import React, { useState } from "react";
import type { GroupInfo } from "@/api/group";
import { update as update_group } from "@/api/group";
import { MessageOutlined, MoreOutlined } from "@ant-design/icons";
import logoImg from "@/assets/allIcon/logo.png";
import { ReadOnlyEditor } from "@/components/Editor";
import Profile from "@/components/Profile";
import { write_file_base64, set_file_owner, FILE_OWNER_TYPE_GROUP } from "@/api/fs";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import AsyncImage from "@/components/AsyncImage";
import { useHistory } from "react-router-dom";
import { APP_GROUP_POST_LIST_PATH } from "@/utils/constant";
import { observer } from 'mobx-react';

export interface GroupCardProps {
    groupInfo: GroupInfo;
    onChange: () => void;
    onRemove: () => void;
}

const GroupCard = (props: GroupCardProps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [showImageModal, setShowImageModal] = useState(false);

    const updateIcon = async (imgData: string) => {
        const res = await request(write_file_base64(userStore.sessionId, props.groupInfo.fs_id, "logo.png", imgData, ""));
        await request(set_file_owner({
            session_id: userStore.sessionId,
            fs_id: props.groupInfo.fs_id,
            file_id: res.file_id,
            owner_type: FILE_OWNER_TYPE_GROUP,
            owner_id: props.groupInfo.group_id,
        }));
        await request(update_group({
            session_id: userStore.sessionId,
            group_id: props.groupInfo.group_id,
            group_name: props.groupInfo.group_name,
            icon_file_id: res.file_id,
            group_desc: props.groupInfo.group_desc,
            can_add_post_for_new: props.groupInfo.can_add_post_for_new,
            can_add_comment_for_new: props.groupInfo.can_add_post_for_new,
        }));
        setShowImageModal(false);
        props.onChange();
    };

    return (
        <Card title={<a style={{ fontSize: "16px", fontWeight: 600 }} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            groupStore.curGroup = props.groupInfo;
            history.push(APP_GROUP_POST_LIST_PATH);
        }}>{props.groupInfo.group_name}</a>}
            style={{ width: "300px" }}
            bodyStyle={{ display: "flex", height: "160px" }}
            extra={
                <Space>
                    {props.groupInfo.last_post_time > props.groupInfo.my_last_view_time && (
                        <Badge count={1} dot={true}>
                            <MessageOutlined />
                        </Badge>
                    )}
                    {(props.groupInfo.user_perm.can_update_group || props.groupInfo.user_perm.can_remove_group) && (
                        <Popover trigger="click" placement="bottom" content={
                            <Space direction="vertical" style={{ padding: "10px 10px" }}>
                                {props.groupInfo.user_perm.can_update_group && (
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowImageModal(true);
                                    }}>修改图标</Button>
                                )}
                                {props.groupInfo.user_perm.can_update_group && (
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>修改简介</Button>
                                )}
                                {props.groupInfo.user_perm.can_remove_group && (
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //TODO
                                    }}>删除兴趣组</Button>
                                )}
                            </Space>
                        }>
                            <MoreOutlined />
                        </Popover>
                    )}

                </Space>
            }>
            <div style={{ width: "100px", cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                groupStore.curGroup = props.groupInfo;
                history.push(APP_GROUP_POST_LIST_PATH);
            }}>
                {props.groupInfo.icon_file_id == "" && (
                    <img src={logoImg} style={{ width: "90px" }} />
                )}
                {props.groupInfo.icon_file_id != "" && (
                    <AsyncImage src={`fs://localhost/${props.groupInfo.fs_id}/${props.groupInfo.icon_file_id}/logo.png`} width="90px" useRawImg />
                )}
            </div>
            <div style={{ flex: 1, overflowY: "scroll" }}>
                <ReadOnlyEditor content={props.groupInfo.group_desc} />
            </div>
            {showImageModal == true && (
                <Profile visible defaultSrc={props.groupInfo.icon_file_id == "" ? logoImg : `fs://localhost/${props.groupInfo.fs_id}/${props.groupInfo.icon_file_id}/logo.png`}
                    borderRadius="0%" onCancel={() => setShowImageModal(false)} onOK={imgData => {
                        if (imgData != null) {
                            updateIcon(imgData);
                        }
                    }} />
            )}
        </Card>
    );
};

export default observer(GroupCard);