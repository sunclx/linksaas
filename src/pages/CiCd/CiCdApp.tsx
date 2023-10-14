import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { useStores } from './stores';
import PipeLineEditor from './PipeLineEditor';


const CiCdApp = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const projectId = urlParams.get("projectId") ?? "";
    const fsId = urlParams.get("fsId") ?? "";
    const pipeLineId = urlParams.get("pipeLineId") ?? "";
    const execId = urlParams.get("execId") ?? "";
    const canUpdateStr = (urlParams.get("canUpdate") ?? "false").toLowerCase();
    const canExecStr = (urlParams.get("canExec") ?? "false").toLowerCase();

    const store = useStores();

    useEffect(() => {
        store.paramStore.projectId = projectId;
        store.paramStore.fsId = fsId;
        store.paramStore.canUpdate = (canUpdateStr == "true");
        store.paramStore.canExec = (canExecStr == "true");
        store.pipeLineStore.loadCredList(projectId);
        if (execId == "") {
            store.pipeLineStore.loadPipeLine(projectId, pipeLineId).then(() => store.pipeLineStore.incInitVersion());
        }
    }, []);

    return (
        <Tabs items={[
            {
                key: "pipeline",
                label: "流水线",
                children: <PipeLineEditor />
            }
        ]}  tabBarStyle={{ backgroundColor: "white" }} type="card" />
    );
};

export default observer(CiCdApp);