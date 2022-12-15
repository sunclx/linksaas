import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { WebMemberInfo } from '@/stores/member';
import { message, Modal, Table } from 'antd';
import useColums from './useColums';
import useVisible from '@/hooks/useVisible';
import type { ColumnsType } from 'antd/lib/table';
import RemoveMember from "./RemoveMember";
import AddMember from "./AddMember";
import Button from "@/components/Button";
import { UserAddOutlined } from '@ant-design/icons';
import s from './MemberList.module.less';
import { change_owner } from "@/api/project";
import { request } from "@/utils/request";

const MemberList = () => {
    const [removeObj, setRemoveObj] = useVisible<WebMemberInfo>();
    const [addObj, setAddObj] = useVisible<WebMemberInfo>();

    const userStore = useStores('userStore');
    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [newOwnerUserId, setNewOwnerUserId] = useState("");

    const onChangeOwner = (memberUserId: string) => {
        setNewOwnerUserId(memberUserId);
    };

    const changeOwner = async () => {
        const res = await request(change_owner(userStore.sessionId,projectStore.curProjectId,newOwnerUserId));
        if(res){
            await projectStore.updateProject(projectStore.curProjectId);
            await memberStore.updateMemberInfo(projectStore.curProjectId,userStore.userInfo.userId);
            setNewOwnerUserId("");
            message.info("转移超级管理员权限成功");
        }
    };

    const { columns } = useColums({
        setRemoveObj,
        onChangeOwner,
    });



    return (
        <div>
            {!(projectStore.curProject?.closed) && projectStore.isAdmin && appStore.clientCfg?.can_invite && (
                <div className={s.head_wrap}>
                    <Button onClick={() => setAddObj(true)} className={s.add_btn}>
                        <UserAddOutlined />
                        邀请成员
                    </Button>
                </div>
            )}
            {projectStore.isAdmin && (
                <Table<WebMemberInfo>
                    rowKey={(e) => e?.member?.member_user_id}
                    scroll={{ y: 'calc(100vh - 270px)' }}
                    columns={columns as ColumnsType<WebMemberInfo>}
                    dataSource={memberStore.memberList}
                    pagination={false}
                />
            )}
            {!projectStore.isAdmin && (
                <Table<WebMemberInfo>
                    rowKey={(e) => e?.member?.member_user_id}
                    scroll={{ y: 'calc(100vh - 270px)' }}
                    columns={columns as ColumnsType<WebMemberInfo>}
                    dataSource={memberStore.memberList}
                    pagination={false}
                />
            )}
            <RemoveMember
                visible={removeObj.visible}
                params={removeObj.param}
                onChange={setRemoveObj}
            />
            {addObj.visible && <AddMember visible={addObj.visible} onChange={setAddObj} />}
            {newOwnerUserId != "" && (
                <Modal
                    title="转移超级管理员"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setNewOwnerUserId("");
                    }}
                    onOk={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        changeOwner();
                    }}>
                    是否把<b>&nbsp;超级管理员&nbsp;</b>转移给 {memberStore.getMember(newOwnerUserId)?.member.display_name ?? ""}?
                </Modal>
            )}
        </div>
    );
};

export default observer(MemberList);