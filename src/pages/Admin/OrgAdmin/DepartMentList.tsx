import { Breadcrumb, Card, Form, Input, Modal, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { list_depart_ment, create_depart_ment, update_depart_ment, remove_depart_ment, list_depart_ment_user, add_depart_ment_user, remove_depart_ment_user } from '@/api/org_admin';
import type { DepartMentInfo, PathElement, DepartMentUserInfo } from '@/api/org_admin';
import { useHistory, useLocation } from 'react-router-dom';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { request } from '@/utils/request';
import type { AdminPermInfo } from '@/api/admin_auth';
import s from './DepartMentList.module.less';
import Button from '@/components/Button';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { EditText } from '@/components/EditCell/EditText';
import { ADMIN_PATH_ORG_LIST_SUFFIX, ADMIN_PATH_USER_DETAIL_SUFFIX } from '@/utils/constant';
import SelectUserModal from '../components/SelectUserModal';
import type { UserDetailState } from '../UserAdmin/UserDetail';
import MoveDepartMentModal from './components/MoveDepartMentModal';

export interface DepartMentState {
    departMentId: string;
}

interface AddDepartMentValues {
    name?: string;
}

const DepartMentList = () => {
    const history = useHistory();

    const location = useLocation();
    const state = location.state as (DepartMentState | undefined) ?? {departMentId: ""};
    
    const [addOrgForm] = Form.useForm();

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);

    const [departMentList, setDepartMentList] = useState<DepartMentInfo[]>([]);
    const [pathElementList, setPathElementList] = useState<PathElement[]>([]);
    const [memberList, setMemberList] = useState<DepartMentUserInfo[]>([]);

    const [showAddOrgModal, setShowAddOrgModal] = useState(false);
    const [removeDepartMentId, setRemoveDepartMentId] = useState("");
    const [showSelectUserModal, setShowSelectUserModal] = useState(false);

    const [removeMemberUserId, setRemoveMemberUserId] = useState("");
    const [moveDepartMentId, setMoveDepartMentId] = useState("");

    const loadDepartMentList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_depart_ment({
            admin_session_id: sessionId,
            parent_depart_ment_id: state.departMentId,
        }));
        setDepartMentList(res.depart_ment_list);
        setPathElementList(res.path_element_list);
    };

    const loadMemberList = async () => {
        if (state.departMentId == "") {
            return;
        }
        const sessionId = await get_admin_session();
        const res = await request(list_depart_ment_user({
            admin_session_id: sessionId,
            depart_ment_id: state.departMentId,
            offset: 0,
            limit: 999,
        }));
        setMemberList(res.user_info_list);
    }

    const createDepartMent = async () => {
        const values = addOrgForm.getFieldsValue() as AddDepartMentValues;
        const name = (values.name ?? "").trim();
        if (name == "") {
            message.error("请输入部门名称");
            return;
        }
        if (name.length < 2) {
            message.error("部门名称过短");
            return;
        }
        const sessionId = await get_admin_session();
        await request(create_depart_ment({
            admin_session_id: sessionId,
            parent_depart_ment_id: state.departMentId,
            name: name,
        }));
        await loadDepartMentList();
        setShowAddOrgModal(false);
    };

    const removeDepartMent = async () => {
        const sessionId = await get_admin_session();
        await request(remove_depart_ment({
            admin_session_id: sessionId,
            depart_ment_id: removeDepartMentId,
        }));
        await loadDepartMentList();
        setRemoveDepartMentId("");
    }

    const getDepartMentName = (departMentId: string) => {
        let name = "";
        departMentList.forEach(item => {
            if (item.depart_ment_id == departMentId) {
                name = item.name;
            }
        })
        return name;
    }

    const addMember = async (userIdList: string[]) => {
        const sessionId = await get_admin_session();
        for (const userId of userIdList) {
            if (memberList.map(item => item.user_id).includes(userId)) {
                continue;
            }
            try {
                await request(add_depart_ment_user({
                    admin_session_id: sessionId,
                    depart_ment_id: state.departMentId,
                    user_id: userId,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        setShowSelectUserModal(false);
        await loadMemberList();
    };

    const getMemberName = (userId: string) => {
        let name = "";
        memberList.forEach(item => {
            if (item.user_id == userId) {
                name = item.user_display_name;
            }
        })
        return name;
    }
    const removeMember = async () => {
        const sessionId = await get_admin_session();
        await request(remove_depart_ment_user({
            admin_session_id: sessionId,
            depart_ment_id: state.departMentId,
            user_id: removeMemberUserId,
        }));
        setRemoveMemberUserId("");
        await loadMemberList();

    };

    const departMentColumns: ColumnsType<DepartMentInfo> = [
        {
            title: "部门名称",
            width: 200,
            render: (_, row: DepartMentInfo) => (
                <EditText editable={permInfo?.org_perm.update ?? false} content={row.name} onChange={async (value: string) => {
                    const name = value.trim();
                    if (name == "") {
                        return false;
                    }
                    try {
                        const sessionId = await get_admin_session();
                        await request(update_depart_ment({
                            admin_session_id: sessionId,
                            depart_ment_id: row.depart_ment_id,
                            name: name,
                        }));
                        return true;
                    } catch (e) {
                        console.log(e);
                    }
                    return false;
                }} showEditIcon={true} />
            ),
        },
        {
            title: "下属部门数量",
            width: 100,
            render: (_, row: DepartMentInfo) => (
                <span>
                    {row.sub_depart_ment_count}
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const subState: DepartMentState = {
                            departMentId: row.depart_ment_id,
                        }
                        history.push(ADMIN_PATH_ORG_LIST_SUFFIX, subState);
                    }}>查看</Button>
                </span>
            ),
        },
        {
            title: "直属成员数量",
            width: 100,
            render: (_, row: DepartMentInfo) => (
                <span>
                    {row.user_count}
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const subState: DepartMentState = {
                            departMentId: row.depart_ment_id,
                        }
                        history.push(ADMIN_PATH_ORG_LIST_SUFFIX, subState);
                    }}>查看</Button>
                </span>
            ),
        },
        {
            title: "操作",
            width: 120,
            render: (_, row: DepartMentInfo) => (
                <Space>
                    <Button type="link" disabled={!(permInfo?.org_perm.move ?? false)}
                        style={{ minWidth: 0, paddingLeft: 0 }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setMoveDepartMentId(row.depart_ment_id);
                        }}>移动部门</Button>
                    <Button type="link" disabled={!((permInfo?.org_perm.remove ?? false) && row.user_count == 0 && row.sub_depart_ment_count == 0)}
                        danger style={{ minWidth: 0, paddingLeft: 0 }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveDepartMentId(row.depart_ment_id);
                        }}>删除部门</Button>
                </Space>
            ),
        }
    ];

    const memberColumns: ColumnsType<DepartMentUserInfo> = [
        {
            title: "成员昵称",
            render: (_, row: DepartMentUserInfo) => (
                <Button type="link" disabled={!(permInfo?.user_perm.read ?? false)}
                    style={{ minWidth: 0, paddingLeft: 0 }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const userState: UserDetailState = {
                            userId: row.user_id,
                        };
                        history.push(ADMIN_PATH_USER_DETAIL_SUFFIX, userState);
                    }}>
                    {row.user_display_name}&nbsp;&nbsp;<LinkOutlined />
                </Button>
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: DepartMentUserInfo) => (
                <Button type="link" disabled={!(permInfo?.org_perm.remove_user ?? false)}
                    danger style={{ minWidth: 0, paddingLeft: 0 }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveMemberUserId(row.user_id);
                    }}
                >移除成员</Button>
            ),
        }
    ];

    useEffect(() => {
        loadDepartMentList();
        loadMemberList();
    }, [state.departMentId]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title={
            <Breadcrumb>
                {pathElementList.map(item => (
                    <Breadcrumb.Item key={item.depart_ment_id}>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const subState: DepartMentState = {
                                departMentId: item.depart_ment_id,
                            }
                            history.push(ADMIN_PATH_ORG_LIST_SUFFIX, subState);
                        }}>{item.name}</a>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        } bordered={false}>
            <div className={s.content_wrap}>
                <Card title="下属部门列表" bordered={false} extra={
                    <Button disabled={!(permInfo?.org_perm.create ?? false)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            addOrgForm.resetFields();
                            setShowAddOrgModal(true);
                        }}><PlusOutlined />&nbsp;&nbsp;增加部门</Button>
                }>
                    <Table rowKey="depart_ment_id" columns={departMentColumns} dataSource={departMentList} pagination={false} />
                </Card>
                {state.departMentId != "" && (
                    <Card title="成员列表" bordered={false} extra={
                        <Button disabled={!(permInfo?.org_perm.add_user ?? false)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowSelectUserModal(true);
                            }}><PlusOutlined />&nbsp;&nbsp;增加成员</Button>
                    }>
                        <Table rowKey="user_id" columns={memberColumns} dataSource={memberList} pagination={false} />
                    </Card>
                )}
            </div>
            {showAddOrgModal == true && (
                <Modal open title="增加部门"
                    okText="增加部门"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddOrgModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createDepartMent();
                    }}>
                    <Form form={addOrgForm}>
                        <Form.Item label="部门名称" name="name" rules={[{ required: true, min: 2 }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {removeDepartMentId != "" && (
                <Modal open title="删除部门"
                    okText="删除部门"
                    okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveDepartMentId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeDepartMent();
                    }}>
                    是否删除&nbsp;{`${getDepartMentName(removeDepartMentId)}`}&nbsp;?
                </Modal>
            )}
            {showSelectUserModal == true && (
                <SelectUserModal title='添加部门成员' showUser={true} showOrg={false}
                    selectUserIdList={memberList.map(item => item.user_id)}
                    onOk={(userIdList: string[]) => {
                        addMember(userIdList);
                    }} onCancel={() => setShowSelectUserModal(false)} />
            )}
            {removeMemberUserId != "" && (
                <Modal open title="移除成员"
                    okText="移除成员"
                    okButtonProps={{ danger: true }}
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
                    是否移除&nbsp;{`${getMemberName(removeMemberUserId)}`}&nbsp;?
                </Modal>
            )}
            {moveDepartMentId != "" && (
                <MoveDepartMentModal departMentId={moveDepartMentId}
                    onCancel={() => setMoveDepartMentId("")}
                    onMove={() => {
                        setMoveDepartMentId("");
                        loadDepartMentList();
                    }} />
            )}
        </Card>
    );
};

export default DepartMentList;