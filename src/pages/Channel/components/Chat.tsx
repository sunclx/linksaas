import React from 'react';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import styles from './Chat.module.less';
import ChatMsgList from './ChatMsgList';
import {
  useCommonEditor,
  is_empty_doc,
  change_file_fs,
  get_reminder_info,
} from '@/components/Editor';
import { Button } from 'antd';
import { request } from '@/utils/request';
import { send_msg, MSG_LINK_NONE, LIST_CHAN_SCOPE_INCLUDE_ME } from '@/api/project_channel';
import { FILE_OWNER_TYPE_CHANNEL } from '@/api/fs';

const ChannelHeader = observer(() => {
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');
  const userStore = useStores('userStore');

  const { editor, editorRef } = useCommonEditor({
    content: '',
    fsId: projectStore.curProject?.channel_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_CHANNEL,
    ownerId: channelStore.curChannelId,
    historyInToolbar: false,
    clipboardInToolbar: false,
    widgetInToolbar: true,
    showReminder: true,
    channelMember: true,
  });

  const sendContent = async () => {
    const chatJson = editorRef.current?.getContent() || {
      type: 'doc',
    };
    if (is_empty_doc(chatJson)) {
      return;
    }

    await change_file_fs(
      chatJson,
      projectStore.curProject?.channel_fs_id ?? '',
      userStore.sessionId,
      FILE_OWNER_TYPE_CHANNEL,
      channelStore.curChannelId,
    );
    const remindInfo = get_reminder_info(chatJson);

    await request(
      send_msg(userStore.sessionId, projectStore.curProjectId, channelStore.curChannelId, {
        msg_data: JSON.stringify(chatJson),
        ref_msg_id: '',
        remind_info: remindInfo,
        link_type: MSG_LINK_NONE,
        link_dest_id: '',
      }),
    );
    editorRef.current?.clearContent();
  };

  return (
    <div className={styles.chat}>
      <ChatMsgList />
      {projectStore.curProject?.closed == false &&
        channelStore.channelScope == LIST_CHAN_SCOPE_INCLUDE_ME &&
        channelStore.curChannel?.channelInfo.readonly == false &&
        channelStore.curChannel?.channelInfo.closed == false && (
          <div className={styles.chatInput + ' _chatContext'}>
            {editor}
            <Button className={styles.chatBtn} type="primary" onClick={() => sendContent()}>
              发送
            </Button>
          </div>
        )}
    </div>
  );
});

export default ChannelHeader;
