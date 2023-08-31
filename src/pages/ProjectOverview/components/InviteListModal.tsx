import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Modal, Space, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { InviteInfo } from "@/api/project_member";
import { list_invite, remove_invite } from "@/api/project_member";
import type { ColumnsType } from 'antd/es/table';
import { Table } from "antd";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from 'moment';
import { writeText } from '@tauri-apps/api/clipboard';

export interface InviteListModalProps {
    onClose: () => void;
}

const PAGE_SIZE = 10;

const InviteListModal = (props: InviteListModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inviteList, setInviteList] = useState<InviteInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);


    const loadInviteList = async () => {
        const res = await request(list_invite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setInviteList(res.invite_info_list);
    };

    const removeInvite = async (inviteCode: string) => {
        await request(remove_invite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            invite_code: inviteCode,
        }));
        if (curPage != 0) {
            setCurPage(0);
        } else {
            await loadInviteList();
        }
        message.info("删除成功");
    };

    const columns: ColumnsType<InviteInfo> = [
        {
            title: "发起用户",
            width: 150,
            render: (_, row: InviteInfo) => (
                <Space style={{ overflow: "hidden" }} title={row.create_display_name}>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "24px", height: "24px", borderRadius: "24px" }} />
                    <span>{row.create_display_name}</span>
                </Space>
            ),
        },
        {
            title: "发起时间",
            width: 120,
            render: (_, row: InviteInfo) => moment(row.create_time).format("YYYY-MM-DD HH点"),
        },
        {
            title: "到期时间",
            width: 120,
            render: (_, row: InviteInfo) => moment(row.expire_time).format("YYYY-MM-DD HH点"),
        },
        {
            title: "邀请码",
            dataIndex: "invite_code"
        },
        {
            title: "操作",
            render: (_, row: InviteInfo) => (
                <Space>
                    <Button type="link"
                        style={{ minWidth: 0, padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            writeText(row.invite_code);
                            message.info("复制成功");
                        }}>复制</Button>
                    <Button type="link" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeInvite(row.invite_code);
                    }}>删除邀请码</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadInviteList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <Modal open title="邀请码列表" width={1000}
            bodyStyle={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Table rowKey="invite_code" dataSource={inviteList} columns={columns} pagination={{
                current: curPage + 1,
                total: totalCount,
                pageSize: PAGE_SIZE,
                onChange: page => setCurPage(page - 1),
                hideOnSinglePage: true,
                showSizeChanger: false
            }} />
        </Modal>
    );
};

export default observer(InviteListModal);