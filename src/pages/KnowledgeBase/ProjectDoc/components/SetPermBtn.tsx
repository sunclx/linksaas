import { Button, Card, Checkbox, Form, Select, Space, message } from "antd";
import React, { useState } from "react";
import type { DocPerm } from "@/api/project_doc";
import { update_doc_perm } from "@/api/project_doc";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

const EditPermBtn = () => {
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');
    const docSpaceStore = useStores('docSpaceStore');
    const userStore = useStores('userStore');

    const [docPerm, setDocPerm] = useState<DocPerm>(docSpaceStore.curDoc?.base_info.doc_perm ?? {
        read_for_all: true,
        extra_read_user_id_list: [],
        write_for_all: true,
        extra_write_user_id_list: [],
    });
    const [hasChange, setHasChange] = useState(false);

    const updatePerm = async () => {
        if (!hasChange) {
            return;
        }
        if (docPerm.read_for_all == false && docPerm.extra_read_user_id_list.length == 0) {
            message.error("可读成员列表不能为空");
            return;
        }
        if (docPerm.write_for_all == false && docPerm.extra_write_user_id_list.length == 0) {
            message.error("可修复成员列表不能为空");
        }
        await request(update_doc_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
            doc_id: docSpaceStore.curDocId,
            doc_perm: docPerm,
        }));
        message.info("更新文档权限成功");
        setHasChange(false);
        await docSpaceStore.updateCurDoc();
    }

    return (
        <Card title="文档权限" style={{ borderRadius: "6px", width: "420px" }} extra={
            <>
                {projectStore.isAdmin && (
                    <Space>
                        <Button disabled={!hasChange} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDocPerm(docSpaceStore.curDoc?.base_info.doc_perm ?? {
                                read_for_all: true,
                                extra_read_user_id_list: [],
                                write_for_all: true,
                                extra_write_user_id_list: [],
                            });
                            setHasChange(false);
                        }}>取消</Button>
                        <Button disabled={!hasChange} type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            updatePerm();
                        }}>保存</Button>
                    </Space>

                )}

            </>
        }>
            <Form labelCol={{ span: 4 }} disabled={!projectStore.isAdmin}>
                <Form.Item label="读权限">
                    <Checkbox checked={docPerm.read_for_all}
                        onChange={e => {
                            e.stopPropagation();
                            setDocPerm({
                                ...docPerm,
                                read_for_all: e.target.checked,
                            });
                            setHasChange(true);
                        }}>所有成员可读当前文档</Checkbox>
                </Form.Item>
                {docPerm.read_for_all == false && (
                    <Form.Item label="可读成员" help={
                        <>
                            {docPerm.extra_read_user_id_list.length == 0 && (
                                <span style={{ color: "red" }}>可读成员列表为空</span>
                            )}
                        </>
                    }>
                        <Select mode="multiple" value={docPerm.extra_read_user_id_list} onChange={value => {
                            setDocPerm({
                                ...docPerm,
                                read_for_all: value.length == 0,
                                extra_read_user_id_list: value,
                            });
                            setHasChange(true);
                        }}>
                            {memberStore.memberList.map(item => (
                                <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>{item.member.display_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item label="修改权限">
                    <Checkbox checked={docPerm.write_for_all} onChange={e => {
                        e.stopPropagation();
                        setDocPerm({
                            ...docPerm,
                            write_for_all: e.target.checked,
                        });
                        setHasChange(true);
                    }}>所有成员可修改当前文档</Checkbox>
                </Form.Item>
                {docPerm.write_for_all == false && (
                    <Form.Item label="可修改成员" help={
                        <>
                            {docPerm.extra_write_user_id_list.length == 0 && (
                                <span style={{ color: "red" }}>可修改成员列表为空</span>
                            )}
                        </>
                    }>
                        <Select mode="multiple" value={docPerm.extra_write_user_id_list} onChange={value => {
                            setDocPerm({
                                ...docPerm,
                                write_for_all: value.length == 0,
                                extra_write_user_id_list: value,
                            });
                            setHasChange(true);
                        }}>
                            {memberStore.memberList.map(item => (
                                <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>{item.member.display_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
};

export default observer(EditPermBtn);