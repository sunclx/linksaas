import React, { useEffect, useState } from 'react';
import Chat from './components/Chat';
import { Collapse, Layout, Popover } from 'antd';
import { observer } from 'mobx-react';
import styles from './index.module.less';
import { useStores } from '@/hooks';
import ChannelList from './components/ChannelList';
import ActionMember, { ActionMemberType } from './components/ActionMember';
import { RenderMoreMenu } from './components/ChannelPanel';
import { SettingOutlined } from '@ant-design/icons';
import AiAssistantList from './components/AiAssistantList';
import { PROJECT_CHAT_TYPE, PROJECT_SETTING_TAB } from '@/utils/constant';
import AiAssistant from './components/AiAssistant';

const { Sider, Content } = Layout;

const ChannelAndAi = () => {
  const projectStore = useStores('projectStore');
  const channelStore = useStores('channelStore');
  const [activeKey, setActiveKey] = useState("channel");

  useEffect(() => { 
    setActiveKey("channel");
  }, [projectStore.curProjectId, channelStore.filterChannelList]);

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        {projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_AI && <AiAssistant />}
        {projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_CHANNEL && <Chat />}
      </Content>
      <Sider className={styles.sider}>
        <Collapse accordion activeKey={activeKey} className={styles.panel} bordered={false} onChange={key => setActiveKey(key as string)}>
          <Collapse.Panel key="channel" header="频道列表" extra={
            <div className={styles.header}>
              <a className={styles.add} onClick={() => channelStore.showCreateChannel = true}>
                <i className={styles.icon} />
              </a>
              <Popover
                placement="bottomLeft"
                content={<RenderMoreMenu />}
                transitionName=""
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
          <Collapse.Panel header="AI助理" key="ai" extra={
            <div className={styles.header}>
              {projectStore.isAdmin && (
                <SettingOutlined style={{ color: "#777", fontSize: "14px", width: "14px", height: "14px", padding: "3px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_AI;
                }} />
              )}
            </div>
          }>
            <AiAssistantList />
          </Collapse.Panel>
        </Collapse>
      </Sider>
    </Layout>
  );
};

export default observer(ChannelAndAi);
