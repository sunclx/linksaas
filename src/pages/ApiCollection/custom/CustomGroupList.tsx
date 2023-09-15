import Button from "@/components/Button";
import { FolderAddOutlined } from "@ant-design/icons";
import { Card, Form, Input, List, Modal, message } from "antd";
import React, { useState } from "react";
import { create_group } from "@/api/http_custom";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { useCustomStores } from "./stores";
import { observer } from 'mobx-react';
import CustomGroup from "./CustomGroup";

interface AddGroupModalProps {
    onCancel: () => void;
}

const AddGroupModal = observer((props: AddGroupModalProps) => {
    const store = useCustomStores();
    const [groupName, setGroupName] = useState("");

    const createGroup = async () => {
        const sessionId = await get_session();
        await request(create_group({
            session_id: sessionId,
            project_id: store.api.projectId,
            api_coll_id: store.api.apiCollId,
            group_name: groupName,
        }));
        message.info("创建接口分组成功");
        store.api.loadGroupList();
        props.onCancel();
    };

    return (
        <Modal open title="创建接口分组"
            okText="创建" okButtonProps={{ disabled: groupName == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createGroup();
            }}>
            <Form>
                <Form.Item label="分组名称">
                    <Input value={groupName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGroupName(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});


const CustomGroupList = () => {
    const store = useCustomStores();

    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <Card bordered={false} title="接口列表" extra={
            <Button type="link" title="创建接口分组" style={{ minWidth: 0, padding: "0px 0px" }}
                disabled={!(store.api.canEdit)}>
                <FolderAddOutlined style={{ fontSize: "20px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddModal(true);
                }} />
            </Button>
        }>
            <List rowKey="group_id" dataSource={store.api.groupList} style={{ height: "calc(100vh - 60px)", overflowY: "scroll" }} renderItem={item => (
                <List.Item>
                    <CustomGroup group={item} />
                </List.Item>
            )} />
            {showAddModal == true && (
                <AddGroupModal
                    onCancel={() => setShowAddModal(false)} />
            )}
        </Card>
    );
};

export default observer(CustomGroupList);