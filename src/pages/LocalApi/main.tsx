import React from "react";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import 'moment/dist/locale/zh-cn';
import '@/styles/global.less';
import { BrowserRouter, useLocation } from "react-router-dom";
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';
import { PROTO } from "./proto";

const Swagger = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const portStr = urlParams.get("port") ?? "8001";

    return (
        <div style={{ height: "100vh", overflow: "scroll" }}>
            <SwaggerUI spec={PROTO.replace("__PORT__", portStr)} />
        </div>
    );
}

const App = () => {


    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Swagger />
            </BrowserRouter>
        </ConfigProvider>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);