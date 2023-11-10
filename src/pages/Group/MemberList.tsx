import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Checkbox, Modal, Popover, Space, Table, message } from "antd";
import { useStores } from "@/hooks";
import Button from "@/components/Button";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import InviteModal from "./components/InviteModal";
import InviteHistoryModal from "./components/InviteHistoryModal";
import type { GroupMemberInfo } from "@/api/group_member";
import { list_member, get_member } from "@/api/group_member";
import { change_owner, get as get_group } from "@/api/group";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import { MEMBER_PERM_OPTION_LIST, calcMemberPerm } from "./components/perm_util";

const PAGE_SIZE = 20;

const MemberList = () => {
    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showInviteHistoryModal, setShowInviteHistoryModal] = useState(false);

    const [memberList, setMemberList] = useState<GroupMemberInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [targetOwner, setTargetOwner] = useState<GroupMemberInfo | null>(null);

    const loadMemberList = async () => {
        const res = await request(list_member({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setMemberList(res.member_list);
    };

    const loadMember = async (memberUserId: string) => {
        const res = await request(get_member({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            member_user_id: memberUserId,
        }));
        const tmpList = memberList.slice();
        const index = tmpList.findIndex(item => item.member_user_id == memberUserId);
        if (index != -1) {
            tmpList[index] = res.member;
            setMemberList(tmpList);
        }
    };

    const changeOwner = async () => {
        if (targetOwner == null) {
            return;
        }
        await request(change_owner({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            member_user_id: targetOwner.member_user_id,
        }));
        const res = await request(get_group({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
        }));
        groupStore.curGroup = res.group;
        await loadMember(targetOwner.member_user_id);
        setTargetOwner(null);
        message.info("转让管理员成功");
    };

    const columns: ColumnsType<GroupMemberInfo> = [
        {
            title: "用户",
            width: 100,
            render: (_, row: GroupMemberInfo) => (
                <Space style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100px" }}>
                    <UserPhoto logoUri={row.member_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    <span>{row.member_display_name}</span>
                </Space>
            ),
        },
        {
            title: "管理员",
            width: 60,
            render: (_, row: GroupMemberInfo) => groupStore.curGroup?.owner_user_id == row.member_user_id ? "是" : "",
        },
        {
            title: "权限",
            render: (_, row: GroupMemberInfo) => (
                <Checkbox.Group options={MEMBER_PERM_OPTION_LIST} value={calcMemberPerm(row.perm)} disabled />
            ),
        },
        {
            title: "操作",
            render: (_, row: GroupMemberInfo) => (
                <Space>
                    {groupStore.curGroup?.owner_user_id == userStore.userInfo.userId && row.member_user_id != userStore.userInfo.userId && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTargetOwner(row);
                        }}>转让管理员</Button>
                    )}
                    {groupStore.curGroup?.user_perm.can_update_member && row.member_user_id != userStore.userInfo.userId && row.member_user_id != groupStore.curGroup?.owner_user_id && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            //TODO
                        }}>修改权限</Button>
                    )}
                    {groupStore.curGroup?.user_perm.can_update_member && row.member_user_id != userStore.userInfo.userId && row.member_user_id != groupStore.curGroup?.owner_user_id && (
                        <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            //TODO
                        }} danger>删除成员</Button>
                    )}
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadMemberList();
    }, [curPage]);

    return (
        <Card title={<span style={{ fontSize: "18px", fontWeight: 600 }}>成员列表</span>} extra={
            <Space>
                {groupStore.curGroup?.user_perm.can_invite == true && (
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowInviteModal(true);
                    }} icon={<PlusOutlined />}>邀请成员</Button>
                )}
                {groupStore.curGroup?.user_perm.can_invite == true && (
                    <Popover trigger="click" placement="bottomLeft" content={
                        <div style={{ padding: "10px 10px" }}>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowInviteHistoryModal(true);
                            }}>查看邀请记录</Button>
                        </div>
                    }>
                        <MoreOutlined />
                    </Popover>
                )}
            </Space>
        } bodyStyle={{ height: "calc(100vh - 94px)", overflowY: "scroll" }} bordered={false}>
            <Table rowKey="member_user_id" dataSource={memberList} columns={columns}
                pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            {showInviteModal == true && (
                <InviteModal onClose={() => setShowInviteModal(false)} />
            )}
            {showInviteHistoryModal == true && (
                <InviteHistoryModal onClose={() => setShowInviteHistoryModal(false)} />
            )}
            {targetOwner != null && (
                <Modal open title="转让管理员"
                    okText="转让" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTargetOwner(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        changeOwner();
                    }}>
                    是否把兴趣组管理员转让给&nbsp;{targetOwner.member_display_name}&nbsp;?
                </Modal>
            )}
        </Card>
    )
}

export default observer(MemberList);
