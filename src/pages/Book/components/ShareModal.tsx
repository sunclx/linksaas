import React, { useEffect, useState } from "react";
import type { MarkInfo } from '@/api/project_book_shelf';
import { Modal, Select, message } from "antd";
import { is_empty_doc, useSimpleEditor } from "@/components/Editor";
import { LinkBookMarkInfo } from "@/stores/linkAux";
import { MSG_LINK_NONE, send_msg, list as list_channel } from '@/api/project_channel';
import { request } from '@/utils/request';
import { get_session } from "@/api/user";
import type { ChannelInfo } from "@/api/project_channel";

interface SendModalProps {
    projectId: string;
    mark: MarkInfo | undefined;
    onClose: () => void;
}

const ShareModal: React.FC<SendModalProps> = (props) => {
    if (props.mark == undefined) {
        props.onClose();
    }

    const [channelId, setChannelId] = useState("");
    const [channelList, setChannelList] = useState<ChannelInfo[]>([]);

    const { editor, editorRef } = useSimpleEditor("", props.mark?.mark_content ?? "");

    const loadChannelList = async () => {
        const sessionId = await get_session();
        const res = await request(list_channel({
            session_id: sessionId,
            project_id: props.projectId,
            filter_by_closed: true,
            closed: false,
        }));
        setChannelList(res.info_list.filter(ch => ch.readonly == false));
        for (const ch of res.info_list) {
            if (ch.system_channel && !ch.readonly) {
                setChannelId(ch.channel_id);
            }
        }
    };

    const sendMsg = async () => {
        const content = editorRef.current?.getContent() ?? { "type": "doc" };
        if (is_empty_doc(content)) {
            message.warn("不能发送空的内容");
            return;
        }
        const sessionId = await get_session();
        await request(send_msg(sessionId, props.projectId, channelId, {
            msg_data: JSON.stringify(content),
            ref_msg_id: "",
            remind_info: {
                reminder_all: false,
                extra_reminder_list: [],
            },
            link_type: MSG_LINK_NONE,
            link_dest_id: "",
        }));
        props.onClose();
        message.info("分享成功");
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (editorRef.current != null) {
                editorRef.current?.getCommands().insertLink(
                    new LinkBookMarkInfo("书本标注", props.mark?.project_id ?? "", props.mark?.book_id ?? "", props.mark?.mark_id ?? ""), false);
                clearInterval(timer);
            }
        }, 100);
    }, []);

    useEffect(() => {
        loadChannelList();
    }, []);

    return (
        <Modal
            title="分享标注内容"
            open
            okText="分享"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }} onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                sendMsg();
            }}>

            分享频道：<Select
                value={channelId}
                style={{ width: 200 }}
                onChange={value => setChannelId(value)}>
                {channelList.map(chan => (
                    <Select.Option key={chan.channel_id} value={chan.channel_id}>{chan.basic_info.channel_name}</Select.Option>
                ))}
            </Select>
            <div style={{ marginTop: 20 }}>
                {editor}
            </div>
        </Modal>
    );
};

export default ShareModal;