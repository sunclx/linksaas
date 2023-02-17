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


const AppStore: React.FC = () => {
  const userStore = useStores('userStore');
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
              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowAdd(true);
                }}
              >
                新增应用
              </Button>
            )}
            <Popover placement='bottom' trigger="click" content={
              <Button type="link" style={{ margin: "10px 10px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowDebug(true);
              }}>调试微应用</Button>
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
              <List.Item>
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
