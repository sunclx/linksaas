import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import '@/styles/global.less';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'mobx-react';
import stores from './stores';
import CiCdApp from "./CiCdApp";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const App = () => {
    return (
        <Provider {...stores}>
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <DndProvider backend={HTML5Backend}>
                        <CiCdApp />
                    </DndProvider>
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);