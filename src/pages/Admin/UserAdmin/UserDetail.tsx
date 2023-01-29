import { Card, Descriptions, Table, Form, Modal, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { AdminPermInfo } from '@/api/admin_auth';
import type { UserInfo } from '@/api/user';
import { USER_STATE_NORMAL, USER_STATE_FORBIDDEN } from '@/api/user';
import s from './UserDetail.module.less';
import { EditSelect } from "@/components/EditCell/EditSelect";
import { useLocation } from 'react-router-dom';
import { request } from '@/utils/request';
import { get as get_user, reset_password } from '@/api/user_admin';
import moment from 'moment';
import { list as list_project } from '@/api/project_admin';
import type { ProjectInfo } from '@/api/project';
import type { ColumnsType } from 'antd/es/table';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import { remove as remove_member } from '@/api/project_member_admin';

export interface UserDetailState {
    userId: string;
};

interface ResetPasswordValues {
    password?: string;
};

const UserDetail = () => {
    const location = useLocation();

    const state: UserDetailState = location.state as UserDetailState;

    const [resetForm] = Form.useForm();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [projectList, setProjectList] = useState<ProjectInfo[]>([]);
    const [showResetModal, setShowResetModal] = useState(false);

    const loadUserInfo = async () => {
        const sessionId = await get_admin_session();
        const res = await request(get_user({
            admin_session_id: sessionId,
            user_id: state.userId,
        }));
        setUserInfo(res.user_info);
    };

    const loadProjectList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_project({
            admin_session_id: sessionId,
            filter_closed: false,
            closed: false,
            filter_by_user_id: true,
            user_id: state.userId,
            filter_by_keyword: false,
            filter_by_remove: true,
            remove: false,
            keyword: "",
            offset: 0,
            limit: 99,
        }));
        setProjectList(res.project_info_list);
    };

    const removeMember = async (projectId: string) => {
        const sessionId = await get_admin_session();
        await request(remove_member({
            admin_session_id: sessionId,
            project_id: projectId,
            user_id: state.userId,
        }));
        loadProjectList();
    };

    const prjColumns: ColumnsType<ProjectInfo> = [
        {
            title: "项目名称",
            width: 150,
            render: (_, row: ProjectInfo) => (
                <Button type="link" disabled={!(permInfo?.project_perm.read ?? false)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        //TODO
                    }}>{row.basic_info.project_name}&nbsp;&nbsp;<LinkOutlined /></Button>
            ),
        },
        {
            title: "状态",
            width: 80,
            render: (_, row: ProjectInfo) => (row.closed ? "关闭" : "打开"),
        },
        {
            title: "超级管理员",
            width: 100,
            dataIndex: "owner_display_name",
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: ProjectInfo) => (
                <Button type="link" style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!((permInfo?.project_member_perm.remove ?? false) && row.owner_user_id != state.userId)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMember(row.project_id);
                    }}>退出项目</Button>
            ),
        }
    ];

    const resetPassword = async () => {
        const values = resetForm.getFieldsValue() as ResetPasswordValues;
        const password = (values.password ?? "").trim();
        if (password == "") {
            message.error("请输入密码");
            return;
        }
        if (password.length < 6) {
            message.error("密码太简单");
            return;
        }
        const sessionId = await get_admin_session();
        await request(reset_password({
            admin_session_id: sessionId,
            user_id: state.userId,
            password: password,
        }));
        setShowResetModal(false);
        message.info("重设密码成功");
    };

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    useEffect(() => {
        loadUserInfo();
        loadProjectList();
    }, [state.userId]);

    return (
        <div className={s.content_wrap}>
            <Descriptions title="用户详情" bordered>
                <Descriptions.Item label="用户名">{userInfo?.user_name ?? ""}</Descriptions.Item>
                <Descriptions.Item label="昵称">{userInfo?.basic_info.display_name ?? ""}</Descriptions.Item>
                <Descriptions.Item label="状态">
                    <EditSelect editable={permInfo?.user_perm.set_state ?? false} curValue={userInfo?.user_state ?? USER_STATE_NORMAL} itemList={[
                        {
                            label: "正常",
                            value: USER_STATE_NORMAL,
                            color: "black",
                        },
                        {
                            label: "禁用",
                            value: USER_STATE_FORBIDDEN,
                            color: "black",
                        },
                    ]} onChange={async (value) => {
                        //TODO
                        return false;
                    }} showEditIcon={true} allowClear={false} />
                </Descriptions.Item>
                <Descriptions.Item label="密码">
                    ******
                    {permInfo?.user_perm.reset_password == true && (
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowResetModal(true);
                        }}>重设密码</Button>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{userInfo != null && moment(userInfo.create_time).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{userInfo != null && moment(userInfo.update_time).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                <Descriptions.Item label="所在项目" span={3}>
                    <Card extra={
                        <Button disabled={!(permInfo?.project_member_perm.add ?? false)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                //TODO
                            }}>
                            <PlusOutlined />&nbsp;&nbsp;添加项目
                        </Button>}>
                        <Table rowKey="project_id" columns={prjColumns} dataSource={projectList} pagination={false} />
                    </Card>
                </Descriptions.Item>
            </Descriptions>
            {showResetModal == true && (
                <Modal open title="重设密码"
                    okText="更新密码"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowResetModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        resetPassword();
                    }}
                >
                    <Form form={resetForm}>
                        <Form.Item label="密码" name="password" rules={[{ required: true, min: 6 }]}>
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default UserDetail;