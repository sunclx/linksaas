import { Card, Space } from "antd";
import React from "react";
import dockerIcon from '@/assets/flow/docker.png';
import composeIcon from '@/assets/flow/dockercompose.png';
import scriptIcon from '@/assets/flow/script.png';
import { useDrag } from 'react-dnd';

export const DND_ITEM_TYPE = "node";
export interface NewNodeInfo {
    nodeType: "ShellNode" | "DockerNode" | "ServiceNode";
}

interface NodeIconProps {
    nodeType: "ShellNode" | "DockerNode" | "ServiceNode";
    title: string;
    imgSrc: string;
}

const NodeIcon = (props: NodeIconProps) => {
    const [_, drag] = useDrag(() => ({
        type: DND_ITEM_TYPE,
        item: { nodeType: props.nodeType },
        canDrag: true,
    }));

    return (
        <div ref={drag}>
            <img src={props.imgSrc} title={props.title} width={64} />
        </div>
    );
}

const NodePanel = () => {
    return (
        <Card title="任务(拖动到面板)">
            <Space>
                <NodeIcon nodeType="ShellNode" imgSrc={scriptIcon} title="脚本任务" />
                <NodeIcon nodeType="DockerNode" imgSrc={dockerIcon} title="Docker任务" />
                <NodeIcon nodeType="ServiceNode" imgSrc={composeIcon} title="服务任务(DockerCompose)" />
            </Space>
        </Card>
    );
};

export default NodePanel