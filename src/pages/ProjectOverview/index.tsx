import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './index.module.less';
import ProjectInfoPanel from "./components/ProjectInfoPanel";
import LocalApi from "./components/LocalApi";
import { Card, Collapse } from "antd";
import Button from "@/components/Button";
import { WebviewWindow } from '@tauri-apps/api/window';
import { get_port } from "@/api/local_api";
import MemberInfoPanel from "./components/MemberInfoPanel";
import MyIssuePanel from "./components/MyIssuePanel";


const ProjectOverview = () => {

    const [port, setPort] = useState(0);

    const loadPort = async () => {
        const res = await get_port();
        setPort(res);
    };

    useEffect(() => {
        loadPort();
    }, []);

    const openApiConsole = async () => {
        const label = "localapi"
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.close();
        }
        new WebviewWindow(label, {
            url: `local_api.html?port=${port}`,
            width: 800,
            minWidth: 800,
            height: 600,
            minHeight: 600,
            center: true,
            title: "本地接口调试",
            resizable: true,
        });
    };

    return (
        <div className={s.overview_wrap}>
            <ProjectInfoPanel />
            <MemberInfoPanel />
            <MyIssuePanel/>
            <Card title={<h1 className={s.head}>其他信息</h1>} style={{ marginTop: "10px" }} headStyle={{ backgroundColor: "#f5f5f5" }}>
                <Collapse bordered={false} className={s.other_wrap}>
                    <Collapse.Panel key="localApi" header="本地接口" extra={
                        <Button
                            title={port == 0 ? "本地服务没有启动" : ""}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                openApiConsole();
                            }} disabled={port == 0}>调试接口</Button>
                    }>
                        <LocalApi />
                    </Collapse.Panel>
                </Collapse>
            </Card>
        </div>
    );
};

export default observer(ProjectOverview);