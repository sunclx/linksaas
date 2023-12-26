import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import '@/styles/global.less';
import { renderRoutes } from 'react-router-config';
import routes from './routes';
import stores from '@/stores';
import zhCN from 'antd/lib/locale/zh_CN';
import { message, ConfigProvider } from 'antd';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import 'moment/dist/locale/zh-cn';
import 'remirror/styles/all.css';
import '@/components/Editor/editor.less';

const App = () => {
  stores.noticeStore.initListen();
  if (stores.userStore.sessionId !== '') {
    stores.appStore.loadClientCfg();
    stores.appStore.loadLocalProxy();
    stores.projectStore.initLoadProjectList();
  }
  return (
    <Provider stores={stores}>
      <ErrorBoundary>
        <ConfigProvider locale={zhCN}>
          <BrowserRouter>
            {renderRoutes(routes)}
          </BrowserRouter>
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
