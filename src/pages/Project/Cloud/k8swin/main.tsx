import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import '@/styles/global.less';
import { BrowserRouter } from "react-router-dom";
import K8sWin from "./K8sWin";

const App = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <K8sWin/>
            </BrowserRouter>
        </ConfigProvider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);