import React from "react";
import { observer } from 'mobx-react';
import { Badge, Card, List, Popover, Space } from "antd";
import { useStores } from "@/hooks";
import moment from 'moment';
import UserPhoto from "@/components/Portrait/UserPhoto";
import { get_content_text } from "@/components/Editor";
import GroupMemberList from "./components/GroupMemberList";


const ChatGroupList = () => {
    const projectStore = useStores('projectStore');

    return (
        <List dataSource={projectStore.curProject?.chat_store.chatGroupList ?? []} bordered={false} renderItem={item => (
            <List.Item key={item.groupInfo.chat_group_id} style={{ cursor: "pointer", borderBottom: "1px solid #e4e4e8" }}
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (projectStore.curProject != null) {
                        projectStore.curProject.chat_store.curGroupId = item.groupInfo.chat_group_id;
                    }
                }}>
                <Card title={
                    <Popover trigger="hover" placement="bottomLeft" content={<GroupMemberList chatGroupId={item.groupInfo.chat_group_id} />}>
                        <div title={item.groupInfo.title}
                            style={{ fontSize: "16px", fontWeight: 700, width: "150px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            ({item.memberList.length}人){item.groupInfo.title}
                        </div>
                    </Popover>}
                    style={{ width: "100%" }} bordered={false}
                    headStyle={{ border: "none", padding: "0px 10px" }}
                    bodyStyle={{ padding: "0px 10px" }}
                    extra={
                        <>
                            {item.lastMsg !== undefined && (
                                <div style={{ marginRight: "20px" }}>
                                    <Badge count={item.groupInfo.unread_count} offset={[10, 5]} style={{ padding: '0 3px', height: '16px', lineHeight: '16px' }}>
                                        {moment(item.lastMsg.send_time).format("YYYY-MM-DD HH:mm")}
                                    </Badge>
                                </div>
                            )}
                        </>
                    }>
                    {item.lastMsg != null && (
                        <Space style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "250px" }}>
                            <UserPhoto logoUri={item.lastMsg.send_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                            <span>{item.lastMsg.send_display_name}:</span>
                            <div title={get_content_text(item.lastMsg.content)}>{get_content_text(item.lastMsg.content)}</div>
                        </Space>
                    )}
                </Card>
            </List.Item>
        )} />
    );
};

export default observer(ChatGroupList);