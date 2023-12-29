import { Card, Descriptions, Table, Form, Modal, Input, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import type { AdminPermInfo } from '@/api/admin_auth';
import type { UserInfo } from '@/api/user';
import { USER_STATE_NORMAL, USER_STATE_FORBIDDEN } from '@/api/user';
import s from './UserDetail.module.less';
import { EditSelect } from "@/components/EditCell/EditSelect";
import { useHistory, useLocation } from 'react-router-dom';
import { request } from '@/utils/request';
import { get as get_user, reset_password, set_state, set_test_account } from '@/api/user_admin';
import moment from 'moment';
import { list as list_project } from '@/api/project_admin';
import type { ProjectInfo } from '@/api/project';
import type { ColumnsType } from 'antd/es/table';
import { LeftOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import { remove as remove_member, add as add_member } from '@/api/project_member_admin';
import type { ProjectDetailState } from '../ProjectAdmin/ProjectDetail';
import { ADMIN_PATH_PROJECT_DETAIL_SUFFIX } from '@/utils/constant';
import SelectProjectModal from '../components/SelectProjectModal';

export interface UserDetailState {
    userId: string;
};

interface ResetPasswordValues {
    password?: string;
};

const UserDetail = () => {
    const history = useHistory();
    const location = useLocation();

    const state: UserDetailState = location.state as UserDetailState;

    const [resetForm] = Form.useForm();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [projectList, setProjectList] = useState<ProjectInfo[]>([]);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showSelectPrjModal, setShowSelectPrjModal] = useState(false);
    const [removeProjectInfo, setRemoveProjectInfo] = useState<ProjectInfo | null>(null);

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
        setRemoveProjectInfo(null);
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
                        const prjState: ProjectDetailState = {
                            projectId: row.project_id,
                        };
                        history.push(ADMIN_PATH_PROJECT_DETAIL_SUFFIX, prjState);
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
                <Button type="link" danger style={{ minWidth: 0, paddingLeft: 0 }}
                    disabled={!((permInfo?.project_member_perm.remove ?? false) && row.owner_user_id != state.userId)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveProjectInfo(row);
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

    const joinProject = async (projectIdList: string[]) => {
        const sessionId = await get_admin_session();
        for (const projectId of projectIdList) {
            if (projectList.map(item => item.project_id).includes(projectId)) {
                continue;
            }
            try {
                await request(add_member({
                    admin_session_id: sessionId,
                    project_id: projectId,
                    user_id: state.userId,
                    role_id: "",
                }));
            } catch (e) {
                console.log(e);
            }
        }
        await loadProjectList();
        setShowSelectPrjModal(false);
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
            {userInfo != null && permInfo != null && (
                <Descriptions title={
                    <Space>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            history.goBack();
                        }}><LeftOutlined /></a>
                        <span>用户详情({userInfo.user_name})</span>
                    </Space>
                } bordered>
                    <Descriptions.Item label="昵称">{userInfo.basic_info.display_name}</Descriptions.Item>
                    <Descriptions.Item label="体验账号">
                        <EditSelect editable={permInfo.user_perm.set_test_account} curValue={userInfo.test_account ? 1 : 0} itemList={[
                            {
                                label: "是",
                                value: 1,
                                color: "black",
                            },
                            {
                                label: "否",
                                value: 0,
                                color: "black",
                            },
                        ]} onChange={async (value) => {
                            try {
                                const sessionId = await get_admin_session();
                                await request(set_test_account({
                                    admin_session_id: sessionId,
                                    user_id: state.userId,
                                    test_account: value == 1,
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                            }
                            return false;
                        }} showEditIcon={true} allowClear={false} />
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                        <EditSelect editable={permInfo.user_perm.set_state} curValue={userInfo.user_state} itemList={[
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
                            try {
                                const sessionId = await get_admin_session();
                                await request(set_state({
                                    admin_session_id: sessionId,
                                    user_id: state.userId,
                                    user_state: value as number,
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                            }
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
                            <Button disabled={!(permInfo.project_member_perm.add)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowSelectPrjModal(true);
                                }}>
                                <PlusOutlined />&nbsp;&nbsp;加入项目
                            </Button>}>
                            <Table rowKey="project_id" columns={prjColumns} dataSource={projectList} pagination={false} />
                        </Card>
                    </Descriptions.Item>
                </Descriptions>
            )}
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
            {showSelectPrjModal == true && (
                <SelectProjectModal title="加入项目"
                    projectIdList={projectList.map(item => item.project_id)}
                    onCancel={() => setShowSelectPrjModal(false)}
                    onOk={(projectIdList) => {
                        joinProject(projectIdList);
                    }} />
            )}
            {removeProjectInfo != null && (
                <Modal open title="退出项目"
                    okText="退出项目"
                    okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveProjectInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeMember(removeProjectInfo.project_id);
                    }}>
                    是否退出项目&nbsp;{removeProjectInfo.basic_info.project_name}&nbsp;?
                </Modal>
            )}
        </div>
    );
};

export default UserDetail;