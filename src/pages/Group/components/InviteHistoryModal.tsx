import { Modal, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { InviteInfo } from "@/api/group_member";
import { list_invite, remove_invite } from "@/api/group_member";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { writeText } from '@tauri-apps/api/clipboard';


const PAGE_SIZE = 10;

export interface InviteHistoryModalProps {
    onClose: () => void;
}

const InviteHistoryModal = (props: InviteHistoryModalProps) => {
    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [inviteList, setInviteList] = useState<InviteInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadInviteList = async () => {
        const res = await request(list_invite({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setInviteList(res.invite_list);
    };

    const removeInvite = async (inviteCode: string) => {
        await request(remove_invite({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            invite_code: inviteCode,
        }));
        message.info("删除成功");
        await loadInviteList();
    };

    const columns: ColumnsType<InviteInfo> = [
        {
            title: "邀请码",
            dataIndex: "invite_code",
        },
        {
            title: "有效时间",
            width: 120,
            render: (_, row: InviteInfo) => moment(row.expire_time).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "发起人",
            width: 100,
            render: (_, row: InviteInfo) => (
                <Space style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100px" }}>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    <span>{row.create_display_name}</span>
                </Space>
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: InviteInfo) => (
                <Space size="large">
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        writeText(row.invite_code);
                        message.info("复制成功");
                    }}>复制</a>
                    <a style={{ color: "red" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeInvite(row.invite_code);
                    }}>删除</a>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadInviteList();
    }, [curPage]);

    return (
        <Modal open title="有效邀请记录" bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
            width={900}
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Table rowKey="invite_code" dataSource={inviteList} columns={columns}
                pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
        </Modal>
    )
};

export default observer(InviteHistoryModal);