import React from "react";
import { observer } from 'mobx-react';

import type { ChatMsgInfo } from "@/api/project_chat";
import { useStores } from "@/hooks";
import { ReadOnlyEditor } from "@/components/Editor";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";

export interface ChatMsgItemProps {
    msg: ChatMsgInfo;
}

const ChatMsgItem = (props: ChatMsgItemProps) => {
    const ideaStore = useStores("ideaStore");
    // const projectStore = useStores("projectStore");

    return (
        <div>
            <h1>
                <UserPhoto logoUri={props.msg.send_logo_uri} style={{ width: "20px", borderRadius: "10px", margin: "0px 10px", }} />
                {props.msg.send_display_name}&nbsp;&nbsp;{moment(props.msg.send_time).format("YYYY-MM-DD HH:mm:ss")}
            </h1>
            <div style={{ marginLeft: "40px", marginRight: "10px", padding: "10px", backgroundColor: "#f8f8f8", borderRadius: "4px" }}>
                <ReadOnlyEditor content={props.msg.content} keywordList={ideaStore.keywordList} />
            </div>
        </div>
    );
};

export default observer(ChatMsgItem);