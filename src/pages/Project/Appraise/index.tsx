import React, { useEffect,useState } from 'react';
import CardWrap from '@/components/CardWrap';
import { Tabs } from 'antd';
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
  const userStore = useStores('userStore');
  const appraiseStore  = useStores('appraiseStore');

  const [isAdmin,setIsAdmin] = useState(false);

  const localStore = useLocalObservable(() => ({
    showCreateModal: false,
    setShowCreateModal(isShow: boolean): void {
      this.showCreateModal = isShow;
    }
  }))

  useEffect(() => {
    memberStore.memberList.forEach(item => {
      if (item.member.member_user_id == userStore.userInfo.userId && item.member.can_admin) {
        setIsAdmin(true);
      }
    });
    if (isAdmin) {
      appraiseStore.loadAllRecord(appraiseStore.myCurPage);
      appraiseStore.loadUserScore();
    } 
    appraiseStore.loadMyRecord(appraiseStore.myCurPage);
  })

  // tab
  const renderTabs = () => {
    return <Tabs defaultActiveKey="1" className={styles.tabs}>
      <TabPane className={styles.tab_pane} tab="我的评估" key="1">
        <AppraiseRecordList adminMode={false} />
      </TabPane>
      {isAdmin && (<TabPane className={styles.tab_pane} tab="全部评估" key="2">
        <AppraiseRecordList adminMode={true} />
      </TabPane>)}
      {isAdmin && (<TabPane className={styles.tab_pane} tab="总评表" key="3">
        <AppraiseList />
      </TabPane>)}
    </Tabs>
  }

  // 发起互评
  const create = () => {
    localStore.setShowCreateModal(true);
  }

  return (
    <CardWrap>

      <div className={styles.wrap}>

        <div className={styles.title}>
          <h2>成员互评</h2>
          <Button type="primary" onClick={() => create()} disabled={memberStore.memberList.length < 2}>
            发起互评
          </Button>
        </div>

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
