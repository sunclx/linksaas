import PasswordModal from '@/components/PasswordModal';
import { useState, useMemo } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH, USER_LOGIN_PATH, WORKBENCH_PATH } from '@/utils/constant';
import { useStores } from '@/hooks';
import Card from './components/Card';
import InfoCount from './components/InfoCount';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import { AppstoreOutlined, DoubleRightOutlined, FolderOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import UserAppList from './components/UserAppList';
import SetLocalRepoModal from './components/SetLocalRepoModal';
import LocalRepoList from './components/LocalRepoList';


const Workbench: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const [passwordModal, setPasswordModal] = useState(type === 'resetPassword');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const appStore = useStores('appStore');

  const tab = urlParams.get('tab') ?? "localRepo";

  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [repoDataVersion, setRepoDataVersion] = useState(0);

  useMemo(() => {
    projectStore.setCurProjectId('');
  }, []);

  return (
    <div className={s.workbench_wrap}>
      <Card className={s.infoCount_wrap} childStyle={{ height: '100%' }}>
        {!userStore.isResetPassword && <InfoCount />}
      </Card>
      <Tabs activeKey={tab} className={s.my_wrap} type="card"
        onChange={key => {
          history.push(`${WORKBENCH_PATH}?tab=${key}`);
        }}
        tabBarExtraContent={
          <div>
            {tab == "userApp" && (
              <Button
                type="link"
                style={{ marginRight: "20px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  history.push(`${PUB_RES_PATH}?tab=appStore`);
                }}>前往应用市场<DoubleRightOutlined /></Button>
            )}
            {tab == "localRepo" && (
              <Button style={{ marginRight: "20px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowAddRepoModal(true);
              }}>
                添加本地仓库
              </Button>
            )}
          </div>
        }>
        <Tabs.TabPane tab={<h2><FolderOutlined />本地仓库</h2>} key="localRepo">
          {tab == "localRepo" && (
            <div className={s.content_wrap}>
              <LocalRepoList repoVersion={repoDataVersion} onChange={() => setRepoDataVersion(repoDataVersion + 1)} />
            </div>
          )}
        </Tabs.TabPane>
        {appStore.clientCfg?.enable_pub_app_store == true && (
          <Tabs.TabPane tab={<h2><AppstoreOutlined />我的微应用</h2>} key="userApp">
            {tab == "userApp" && (
              <div className={s.content_wrap}>
                <UserAppList />
              </div>
            )}
          </Tabs.TabPane>
        )}
      </Tabs>
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
      {showAddRepoModal == true && (
        <SetLocalRepoModal onCancel={() => setShowAddRepoModal(false)} onOk={() => {
          setRepoDataVersion(repoDataVersion + 1);
          setShowAddRepoModal(false);
        }} />
      )}
    </div>
  );
};

export default observer(Workbench);
