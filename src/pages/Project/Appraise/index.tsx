import React, { useEffect } from 'react';
import CardWrap from '@/components/CardWrap';
import { Space, Tabs } from 'antd';
import Button from '@/components/Button';
import styles from './index.module.less';
import { observer, useLocalObservable } from 'mobx-react';
import AppraiseList from './components/AppraiseScoreList';
import AppraiseRecordList from './components/AppraiseRecordList';
import { useStores } from '@/hooks';
import CreateAppraise from './components/CreateAppraise';


const { TabPane } = Tabs;


const Appraise: React.FC = observer(() => {
  const memberStore = useStores('memberStore');
  const appraiseStore = useStores('appraiseStore');
  const projectStore = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    showCreateModal: false,
    setShowCreateModal(isShow: boolean): void {
      this.showCreateModal = isShow;
    }
  }))

  useEffect(() => {
    if (projectStore.isAdmin) {
      appraiseStore.loadAllRecord(appraiseStore.myCurPage);
      appraiseStore.loadUserScore();
    }
    appraiseStore.loadMyRecord(appraiseStore.myCurPage);
  }, [projectStore.isAdmin]);

  // tab
  const renderTabs = () => {
    return <Tabs defaultActiveKey="1" className={styles.tabs}>
      <TabPane className={styles.tab_pane} tab="我的评估" key="1">
        <AppraiseRecordList adminMode={false} />
      </TabPane>
      {projectStore.isAdmin && (<TabPane className={styles.tab_pane} tab="全部评估" key="2">
        <AppraiseRecordList adminMode={true} />
      </TabPane>)}
      {projectStore.isAdmin && (<TabPane className={styles.tab_pane} tab="总评表" key="3">
        <AppraiseList />
      </TabPane>)}
    </Tabs>
  }

  // 发起互评
  const create = () => {
    localStore.setShowCreateModal(true);
  }

  return (
    <CardWrap title="成员互评" extra={
      <Space>
        <Button type="primary" onClick={() => create()} disabled={memberStore.memberList.length < 2}>
            发起互评
          </Button>
      </Space>
    }>
      <div className={styles.wrap}>
        {renderTabs()}
      </div>

      {localStore.showCreateModal && <CreateAppraise
        visible={localStore.showCreateModal}
        onChange={(value: boolean) => localStore.setShowCreateModal(value)}
      />}
    </CardWrap>
  );
});
export default Appraise;
