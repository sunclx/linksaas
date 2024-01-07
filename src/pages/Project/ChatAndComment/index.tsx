import { Tabs } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import UnreadCommentList from "./UnreadCommentList";


const ChatAndCommentPanel = () => {

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

            ]} tabBarExtraContent={
                <div style={{ marginRight: "10px" }}>
                    {activeKey == "chat" && "xx"}
                </div>
            } />
    );
};

export default observer(ChatAndCommentPanel);