import { Collapse, Descriptions, Modal, Popover, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import Button from "@/components/Button";
import { MinusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import GoalList from "./GoalList";
import AwardList from "./AwardList";
import type { RoleInfo } from '@/api/project_member';
import { list_role, set_member_role, remove_member } from '@/api/project_member';
import { request } from "@/utils/request";
import { change_owner } from "@/api/project";
import UserPhoto from "@/components/Portrait/UserPhoto";
import MemberInfo from "@/pages/ChannelAndAi/components/MemberInfo";
import s from "./MemberInfoPanel.module.less";
import type { AwardState } from '@/api/project_award';
import { list_state } from '@/api/project_award';

const MemberAwardState: React.FC<{ state?: AwardState }> = ({ state }) => {
    if (state == undefined) {
        return (<></>);
    } else {
        return (
            <div style={{ paddingRight: "20px" }}>
                <Space size="large">
                    <span>上月贡献:&nbsp;{state.last_month_point}</span>
                    <span>本月贡献:&nbsp;{state.cur_month_point}</span>
                    <span>上周贡献:&nbsp;{state.last_weak_point}</span>
                    <span>本周贡献:&nbsp;{state.cur_week_point}</span>
                </Space>
            </div>
        );
    }
};

const MemberInfoPanel = () => {
    const userStore = useStores('userStore');
    const memberStore = useStores('memberStore');
    const projectStore = useStores('projectStore');
    const appStore = useStores('appStore');

    const [roleList, setRoleList] = useState<RoleInfo[]>([]);
    const [removeMemberUserId, setRemoveMemberUserId] = useState("");
    const [ownerMemberUserId, setOwnerMemberUserId] = useState("");
    const [awardStateList, setAwardStateList] = useState<AwardState[]>([]);

    const loadRoleList = async () => {
        const res = await request(list_role(userStore.sessionId, projectStore.curProjectId));
        if (res) {
            setRoleList(res.role_list);
        }
    };

    const updateMemberRole = async (memberUserId: string, roleId: string) => {
        await set_member_role(userStore.sessionId, projectStore.curProjectId, roleId, memberUserId);
        memberStore.updateMemberRole(memberUserId, roleId);
        message.info("修改角色成功");
    };

    const changeOwner = async () => {
        await request(change_owner(userStore.sessionId, projectStore.curProjectId, ownerMemberUserId));

        await projectStore.updateProject(projectStore.curProjectId);
        await memberStore.updateMemberInfo(projectStore.curProjectId, userStore.userInfo.userId);
        setOwnerMemberUserId("");
        message.info("转移超级管理员权限成功");
    };

    const removeMember = async () => {
        await request(remove_member(userStore.sessionId, projectStore.curProjectId, removeMemberUserId));
        await memberStore.loadMemberList(projectStore.curProjectId);
        setRemoveMemberUserId("");
        message.info("移除用户成功");
    };

    const loadAwardStateList = async () => {
        const res = await request(list_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setAwardStateList(res.state_list);
    };

    useEffect(() => {
        loadRoleList();
        loadAwardStateList();
    }, [projectStore.curProjectId]);

    return (
        <>
            <Collapse bordered={true} className={s.member_list_wrap}>
                <Collapse.Panel key="memberInfo" header={<h1 className={s.head}>成员信息</h1>} extra={
                    <>
                        {!(projectStore.curProject?.closed) && projectStore.isAdmin && appStore.clientCfg?.can_invite && (
                            <Button onClick={() => memberStore.showInviteMember = true}>
                                <UserAddOutlined />
                                邀请成员
                            </Button>
                        )}
                    </>
                }>
                    {memberStore.memberList.map(member => (
                        <Descriptions bordered key={member.member.member_user_id} style={{ marginBottom: "10px" }}>
                            <Descriptions.Item label="用户名称">
                                <Popover
                                    placement="right"
                                    trigger="click"
                                    content={<MemberInfo memberId={member.member.member_user_id} showLink hideMemberInfo={() => { }} />}>
                                    <a>
                                        <UserPhoto logoUri={member.member.logo_uri} style={{ width: "24px", height: "24px", borderRadius: "24px", marginRight: "10px" }} />
                                        {member.member.display_name}</a>
                                </Popover>
                            </Descriptions.Item>
                            <Descriptions.Item label="用户角色">
                                {member.member.is_project_owner ? (
                                    <span>超级管理员</span>
                                ) : (
                                    <Select value={member.member.role_id}
                                        style={{ width: 100 }}
                                        disabled={!projectStore.isAdmin} onChange={value => {
                                            if (value == "") {
                                                setOwnerMemberUserId(member.member.member_user_id);
                                            } else {
                                                updateMemberRole(member.member.member_user_id, value);
                                            }
                                        }}>
                                        {projectStore.curProject?.owner_user_id == userStore.userInfo.userId && (
                                            <Select.Option value="">超级管理员</Select.Option>
                                        )}
                                        {roleList.map(item => (
                                            <Select.Option value={item.role_id} key={item.role_id}>
                                                {item.basic_info.role_name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}

                            </Descriptions.Item>
                            <Descriptions.Item label="操作">
                                <Button
                                    type="link"
                                    disabled={!projectStore.isAdmin}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setRemoveMemberUserId(member.member.member_user_id);
                                    }}
                                >
                                    <MinusCircleOutlined />
                                    移除
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="其他信息" span={3}>
                                <Collapse bordered={false} className={s.extra_info}>
                                    <Collapse.Panel key="okr" header="成员目标">
                                        <GoalList memberUserId={member.member.member_user_id} />
                                    </Collapse.Panel>
                                    <Collapse.Panel key="award" header="成员贡献"
                                        extra={<MemberAwardState state={awardStateList.find(item => item.member_user_id == member.member.member_user_id)} />}>
                                        <AwardList memberUserId={member.member.member_user_id} />
                                    </Collapse.Panel>
                                </Collapse>
                            </Descriptions.Item>
                        </Descriptions>
                    ))}
                </Collapse.Panel>
            </Collapse >
            {ownerMemberUserId != "" && (
                <Modal
                    title="转移超级管理员"
                    open
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOwnerMemberUserId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        changeOwner();
                    }}>
                    是否把<b>&nbsp;超级管理员&nbsp;</b>转移给 {memberStore.getMember(ownerMemberUserId)?.member.display_name ?? ""}?
                </Modal>
            )}
            {removeMemberUserId != "" && (
                <Modal title="移除人员" open
                    okButtonProps={{ danger: true }}
                    okText="移除"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMemberUserId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMember();
                    }}>
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            lineHeight: '20px',
                            marginBottom: '20px',
                            color: ' #2C2D2E',
                        }}
                    >
                        是否确认移除成员 {memberStore.getMember(removeMemberUserId)?.member.display_name ?? ""}？
                    </div>
                </Modal>
            )}
        </>
    );
};

export default observer(MemberInfoPanel);