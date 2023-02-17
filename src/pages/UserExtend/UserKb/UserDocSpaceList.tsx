import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { list_space, list_doc_index, KB_SPACE_PRIVATE, KB_SPACE_SECURE, remove_space } from "@/api/user_kb";
import type { KbSpaceInfo, DocIndexInfo } from "@/api/user_kb";
import { request } from "@/utils/request";
import { Card, Menu, Modal, Popover, Table } from "antd";
import Button from "@/components/Button";
import s from "./UserDocSpaceList.module.less";
import { FolderOpenOutlined, FolderOutlined, LinkOutlined, LockOutlined, MoreOutlined, PlusOutlined, UnlockOutlined } from "@ant-design/icons";
import CreateKbSpaceModal from "./components/CreateKbSpaceModal";
import ValidSshKeyModal from "./components/VaildSshKeyModal";
import { useHistory } from "react-router-dom";
import { WORKBENCH_KB_DOC_SUFFIX } from "@/utils/constant";
import type { UserDocState } from "./UserDoc";
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import UpdateSpaceNameModal from "./components/UpdateSpaceNameModal";

interface UserDocSpaceListProps {
    spaceId: string;
    onChange: (kbSpace: KbSpaceInfo) => void;
}

const UserDocSpaceList: React.FC<UserDocSpaceListProps> = (props) => {
    const history = useHistory();

    const userStore = useStores('userStore');

    const [curKbSpaceId, setCurKbSpaceId] = useState(props.spaceId);
    const [kbSpaceList, setKbSpaceList] = useState<KbSpaceInfo[]>([]);
    const [docIndexList, setDocIndexList] = useState<DocIndexInfo[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [validKbSpace, setValidKbSpace] = useState<KbSpaceInfo | null>(null);
    const [updateKbSpace, setUpdateKbSpace] = useState<KbSpaceInfo | null>(null);
    const [removeKbSpace, setRemoveKbSpace] = useState<KbSpaceInfo | null>(null);

    const loadKbSpace = async () => {
        const res = await request(list_space(userStore.sessionId));
        setKbSpaceList(res.info_list);
        const index = res.info_list.findIndex(item => item.space_id == curKbSpaceId);
        if (index != -1) {
            props.onChange(res.info_list[index]);
        }
    };

    const loadDocIndexList = async () => {
        const res = await request(list_doc_index(userStore.sessionId, curKbSpaceId));
        setDocIndexList(res.info_list);
    };

    const changeKbSpace = async (spaceId: string) => {
        if (spaceId == curKbSpaceId) {
            return;
        }
        const index = kbSpaceList.findIndex(item => item.space_id == spaceId);
        if (index == -1) {
            return;
        }
        props.onChange(kbSpaceList[index]);
        if (kbSpaceList[index].kb_space_type == KB_SPACE_SECURE) {
            setValidKbSpace(kbSpaceList[index]);
        } else {
            setCurKbSpaceId(spaceId);
        }
    }

    const removeSpace = async () => {
        if (removeKbSpace == null) {
            return;
        }
        await request(remove_space(userStore.sessionId, removeKbSpace.space_id));
        setRemoveKbSpace(null);
        await loadKbSpace();
        await changeKbSpace(userStore.userInfo.defaultKbSpaceId);
    };

    const columns: ColumnsType<DocIndexInfo> = [
        {
            title: "文档标题",
            render: (_, row: DocIndexInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const index = kbSpaceList.findIndex(item => item.space_id == curKbSpaceId);
                    if (index == -1) {
                        return;
                    }
                    const state: UserDocState = {
                        spaceId: curKbSpaceId,
                        sshPubKey: kbSpaceList[index].ssh_pub_key,
                        docId: row.doc_id,
                        readMode: true,
                    };
                    history.push(WORKBENCH_KB_DOC_SUFFIX, state);
                }}><LinkOutlined />&nbsp;{row.title}</a>
            ),
        },
        {
            title: "创建时间",
            width: 200,
            render: (_, row: DocIndexInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "修改时间",
            width: 200,
            render: (_, row: DocIndexInfo) => moment(row.update_time).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        loadKbSpace();
    }, []);

    useEffect(() => {
        if (curKbSpaceId != "") {
            loadDocIndexList();
        }
    }, [curKbSpaceId])

    return (
        <>
            <div className={s.content_wrap}>
                <div className={s.left_panel}>
                    <Card title="知识库空间" bordered={false}
                        headStyle={{ padding: "0px 10px" }}
                        bodyStyle={{ padding: "0px 0px" }}
                        extra={
                            <Button type="text" style={{ minWidth: "0px", fontSize: "16px" }} title="创建知识库空间"
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowAddModal(true);
                                }}><PlusOutlined /></Button>}>
                        <div className={s.space_list_wrap}>
                            <Menu selectedKeys={[curKbSpaceId]}
                                className={s.space_list}
                                items={kbSpaceList.map(item => ({
                                    label: (
                                        <div className={s.kb_space_wrap}>
                                            <div className={s.title} onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                changeKbSpace(item.space_id);
                                            }}>
                                                {item.kb_space_type == KB_SPACE_PRIVATE && item.space_id == curKbSpaceId && <FolderOpenOutlined />}
                                                {item.kb_space_type == KB_SPACE_PRIVATE && item.space_id != curKbSpaceId && <FolderOutlined />}
                                                {item.kb_space_type == KB_SPACE_SECURE && item.space_id == curKbSpaceId && <UnlockOutlined />}
                                                {item.kb_space_type == KB_SPACE_SECURE && item.space_id != curKbSpaceId && <LockOutlined />}
                                                &nbsp;{item.basic_info.space_name}
                                            </div>
                                            <div className={s.more}>
                                                {item.space_id == curKbSpaceId && item.default == false && (
                                                    <Popover content={
                                                        <div className={s.pop_menu}>
                                                            <div>
                                                                <Button type="link" onClick={e => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    setUpdateKbSpace(item);
                                                                }}>修改名称</Button>
                                                            </div>
                                                            <div>
                                                                <Button type="link" danger disabled={item.doc_count > 0} onClick={e => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    setRemoveKbSpace(item);
                                                                }}>删除空间</Button>
                                                            </div>
                                                        </div>
                                                    } trigger="click" placement="bottom">
                                                        <MoreOutlined />
                                                    </Popover>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                    key: item.space_id,
                                }))} />
                        </div>
                    </Card>
                </div>
                <div className={s.right_panel}>
                    <Table rowKey="doc_id" columns={columns} dataSource={docIndexList} pagination={false} bordered={false} />
                </div>
            </div>
            {showAddModal == true && (
                <CreateKbSpaceModal onCancel={() => setShowAddModal(false)} onOk={() => {
                    setShowAddModal(false);
                    loadKbSpace();
                }} />
            )}
            {validKbSpace != null && (
                <ValidSshKeyModal sshPubKey={validKbSpace.ssh_pub_key} onCancel={() => setValidKbSpace(null)}
                    onOk={() => {
                        setCurKbSpaceId(validKbSpace.space_id);
                        setValidKbSpace(null);
                    }} />
            )}
            {removeKbSpace != null && (
                <Modal title={`删除知识库空间 ${removeKbSpace.basic_info.space_name}`} open
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveKbSpace(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSpace();
                    }}>
                    是否删除知识库空间&nbsp;{removeKbSpace.basic_info.space_name}&nbps;?
                </Modal>
            )}
            {updateKbSpace != null && (
                <UpdateSpaceNameModal
                    spaceId={updateKbSpace.space_id}
                    spaceName={updateKbSpace.basic_info.space_name}
                    onCancel={() => setUpdateKbSpace(null)}
                    onOk={newName => {
                        const tmpList = kbSpaceList.slice();
                        const index = tmpList.findIndex(item => item.space_id == updateKbSpace.space_id);
                        if (index != -1) {
                            tmpList[index].basic_info.space_name = newName;
                            setKbSpaceList(tmpList);
                        }
                        setUpdateKbSpace(null);
                    }} />
            )}
        </>
    );
};

export default observer(UserDocSpaceList);