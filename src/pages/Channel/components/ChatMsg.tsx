import React, { useEffect, useRef, useState } from 'react';
import type { WebMsg } from '@/stores/chatMsg';
import { MSG_LINK_BUG, MSG_LINK_TASK, MSG_LINK_CHANNEL } from '@/api/project_channel';
import type { MSG_LINK_TYPE } from '@/api/project_channel';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { Badge, Popover, Space } from 'antd';
import { useStores } from '@/hooks';
import { useHistory } from 'react-router-dom';
import { LinkTaskInfo, LinkBugInfo, LinkChannelInfo, LinkIdeaPageInfo } from '@/stores/linkAux';
import { ReadOnlyEditor } from '@/components/Editor';
import UserPhoto from '@/components/Portrait/UserPhoto';
import styles from './ChatMsg.module.less';
import { BulbFilled, CommentOutlined, LinkOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';
import Button from '@/components/Button';

export type ChatMsgProp = {
  msg: WebMsg;
  readonly: boolean;
};

const ChatMsg: React.FC<ChatMsgProp> = (props) => {
  const { msg, readonly } = props;
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const chatMsgStore = useStores('chatMsgStore');
  const linkAuxStore = useStores('linkAuxStore');
  const ideaStore = useStores('ideaStore');
  const channelStore = useStores('channelStore');

  const history = useHistory();

  const [matchKeywordList, setMatchKeywordList] = useState<string[]>([]);

  const msgRef = useRef<HTMLDivElement>(null);

  const goToDest = () => {
    if (msg.msg.basic_msg.link_type == MSG_LINK_TASK) {
      linkAuxStore.goToLink(
        new LinkTaskInfo('', msg.msg.project_id, msg.msg.basic_msg.link_dest_id),
        history,
      );
    } else if (msg.msg.basic_msg.link_type == MSG_LINK_BUG) {
      linkAuxStore.goToLink(
        new LinkBugInfo('', msg.msg.project_id, msg.msg.basic_msg.link_dest_id),
        history,
      );
    } else if (msg.msg.basic_msg.link_type == MSG_LINK_CHANNEL) {
      linkAuxStore.goToLink(
        new LinkChannelInfo('', msg.msg.project_id, msg.msg.basic_msg.link_dest_id, msg.msg.msg_id),
        history,
      );
    }
  };
  const setHover = (hover: boolean) => {
    if (msg.hovered != hover) {
      runInAction(() => (msg.hovered = hover));
    }
  };
  const getLinkType = (linkType: MSG_LINK_TYPE) => {
    if (linkType == MSG_LINK_BUG) {
      return "缺陷";
    } else if (linkType == MSG_LINK_TASK) {
      return "任务";
    } else if (linkType == MSG_LINK_CHANNEL) {
      return "频道";
    }
    return "";
  };

  useEffect(() => {
    if (!(msgRef.current != null && chatMsgStore.scrollTargetMsgId == msg.msg.msg_id)) {
      return;
    }
    for (const ts of [100, 200, 500, 1000]) {
      setTimeout(() => {
        if (msgRef.current != null && chatMsgStore.scrollTargetMsgId == msg.msg.msg_id) {
          msgRef.current.scrollIntoView(chatMsgStore.scrollTargetTop);
        }
      }, ts);
    }
  }, [msgRef, chatMsgStore.scrollTargetMsgId]);

  return (
    <>
      <div
        ref={msgRef}
        className={styles.chatItem}
        style={{ backgroundColor: chatMsgStore.replayTargetMsgId == msg.msg.msg_id ? "snow" : undefined }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div>
          <UserPhoto
            logoUri={msg.msg.sender_logo_uri ?? ''}
            width="32px"
            height="32px"
            style={{
              borderRadius: '20px',
              position: 'absolute',
              left: '16px',
              top: '10px',
            }}
          />
          <span className={styles.chatName}>{msg.msg.sender_display_name}</span>
          <span className={styles.chatTime}>{moment(msg.msg.send_time).format("YYYY-MM-DD HH:mm:ss")}</span>
          {msg.msg.has_update_time && (
            <>
              <span className={styles.chatName}>修改时间</span>
              <span className={styles.chatTime}>&nbsp;&nbsp;{moment(msg.msg.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            </>
          )}

          {!(channelStore.curChannel?.channelInfo.system_channel == true && channelStore.curChannel?.channelInfo.readonly == true) && matchKeywordList.length > 0 && (
            <Popover placement='left'
              title="相关知识点"
              trigger="hover"
              overlayStyle={{ width: 150 }}
              content={
                <div style={{ maxHeight: "calc(100vh - 300px)", padding: "10px 10px" }}>
                  {matchKeywordList.map(keyword => (
                    <Button key={keyword} type="link" style={{ minWidth: 0 }} onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", [keyword]), history);
                    }}>{keyword}</Button>
                  ))}
                </div>
              }>
              <BulbFilled style={{ color: "orange", paddingRight: "10px" }} />
            </Popover>
          )}
          {!(channelStore.curChannel?.channelInfo.system_channel == true && channelStore.curChannel?.channelInfo.readonly == true) && (
            <span className={styles.threadInfo} onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              chatMsgStore.replayTargetMsgId = msg.msg.msg_id;
              chatMsgStore.replayMsgCount = msg.msg.reply_count;
            }}>
              <Badge size="small" offset={[20, 7]} count={msg.msg.reply_count} color={msg.hovered ? "orange" : "#888"}>
                <CommentOutlined style={{ fontSize: "16px", color: msg.hovered ? "orange" : "#888" }} />
              </Badge>
            </span>
          )}
          {msg.msg.basic_msg.link_dest_id != "" && (
            <span className={styles.linkInfo}>
              来自{getLinkType(msg.msg.basic_msg.link_type)}:
              <a
                style={{ marginLeft: "10px" }}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  goToDest();
                }}><Space>{msg.msg.link_dest_title}<LinkOutlined /></Space></a>
            </span>
          )}
          {(!projectStore.isClosed) && msg.hovered && (
            <span className={styles.tools}>
              {readonly == false && msg.msg.sender_user_id == userStore.userInfo.userId && moment().diff(msg.msg.send_time) < (900 * 1000) && (<span
                title="修改"
                className={styles.editBtn}
                onClick={() => chatMsgStore.setEditMsg(msg)}
              />)}
              <span
                title="创建知识点"
                className={styles.ideaBtn}
                onClick={() => ideaStore.setShowCreateIdea("", msg.msg.basic_msg.msg_data)}
              />
              <span
                title="创建文档"
                className={styles.docBtn}
                onClick={() => linkAuxStore.goToCreateDoc(msg.msg.basic_msg.msg_data, projectStore.curProjectId, "", history)}
              />
              <span
                title="创建需求"
                className={styles.reqBtn}
                onClick={() => linkAuxStore.goToCreateRequirement(msg.msg.basic_msg.msg_data, projectStore.curProjectId, history)}
              />
              <span
                title="创建任务"
                className={styles.taskBtn}
                onClick={() => linkAuxStore.goToCreateTask(msg.msg.basic_msg.msg_data, projectStore.curProjectId, history)}
              />
              <span
                title="创建缺陷"
                className={styles.bugBtn}
                onClick={() => linkAuxStore.goToCreateBug(msg.msg.basic_msg.msg_data, projectStore.curProjectId, history)}
              />
            </span>
          )}
        </div>
        <div className='_readContext'>
          {channelStore.curChannel?.channelInfo.system_channel == true && channelStore.curChannel?.channelInfo.readonly == true && (
            <ReadOnlyEditor content={msg.msg.basic_msg.msg_data} />
          )}
          {!(channelStore.curChannel?.channelInfo.system_channel == true && channelStore.curChannel?.channelInfo.readonly == true) && (
            <ReadOnlyEditor content={msg.msg.basic_msg.msg_data} keywordList={ideaStore.keywordList} keywordCallback={(kwList) => {
              setMatchKeywordList(kwList);
            }} />
          )}

        </div>
      </div>
      {chatMsgStore.listRefMsgId == msg.msg.msg_id && (
        <div style={{ backgroundColor: "#E18160", position: "relative", textAlign: "center" }}>
          来自提到我的(关闭后查看更多信息)<CloseOutlined style={{ position: "absolute", right: "5px", top: "5px" }} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            chatMsgStore.listRefMsgId = '';
          }} />
          &nbsp;&nbsp;
        </div>
      )}
    </>
  );
};

export default observer(ChatMsg);
