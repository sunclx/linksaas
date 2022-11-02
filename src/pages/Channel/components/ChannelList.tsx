import React, { useState } from 'react';
import { useStores } from '@/hooks';
import styles from './ChannelList.module.less';
import { observer } from 'mobx-react';
import {
  close as close_channel,
  open as open_channel,
  set_top,
  unset_top,
  join_by_admin,
  remove_by_admin,
  leave as leave_channel,
  LIST_CHAN_SCOPE_INCLUDE_ME,
  LIST_CHAN_SCOPE_ORPHAN
} from '@/api/project_channel';
import { request } from '@/utils/request';
import type { WebChannelInfo } from '@/stores/channel';
import { Modal, Popover } from 'antd';
import ActionMember, { ActionMemberType } from './ActionMember';


const ChannelList = observer(() => {
  const channelStore = useStores('channelStore');
  const chatMsgStore = useStores('chatMsgStore');
  const { sessionId } = useStores('userStore');
  const { curProjectId } = useStores('projectStore');
  const [closeChannelId, setCloseChannelId] = useState("");
  const [exitChannelId, setExitChannelId] = useState("");
  const [updateChannelId, setUpdateChannelId] = useState("");
  const [joinChannelId, setJoinChannelId] = useState("");
  const [removeChannelId, setRemoveChannelId] = useState("");
  const [hoverChannelId, setHoverChannelId] = useState("");

  // 右键菜单
  const genMoreMenu = (channelId: string): JSX.Element => {
    const channelItem = channelStore.getChannel(channelId);
    const permission = {
      canSetTop: channelItem?.channelInfo.user_channel_perm?.can_set_top,
      canUpdate: channelItem?.channelInfo.user_channel_perm?.can_update,
      canExit: channelItem?.channelInfo.user_channel_perm?.can_leave,
      canClose: channelItem?.channelInfo.user_channel_perm?.can_close,
      canOpen: channelItem?.channelInfo.user_channel_perm?.can_open,
      canRemove: channelItem?.channelInfo.user_channel_perm?.can_remove,
    }

    // 置顶频道
    const setTopChannel = async (topWeight: number): Promise<void> => {
      if (channelItem !== undefined) {
        if (topWeight > 0) {
          await request(unset_top(sessionId, curProjectId, channelItem.channelInfo.channel_id));
        } else {
          await request(set_top(sessionId, curProjectId, channelItem.channelInfo.channel_id));
        }
        await channelStore.updateChannel(channelItem.channelInfo.channel_id)
      }
    }

    //激活频道
    const openChannel = async () => {
      const res = await request(open_channel(sessionId, curProjectId, channelId));
      if (res) {
        channelStore.updateChannel(channelId);
      }
    }

    // 退出频道
    const exitChannel = () => {
      if (!permission.canExit) return;
      setExitChannelId(channelId);
    }

    // 关闭频道
    const closeChannel = () => {
      if (!permission.canClose) return;
      setCloseChannelId(channelId);
    }


    //更新频道
    const updateChannel = () => {
      if (!permission.canUpdate) return;
      setUpdateChannelId(channelId);
    }
    const joinChannel = () => {
      setJoinChannelId(channelId);
    }

    const removeChannel = () => {
      setRemoveChannelId(channelId);
    }

    if (channelItem?.channelInfo.system_channel) {
      return (<div />);
    }
    return (
      <div
        className={styles.contextmenu}
      >
        {channelStore.channelScope == LIST_CHAN_SCOPE_INCLUDE_ME && (
          <>
            <div
              className={styles.item + ' ' + (permission.canUpdate ? '' : styles.disabled)}
              onClick={() => updateChannel()}
            >
              修改频道
            </div>
            <div className={styles.divider} />
            <div
              className={styles.item + ' ' + (permission.canSetTop ? '' : styles.disabled)}
              onClick={() => setTopChannel(channelItem?.channelInfo.top_weight || 0)}
            >
              {(channelItem?.channelInfo.top_weight || 0) > 0 ? '取消置顶' : '置顶频道'}
            </div>
          </>
        )}
        {channelStore.channelScope == LIST_CHAN_SCOPE_INCLUDE_ME && (
          <>
            <div className={styles.divider} />
            <div
              className={styles.item + ' ' + (permission.canExit ? '' : styles.disabled)}
              onClick={() => exitChannel()}
            >
              退出频道
            </div>
            <div
              className={styles.item + ' ' + (permission.canClose ? '' : styles.disabled)}
              onClick={() => closeChannel()}
            >
              关闭频道
            </div>
            <div
              className={styles.item + ' ' + (permission.canOpen ? '' : styles.disabled)}
              onClick={() => openChannel()}
            >
              激活频道
            </div>
          </>
        )}

        {channelStore.channelScope != LIST_CHAN_SCOPE_INCLUDE_ME && (
          <div
            className={styles.item}
            onClick={() => joinChannel()}
          >
            加入频道
          </div>
        )}
        {channelStore.channelScope == LIST_CHAN_SCOPE_ORPHAN && (
          <>
            <div className={styles.divider} />
            <div
              className={styles.item}
              style={{ color: "red" }}
              onClick={() => removeChannel()}
            >
              删除频道
            </div>
          </>
        )}



      </div>);
  };

  return (
    <div className={styles.menu} onMouseOut={e => {
      e.stopPropagation();
      e.preventDefault();
      setHoverChannelId("");
    }}>
      {channelStore.channelList.length > 0 && channelStore.filterChannelList.map((item: WebChannelInfo) => {
        return (
          <div
            className={
              styles.menu_item + ' ' +
              (item.channelInfo.closed ? styles.closed : '') + ' ' +
              (item.channelInfo.channel_id == channelStore.curChannelId ? styles.current : '')
            }
            onClick={() => {
              chatMsgStore.listRefMsgId = "";
              chatMsgStore.replayRefMsgId = "";
              channelStore.curChannelId = item.channelInfo.channel_id;
            }}
            key={item.channelInfo.channel_id}
            onMouseOver={e => {
              e.stopPropagation();
              e.preventDefault();
              setHoverChannelId(item.channelInfo.channel_id);
            }}
          >
            <div className={styles.menu_box}>
              <div className={styles.menu_title + ' ' + (item.channelInfo.system_channel ? styles.system : '')}>{`#${item.channelInfo.basic_info.channel_name}`}</div>
              <Popover content={genMoreMenu(item.channelInfo.channel_id)} placement="left">
                {hoverChannelId == item.channelInfo.channel_id && !item.channelInfo.system_channel &&<i className={styles.more} />}
              </Popover>

            </div>
            {item.unreadMsgCount > 0 && (
              <div className={styles.menu_news}>
                {item.unreadMsgCount > 999 ? '999+' : Math.floor(item.unreadMsgCount)}
              </div>
            )}
          </div>
        )
      }
      )}

      {closeChannelId != "" && <Modal
        title='警告'
        open={true}
        onOk={async (): Promise<void> => {
          const res = await request(close_channel(sessionId, curProjectId, closeChannelId));
          if (res) {
            channelStore.updateChannel(closeChannelId);
          }
          setCloseChannelId("");
        }}
        onCancel={() => {
          setCloseChannelId("");
        }}
        okText='关闭频道'
      >
        <p>是否确认关闭当前频道？关闭后此频道聊天记录会保留</p>
      </Modal>
      }

      {exitChannelId != "" && <Modal
        title='警告'
        open={true}
        onOk={async (): Promise<void> => {
          const res = await request(leave_channel(sessionId, curProjectId, exitChannelId));
          if (res) {
            channelStore.removeChannel(exitChannelId);
          }
          setExitChannelId("");
        }}
        onCancel={() => {
          setExitChannelId("");
        }}
        okText='退出频道'
      >
        <p>是否确认退出当前频道？</p>
      </Modal>}

      {joinChannelId != "" && <Modal
        title='警告'
        open={true}
        onOk={async (): Promise<void> => {
          const res = await request(join_by_admin(sessionId, curProjectId, joinChannelId));
          if (res) {
            channelStore.removeChannel(joinChannelId);
          }
          setJoinChannelId("");
        }}
        onCancel={() => {
          setJoinChannelId("");
        }}
        okText='加入频道'
      >
        <p>是否确认加入当前频道？</p>
      </Modal>}

      {updateChannelId != "" && <ActionMember
        visible={true}
        type={ActionMemberType.UPDATE_CHANNEL}
        channelId={updateChannelId}
        onChange={(value: boolean) => {
          if (!value) {
            setUpdateChannelId("");
          }
        }}
        title="更新频道"
      />}

      {removeChannelId != "" && (
        <Modal
          title="删除频道"
          open={true}
          onCancel={() => {
            setRemoveChannelId("");
          }}
          onOk={async (): Promise<void> => {
            const res = await request(remove_by_admin(sessionId, curProjectId, removeChannelId));
            if (res) {
              channelStore.removeChannel(removeChannelId);
            }
            setRemoveChannelId("");
          }}>
          <p>是否确认删除频道 {channelStore.getChannel(removeChannelId)?.channelInfo.basic_info.channel_name ?? ""}？</p>
          <p style={{ color: "red" }}>频道删除后将不能再恢复。</p>
        </Modal>
      )}
    </div>
  );
});

export default ChannelList;
