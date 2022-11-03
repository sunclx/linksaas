import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import '@/styles/global.less';
import { SearchResult } from "./SearchResult";
import { BrowserRouter } from "react-router-dom";

const App = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter><SearchResult/></BrowserRouter>
        </ConfigProvider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);