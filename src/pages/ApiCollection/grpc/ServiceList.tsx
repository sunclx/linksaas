import React, { useEffect, useState } from "react";
import type { DataNode } from 'antd/es/tree';
import { Command } from '@tauri-apps/api/shell';
import type { MethodWithServiceInfo, ServiceInfo } from "./types";
import { Tree, message } from "antd";
import { ApiOutlined, DownOutlined, FolderOutlined } from "@ant-design/icons";

export interface ServiceListProps {
    protoPath: string;
    curMethodList: MethodWithServiceInfo[];
    onSelect: (method: MethodWithServiceInfo) => void;
}

type ExDataNode = DataNode & {
    method?: MethodWithServiceInfo;
};


const ServiceList = (props: ServiceListProps) => {
    const [treeData, setTreeData] = useState<ExDataNode[]>([]);

    const parseProto = async () => {
        const cmd = Command.sidecar("bin/grpcutil", ["desc", "--in", props.protoPath]);
        const result = await cmd.execute();
        let svcInfoList: ServiceInfo[] = [];
        try {
            const obj = JSON.parse(result.stdout);
            if (obj.error !== undefined) {
                message.error("无法获取服务信息.${obj.error}")
                return;
            }
            svcInfoList = obj as ServiceInfo[];
        } catch (e) {
            console.log(e)
            return;
        }
        svcInfoList = svcInfoList.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
        svcInfoList.forEach(svc => {
            svc.methodList = svc.methodList.sort((a, b) => a.methodName.localeCompare(b.methodName));
        });

        const tmpTree: ExDataNode[] = [];
        for (const svcInfo of svcInfoList) {
            const parts = svcInfo.serviceName.split(".")
            const svcNode: ExDataNode = {
                title: parts[parts.length - 1],
                key: svcInfo.serviceName,
                icon: <FolderOutlined />,
                selectable: false,
                checkable: false,
                children: [],
            }
            for (const methodInfo of svcInfo.methodList) {
                const key = `${svcInfo.serviceName}.${methodInfo.methodName}`;
                svcNode.children?.push({
                    title: methodInfo.methodName,
                    key: key,
                    icon: <ApiOutlined />,
                    selectable: true,
                    checkable: false,
                    isLeaf: true,
                    method: {
                        serviceName: svcInfo.serviceName,
                        method: methodInfo,
                    },
                } as ExDataNode);
            }
            tmpTree.push(svcNode);
        }
        setTreeData(tmpTree);
    };

    useEffect(() => {
        parseProto();
    }, [props.protoPath]);

    useEffect(() => {
        console.log(props.curMethodList);
    }, [props.curMethodList]);

    return (
        <div style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
            <Tree showIcon defaultExpandAll multiple
                switcherIcon={<DownOutlined />}
                treeData={treeData} onSelect={(_, info) => {
                    if (info.node.method !== undefined) {
                        props.onSelect(info.node.method);
                    }
                }}
                selectedKeys={props.curMethodList.map(item => `${item.serviceName}.${item.method.methodName}`)} />
        </div>
    );
};

export default ServiceList;