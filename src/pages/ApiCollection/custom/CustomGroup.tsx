import React, { useState } from "react";
import type { GroupInfo } from "./types";
import { Button, Card, Form, Input, List, Modal, Popover, Space, message } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import type { ApiCollInfo } from "@/api/api_collection";
import { HTTP_BODY_NONE, create_api_item, remove_group, update_group } from "@/api/http_custom";
import { get_session } from "@/api/user";
import { request } from "@/utils/request";
import s from "./CustomGroup.module.less";
import classNames from "classnames";

interface UpdateNameModalProps {
    name: string;
    onCancel: () => void;
    onChange: (newName: string) => void;
}

const UpdateNameModal = (props: UpdateNameModalProps) => {
    const [name, setName] = useState(props.name);

    return (
        <Modal open title="修改名称"
            okText="修改" okButtonProps={{ disabled: !(name != "" && name != props.name) }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onChange(name);
            }}
        >
            <Form>
                <Form.Item label="名称">
                    <Input value={name} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setName(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export interface CustomGroupProps {
    projectId: string;
    group: GroupInfo;
    curUserId: string;
    isAdminUser: boolean;
    collInfo: ApiCollInfo;
    curApiIdList: string[];
    onChange: () => void;
    onSelect: (apiItemId: string) => void;
}

const CustomGroup = (props: CustomGroupProps) => {
    const [showUpdateGrpName, setShowUpdateGrpName] = useState(false);

    const createApiItem = async () => {
        const sessionId = await get_session();
        await request(create_api_item({
            session_id: sessionId,
            project_id: props.projectId,
            api_coll_id: props.collInfo.api_coll_id,
            group_id: props.group.group_id,
            api_item_name: "New Api",
            method: "GET",
            url: "/",
            param_list: [],
            header_list: [],
            body_type: HTTP_BODY_NONE,
            body: {
                NodyBody: "",
            },
        }));
        props.onChange();
    };

    const removeGroup = async () => {
        const sessionId = await get_session();
        await request(remove_group({
            session_id: sessionId,
            project_id: props.projectId,
            api_coll_id: props.collInfo.api_coll_id,
            group_id: props.group.group_id,
        }));
        message.info("删除接口分组成功");

        props.onChange();
    };

    const updateGroupName = async (newName: string) => {
        const sessionId = await get_session();
        await request(update_group({
            session_id: sessionId,
            project_id: props.projectId,
            api_coll_id: props.collInfo.api_coll_id,
            group_id: props.group.group_id,
            group_name: newName,
        }));
        message.info("更新接口分组名称成功");
        setShowUpdateGrpName(false);
        props.onChange();
    };

    return (
        <Card title={<span title={props.group.group_name}>{props.group.group_name}</span>} style={{ width: "100%" }} bordered={false} extra={
            <Space>
                <Button type="link" style={{ minBlockSize: 0, padding: "0px 0px" }} title="创建接口"
                    disabled={!((props.collInfo.create_user_id == props.curUserId) || props.isAdminUser)}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createApiItem();
                    }}>
                    <PlusOutlined />
                </Button>
                <Popover trigger="click" placement="right" content={
                    <Space direction="vertical">
                        <Button type="link" disabled={!((props.collInfo.create_user_id == props.curUserId) || props.isAdminUser)}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowUpdateGrpName(true);
                            }}>
                            修改名称
                        </Button>
                        <Button type="link" danger
                            disabled={!((props.group.item_count == 0) && ((props.collInfo.create_user_id == props.curUserId) || props.isAdminUser))}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeGroup();
                            }}>
                            删除分组
                        </Button>
                    </Space>
                }>
                    <MoreOutlined />
                </Popover>
            </Space>
        }>
            <List rowKey="api_item_id" dataSource={props.group.item_list} renderItem={item => (
                <List.Item className={classNames(s.api_item, props.curApiIdList.includes(item.api_item_id) ? s.active : "")}>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        props.onSelect(item.api_item_id);
                    }}>{item.api_item_name}</Button>
                </List.Item>
            )} />
            {showUpdateGrpName == true && (
                <UpdateNameModal name={props.group.group_name} onCancel={() => setShowUpdateGrpName(false)}
                    onChange={newName => {
                        updateGroupName(newName);
                    }} />
            )}
        </Card>
    );
};

export default CustomGroup;