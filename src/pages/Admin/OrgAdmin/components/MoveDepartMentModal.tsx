import { Modal, Tree } from "antd";
import React, { useState } from "react";
import type { DataNode } from "antd/lib/tree";
import { request } from "@/utils/request";
import { list_depart_ment, move_depart_ment } from "@/api/org_admin";
import { get_admin_session } from '@/api/admin_auth';


interface MoveDepartMentModalProps {
    departMentId: string;
    onMove: () => void;
    onCancel: () => void;
}

const MoveDepartMentModal: React.FC<MoveDepartMentModalProps> = (props) => {
    const [treeData, setTreeData] = useState<DataNode[]>([
        {
            key: "",
            title: "组织结构",
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
        const sessionId = await get_admin_session();
        const res = await request(list_depart_ment({
            admin_session_id: sessionId,
            parent_depart_ment_id: node.key as string,

        }));
        setTreeData((origin) =>
            updateTreeData(origin, node.key, res.depart_ment_list.map(item => ({
                key: item.depart_ment_id,
                title: item.name,
                children: [],
            })))
        );
    };

    const moveDepartMent = async (destDepartMentId: string) => {
        const sessionId = await get_admin_session();
        await request(move_depart_ment({
            admin_session_id: sessionId,
            depart_ment_id: props.departMentId,
            parent_depart_ment_id: destDepartMentId,
        }));
        props.onMove();
    };

    return (
        <Modal open title="移动部门"
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Tree treeData={treeData} loadData={loadData} showLine={true}
                style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
                onSelect={keys => {
                    if (keys.length == 1) {
                        moveDepartMent(keys[0] as string);
                    }
                }} />
        </Modal>
    );
};

export default MoveDepartMentModal;
