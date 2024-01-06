import React, { useEffect, useState } from "react";
import type { COMMENT_TARGET_TYPE } from "@/api/project_comment";
import { check_un_read } from "@/api/project_comment";
import { Badge, Button } from "antd";
import { MessageTwoTone } from "@ant-design/icons";
import { get_session } from "@/api/user";
import { request } from "@/utils/request";
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';
import CommentModal from "./CommentModal";

export interface CommentEntryProps {
    projectId: string;
    targetType: COMMENT_TARGET_TYPE;
    targetId: string;
    myUserId: string;
    myAdmin: boolean;
    defaultOpen?: boolean;
}

const CommentEntry = (props: CommentEntryProps) => {
    const [hasUnRead, setHasUnRead] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(props.defaultOpen ?? false);

    const checkHasUnread = async () => {
        const sessionId = await get_session();
        const res = await request(check_un_read({
            session_id: sessionId,
            project_id: props.projectId,
            target_type: props.targetType,
            target_id: props.targetId,
        }));
        setHasUnRead(res.has_un_read);
    };

    useEffect(() => {
        checkHasUnread();
    }, [props.targetId]);

    useEffect(() => {
        const unListenFn = listen<NoticeType.AllNotice>("notice", ev => {
            const notice = ev.payload;
            if (notice.CommentNotice?.AddCommentNotice?.target_id == props.targetId || notice.CommentNotice?.AddCommentNotice?.target_type == props.targetType) {
                setOpenCommentModal(oldValue => {
                    if (!oldValue) {
                        setHasUnRead(true);
                    }
                    return oldValue;
                })
            }
        });
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, [props.targetId]);

    return (
        <div>
            <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setOpenCommentModal(true);
            }}>
                <Badge count={hasUnRead ? 1 : 0} dot={true}>
                    <MessageTwoTone twoToneColor={["orange", "white"]} style={{ fontSize: "20px" }} />
                </Badge>
            </Button>
            {openCommentModal == true && (
                <CommentModal projectId={props.projectId} targetType={props.targetType} targetId={props.targetId}
                    onCancel={() => setOpenCommentModal(false)}
                    myUserId={props.myUserId} myAdmin={props.myAdmin} />
            )}
        </div>
    );
}

export default CommentEntry;