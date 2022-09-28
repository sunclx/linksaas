import React from 'react';
import ChannelPanel from './components/ChannelPanel';
// import ChannelHeader from './components/ChannelHeader';
import Chat from './components/Chat';
import { Layout } from 'antd';

import styles from './index.module.less';

const { Sider, Content } = Layout;

const Channel = () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        {/* <ChannelHeader /> */}
        <Chat />
      </Content>
      <Sider className={styles.sider}>
        <ChannelPanel />
      </Sider>
    </Layout>
  );
};

export default Channel;
