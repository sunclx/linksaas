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
import { Modal } from 'antd';
import ActionMember, { ActionMemberType } from './ActionMember';

type ContextMenuConfig = {
  x: number;
  y: number;
  isShow: boolean;
  channelId: string;
}

const ChannelList = observer(() => {
  const channelStore = useStores('channelStore');
  const chatMsgStore = useStores('chatMsgStore');
  const { sessionId } = useStores('userStore');
  const { curProjectId } = useStores('projectStore');
  const [contextMenuCfg, setContextMenuConfig] = useState({ x: 0, y: 0, isShow: false, channelId: '' } as ContextMenuConfig)
  const [showModalClose, setShowModalClose] = useState(false);
  const [showModalExit, setShowModalExit] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalJoin, setShowModalJoin] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

  // 右键菜单
  const handleContextMenu = (event: React.MouseEvent<Element, MouseEvent>, channelId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const { clientX, clientY } = event;

    setContextMenuConfig({
      x: clientX,
      y: clientY,
      isShow: true,
      channelId: channelId
    })
  }

  // 关闭右键菜单
  const hideContextMenu = () => {
    if (contextMenuCfg.isShow) {
      setContextMenuConfig({
        ...contextMenuCfg,
        isShow: false,
      })
    }
  }

  // 右键菜单
  const ContextMenu = (): JSX.Element => {
    const channelItem = channelStore.getChannel(contextMenuCfg.channelId);
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
      const res = await request(open_channel(sessionId, curProjectId, contextMenuCfg.channelId));
      if (res) {
        channelStore.updateChannel(contextMenuCfg.channelId);
      }
    }

    // 退出频道
    const exitChannel = () => {
      if (!permission.canExit) return;
      setShowModalExit(true);
    }

    // 关闭频道
    const closeChannel = () => {
      if (!permission.canClose) return;
      setShowModalClose(true);
    }


    //更新频道
    const updateChannel = () => {
      if (!permission.canUpdate) return;
      setShowModalUpdate(true);
    }
    const joinChannel = () => {
      setShowModalJoin(true);
    }

    const removeChannel = () => {
      setShowModalRemove(true);
    }

    if (channelItem?.channelInfo.system_channel) {
      return (<div />);
    }
    return (<div
      className={styles.contextmenu_box + ' ' + (contextMenuCfg.isShow ? styles.show : '')}
      onClick={hideContextMenu}
      onContextMenu={hideContextMenu}
    >
      <div
        className={styles.contextmenu}
        style={{ top: contextMenuCfg.y, left: contextMenuCfg.x }}
        onMouseLeave={hideContextMenu}
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


      </div>
    </div>);
  };

  return (
    <div className={styles.menu}>
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
            onContextMenu={(e: React.MouseEvent<Element, MouseEvent>) => handleContextMenu(e, item.channelInfo.channel_id)}
            key={item.channelInfo.channel_id}
          >
            <div className={styles.menu_box}>
              <div className={styles.menu_title + ' ' + (item.channelInfo.system_channel ? styles.system : '')}>{`#${item.channelInfo.basic_info.channel_name}`}</div>
              {/* 逻辑待更新 */}
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
      {/* 右键菜单 */}
      {contextMenuCfg.isShow && <ContextMenu />}
      {showModalClose && <Modal
        title='警告'
        visible={showModalClose}
        onOk={async (): Promise<void> => {
          const res = await request(close_channel(sessionId, curProjectId, contextMenuCfg.channelId));
          if (res) {
            channelStore.updateChannel(contextMenuCfg.channelId);
          }
          setShowModalClose(false);
        }}
        onCancel={() => {
          setShowModalClose(false)
        }}
        okText='关闭频道'
      >
        <p>是否确认关闭当前频道？关闭后此频道聊天记录会保留</p>
      </Modal>
      }

      {showModalExit && <Modal
        title='警告'
        open={showModalExit}
        onOk={async (): Promise<void> => {
          const res = await request(leave_channel(sessionId, curProjectId, contextMenuCfg.channelId));
          if (res) {
            channelStore.removeChannel(contextMenuCfg.channelId);
          }
          setShowModalExit(false);
        }}
        onCancel={() => {
          setShowModalExit(false)
        }}
        okText='退出频道'
      >
        <p>是否确认退出当前频道？</p>
      </Modal>}

      {showModalJoin && <Modal
        title='警告'
        open={showModalJoin}
        onOk={async (): Promise<void> => {
          const res = await request(join_by_admin(sessionId, curProjectId, contextMenuCfg.channelId));
          if (res) {
            channelStore.removeChannel(contextMenuCfg.channelId);
          }
          setShowModalJoin(false);
        }}
        onCancel={() => {
          setShowModalJoin(false);
        }}
        okText='加入频道'
      >
        <p>是否确认加入当前频道？</p>
      </Modal>}

      {showModalUpdate && <ActionMember
        visible={showModalUpdate}
        type={ActionMemberType.UPDATE_CHANNEL}
        channelId={contextMenuCfg.channelId}
        onChange={(value: boolean) => setShowModalUpdate(value)}
        title="更新频道"
      />}

      {showModalRemove && (
        <Modal
          title="删除频道"
          open={showModalRemove}
          onCancel={() => {
            setShowModalRemove(false);
          }}
          onOk={async (): Promise<void> => {
            const res = await request(remove_by_admin(sessionId, curProjectId, contextMenuCfg.channelId));
            if (res) {
              channelStore.removeChannel(contextMenuCfg.channelId);
            }
            setShowModalRemove(false);
          }}>
          <p>是否确认删除频道 {channelStore.getChannel(contextMenuCfg.channelId)?.channelInfo.basic_info.channel_name ?? ""}？</p>
          <p style={{ color: "red" }}>频道删除后将不能再恢复。</p>
        </Modal>
      )}
    </div>
  );
});

export default ChannelList;
