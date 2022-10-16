import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import NoticeList from "./NoticeList";
import '@/styles/global.less';


const App = () => {
    return (
        <ConfigProvider locale={zhCN}>
            <NoticeList />
        </ConfigProvider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);