import { useStores } from "@/hooks";
import { List } from "antd";
import React, { useEffect } from "react";
import DeploymentCard from "./components/DeploymentCard";
import { observer } from 'mobx-react';


const DeploymentListPanel = () => {
    const cloudStore = useStores('cloudStore');

    useEffect(() => {
        cloudStore.loadDeploymentList().then(() => cloudStore.loadDeploymentPermList());
    }, [cloudStore.curNameSpace]);

    return (
        <List dataSource={cloudStore.deploymentList} renderItem={item => (
            <List.Item key={item.metadata?.name ?? ""}>
                <DeploymentCard deployment={item} />
            </List.Item>
        )} />
    );
};


export default observer(DeploymentListPanel);