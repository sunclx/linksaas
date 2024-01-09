import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { ChatMsgInfo } from "@/api/project_chat";
import { useStores } from "@/hooks";
import { ReadOnlyEditor } from "@/components/Editor";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";
import { Card, Popover, Space } from "antd";
import { BulbTwoTone } from "@ant-design/icons";
import { LinkIdeaPageInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";

export interface ChatMsgItemProps {
    msg: ChatMsgInfo;
}

const ChatMsgItem = (props: ChatMsgItemProps) => {
    const history = useHistory();

    const ideaStore = useStores("ideaStore");
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores('linkAuxStore');

    const [ideaKwList, setIdeaKwList] = useState<string[]>([]);

    return (
        <Card title={
            <Space size="small">
                <UserPhoto logoUri={props.msg.send_logo_uri} style={{ width: "20px", borderRadius: "10px", margin: "0px 0px", }} />
                {props.msg.send_display_name}
                {moment(props.msg.send_time).format("YYYY-MM-DD HH:mm")}
            </Space>
        } style={{ width: "100%" }} bordered={false} headStyle={{ border: "none", padding: "0px 10px" }}
            bodyStyle={{ padding: "0px 10px" }}
            extra={
                <>
                    {ideaKwList.length > 0 && (
                        <Popover trigger="hover" placement="left" content={
                            <div style={{ padding: "10px 10px", width: "100px", display: "flex", flexWrap: "wrap" }}>
                                {ideaKwList.map(item => (
                                    <a key={item} style={{ marginRight: "10px" }}
                                    onClick={e=>{
                                        e.stopPropagation();
                                        e.preventDefault();
                                        linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", [item]), history);
                                    }}>{item}</a>
                                ))}
                            </div>
                        }>
                            <BulbTwoTone style={{ fontSize: "16px", marginRight: "10px" }} twoToneColor={["orange", "orange"]} />
                        </Popover>
                    )}
                </>
            }>
            <div style={{ marginLeft: "40px", marginRight: "10px", padding: "10px", backgroundColor: "#f8f8f8", borderRadius: "4px" }}>
                <ReadOnlyEditor content={props.msg.content} keywordList={ideaStore.keywordList} keywordCallback={kwList => setIdeaKwList(kwList)} />
            </div>
        </Card>
    );
};

export default observer(ChatMsgItem);