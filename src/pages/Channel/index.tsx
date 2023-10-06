import React, { useEffect, useState } from 'react';
import Chat from './components/Chat';
import { Collapse, Layout, Popover, Space } from 'antd';
import { observer } from 'mobx-react';
import styles from './index.module.less';
import { useStores } from '@/hooks';
import ChannelList from './components/ChannelList';
import ActionMember, { ActionMemberType } from './components/ActionMember';
import { RenderMoreMenu } from './components/ChannelPanel';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import ReplayMsgList from './components/ReplayMsgList';

const { Sider, Content } = Layout;

const Channel = () => {
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');
  const chatMsgStore = useStores('chatMsgStore');
  const [activeKey, setActiveKey] = useState("channel");

  useEffect(() => {
    if (chatMsgStore.replayTargetMsgId != "") {
      setActiveKey("msgThread");
    } else {
      setActiveKey("channel");
    }
  }, [projectStore.curProjectId, channelStore.filterChannelList, chatMsgStore.replayTargetMsgId]);

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Chat />
      </Content>
      <Sider className={styles.sider}>
        <Collapse accordion activeKey={activeKey} className={styles.panel} bordered={false} onChange={key => setActiveKey(key as string)}>
          <Collapse.Panel key="channel" header="频道列表" extra={
            <div className={styles.header}>
              {!projectStore.isClosed && (
                <a className={styles.add} onClick={() => channelStore.showCreateChannel = true}>
                  <i className={styles.icon} />
                </a>
              )}
              <Popover
                placement="bottomLeft"
                content={<RenderMoreMenu />}
                overlayClassName="popover"
              >
                <a className={styles.more} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}>
                  <i className={styles.icon} />
                </a>
              </Popover>
              {channelStore.showCreateChannel && (
                <ActionMember
                  visible
                  type={ActionMemberType.CREATE_CHANNEL}
                  channelId=""
                  onChange={(value: boolean) => channelStore.showCreateChannel = value}
                  title="创建自定义频道"
                />
              )}
            </div>
          }>
            <ChannelList />
          </Collapse.Panel>
          <Collapse.Panel header="消息会话" key="msgThread" extra={
            <Space size="large">
              <EyeOutlined style={{ color: "#777", fontSize: "14px", width: "14px", height: "14px", padding: "3px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                chatMsgStore.setScrollTarget(chatMsgStore.replayTargetMsgId, true);
              }} title='定位消息' />
              <CloseOutlined style={{ color: "#777", fontSize: "14px", width: "14px", height: "14px", padding: "3px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                chatMsgStore.replayTargetMsgId = "";
              }} title='退出消息会话' />
            </Space>
          }>
            <ReplayMsgList />
          </Collapse.Panel>
        </Collapse>
      </Sider>
    </Layout>
  );
};

export default observer(Channel);
