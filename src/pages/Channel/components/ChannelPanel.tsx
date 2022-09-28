import React, { useState } from 'react';
import styles from './ChannelPanel.module.less';
import * as channelApi from '@/api/project_channel';
import { Popover, Divider } from 'antd';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import ActionMember, { ActionMemberType } from './ActionMember';
import ChannelList from './ChannelList';
import { runInAction } from 'mobx';
import { CHANNEL_STATE } from '@/stores/channel';

const RenderMoreMenu = observer(() => {
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');

  return (
    <div className={styles.moremenu}>
      <div>
        <Divider orientation="left" style={{ margin: '10px 0' }}>
          <b style={{ fontSize: '14px' }}>频道状态</b>
        </Divider>
        <div
          className={
            styles.item +
            ' ' +
            (channelStore.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_ALL
              ? styles.selected
              : '')
          }
          onClick={() => {
            runInAction(() => {
              runInAction(() => {
                if (channelStore.filterChanelState != CHANNEL_STATE.CHANNEL_STATE_ALL) {
                  channelStore.filterChanelState = CHANNEL_STATE.CHANNEL_STATE_ALL;
                }
              });
            });
          }}
        >
          不限
        </div>
        <div
          className={
            styles.item +
            ' ' +
            (channelStore.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_OPEN
              ? styles.selected
              : '')
          }
          onClick={() => {
            runInAction(() => {
              if (channelStore.filterChanelState != CHANNEL_STATE.CHANNEL_STATE_OPEN) {
                channelStore.filterChanelState = CHANNEL_STATE.CHANNEL_STATE_OPEN;
              }
            });
          }}
        >
          激活状态
        </div>
        <div
          className={
            styles.item +
            ' ' +
            (channelStore.filterChanelState == CHANNEL_STATE.CHANNEL_STATE_CLOSE
              ? styles.selected
              : '')
          }
          onClick={() => {
            runInAction(() => {
              runInAction(() => {
                if (channelStore.filterChanelState != CHANNEL_STATE.CHANNEL_STATE_CLOSE) {
                  channelStore.filterChanelState = CHANNEL_STATE.CHANNEL_STATE_CLOSE;
                }
              });
            });
          }}
        >
          关闭状态
        </div>
      </div>
      {projectStore.curProject?.user_project_perm.can_admin && (
        <div>
          <Divider orientation="left" style={{ margin: '10px 0' }}>
            <b style={{ fontSize: '14px' }}>频道范围</b>
          </Divider>

          <div
            className={
              styles.item +
              ' ' +
              (channelStore.channelScope == channelApi.LIST_CHAN_SCOPE_INCLUDE_ME
                ? styles.selected
                : '')
            }
            onClick={() =>
              channelStore.loadChannelList(
                projectStore.curProjectId,
                channelApi.LIST_CHAN_SCOPE_INCLUDE_ME,
              )
            }
          >
            已加入频道
          </div>
          <div
            className={
              styles.item +
              ' ' +
              (channelStore.channelScope == channelApi.LIST_CHAN_SCOPE_WITHOUT_ME
                ? styles.selected
                : '')
            }
            onClick={() =>
              channelStore.loadChannelList(
                projectStore.curProjectId,
                channelApi.LIST_CHAN_SCOPE_WITHOUT_ME,
              )
            }
          >
            未加入频道
          </div>
          <div
            className={
              styles.item +
              ' ' +
              (channelStore.channelScope == channelApi.LIST_CHAN_SCOPE_ORPHAN
                ? styles.selected
                : '')
            }
            onClick={() =>
              channelStore.loadChannelList(
                projectStore.curProjectId,
                channelApi.LIST_CHAN_SCOPE_ORPHAN,
              )
            }
          >
            无人频道
          </div>
        </div>
      )}
    </div>
  );
});

const RenderHeader = observer(() => {
  const [showAddChannel, setShowAddChannel] = useState(false);

  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');

  return (
    <header className={styles.header}>
      <h3 className={styles.title}>频道列表</h3>
      {projectStore.curProject?.closed == false &&
        channelStore.channelScope == channelApi.LIST_CHAN_SCOPE_INCLUDE_ME && (
          <a className={styles.add} onClick={() => setShowAddChannel(true)}>
            <i className={styles.icon} />
          </a>
        )}
      <Popover
        placement="bottomLeft"
        content={<RenderMoreMenu />}
        transitionName=""
        overlayClassName="popover"
      >
        <a className={styles.more}>
          <i className={styles.icon} />
        </a>
      </Popover>
      {showAddChannel && (
        <ActionMember
          visible={showAddChannel}
          type={ActionMemberType.CREATE_CHANNEL}
          channelId=""
          onChange={(value: boolean) => setShowAddChannel(value)}
          title="创建自定义频道"
        />
      )}
    </header>
  );
});

const ChannelPanel = () => {
  return (
    <div className={styles.list}>
      <RenderHeader />
      <ChannelList />
    </div>
  );
};

export default observer(ChannelPanel);
