import { Card, Descriptions, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { AdminPermInfo } from '@/api/admin_auth';
import s from './ProjectDetail.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { get as get_project } from '@/api/project_admin';
import type { ProjectInfo } from '@/api/project';
import { request } from '@/utils/request';
import { list as list_member, remove as remove_member } from '@/api/project_member_admin';
import type { MemberInfo } from '@/api/project_member';
import type { ColumnsType } from 'antd/es/table';
import Button from '@/components/Button';
import type { UserDetailState } from "../UserAdmin/UserDetail";
import { ADMIN_PATH_USER_DETAIL_SUFFIX } from '@/utils/constant';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EditText } from '@/components/EditCell/EditText';

export interface ProjectDetailState {
    projectId: string;
};

const ProjectDetail = () => {
    const history = useHistory();
    const location = useLocation();
    const state: ProjectDetailState = location.state as ProjectDetailState;

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
    const [memberInfoList, setMemberInfoList] = useState<MemberInfo[]>();

    const loadProjectInfo = async () => {
        const sessionId = await get_admin_session();
        const res = await request(get_project({
            admin_session_id: sessionId,
            project_id: state.projectId,
        }));
        setProjectInfo(res.project_info);
    };



    const loadMemberList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_member({
            admin_session_id: sessionId,
            project_id: state.projectId,
        }));
        setMemberInfoList(res.member_info_list);
    };

    const removeMember = async (memberUserId: string) => {
        const sessionId = await get_admin_session();
        await request(remove_member({
            admin_session_id: sessionId,
            project_id: state.projectId,
            user_id: memberUserId,
        }));
        await loadMemberList();
    };

    const memberColumns: ColumnsType<MemberInfo> = [
        {
            title: "成员昵称",
            width: 100,
            render: (_, row: MemberInfo) => (
                <Button type="link"
                    style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!(permInfo?.user_perm.read ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const userState: UserDetailState = {
                            userId: row.member_user_id,
                        };
                        history.push(ADMIN_PATH_USER_DETAIL_SUFFIX, userState);
                    }}><LinkOutlined />&nbsp;{row.display_name}</Button>
            ),
        },
        {
            title: "成员角色",
            width: 100,
            dataIndex: "role_name",
        },
        {
            title: "加入时间",
            width: 150,
            render: (_, row: MemberInfo) => (
                moment(row.create_time).format("YYYY-MM-DD HH:mm:ss")
            ),

        },
        {
            title: "更新时间",
            width: 150,
            render: (_, row: MemberInfo) => (
                moment(row.update_time).format("YYYY-MM-DD HH:mm:ss")
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: MemberInfo) => (
                <Button type="link" style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!((permInfo?.project_member_perm.remove ?? false) && row.is_project_owner == false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMember(row.member_user_id);
                    }}>移除成员</Button>
            ),
        }
    ];

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadProjectInfo();
        loadMemberList();
    }, [])

    return (
        <div className={s.content_wrap}>
            <Descriptions title="项目详情" bordered>
                <Descriptions.Item label="项目名称">{projectInfo != null && (
                    <EditText editable={projectInfo.closed == false && permInfo?.project_perm.update == true} content={projectInfo.basic_info.project_name} onChange={async (value) => {
                        //TODO
                        return false;
                    }} showEditIcon={true} />
                )}</Descriptions.Item>
                <Descriptions.Item label="项目状态">{projectInfo != null && (projectInfo.closed ? "关闭" : "打开")}</Descriptions.Item>
                <Descriptions.Item label="超级管理员">{projectInfo?.owner_display_name ?? ""}</Descriptions.Item>
                <Descriptions.Item label="项目成员">
                    <Card extra={
                        <Button disabled={!((permInfo?.project_member_perm.add ?? false) && (projectInfo?.closed ?? true) == false)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }}>
                            <PlusOutlined />&nbsp;&nbsp;添加项目</Button>
                    }>
                        <Table rowKey="member_user_id" columns={memberColumns} dataSource={memberInfoList} pagination={false} />
                    </Card>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default ProjectDetail;