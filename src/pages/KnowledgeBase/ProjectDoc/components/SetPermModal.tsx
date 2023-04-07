import { Checkbox, Form, Modal, Select } from "antd";
import React, { useState } from "react";
import type { DocPerm } from "@/api/project_doc";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";

interface EditPermModalProps {
    docPerm: DocPerm;
    onCancel: () => void;
    onOk: (newPerm: DocPerm | null) => void;
}

const EditPermModal: React.FC<EditPermModalProps> = (props) => {
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [docPerm, setDocPerm] = useState(props.docPerm);
    const [hasChange, setHasChange] = useState(false);

    return (
        <Modal open title="设置文档权限" footer={projectStore.isAdmin ? undefined : null}
            okText="设置" onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }} onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (hasChange) {
                    props.onOk(docPerm);
                } else {
                    props.onOk(null);
                }
            }}>
            <Form labelCol={{ span: 4 }} disabled={!projectStore.isAdmin}>
                <Form.Item label="读权限">
                    <Checkbox checked={docPerm.read_for_all} onChange={e => {
                        e.stopPropagation();
                        setDocPerm({
                            ...docPerm,
                            read_for_all: e.target.checked,
                        });
                        setHasChange(true);
                    }}>所有成员可读当前文档</Checkbox>
                </Form.Item>
                {docPerm.read_for_all == false && (
                    <Form.Item label="可读成员">
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
                    <Form.Item label="可修改成员">
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
        </Modal>
    );
};

export default observer(EditPermModal);