import React, { useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Tabs } from "antd";
import { useStores } from "@/hooks";
import CreatePipeLineModal from "./CreatePipeLineModal";
import CreateCredModal from "./CreateCredModal";
import CredPanel from "./CredPanel";
import PipeLinePanel from "./PipeLinePanel";

const ProjectCiCd = () => {
    const location = useLocation();
    const tabStr = new URLSearchParams(location.search).get('tab') ?? "pipeline";
    const history = useHistory();

    const projectStore = useStores('projectStore');

    const [pipeLineVersion, setPipeLineVersion] = useState(0);
    const [credVersion, setCredVersion] = useState(0);
    const [showPipeLineModal, setShowPipeLineModal] = useState(false);
    const [showCredModal, setShowCredModal] = useState(false);

    return (
        <CardWrap title="CI/CD">
            <Tabs type="card" activeKey={tabStr}
                onChange={value => history.push(`${location.pathname}?tab=${value}`)}
                style={{ marginLeft: "20px", marginRight: "20px" }}
                tabBarStyle={{ height: "40px" }}
                tabBarExtraContent={
                    <>
                        {tabStr == "pipeline" && (
                            <Button type="primary"
                                disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowPipeLineModal(true);
                                }}>创建</Button>
                        )}
                        {tabStr == "cred" && (
                            <Button type="primary"
                                disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowCredModal(true);
                                }}>增加</Button>
                        )}
                    </>
                }
                items={[
                    {
                        key: "pipeline",
                        label: "流水线",
                        children: (
                            <div style={{ height: "calc(100vh - 220px)", overflowY: "scroll" }}>
                                {tabStr == "pipeline" && (
                                    <PipeLinePanel version={pipeLineVersion} />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: "exec",
                        label: "运行结果",
                        children: (
                            <div style={{ height: "calc(100vh - 220px)", overflowY: "scroll" }}>
                                xx
                            </div>
                        ),
                    },
                    {
                        key: "agent",
                        label: "执行代理",
                        children: (
                            <div style={{ height: "calc(100vh - 220px)", overflowY: "scroll" }}>
                                xx
                            </div>
                        ),
                    },
                    {
                        key: "cred",
                        label: "登录凭证",
                        children: (
                            <div style={{ height: "calc(100vh - 220px)", overflowY: "scroll" }}>
                                {tabStr == "cred" && (
                                    <CredPanel version={credVersion} />
                                )}
                            </div>
                        ),
                    }
                ]} />
            {showPipeLineModal == true && (
                <CreatePipeLineModal onCancel={() => setShowPipeLineModal(false)} onOk={() => {
                    setShowPipeLineModal(false);
                    setPipeLineVersion(oldValue => oldValue + 1)
                }} />
            )}
            {showCredModal == true && (
                <CreateCredModal onCancel={() => setShowCredModal(false)} onOk={() => {
                    setShowCredModal(false);
                    setCredVersion(oldValue => oldValue + 1);
                }} />
            )}
        </CardWrap>
    );
};

export default observer(ProjectCiCd);