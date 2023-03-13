import { useStores } from "@/hooks";
import { List, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { list_comment } from "@/api/project_code";
import type { Comment } from "@/api/project_code";
import { request } from "@/utils/request";
import { observer } from 'mobx-react';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from 'moment';
import ReactMarkdown from 'react-markdown'


interface CodeCommentThreadModalProps {
    threadId: string;
    commentId: string;
}

const CodeCommentThreadModal: React.FC<CodeCommentThreadModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [commentList, setCommentList] = useState<Comment[]>([]);

    const loadCommentList = async () => {
        const res = await request(list_comment({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            thread_id: props.threadId,
        }));
        setCommentList(res.comment_list);
    };

    useEffect(() => {
        loadCommentList();
    }, [props.threadId, props.commentId])

    return (
        <Modal open title={`代码评论 (${props.threadId}) `}
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                projectStore.setCodeCommentInfo("", "");
            }}>
            <div style={{ maxHeight: "calc(100vh - 250px)", overflowY: "scroll" }}>
                <List dataSource={commentList} renderItem={item => (
                    <List.Item key={item.comment_id}>
                        <div style={{width:"100%"}}>
                            <div>
                                <UserPhoto logoUri={item.user_logo_uri} width="24px" height="24px" style={{
                                    borderRadius: '20px',
                                    marginRight: "10px"
                                }} />
                                {item.user_display_name}&nbsp;&nbsp;
                                {moment(item.update_time).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                            <div style={{
                                margin: "6px 0px",
                                padding: "6px 34px",
                                backgroundColor:"#fffff0",
                                width:"100%"
                            }}>
                                <ReactMarkdown linkTarget="_blank">{item.content}</ReactMarkdown>
                            </div>
                        </div>
                    </List.Item>
                )} />
            </div>
        </Modal>
    );
};

export default observer(CodeCommentThreadModal);