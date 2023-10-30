import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import 'remirror/styles/all.css';
import '@/components/Editor/editor.less';
import '@/styles/global.less';
import { BrowserRouter } from "react-router-dom";
import SwaggerPage from "./SwaggerPage";

const App = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <SwaggerPage />
            </BrowserRouter>
        </ConfigProvider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);