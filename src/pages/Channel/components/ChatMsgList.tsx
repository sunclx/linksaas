import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ChatMsg from './ChatMsg';
import styles from './ChatMsgList.module.less';
import { LIST_MSG_TYPE_BEFORE, LIST_MSG_TYPE_AFTER } from '@/api/project_channel';

const ChatMsgList = () => {
  const chatMsgStore = useStores('chatMsgStore');
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');

  const readonly = channelStore.curChannel?.channelInfo.closed || channelStore.curChannel?.channelInfo.readonly;
  const [keepLastTimer, setKeepLastTimer] = useState<NodeJS.Timer | null>(null);


  const onScroll = async (el: HTMLDivElement) => {
    if (el.scrollHeight <= el.clientHeight) {
      return;
    }
    setTimeout(() => {
      chatMsgStore.setScrollTarget("", false);
    }, 200);
    //检查是否滚动到底部
    if (el.scrollHeight - el.clientHeight - el.scrollTop < 10) {
      if (chatMsgStore.containLastMsg) {
        chatMsgStore.autoScroll = true;
      } else {
        await chatMsgStore.loadMoreMsg(projectStore.curProjectId, channelStore.curChannelId, LIST_MSG_TYPE_AFTER);
        if (chatMsgStore.containLastMsg) {
          chatMsgStore.autoScroll = true;
        }
      }
    } else if (el.scrollTop < 10) {
      chatMsgStore.autoScroll = false;
      await chatMsgStore.loadMoreMsg(projectStore.curProjectId, channelStore.curChannelId, LIST_MSG_TYPE_BEFORE);
    } else {
      chatMsgStore.autoScroll = false;
    }
  };

  return (
    <div className={styles.chatListWrap}>
      <div className={styles.chatList} onScroll={e => {
        e.stopPropagation();
        e.preventDefault();
        onScroll(e.currentTarget);
      }} onMouseMove={() => {
        if (keepLastTimer != null) {
          clearInterval(keepLastTimer);
          setKeepLastTimer(null);
        }
      }}>
        {chatMsgStore.msgList.map((msg) => {
          return <ChatMsg msg={msg} key={msg.msg.msg_id} readonly={readonly ?? true} />;
        })}
      </div>
    </div>
  );
};

export default observer(ChatMsgList);
