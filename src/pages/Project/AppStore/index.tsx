import React, { useEffect, useState } from 'react';
import CardWrap from '@/components/CardWrap';
import { Button, Modal, Form, Input, message, Image, Space, Popover } from 'antd';
import * as appApi from '@/api/project_app';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { open as open_shell } from '@tauri-apps/api/shell';
import s from './index.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import defaultIcon from '@/assets/allIcon/app-default-icon.png';
import { MoreOutlined } from '@ant-design/icons';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { start as start_min_app } from '@/api/min_app';
import { uniqId } from '@/utils/utils';

interface AddFormData {
  appName: string;
  appUrl: string;
}

const AppStore: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const [appList, setAppList] = useState([] as appApi.App[]);
  const [showAdd, setShowAdd] = useState(false);


  const loadAppList = async () => {
    const res = await request(
      appApi.list({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
      }),
    );
    if (res) {
      setAppList(res.app_list);
    }
  };

  const addApp = async (appData: AddFormData) => {
    if (!(appData.appUrl.startsWith('http://') || appData.appUrl.startsWith('https://'))) {
      appData.appUrl = 'https://' + appData.appUrl;
    }
    const url = new URL(appData.appUrl);
    const logoUrl = `${url.protocol}//${url.host}/favicon.ico`;
    const res = await request(
      appApi.add({
        session_id: userStore.sessionId,
        basic_info: {
          project_id: projectStore.curProjectId,
          app_name: appData.appName,
          app_icon_url: logoUrl,
          app_url: appData.appUrl,
          app_open_type: appApi.OPEN_TYPE_BROWSER,
        },
      }),
    );
    if (res) {
      message.success('添加应用成功');
      await loadAppList();
      setShowAdd(false);
    }
  };

  const removeApp = async (appId: string) => {
    const res = await request(
      appApi.remove({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        app_id: appId,
      }),
    );
    if (res) {
      message.success('删除应用成功');
      await loadAppList();
    }
  };

  const openApp = async (appId: string, appUrl: string) => {
    const tokenRes = await request(
      appApi.get_token_url({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        app_id: appId,
      }),
    );
    const url = new URL(appUrl);
    url.searchParams.append('_tokenurl', tokenRes.url);
    await open_shell(url.toString());
  };

  const debugMinApp = async () => {
    const selected = await open_dialog({
      title: "选择程序目录",
      directory: true,
    });
    if (Array.isArray(selected)) {
      return;
    } else if (selected === null) {
      return;
    }
    await start_min_app("minApp_" + uniqId(), "调试微应用", projectStore.curProjectId, selected);
  }

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
                debugMinApp();
              }}>调试微应用</Button>
            }>
              <MoreOutlined />
            </Popover>

          </Space>
        </div>
        <div className={s.appStoreBd}>
          <div className={s.appList}>
            {appList.map((item) => (
              <div className={s.item} key={item.app_id}>
                <Image
                  className={s.img}
                  src={item.basic_info.app_icon_url}
                  alt={item.basic_info.app_name}
                  preview={false}
                  fallback={defaultIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openApp(item.app_id, item.basic_info.app_url);
                  }}
                />
                <div
                  className={s.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openApp(item.app_id, item.basic_info.app_url);
                  }}
                >
                  {item.basic_info.app_name}
                </div>
                {projectStore.isAdmin && (
                  <div
                    className={s.delete}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeApp(item.app_id);
                    }}
                  >
                    <Deletesvg />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={s.info}>
            <h3>说明</h3>
            <p>您可以把项目团队用到的研发系统地址添加在这里。</p>
          </div>
        </div>
      </div>
      {showAdd && (
        <Modal
          title="新增应用"
          visible
          footer={null}
          onCancel={() => {
            setShowAdd(false);
          }}
        >
          <Form onFinish={(v: AddFormData) => addApp(v)}>
            <Form.Item
              label="应用名称"
              name="appName"
              rules={[{ required: true, message: '请输入应用名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="应用地址"
              name="appUrl"
              rules={[{ required: true, message: '请输入应用地址' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </CardWrap>
  );
};

export default AppStore;
