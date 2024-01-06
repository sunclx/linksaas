import { Button, Tabs } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import UnreadCommentList from "./UnreadCommentList";
import MemberList from "./MemberList";
import { UserAddOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";

const ChatAndCommentPanel = () => {
    const memberStore = useStores('memberStore');

    const [activeKey, setActiveKey] = useState("chat");

    return (
        <Tabs style={{ width: "100%" }} type="card"
            tabBarStyle={{ height: "45px", marginBottom: "0px" }}
            activeKey={activeKey}
            onChange={key => setActiveKey(key)}
            items={[
                {
                    key: "chat",
                    label: "沟通",
                    children: (
                        <div style={{ height: "calc(100vh - 136px)", overflowY: "scroll" }}>
                            xx
                        </div>
                    ),
                },
                {
                    key: "comment",
                    label: "未读评论",
                    children: (
                        <div style={{ height: "calc(100vh - 136px)", overflowY: "scroll" }}>
                            {activeKey == "comment" && (<UnreadCommentList />)}
                        </div>
                    ),
                },
                {
                    key: "member",
                    label: "项目成员",
                    children: (
                        <div style={{ height: "calc(100vh - 136px)", overflowY: "scroll" }}>
                            {activeKey == "member" && (<MemberList />)}
                        </div>
                    ),
                }
            ]} tabBarExtraContent={
                <div style={{ marginRight: "10px" }}>
                    {activeKey == "chat" && "xx"}
                    {activeKey == "member" && (
                        <Button type="primary" icon={<UserAddOutlined />}
                            style={{ borderRadius: "4px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                memberStore.showInviteMember = true;
                            }}>邀请成员</Button>
                    )}
                </div>
            } />
    );
};

export default observer(ChatAndCommentPanel);