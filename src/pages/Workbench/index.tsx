import PasswordModal from '@/components/PasswordModal';
import { useState, useMemo } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH, WORKBENCH_PATH } from '@/utils/constant';
import { useStores } from '@/hooks';
import Card from './components/Card';
import InfoCount from './components/InfoCount';
import { Popover, Space, Tabs } from 'antd';
import { observer } from 'mobx-react';
import { AppstoreOutlined, DoubleRightOutlined, FolderOutlined, MoreOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import UserAppList from './components/UserAppList';
import LocalRepoList from './components/LocalRepoList';
import AddRepoModal from './components/AddRepoModal';
import ResetDevModal from './components/ResetDevModal';


const Workbench: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const [passwordModal, setPasswordModal] = useState(type === 'resetPassword');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const tab = urlParams.get('tab') ?? "localRepo";

  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [repoDataVersion, setRepoDataVersion] = useState(0);
  const [showResetDevModal, setShowResetDevModal] = useState(false);

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
              <Space>
                <Button style={{ marginRight: "20px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowAddRepoModal(true);
                }}>
                  添加代码仓库
                </Button>
                <Popover trigger="click" placement="bottom" content={
                  <div style={{ padding: "10px 10px" }}>
                    <Button type="link" onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowResetDevModal(true);
                    }}>重置研发环境</Button>
                  </div>
                }>
                  <MoreOutlined style={{ marginRight: "32px" }} />
                </Popover>
              </Space>
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

        <Tabs.TabPane tab={<h2><AppstoreOutlined />我的微应用</h2>} key="userApp">
          {tab == "userApp" && (
            <div className={s.content_wrap}>
              <UserAppList />
            </div>
          )}
        </Tabs.TabPane>

      </Tabs>
      {passwordModal && (
        <PasswordModal
          visible={passwordModal}
          type="resetPassword"
          onCancel={(bool) => {
            userStore.logout();
            if (userStore.isResetPassword) {
              history.push("/");
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
        <AddRepoModal onCancel={() => setShowAddRepoModal(false)} onOk={() => {
          setRepoDataVersion(repoDataVersion + 1);
          setShowAddRepoModal(false);
        }} />
      )}
      {showResetDevModal == true && (
        <ResetDevModal onClose={() => setShowResetDevModal(false)} />
      )}
    </div>
  );
};

export default observer(Workbench);
