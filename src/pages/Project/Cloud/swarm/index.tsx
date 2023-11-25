import React, { useEffect } from "react";
import { useStores } from "@/hooks";
import { observer } from 'mobx-react';
import { List } from "antd";
import ServiceCard from "./components/ServiceCard";

const SwarmPage = () => {
    const cloudStore = useStores('cloudStore');

    useEffect(() => {
        cloudStore.loadSwarmService().then(() => cloudStore.loadSwarmTask());
    }, [cloudStore.curNameSpace]);

    useEffect(()=>{
        cloudStore.loadSwarmUserPermList();
    },[]);

    return (
        <div>
            {cloudStore.curNameSpace != "" && (
                <div style={{ height: "calc(100vh - 166px)", overflowY: "scroll" }}>
                    <List dataSource={cloudStore.swarmServiceList} renderItem={item=>(
                        <List.Item key={item.service_id} style={{ border: "none" }}>
                            <ServiceCard service={item} />
                        </List.Item>
                    )} />
                </div>
            )}
        </div>
    );
};

export default observer(SwarmPage);