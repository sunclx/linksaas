import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ChatMsg from './ChatMsg';
import styles from './ChatMsgList.module.less';
import { LIST_MSG_TYPE_BEFORE, LIST_MSG_TYPE_AFTER } from '@/api/project_channel';
import { runInAction } from 'mobx';

const ChatMsgList = () => {
  const chatMsgStore = useStores('chatMsgStore');
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');
  const chatListElRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const readonly = channelStore.curChannel?.channelInfo.closed || channelStore.curChannel?.channelInfo.readonly;

  useEffect(() => {
    setTimeout(() => {
      if (chatListElRef.current != null) {
        const bottomDis =
          chatListElRef.current.scrollHeight -
          chatListElRef.current.clientHeight -
          chatListElRef.current.scrollTop;
        if (
          chatMsgStore.msgList.map(item => item.msg.msg_id).includes(chatMsgStore.lastMsgId) && (
            bottomDis < 200 ||
            chatMsgStore.listRefMsgId == ''
          )
        ) {
          chatListElRef.current.scrollTop =
            chatListElRef.current.scrollHeight - chatListElRef.current.clientHeight;
        }
      }
    }, 200);
  }, [chatMsgStore.lastMsgId]);

  const onScroll = () => {
    if (chatListElRef.current != null) {
      const bottomDis =
        chatListElRef.current.scrollHeight -
        chatListElRef.current.clientHeight -
        chatListElRef.current.scrollTop;
      if (bottomDis > 200 && chatListElRef.current.clientHeight != 0) {
        runInAction(() => {
          chatMsgStore.skipNewMsgByUi = true;
        });
      } else {
        chatMsgStore.skipNewMsgByUi = false;
      }
      if (chatMsgStore.listRefMsgId !== '') {
        return;
      }
      if (chatListElRef.current.scrollTop < 10) {
        setTimeout(() => {
          chatMsgStore.loadMoreMsg(
            projectStore.curProjectId,
            channelStore.curChannelId,
            LIST_MSG_TYPE_BEFORE,
          );
        }, 300);
      } else if (bottomDis < 10) {
        setTimeout(() => {
          chatMsgStore.loadMoreMsg(
            projectStore.curProjectId,
            channelStore.curChannelId,
            LIST_MSG_TYPE_AFTER,
          );
        }, 300);
      }
    }
  };
  return (
    <div className={styles.chatListWrap}>
      <div ref={chatListElRef} className={styles.chatList} onScroll={() => onScroll()}>
        {chatMsgStore.msgList.map((msg) => {
          return <ChatMsg msg={msg} key={msg.msg.msg_id} readonly={readonly ?? true} />;
        })}
      </div>
    </div>
  );
};

export default observer(ChatMsgList);
