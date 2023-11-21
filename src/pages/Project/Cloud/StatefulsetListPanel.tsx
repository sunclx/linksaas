import { useStores } from "@/hooks";
import { List } from "antd";
import React, { useEffect } from "react";
import { observer } from 'mobx-react';
import StatefulsetCard from "./components/StatefulsetCard";

const StatefulsetListPanel = () => {
    const cloudStore = useStores('cloudStore');

    useEffect(() => {
        cloudStore.loadStatefulsetList().then(() => cloudStore.loadStatefulsetPermList());
    }, [cloudStore.curNameSpace]);

    return (
        <List dataSource={cloudStore.statefulsetList} renderItem={item => (
            <List.Item key={item.metadata?.name ?? ""} style={{ border: "none" }}>
                <StatefulsetCard statefulset={item} />
            </List.Item>
        )} />
    );
};

export default observer(StatefulsetListPanel);