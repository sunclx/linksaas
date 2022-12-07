import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { WebMemberInfo } from '@/stores/member';
import { Table } from 'antd';
import useColums from './useColums';
import useVisible from '@/hooks/useVisible';
import type { ColumnsType } from 'antd/lib/table';
import RemoveMember from "./RemoveMember";
import AddMember from "./AddMember";
import Button from "@/components/Button";
import { UserAddOutlined } from '@ant-design/icons';
import s from './MemberList.module.less';

const MemberList = () => {
    const [removeObj, setRemoveObj] = useVisible<WebMemberInfo>();
    const [addObj, setAddObj] = useVisible<WebMemberInfo>();

    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const { columns } = useColums({
        setRemoveObj,
    });
    return (
        <div>
            {!(projectStore.curProject?.closed) && projectStore.isAdmin && appStore.clientCfg?.can_invite && (
                <div className={s.head_wrap}>
                    <Button onClick={() => setAddObj(true)} className={s.add_btn}>
                        <UserAddOutlined />
                        添加成员
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
        </div>
    );
};

export default observer(MemberList);