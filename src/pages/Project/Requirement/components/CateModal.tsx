import { Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { create_cate, update_cate, remove_cate } from '@/api/project_requirement';
import { useStores } from "@/hooks";
import type { CateInfo } from '@/api/project_requirement';


interface AddCateModalProps {
    onCancel: () => void;
    onOk: () => void;
}

export const AddCateModal: React.FC<AddCateModalProps> = observer((props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [cateName, setCateName] = useState("");

    const createCate = async () => {
        const name = cateName.trim();
        if (name == "") {
            message.error("需求分类名称不能为空");
            return;
        }
        await request(create_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_name: name,
        }));
        props.onOk();
    };

    return (
        <Modal open title="创建需求分类"
            okText="创建"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createCate();
            }}>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="需求分类名称">
                    <Input value={cateName} placeholder="请输入需求分类名称" onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});

interface UpdateCateModalProps {
    cateInfo: CateInfo;
    onCancel: () => void;
    onOk: () => void;
}

export const UpdateCateModal: React.FC<UpdateCateModalProps> = observer((props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const [cateName, setCateName] = useState(props.cateInfo.cate_name);

    const updateCate = async () => {
        const name = cateName.trim();
        if (name == "") {
            message.error("需求分类名称不能为空");
            return;
        }
        await request(update_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_id: props.cateInfo.cate_id,
            cate_name: name,
        }));
        props.onOk();
    }
    return (
        <Modal open title="修改分类名称"
            okText="修改"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateCate();
            }}>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="需求分类名称">
                    <Input value={cateName} placeholder="请输入需求分类名称" onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCateName(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});

interface RemoveCateModalProps {
    cateInfo: CateInfo;
    onCancel: () => void;
    onOk: () => void;
}

export const RemoveCateModal: React.FC<RemoveCateModalProps> = observer((props) => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");

    const removeCate = async () => {
        await request(remove_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_id: props.cateInfo.cate_id,
        }));
        props.onOk();
    };

    return (
        <Modal open title="修改分类名称"
            okText="删除" okButtonProps={{ danger: true }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                removeCate();
            }}>
            是否删除需求类别&nbsp;{props.cateInfo.cate_name}&nbsp;?
        </Modal>
    );
});