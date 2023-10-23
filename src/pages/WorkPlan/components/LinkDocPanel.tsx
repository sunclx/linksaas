import React, { useState } from "react";
import { observer } from 'mobx-react';
import Button from "@/components/Button";
import { useStores } from "@/hooks";
import { Card, Table } from "antd";
import { LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { LinkSelect } from "@/components/Editor/components";
import type { LinkInfo } from '@/stores/linkAux';
import { LinkDocInfo } from '@/stores/linkAux';
import { request } from "@/utils/request";
import { cancel_link_doc, link_doc } from '@/api/project_sprit';
import type { SpritDocInfo } from '@/api/project_sprit';
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import { useHistory } from "react-router-dom";


const LinkDocPanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [showAddModal, setShowAddModal] = useState(false);

    const linkDoc = async (link: LinkInfo) => {
        const docId = (link as LinkDocInfo).docId;
        await request(link_doc(userStore.sessionId, projectStore.curProjectId, projectStore.curEntry?.entry_id ?? "", docId));
        await spritStore.onLinkDoc(docId);
        setShowAddModal(false);
    };

    const cancelLinkDoc = async (docId: string) => {
        await request(cancel_link_doc(userStore.sessionId, projectStore.curProjectId, projectStore.curEntry?.entry_id ?? "", docId));
        spritStore.onCancelLinkDoc(docId);
    }

    const columns: ColumnsType<SpritDocInfo> = [
        {
            title: "文档标题",
            width: 250,
            render: (_, record: SpritDocInfo) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {projectStore.isAdmin && <Deliconsvg
                        style={{ marginRight: '10px', cursor: 'pointer', color: '#0E83FF' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            cancelLinkDoc(record.doc_id);
                        }}
                    />}
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkDocInfo("", record.project_id, record.doc_id), history);
                    }}><LinkOutlined />&nbsp;{record.title}</a>
                </div>
            ),
        },
        {
            title: "关联用户",
            width: 100,
            dataIndex: "link_display_name",
        },
        {
            title: "关联时间",
            width: 100,
            render: (_, record: SpritDocInfo) => <span>{moment(record.link_time).format("YYYY-MM-DD")}</span>
        }
    ];

    return (
        <div>
            <Card bordered={false} extra={
                <Button
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}
                    title={projectStore.isAdmin ? "" : "只有管理员可以关联文档"}
                    disabled={!projectStore.isAdmin}
                ><PlusOutlined />关联文档</Button>}>
                <Table
                    rowKey="doc_id"
                    dataSource={spritStore.spritDocList}
                    columns={columns}
                    pagination={false} />
            </Card>
            {showAddModal == true && (
                <LinkSelect title="关联文档"
                    showDoc={true}
                    showRequirement={false}
                    showTask={false}
                    showBug={false}
                    showExterne={false}
                    onCancel={() => setShowAddModal(false)}
                    onOk={link => linkDoc(link)} />
            )}
        </div>
    );
};

export default observer(LinkDocPanel);