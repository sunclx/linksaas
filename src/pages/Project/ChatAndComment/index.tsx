import { Tabs } from "antd";
import React, { useState } from "react";
import UnreadCommentList from "./UnreadCommentList";
import MemberList from "./MemberList";

const ChatAndCommentPanel = () => {

    const [activeKey, setActiveKey] = useState("chat");

    return (
        <Tabs style={{ width: "100%" }} type="card"
            tabBarStyle={{ height: "45px" }}
            activeKey={activeKey}
            onChange={key => setActiveKey(key)}
            items={[
                {
                    key: "chat",
                    label: "沟通",
                    children: (
                        <div style={{ height: "calc(100vh - 130px)", overflowY: "scroll" }}>
                            xx
                        </div>
                    ),
                },
                {
                    key: "comment",
                    label: "未读评论",
                    children: (
                        <div style={{ height: "calc(100vh - 130px)", overflowY: "scroll" }}>
                            {activeKey == "comment" && (<UnreadCommentList />)}
                        </div>
                    ),
                },
                {
                    key: "member",
                    label: "项目成员",
                    children: (
                        <div style={{ height: "calc(100vh - 130px)", overflowY: "scroll" }}>
                            {activeKey == "member" && (<MemberList />)}
                        </div>
                    ),
                }
            ]} />
    );
};

export default (ChatAndCommentPanel);