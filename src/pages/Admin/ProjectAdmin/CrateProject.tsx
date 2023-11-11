import Button from "@/components/Button";
import { Card, Form, Input, Select, Tag } from "antd";
import React, { useEffect, useState } from "react";
import type { UserInfo } from '@/api/user';
import { list_by_id as list_user_by_id } from '@/api/user_admin';
import SelectUserModal from "../components/SelectUserModal";
import type { AdminPermInfo } from '@/api/admin_auth';
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { request } from "@/utils/request";
import { PlusOutlined } from "@ant-design/icons";
import { create as create_project } from '@/api/project_admin';
import { add as add_member } from '@/api/project_member_admin';
import { useHistory } from "react-router-dom";
import { ADMIN_PATH_PROJECT_LIST_SUFFIX } from "@/utils/constant";

const CreateProject = () => {
    const history = useHistory();

    const [projectName, setProjectName] = useState("");
    const [memberList, setMemberList] = useState<UserInfo[]>([]);
    const [ownerUserId, setOwnerUserId] = useState("");
    const [canSave, setCanSave] = useState(false);

    const [showSelectUser, setShowSelectUser] = useState(false);

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);


    const updateCanSave = (ownerId: string, prjName: string) => {
        if (ownerId == "") {
            setCanSave(false);
            return;
        }
        if (prjName.trim().length < 2) {
            setCanSave(false);
            return;
        }
        setCanSave(true);
        return;
    }

    const removeMember = (userId: string) => {
        const tmpList = memberList.filter(item => item.user_id != userId);
        setMemberList(tmpList);
        if (userId == ownerUserId) {
            setOwnerUserId("");
            setCanSave(false);
        }
    }

    const loadMemberList = async (userIdList: string[]) => {
        const sessionId = await get_admin_session();
        const res = await request(list_user_by_id({
            admin_session_id: sessionId,
            user_id_list: userIdList,
        }));
        setMemberList(res.user_info_list);
        let ownerId = ownerUserId;
        if (!(res.user_info_list.map(item => item.user_id).includes(ownerUserId))) {
            ownerId = "";
            setOwnerUserId("");
        }
        updateCanSave(ownerId, projectName);
        setShowSelectUser(false);
    };

    const createProject = async () => {
        const sessionId = await get_admin_session();
        const createRes = await request(create_project({
            admin_session_id: sessionId,
            basic_info: {
                project_name: projectName,
                project_desc: "",
            },
            owner_user_id: ownerUserId,
        }));
        for (const member of memberList) {
            if (member.user_id == ownerUserId) {
                continue
            }
            try {
                await request(add_member({
                    admin_session_id: sessionId,
                    project_id: createRes.project_id,
                    user_id: member.user_id,
                    role_id: "",
                }));
            } catch (e) {
                console.log(e);
            }
        }
        history.push(ADMIN_PATH_PROJECT_LIST_SUFFIX);
    };

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card style={{ height: "100%" }} extra={
            <Button disabled={!canSave} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                createProject();
            }}>保存</Button>
        }>
            <div>
                <Form labelCol={{ span: 2 }}>
                    <Form.Item label="项目名称">
                        <Input value={projectName} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setProjectName(e.target.value);
                            updateCanSave(ownerUserId, e.target.value);
                        }} />
                    </Form.Item>
                    <Form.Item label="项目成员">
                        {memberList.map(item => (
                            <Tag key={item.user_id} closable onClose={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeMember(item.user_id);
                            }}>{item.basic_info.display_name}</Tag>
                        ))}
                        <Button type="default" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowSelectUser(true);
                        }}><PlusOutlined />&nbsp;&nbsp;添加</Button>
                    </Form.Item>
                    <Form.Item label="超级管理员">
                        <Select value={ownerUserId} onChange={value => {
                            setOwnerUserId(value);
                            updateCanSave(value, projectName);
                        }}>
                            {memberList.map(item => (
                                <Select.Option key={item.user_id} value={item.user_id}>{item.basic_info.display_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            {showSelectUser == true && (
                <SelectUserModal title="添加项目成员"
                    showUser={permInfo?.user_perm.read ?? false}
                    selectUserIdList={memberList.map(item => item.user_id)}
                    onCancel={() => setShowSelectUser(false)}
                    onOk={(userIdList) => loadMemberList(userIdList)} />
            )}
        </Card>
    );
};

export default CreateProject;