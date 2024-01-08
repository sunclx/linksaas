import React from "react";
import { observer } from 'mobx-react';
import { List, Space } from "antd";
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";

export interface GroupMemberListProps {
    chatGroupId: string;
}

const GroupMemberList = (props: GroupMemberListProps) => {
    const projectStore = useStores('projectStore');
    const memberStore = useStores("memberStore");
    
    return (
        <div style={{ width: "300px", padding: "10px 10px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>在线成员</h1>
            <List grid={{ gutter: 16 }}
                dataSource={(projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == true)}
                renderItem={item => (
                    <List.Item key={item.member_user_id}>
                        <Space>
                            <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                            {item.member_display_name}
                        </Space>
                    </List.Item>
                )} />
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>离线成员</h1>
            <List grid={{ gutter: 16 }}
                dataSource={(projectStore.curProject?.chat_store.getGroup(props.chatGroupId)?.memberList ?? []).filter(member => memberStore.getMember(member.member_user_id)?.member.online == false)}
                renderItem={item => (
                    <List.Item key={item.member_user_id}>
                        <Space>
                            <UserPhoto logoUri={item.member_logo_uri} style={{ width: "16px", borderRadius: "10px", filter: "grayscale(100%)" }} />
                            {item.member_display_name}
                        </Space>
                    </List.Item>
                )} />
        </div>
    );
};

export default observer(GroupMemberList);