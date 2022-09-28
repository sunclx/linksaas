import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import '@/styles/global.less';
import { renderRoutes } from 'react-router-config';
import routes from './routes';
import stores from '@/stores';
import zhCN from 'antd/lib/locale/zh_CN';
import { message, ConfigProvider, Row, Col, Select, Button, Input, Divider, Space } from 'antd';
import { observer } from 'mobx-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import 'moment/dist/locale/zh-cn';
import 'remirror/styles/all.css';
import '@/components/Editor/editor.less';
import Swiper from './pages/User/components/Swiper';
import cls from './pages/User/index.module.less';
import Header from '@/components/Header';
import logoPng from '@/assets/allIcon/logo.png';
import * as cfgApi from '@/api/client_cfg';
import { PlusOutlined } from '@ant-design/icons';
import { conn_grpc_server, is_conn_server } from './api/main';
import { useStores } from './hooks';

const Connect = observer(() => {
  const appStore = useStores('appStore');
  const [serverList, setServerList] = useState<cfgApi.ServerInfo[]>([]);
  const [defaultAddr, setDefaultAddr] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const [hasConn, setHasConn] = useState(false);

  const loadServerList = async () => {
    const res = await cfgApi.list_server(false);
    setServerList(res.server_list);
    res.server_list.forEach((item) => {
      if (item.default_server) {
        setDefaultAddr(item.addr);
      }
    });
  };

  const addServer = async () => {
    if (newAddr == '') {
      message.warn('请输入正确的地址');
      return;
    }
    await cfgApi.add_server(newAddr);
    setNewAddr('');
    await loadServerList();
  };

  const removeServer = async (addr: string) => {
    await cfgApi.remove_server(addr);
    await loadServerList();
  };

  const connServer = async () => {
    const res = await conn_grpc_server(defaultAddr);
    if (!res) {
      message.error('连接失败');
    }
    setHasConn(res);
  };

  const checkConn = async () => {
    const res = await is_conn_server();
    setHasConn(res);
    if (res) {
      appStore.loadClientCfg();
    }
  };

  useEffect(() => {
    loadServerList();
  }, []);

  useEffect(() => {
    checkConn();
  }, [defaultAddr]);

  if (hasConn) {
    return <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>;
  }
  return (
    <div className={cls.loginBox}>
      <Row>
        <Col span={12}>
          <Swiper />
        </Col>
        <Col span={12}>
          <Header type="login" style={{ boxShadow: 'none' }} />
          <div className={cls.logo}>
            <img src={logoPng} alt="" />
          </div>
          <div className={cls.form}>
            <Select
              style={{ width: '100%' }}
              value={defaultAddr}
              onChange={(v) => setDefaultAddr(v)}
              onDropdownVisibleChange={(v) => setOpenSelect(v)}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider />
                  <div style={{ paddingLeft: "10px", paddingBottom: "20px", position: "relative" }}>
                    <Space>
                      <Input
                        style={{ width: "200px" }}
                        placeholder="请输入服务器地址"
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setNewAddr(e.target.value);
                        }}
                      />
                      <Button
                        style={{ position: "absolute", right: "10px", top: "0px" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addServer();
                        }}
                      >
                        增加服务器
                      </Button>
                    </Space>
                  </div>
                </>
              )}
            >
              {serverList.map((item) => (
                <Select.Option key={item.addr} value={item.addr}>
                  {item.system ? (
                    <div style={{ height: "20px", fontSize: "16px" }}>{item.name}</div>
                  ) : (
                    <div style={{ height: "20px", fontSize: "16px" }}>
                      {item.name}
                      {openSelect && (
                        <Button style={{ position: "absolute", right: "10px", top: "0px" }}
                          type="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeServer(item.addr);
                          }}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                  )}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              className={cls.button}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                connServer();
              }}
            >
              连接服务器
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
});

const App = () => {
  stores.noticeStore.initListen();
  if (stores.userStore.sessionId !== '') {
    stores.appStore.loadClientCfg();
    stores.projectStore.initLoadProjectList();
  }
  return (
    <Provider stores={stores}>
      <ErrorBoundary>
        <ConfigProvider locale={zhCN}>
          <Connect />
        </ConfigProvider>
      </ErrorBoundary>
    </Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

window.addEventListener('unhandledrejection', function (event) {
  // 防止默认处理（例如将错误输出到控制台）
  event.preventDefault();
  message.error(event?.reason);
});
