import React, { useEffect, useState } from "react";
import type { MarkInfo } from '@/api/project_book_shelf';
import { Modal, Select, message } from "antd";
import { observer } from "mobx-react";
import { useStores } from "@/hooks";
import { is_empty_doc, useSimpleEditor } from "@/components/Editor";
import { LinkBookMarkInfo } from "@/stores/linkAux";
import { MSG_LINK_NONE, send_msg } from '@/api/project_channel';
import { request } from '@/utils/request';

interface SendModalProps {
    mark: MarkInfo | undefined;
    onClose: () => void;
}

const ShareModal: React.FC<SendModalProps> = (props) => {
    if (props.mark == undefined) {
        props.onClose();
    }

    const userStore = useStores("userStore");
    const channelStore = useStores("channelStore");
    const projectStore = useStores("projectStore");

    const [channelId, setChannelId] = useState(projectStore.curProject?.default_channel_id ?? "");

    const { editor, editorRef } = useSimpleEditor("", props.mark?.mark_content ?? "");

    const sendMsg = async () => {
        const content = editorRef.current?.getContent() ?? { "type": "doc" };
        if (is_empty_doc(content)) {
            message.warn("不能发送空的内容");
            return;
        }
        await request(send_msg(userStore.sessionId, projectStore.curProjectId, channelId, {
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
                {channelStore.channelList.filter(chan => chan.channelInfo.closed == false && chan.channelInfo.readonly == false).map(chan => (
                    <Select.Option key={chan.channelInfo.channel_id} value={chan.channelInfo.channel_id}>{chan.channelInfo.basic_info.channel_name}</Select.Option>
                ))}
            </Select>
            <div style={{ marginTop: 20 }}>
                {editor}
            </div>
        </Modal>
    );
};

export default observer(ShareModal);