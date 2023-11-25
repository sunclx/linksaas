import React from "react";
import { useStores } from "@/hooks";
import { observer } from 'mobx-react';
import DeploymentListPanel from "./DeploymentListPanel";
import StatefulsetListPanel from "./StatefulsetListPanel";

const K8sPage = () => {
    const cloudStore = useStores('cloudStore');

    return (
        <div>
            {cloudStore.curNameSpace != "" && (
                <div style={{ height: "calc(100vh - 166px)", overflowY: "scroll" }}>
                    <DeploymentListPanel />
                    <StatefulsetListPanel />
                </div>
            )}
        </div>
    );
};

export default observer(K8sPage);