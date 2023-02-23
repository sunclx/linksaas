import React, { useState } from "react";
import type { DataNode } from "antd/lib/tree";
import { list_major_cate, list_minor_cate, list_sub_minor_cate, get_cate_path } from "@/api/appstore";
import { request } from "@/utils/request";
import { Modal, Tree } from "antd";
import { move_app } from "@/api/appstore_admin";
import { get_admin_session } from '@/api/admin_auth';

const KEY_PREFIX_MAJOR = "major:";
const KEY_PREFIX_MINOR = "minor:";
const KEY_PREFIX_SUB_MINOR = "subMinor:";


interface SelectAppCateModalProps {
    appId: string;
    onCancel: () => void;
    onOk: () => void;
}

const SelectAppCateModal: React.FC<SelectAppCateModalProps> = (props) => {
    const [treeData, setTreeData] = useState<DataNode[]>([
        {
            key: "",
            title: "根目录",
            children: [],
            selectable: false,
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
        let nodeKey = node.key as string;
        if (nodeKey == "") {
            const res = await request(list_major_cate({}));
            if (res.cate_info_list.length > 0) {
                setTreeData((origin) =>
                    updateTreeData(origin, node.key, res.cate_info_list.map(item => ({
                        key: `${KEY_PREFIX_MAJOR}${item.cate_id}`,
                        title: item.cate_name,
                        children: [],
                        isLeaf: item.minor_cate_count == 0,
                    })))
                );
            }
        } else {
            if (nodeKey.startsWith(KEY_PREFIX_MAJOR)) {
                nodeKey = nodeKey.substring(KEY_PREFIX_MAJOR.length);
                const res = await request(list_minor_cate({
                    major_cate_id: nodeKey,
                }));
                if (res.cate_info_list.length > 0) {
                    setTreeData((origin) =>
                        updateTreeData(origin, node.key, res.cate_info_list.map(item => ({
                            key: `${KEY_PREFIX_MINOR}${item.cate_id}`,
                            title: item.cate_name,
                            children: [],
                            isLeaf: item.sub_minor_cate_count == 0,
                        })))
                    );
                }
            } else if (nodeKey.startsWith(KEY_PREFIX_MINOR)) {
                nodeKey = nodeKey.substring(KEY_PREFIX_MINOR.length);
                const res = await request(list_sub_minor_cate({
                    minor_cate_id: nodeKey,
                }));
                if (res.cate_info_list.length > 0) {
                    setTreeData((origin) =>
                        updateTreeData(origin, node.key, res.cate_info_list.map(item => ({
                            key: `${KEY_PREFIX_SUB_MINOR}${item.cate_id}`,
                            title: item.cate_name,
                            children: [],
                            isLeaf: true,
                        })))
                    );
                }
            }
        }
    };

    const moveApp = async (cateId: string) => {
        let realCateId = "";
        const index = cateId.indexOf(":");
        if (index != -1) {
            realCateId = cateId.substring(index + 1);
        }
        const pathRes = await request(get_cate_path({
            cate_id: realCateId,
        }));
        const sessionId = await get_admin_session();
        await request(move_app({
            admin_session_id: sessionId,
            app_id: props.appId,
            major_cate_id: pathRes.cate_path.major_cate_id,
            minor_cate_id: pathRes.cate_path.minor_cate_id,
            sub_minor_cate_id: pathRes.cate_path.sub_minor_cate_id,
        }));
        props.onOk();
    }

    return (
        <Modal open title="更新应用列表" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Tree treeData={treeData} loadData={loadData} showLine={true} autoExpandParent={true}
                onSelect={keys => {
                    if (keys.length == 1) {
                        moveApp(keys[0].toString());
                    }
                }} />
        </Modal>
    );
};

export default SelectAppCateModal;