import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './index.module.less';
import ProjectInfoPanel from "./components/ProjectInfoPanel";
import LocalApi from "./components/LocalApi";
import { Card, Collapse } from "antd";
import Button from "@/components/Button";
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import { get_port } from "@/api/local_api";
import MemberInfoPanel from "./components/MemberInfoPanel";
import MyIssuePanel from "./components/MyIssuePanel";
import BulletinListPanel from "./components/BulletinListPanel";


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
        const pos = await appWindow.innerPosition();
        const deviceRatio = window.devicePixelRatio ?? 1;
        new WebviewWindow(label, {
            url: `local_api.html?port=${port}`,
            width: 800 * deviceRatio,
            minWidth: 800 * deviceRatio,
            height: 600 * deviceRatio,
            minHeight: 600 * deviceRatio,
            center: true,
            title: "本地接口调试",
            resizable: true,
            x: pos.x + Math.floor(Math.random() * 200),
            y: pos.y + Math.floor(Math.random() * 200),
        });
    };

    return (
        <div className={s.overview_wrap}>
            <ProjectInfoPanel />
            <BulletinListPanel />
            <MemberInfoPanel />
            <MyIssuePanel />
            <Card title={<h1 className={s.head}>其他信息</h1>} style={{ marginTop: "10px" }} headStyle={{ backgroundColor: "#f5f5f5" }}>
                <Collapse bordered={false} className={s.other_wrap} defaultActiveKey={["localApi"]}>
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