import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Tree } from "antd";
import type { DataNode } from "antd/lib/tree";
import { list_all_folder, type FolderPathItem } from "@/api/project_entry";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

export interface MoveToFolderModalProps {
    skipFolderId?: string; //忽略的目录
    onCancel: () => void;
    onOk: (folderId: string) => void;
}

const MoveToFolderModal = (props: MoveToFolderModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [treeNodeList, setTreeNodeList] = useState([] as DataNode[]);
    const [selectKey, setSelectkey] = useState<string | null>(null);

    const setupTreeNode = (pathItemList: FolderPathItem[], nodeList: DataNode[], parentFolderId: string) => {
        for (const pathItem of pathItemList) {
            if (pathItem.parent_folder_id != parentFolderId) {
                continue;
            }
            if (pathItem.folder_id == props.skipFolderId) {
                continue;
            }
            const subNode: DataNode = {
                key: pathItem.folder_id,
                title: pathItem.folder_title,
                children: [],
            };
            nodeList.push(subNode);
            setupTreeNode(pathItemList, subNode.children!, pathItem.folder_id);
        }
    };

    const initTree = async () => {
        const res = await request(list_all_folder({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const tmpNodeList = [] as DataNode[];
        setupTreeNode(res.item_list, tmpNodeList, "");
        setTreeNodeList([{
            key: "",
            title: "根目录",
            children: tmpNodeList,
        }]);
    };

    useEffect(() => {
        initTree();
    }, []);

    return (
        <Modal open title="移动到目录"
            bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            okText="移动" okButtonProps={{ disabled: selectKey == null }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (selectKey != null) {
                    props.onOk(selectKey);
                }
            }}>
            <Tree treeData={treeNodeList} defaultExpandAll={true} onSelect={keys => {
                if (keys.length == 1) {
                    setSelectkey(keys[0] as string);
                }
            }} />
        </Modal>
    );
};

export default observer(MoveToFolderModal);