import { Button, Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { type SimpleCredential, list_credential, remove_credential, CREDENTIAL_TYPE_KEY } from "@/api/project_cicd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';

export interface CredPanelProps {
    version: number;
}

const CredPanel = (props: CredPanelProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [credList, setCredList] = useState<SimpleCredential[]>([]);
    const [removeCredInfo, setRemoveCredInfo] = useState<SimpleCredential | null>(null);

    const loadCredList = async () => {
        const res = await request(list_credential({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setCredList(res.credential_list);
    };

    const removeCred = async () => {
        if (removeCredInfo == null) {
            return;
        }
        await request(remove_credential({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            credential_id: removeCredInfo.credential_id,
        }));
        setRemoveCredInfo(null);
        await loadCredList();
        message.info("删除成功");
    };

    const columns: ColumnsType<SimpleCredential> = [
        {
            title: "名称",
            dataIndex: "credential_name",
        },
        {
            title: "类型",
            render: (_, row: SimpleCredential) => row.credential_type == CREDENTIAL_TYPE_KEY ? "SSH密钥" : "密码",
        },
        {
            title: "操作",
            render: (_, row: SimpleCredential) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }} disabled={projectStore.isClosed || (!projectStore.isAdmin)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCredInfo(row);
                    }}>
                    删除
                </Button>
            ),
        }
    ];

    useEffect(() => {
        loadCredList();
    }, [props.version]);

    return (
        <div>
            <Table rowKey="credential_id" dataSource={credList} columns={columns} />
            {removeCredInfo != null && (
                <Modal open title="删除登录凭证"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCredInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeCred();
                    }}>
                    是否删除登录凭证&nbsp;{removeCredInfo.credential_name}&nbsp;?
                </Modal>
            )}
        </div>
    );
}

export default CredPanel;