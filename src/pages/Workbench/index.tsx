import PasswordModal from '@/components/PasswordModal';
import { useEffect } from 'react';
import { useState, useMemo } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH, USER_LOGIN_PATH, WORKBENCH_KB_DOC_SUFFIX, WORKBENCH_PATH, filterProjectItemList } from '@/utils/constant';
import { useStores } from '@/hooks';
import Card from './components/Card';
import InfoCount from './components/InfoCount';
import Backlog from './components/Backlog';
import { Select, Space, Tabs } from 'antd';
import { observer } from 'mobx-react';
import Record from './components/Record';
import { AppstoreOutlined, BookOutlined, DoubleRightOutlined, FieldTimeOutlined, FolderOutlined, IssuesCloseOutlined, ProjectOutlined } from '@ant-design/icons';
import UserDocSpaceList from '../UserExtend/UserKb/UserDocSpaceList';
import Button from '@/components/Button';
import type { KbSpaceInfo } from '@/api/user_kb';
import type { UserDocState } from '../UserExtend/UserKb/UserDoc';
import { runInAction } from 'mobx';
import MyProjectList from './components/MyProjectList';
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

  let tab = urlParams.get('tab');
  if (tab == null) {
    tab = "myProject";
  }
  const userAction = urlParams.get("userAction");
  const spaceId = urlParams.get("spaceId");

  const [totalMyIssueCount, setTotalMyIssueCount] = useState(0);
  const [activeKey, setActiveKey] = useState(tab);
  const [curKbSpace, setCurKbSpace] = useState<KbSpaceInfo | null>(null);
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [repoDataVersion, setRepoDataVersion] = useState(0);

  useMemo(() => {
    projectStore.setCurProjectId('');
  }, []);

  useEffect(() => {
    if (userAction == null) {
      if (projectStore.projectList.length == 0) {
        setActiveKey("myProject");
      } else {
        setActiveKey("myIssue");
      }
    } else {
      if (tab != null) {
        setActiveKey(tab);
      }
    }
  }, [projectStore.projectList, location.search]);

  return (
    <div className={s.workbench_wrap}>
      <Card className={s.infoCount_wrap} childStyle={{ height: '100%' }}>
        {!userStore.isResetPassword && <InfoCount total={totalMyIssueCount} />}
      </Card>
      <Tabs activeKey={activeKey} className={s.my_wrap} type="card"
        onChange={key => {
          setCurKbSpace(null);
          history.push(`${WORKBENCH_PATH}?tab=${key}&userAction=true`);
        }}
        tabBarExtraContent={
          <div>
            {activeKey == "myProject" && (
              <Space size="small">
                <Button onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  appStore.showCreateOrJoinProject = true;
                }}>创建/加入项目</Button>
                <Select value={projectStore.filterProjectType} style={{ width: "100px", marginLeft: "20px", marginRight: "20px" }}
                  onSelect={value => {
                    runInAction(() => {
                      projectStore.filterProjectType = value;
                    });
                  }}>
                  {filterProjectItemList.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>
              </Space>
            )}
            {activeKey == "userDoc" && (
              <Button style={{ marginRight: "20px" }}
                disabled={curKbSpace == null}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (curKbSpace == null) {
                    return;
                  }
                  const state: UserDocState = {
                    spaceId: curKbSpace.space_id,
                    sshPubKey: curKbSpace.ssh_pub_key,
                    docId: "",
                    readMode: false,
                  };
                  history.push(WORKBENCH_KB_DOC_SUFFIX, state);
                }}>创建文档</Button>
            )}
            {activeKey == "userApp" && (
              <Button
                type="link"
                style={{ marginRight: "20px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  history.push(`${PUB_RES_PATH}?tab=appStore`);
                }}>前往应用市场<DoubleRightOutlined /></Button>
            )}
            {activeKey == "localRepo" && (
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
        {projectStore.projectList.length > 0 && (
          <Tabs.TabPane tab={<h2><IssuesCloseOutlined />我的待办</h2>} key="myIssue">
            {activeKey == "myIssue" && (
              <div className={s.content_wrap}>
                {!userStore.isResetPassword && <Backlog onChange={count => setTotalMyIssueCount(count)} />}
              </div>
            )}
          </Tabs.TabPane>
        )}
        {projectStore.projectList.length > 0 && (
          <Tabs.TabPane tab={<h2><FieldTimeOutlined />我的工作记录</h2>} key="myEvent">
            {activeKey == "myEvent" && (
              <div className={s.content_wrap}>
                <Record />
              </div>
            )}
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab={<h2><FolderOutlined />本地仓库</h2>} key="localRepo">
          {activeKey == "localRepo" && (
            <div className={s.content_wrap}>
              <LocalRepoList repoVersion={repoDataVersion} onChange={() => setRepoDataVersion(repoDataVersion + 1)} />
            </div>
          )}
        </Tabs.TabPane>
        {appStore.clientCfg?.enable_pub_app_store == true && (
          <Tabs.TabPane tab={<h2><AppstoreOutlined />我的微应用</h2>} key="userApp">
            {activeKey == "userApp" && (
              <div className={s.content_wrap}>
                <UserAppList />
              </div>
            )}
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab={<h2><BookOutlined />我的文档</h2>} key="userDoc">
          {activeKey == "userDoc" && (
            <div className={s.content_wrap}>
              <UserDocSpaceList onChange={kbSpace => setCurKbSpace(kbSpace)} spaceId={spaceId ?? userStore.userInfo.defaultKbSpaceId} />
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab={<h2><ProjectOutlined />我的项目</h2>} key="myProject">
          {activeKey == "myProject" && (
            <div className={s.content_wrap}>
              <MyProjectList />
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
