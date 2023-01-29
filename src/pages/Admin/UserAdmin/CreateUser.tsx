import Button from "@/components/Button";
import { uniqId } from "@/utils/utils";
import { WarningOutlined } from "@ant-design/icons";
import { Card, Form, Input, Space, message } from "antd";
import React, { useState } from "react";
import { create as create_user, exist as exist_user } from '@/api/user_admin';
import { request } from "@/utils/request";
import { get_admin_session } from '@/api/admin_auth';
import { USER_STATE_NORMAL } from "@/api/user";
import { useHistory } from "react-router-dom";
import { ADMIN_PATH_USER_LIST_SUFFIX } from "@/utils/constant";


interface NewUserInfo {
    id: string;
    userName: string;
    displayName: string;
    password: string;
    userExist: boolean;
};

const CreateUser = () => {
    const history = useHistory();
    const [newUserList, setNewUserList] = useState<NewUserInfo[]>([]);
    const [canSave, setCanSave] = useState(false);

    const getUserNameStatus = (newUser: NewUserInfo): "" | "error" | "warning" | undefined => {
        if (newUser.userName.trim() == "") {
            return "warning";
        } else if (newUser.userExist) {
            return "error";
        }
        return "";
    };

    const getUserNamePrefix = (newUser: NewUserInfo) => {
        const status = getUserNameStatus(newUser);
        return (<>
            {status == "error" && (
                <Space>
                    <WarningOutlined />用户已存在
                </Space>
            )}
            {status == "warning" && (
                <Space>
                    <WarningOutlined />请输入用户名
                </Space>
            )}
        </>);
    };

    const updateCanSave = (infoList: NewUserInfo[]) => {
        let result = true;
        infoList.forEach(info => {
            if (info.userExist) {
                result = false;
            }
            if (info.displayName.trim() == "") {
                result = false;
            }
            if (info.userName.trim() == "") {
                result = false;
            }
            if (info.password.trim().length < 6) {
                result = false;
            }
        })
        if (infoList.length == 0) {
            result = false;
        }
        setCanSave(result);
    }

    const saveNewUser = async () => {
        const sessionId = await get_admin_session();
        for (const newUser of newUserList) {
            try {
                await request(create_user({
                    admin_session_id: sessionId,
                    user_name: newUser.userName,
                    basic_info: {
                        display_name: newUser.displayName,
                        logo_uri: "",
                    },
                    user_state: USER_STATE_NORMAL,
                    password: newUser.password,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        message.info("创建用户成功");
        history.push(ADMIN_PATH_USER_LIST_SUFFIX);
    };

    const updateUserName = async (id: string, userName: string) => {
        const sessionId = await get_admin_session();
        const res = await request(exist_user({
            admin_session_id: sessionId,
            user_name: userName,
        }));
        const tmpList = newUserList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].userName = userName;
            tmpList[index].userExist = res.exist;
            setNewUserList(tmpList);
            updateCanSave(tmpList);
        }
    };

    const updateDisplayName = (id: string, displayName: string) => {
        const tmpList = newUserList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].displayName = displayName;
            setNewUserList(tmpList);
            updateCanSave(tmpList);
        }
    };

    const updatePassword = (id: string, password: string) => {
        const tmpList = newUserList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].password = password;
            setNewUserList(tmpList);
            updateCanSave(tmpList);
        }
    }

    const removeNewUser = (id: string) => {
        const tmpList = newUserList.filter(item => item.id != id);
        setNewUserList(tmpList);
        updateCanSave(tmpList);
    };

    return (
        <Card title="新增用户" extra={
            <Space>
                <Button type="default" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = newUserList.slice();
                    tmpList.push({
                        id: uniqId(),
                        userName: "",
                        displayName: "",
                        password: "",
                        userExist: false,
                    });
                    setNewUserList(tmpList);
                }}>新增用户</Button>
                <Button disabled={!canSave} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    saveNewUser();
                }}>保存</Button>
            </Space>
        }>
            <div>
                {newUserList.map((item, index) => (
                    <div key={item.id} style={{ marginBottom: "5px" }}>
                        <Space >
                            <span>{index + 1}&nbsp;&nbsp;</span>
                            <Form layout="inline">
                                <Form.Item label="用户名">
                                    <Input value={item.userName}
                                        status={getUserNameStatus(item)}
                                        prefix={getUserNamePrefix(item)}
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            updateUserName(item.id, e.target.value);
                                        }} />
                                </Form.Item>
                                <Form.Item label="昵称">
                                    <Input value={item.displayName}
                                        status={item.displayName.trim() == "" ? "warning" : ""} placeholder="请输入昵称"
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            updateDisplayName(item.id, e.target.value);
                                        }} />
                                </Form.Item>
                                <Form.Item label="密码">
                                    <Input.Password
                                        status={item.password.trim().length < 6 ? "warning" : ""} placeholder="请输入6位以上密码"
                                        onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            updatePassword(item.id, e.target.value);
                                        }} />
                                </Form.Item>
                            </Form>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeNewUser(item.id);
                            }}>移除</Button>
                        </Space>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CreateUser;