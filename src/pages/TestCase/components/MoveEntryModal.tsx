import { Modal, Tree } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { DataNode } from "antd/lib/tree";
import { useStores } from "@/hooks";
import { ENTRY_TYPE_DIR, list_entry, set_parent_entry } from '@/api/project_test_case';
import { request } from "@/utils/request";

interface MoveEntryModalProps {
    entryId: string;
    onMove: () => void;
    onCancel: () => void;
}

const MoveEntryModal: React.FC<MoveEntryModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [treeData, setTreeData] = useState<DataNode[]>([
        {
            key: "",
            title: "根目录",
            children: [],
        },
    ]);

    const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }
            return node;
        });

    const loadData = async (node: DataNode) => {
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: node.key as string,
        }));
        const entryList = res.entry_list.filter(item => (item.entry_type == ENTRY_TYPE_DIR && item.entry_id != props.entryId));
        setTreeData((origin) =>
            updateTreeData(origin, node.key, entryList.map(item => ({
                key: item.entry_id,
                title: item.title,
                children: [],
            })))
        );
    };

    const moveEntry = async (destEntryId: string) => {
        await request(set_parent_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            parent_entry_id: destEntryId,
        }));
        props.onMove();
    };

    return (
        <Modal open title="移动节点"
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Tree treeData={treeData} loadData={loadData} showLine={true} onSelect={keys => {
                if (keys.length == 1) {
                    moveEntry(keys[0] as string);
                }
            }} />
        </Modal>
    );
};

export default observer(MoveEntryModal);
