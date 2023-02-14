import PasswordModal from '@/components/PasswordModal';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { USER_LOGIN_PATH, WORKBENCH_PATH } from '@/utils/constant';
import { useStores } from '@/hooks';
import Card from './components/Card';
import InfoCount from './components/InfoCount';
import Backlog from './components/Backlog';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import Record from './components/Record';
import { FieldTimeOutlined, IssuesCloseOutlined } from '@ant-design/icons';


const Workbench: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const [passwordModal, setPasswordModal] = useState(type === 'resetPassword');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const [totalMyIssueCount, setTotalMyIssueCount] = useState(0);

  useMemo(() => {
    projectStore.setCurProjectId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.workbench_wrap}>
      <Card className={s.infoCount_wrap} childStyle={{ height: '100%' }}>
        {!userStore.isResetPassword && <InfoCount total={totalMyIssueCount} />}
      </Card>
      <Tabs defaultActiveKey='myIssue' className={s.my_wrap} type="card">
        <Tabs.TabPane tab={<h2><IssuesCloseOutlined />&nbsp;我的待办</h2>} key="myIssue">
          <div className={s.content_wrap}>
            {!userStore.isResetPassword && <Backlog onChange={count => setTotalMyIssueCount(count)} />}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<h2><FieldTimeOutlined />&nbsp;我的工作记录</h2>} key="myEvent">
          <div className={s.content_wrap}>
            <Record />
          </div>
        </Tabs.TabPane>
      </Tabs>
      {/* <Card className={s.backlog_wrap} title="我的待办">
        
      </Card> */}
      {passwordModal && (
        <PasswordModal
          visible={passwordModal}
          type="resetPassword"
          onCancel={(bool) => {
            userStore.logout();
            if (userStore.isResetPassword) {
              history.push(USER_LOGIN_PATH);
            }
            setPasswordModal(bool);
          }}
          onSuccess={async () => {
            history.push(WORKBENCH_PATH);
            setPasswordModal(false);
          }}
        />
      )}
    </div>
  );
};

export default observer(Workbench);
