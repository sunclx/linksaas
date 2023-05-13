import React, { useEffect, useState } from 'react';
import CardWrap from '@/components/CardWrap';
import { Button, Space, Popover, List } from 'antd';
import type { App as AppInfo } from '@/api/project_app';
import { list as list_app } from '@/api/project_app';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import s from './index.module.less';
import { MoreOutlined } from '@ant-design/icons';
import DebugMinAppModal from './components/DebugMinAppModal';
import { observer } from 'mobx-react';
import AddAppModal from './components/AddAppModal';
import AppItem from './components/AppItem';
import { useHistory } from 'react-router-dom';
import { PUB_RES_PATH } from '@/utils/constant';


const AppStore: React.FC = () => {
  const history = useHistory();

  const userStore = useStores('userStore');
  const appStore = useStores('appStore');
  const projectStore = useStores('projectStore');

  const [appList, setAppList] = useState([] as AppInfo[]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDebug, setShowDebug] = useState(false);


  const loadAppList = async () => {
    const res = await request(
      list_app({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
      }),
    );
    if (res) {
      setAppList(res.app_list);
    }
  };

  useEffect(() => {
    loadAppList();
  }, [projectStore.curProjectId]);

  return (
    <CardWrap title="更多应用" halfContent>
      <div className={s.appStore}>
        <div className={s.appStoreHd}>
          <h2>应用列表</h2>
          <Space size="middle">
            {projectStore.isAdmin && (
              <>
                {appStore.clientCfg?.enable_pub_app_store == true && (
                  <Button
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      projectStore.setCurProjectId("");
                      history.push(`${PUB_RES_PATH}?tab=appStore`);
                    }}
                  >
                    前往应用市场
                  </Button>
                )}
                {appStore.clientCfg?.enable_pub_app_store == false && (
                  <Button type="primary" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAdd(true);
                  }}>新增应用</Button>
                )}
              </>
            )}
            <Popover placement='bottom' trigger="click" content={
              <Space direction="vertical" style={{ padding: "10px 0px" }}>
                {projectStore.isAdmin && appStore.clientCfg?.enable_pub_app_store == true && (
                  <Button
                    type="link" style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowAdd(true);
                    }}
                  >
                    新增应用
                  </Button>
                )}
                <Button type="link" style={{ marginLeft: "10px" }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowDebug(true);
                }}>调试微应用</Button>
              </Space>
            }>
              <MoreOutlined />
            </Popover>

          </Space>
        </div>
        <div className={s.appStoreBd}>
          <List
            grid={{
              gutter: 16,
              column: 4,
            }}
            dataSource={appList}
            renderItem={(item) => (
              <List.Item key={item.app_id}>
                <AppItem appInfo={item} onRemove={() => loadAppList()} />
              </List.Item>
            )}
          />

          <div className={s.info}>
            <h3>说明</h3>
            <p>您可以把项目团队用到的研发系统地址添加在这里。</p>
          </div>
        </div>
      </div>
      {showAdd == true && (
        <AddAppModal onCancel={() => setShowAdd(false)} onOk={() => {
          loadAppList();
          setShowAdd(false);
        }} />
      )}
      {showDebug == true && (
        <DebugMinAppModal onCancel={() => setShowDebug(false)} onOk={() => setShowDebug(false)} />
      )}
    </CardWrap>
  );
};

export default observer(AppStore);
