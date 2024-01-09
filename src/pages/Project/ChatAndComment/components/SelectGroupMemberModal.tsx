import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal, Space, Transfer } from "antd";
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";

export interface SelectGroupMemberModalProps {
    onCancel: () => void;
    onOk: (newTitle: string, newUserIdList: string[]) => void;
}

const SelectGroupMemberModal = (props: SelectGroupMemberModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [newTitle, setNewTitle] = useState(projectStore.curProject?.chat_store.curGroup?.groupInfo.title ?? "");
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [hasChange, setHasChange] = useState(false);

    const isDisabled = (memberUserId: string) => {
        if ((projectStore.curProject?.chat_store.curGroupId ?? "") == "") { //创建
            return memberUserId == userStore.userInfo.userId;
        } else {//更新
            if ((projectStore.curProject?.chat_store.curGroup?.groupInfo.owner_user_id ?? "") == userStore.userInfo.userId) {
                return memberUserId == userStore.userInfo.userId;
            } else {
                return memberUserId == (projectStore.curProject?.chat_store.curGroup?.groupInfo.owner_user_id ?? "");
            }
        }
    }

    useEffect(() => {
        if ((projectStore.curProject?.chat_store.curGroupId ?? "") == "") { //创建
            setTargetKeys([userStore.userInfo.userId]);
        } else {//更新
            setTargetKeys((projectStore.curProject?.chat_store.curGroup?.memberList ?? []).map(item => item.member_user_id));
        }
    }, []);

    return (
        <Modal open title={(projectStore.curProject?.chat_store.curGroupId ?? "") == "" ? "创建沟通群" : "更新沟通分群"}
            okText={(projectStore.curProject?.chat_store.curGroupId ?? "") == "" ? "创建" : "更新"}
            okButtonProps={{ disabled: hasChange == false || newTitle == "" || targetKeys.length < 2 }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(newTitle, targetKeys);
            }}>
            <Form>
                <Form.Item label="群名称">
                    <Input value={newTitle} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setNewTitle(e.target.value);
                        setHasChange(true);
                    }} />
                </Form.Item>
                <Form.Item label="群成员:">
                    <Transfer dataSource={memberStore.memberList.map(item => ({
                        key: item.member.member_user_id,
                        displayName: item.member.display_name,
                        logoUri: item.member.logo_uri,
                        disabled: isDisabled(item.member.member_user_id),
                    }))}
                        showSearch
                        titles={["待选成员", "已选成员"]}
                        targetKeys={targetKeys}
                        render={item => (
                            <Space>
                                <UserPhoto logoUri={item.logoUri} style={{ width: "16px", borderRadius: "10px" }} />
                                <span>{item.displayName}</span>
                            </Space>
                        )}
                        onChange={(_, direction, moveKeys) => {
                            setHasChange(true);
                            if (direction == "right") {
                                setTargetKeys([...targetKeys, ...moveKeys]);
                            } else if (direction == "left") {
                                const tmpList = targetKeys.filter(item => moveKeys.includes(item) == false);
                                setTargetKeys(tmpList);
                            }
                        }}
                        filterOption={(value, row) => row.displayName.includes(value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(SelectGroupMemberModal);