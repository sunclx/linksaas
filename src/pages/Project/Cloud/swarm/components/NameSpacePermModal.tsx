import React, { useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Checkbox, Form, Modal, message } from "antd";
import { gen_one_time_token, type MemberInfo } from "@/api/project_member";
import type { NameSpaceUserPerm } from "@/api/swarm_proxy";
import { set_name_space_perm } from "@/api/swarm_proxy";
import { request } from "@/utils/request";

export interface NameSpacePermModalProps {
    onClose: () => void;
}

const NameSpacePermModal = (props: NameSpacePermModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');
    const cloudStore = useStores('cloudStore');

    const [userPermList, setUserPermList] = useState(cloudStore.swarmUserPermList);
    const [hasChange, setHasChange] = useState(false);

    const calcPermStr = (member: MemberInfo) => {
        if (member.can_admin) {
            return ["update_scale", "update_image", "logs", "exec"];
        }
        const index = userPermList.findIndex(item => item.user_id == member.member_user_id);
        if (index == -1) {
            return [];
        }
        const permStrList: string[] = [];
        if (userPermList[index].update_scale) {
            permStrList.push("update_scale");
        }
        if (userPermList[index].update_image) {
            permStrList.push("update_image");
        }
        if (userPermList[index].logs) {
            permStrList.push("logs");
        }
        if (userPermList[index].exec) {
            permStrList.push("exec");
        }
        return permStrList;
    };

    const updatePerm = async () => {
        const servAddr = projectStore.curProject?.setting.swarm_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        await request(set_name_space_perm(servAddr, {
            token: tokenRes.token,
            name_space: cloudStore.curNameSpace,
            perm: {
                name_space: cloudStore.curNameSpace,
                user_perm_list: userPermList
            }
        }));
        message.info("修改权限成功");
        await cloudStore.loadSwarmUserPermList();
        props.onClose();
    };

    return (
        <Modal open title={projectStore.isAdmin ? "修改权限" : "查看权限"}
            bodyStyle={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
            footer={projectStore.isAdmin ? undefined : null}
            okText="修改" okButtonProps={{ disabled: !hasChange }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updatePerm();
            }}>
            <Form labelCol={{ span: 6 }}>
                {memberStore.memberList.map(item => (
                    <Form.Item key={item.member.member_user_id} label={item.member.display_name}>
                        <Checkbox.Group options={[
                            {
                                label: "修改Pod数量",
                                value: "update_scale",
                            },
                            {
                                label: "更新镜像",
                                value: "update_image",
                            },
                            {
                                label: "查看日志",
                                value: "logs",
                            },
                            {
                                label: "打开终端",
                                value: "exec",
                            }
                        ]} value={calcPermStr(item.member)} disabled={item.member.can_admin || !projectStore.isAdmin}
                            onChange={values => {
                                const newPerm: NameSpaceUserPerm = {
                                    user_id: item.member.member_user_id,
                                    update_scale: values.includes("update_scale"),
                                    update_image: values.includes("update_image"),
                                    logs: values.includes("logs"),
                                    exec: values.includes("exec"),
                                };
                                const tmpList = userPermList.slice();
                                const index = tmpList.findIndex(item2 => item2.user_id == item.member.member_user_id);
                                if (index != -1) {
                                    tmpList[index] = newPerm;
                                } else {
                                    tmpList.push(newPerm);
                                }
                                setUserPermList(tmpList);
                                setHasChange(true);
                            }} />
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};

export default observer(NameSpacePermModal);