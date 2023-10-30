import { Checkbox, Divider, Form, Input, Modal, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import type { PLATFORM_TYPE, PipeLinePerm, SimpleCredential } from "@/api/project_cicd";
import { create_pipe_line, update_pipe_line_perm, list_credential, PLATFORM_TYPE_LINUX, PLATFORM_TYPE_DARWIN, PLATFORM_TYPE_WINDOWS, CREDENTIAL_TYPE_KEY } from "@/api/project_cicd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { uniqId } from "@/utils/utils";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { OpenPipeLineWindow } from "./utils";

export interface CreatePipeLineModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreatePipeLineModal = (props: CreatePipeLineModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [credList, setCredList] = useState<SimpleCredential[]>([]);

    const [pipeLineName, setPipeLineName] = useState("");
    const [platForm, setPlatForm] = useState<PLATFORM_TYPE>(PLATFORM_TYPE_LINUX);
    const [credId, setCredId] = useState("");
    const [gitUrl, setGitUrl] = useState("");
    const [perm, setPerm] = useState<PipeLinePerm>({
        update_for_all: true,
        extra_update_user_id_list: [],
        exec_for_all: true,
        extra_exec_user_id_list: [],
    });

    const loadCredList = async () => {
        const res = await request(list_credential({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setCredList(res.credential_list);
    };

    const valid = (): boolean => {
        if (pipeLineName == "") {
            return false;
        }
        if (gitUrl == "") {
            return false;
        }
        return true;
    };

    const createPipeLine = async () => {
        const res = await request(create_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            pipe_line_name: pipeLineName,
            plat_form: platForm,
            gitsource_job: {
                job_id: uniqId(),
                credential_id: credId,
                git_url: gitUrl,
                position: {
                    x: 0,
                    y: 0,
                },
                timeout: 600,
            },
            exec_job_list: [],
        }));
        if (perm.update_for_all != true || perm.exec_for_all != true) {
            await request(update_pipe_line_perm({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                pipe_line_id: res.pipe_line_id,
                pipe_line_perm: perm,
            }));
        }
        props.onOk();
        message.info("创建成功");
        //打开流水线编辑页面
        let canUpdate = false;
        if (projectStore.isAdmin || perm.update_for_all || perm.extra_update_user_id_list.includes(userStore.userInfo.userId)) {
            canUpdate = true;
        }
        let canExec = false;
        if (projectStore.isAdmin || perm.exec_for_all || perm.extra_exec_user_id_list.includes(userStore.userInfo.userId)) {
            canExec = true;
        }
        OpenPipeLineWindow(pipeLineName, projectStore.curProjectId, projectStore.curProject?.ci_cd_fs_id ?? "", res.pipe_line_id, canUpdate, canExec, projectStore.isAdmin);
    };

    useEffect(() => {
        loadCredList();
    }, []);

    return (
        <Modal open title="创建流水线"
            okText="创建" okButtonProps={{ disabled: !valid() }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createPipeLine();
            }}>
            <Form labelCol={{ span: 3 }}>
                <Form.Item label="名称">
                    <Input value={pipeLineName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setPipeLineName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="运行平台">
                    <Select value={platForm} onChange={value => setPlatForm(value)}>
                        <Select.Option value={PLATFORM_TYPE_LINUX}>LINUX</Select.Option>
                        <Select.Option value={PLATFORM_TYPE_DARWIN}>MAC</Select.Option>
                        <Select.Option value={PLATFORM_TYPE_WINDOWS}>WINDOWS</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="GIT地址" help="对应git clone命令地址">
                    <Input value={gitUrl} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGitUrl(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="GIT验证">
                    <Select value={credId} onChange={value => setCredId(value)}>
                        <Select.Option value="">无需验证</Select.Option>
                        {credList.map(item => (
                            <Select.Option key={item.credential_id} value={item.credential_id}>{item.credential_type == CREDENTIAL_TYPE_KEY ? "SSH密钥" : "密码"}&nbsp;{item.credential_name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Divider orientation="left">权限设置</Divider>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="全体成员可修改">
                    <Checkbox checked={perm.update_for_all} onChange={e => {
                        e.stopPropagation();
                        setPerm({
                            ...perm,
                            update_for_all: e.target.checked,
                            extra_update_user_id_list: e.target.checked ? [] : perm.extra_update_user_id_list,
                        });
                    }} />
                </Form.Item>
                {perm.update_for_all == false && (
                    <Form.Item label="可修改成员" help="管理员权限始终可修改流水线">
                        <Select mode="multiple" value={perm.extra_update_user_id_list} onChange={value => {
                            setPerm({
                                ...perm,
                                extra_update_user_id_list: value,
                            });
                        }}>
                            {memberStore.memberList.filter(item => item.member.can_admin == false).map(item => (
                                <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                    <Space>
                                        <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: '8px' }} />
                                        {item.member.display_name}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
                <Form.Item label="全体成员可执行">
                    <Checkbox checked={perm.exec_for_all} onChange={e => {
                        e.stopPropagation();
                        setPerm({
                            ...perm,
                            exec_for_all: e.target.checked,
                            extra_exec_user_id_list: e.target.checked ? [] : perm.extra_exec_user_id_list,
                        });
                    }} />
                </Form.Item>
                {perm.exec_for_all == false && (
                    <Form.Item label="可执行成员" help="管理员权限始终可执行流水线">
                        <Select mode="multiple" value={perm.extra_exec_user_id_list} onChange={value => {
                            setPerm({
                                ...perm,
                                extra_exec_user_id_list: value,
                            });
                        }}>
                            {memberStore.memberList.filter(item => item.member.can_admin == false).map(item => (
                                <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                    <Space>
                                        <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: '8px' }} />
                                        {item.member.display_name}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default CreatePipeLineModal;