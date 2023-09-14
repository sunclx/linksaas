import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import '@/styles/global.less';
import { BrowserRouter } from "react-router-dom";
import CustomPage from "./CustomPage";
import { Provider } from 'mobx-react';
import stores from './stores';

const App = () => {
    return (
        <Provider {...stores}>
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <CustomPage />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);