import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Collapse, Form, Input, Modal, Space, Table, message } from "antd";
import s from "./BulletinListPanel.module.less";
import Button from "@/components/Button";
import type { BulletinInfoKey } from "@/api/project_bulletin";
import { create, update, remove, list_key, get as get_bulletin, mark_read } from "@/api/project_bulletin";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { ReadOnlyEditor, change_file_owner, is_empty_doc, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_BULLETIN, FILE_OWNER_TYPE_PROJECT } from "@/api/fs";
import type { ColumnsType } from 'antd/lib/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";

interface EditModalProps {
    bulletinId: string;
    inEdit: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const EditModal: React.FC<EditModalProps> = observer((props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: projectStore.curProject?.bulletin_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_BULLETIN,
        ownerId: props.bulletinId,
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const loadBulletin = async () => {
        const res = await request(get_bulletin({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            bulletin_id: props.bulletinId,
        }));
        setTitle(res.key_info.title);
        editorRef.current?.setContent(res.content);
        setContent(res.content);
    };

    const updateBulletin = async () => {
        if (title.trim() == "") {
            message.error("标题不能为空");
            return;
        }
        const newContent = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        if (is_empty_doc(newContent)) {
            message.error("内容不能为空");
            return;
        }
        await request(update({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            bulletin_id: props.bulletinId,
            title: title.trim(),
            content: JSON.stringify(newContent),
        }));
        props.onOk();
        message.info("更新成功");
    };

    const markRead = async () => {
        await request(mark_read({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            bulletin_id: props.bulletinId,
        }));
    };

    useEffect(() => {
        if (props.inEdit == false) {
            loadBulletin();
            markRead();
        } else if (props.inEdit && editorRef.current != null) {
            loadBulletin();
        }
    }, [editorRef.current])

    return (
        <Modal open title={props.inEdit ? "更新公告" : "查看公告"} footer={props.inEdit ? undefined : null}
            okText="更新" okButtonProps={{ disabled: title.trim() == "" }}
            width="calc(100vw - 600px)"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateBulletin();
            }}>
            <Form labelCol={{ span: 2 }}>
                <Form.Item label="标题">
                    {props.inEdit == true && (
                        <Input value={title} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTitle(e.target.value);
                        }} />
                    )}
                    {props.inEdit == false && (
                        <div>{title}</div>
                    )}
                </Form.Item>
                <Form.Item label="内容">
                    {props.inEdit == true && (
                        <div className="_editChatContext">{editor}</div>
                    )}
                    {props.inEdit == false && content != "" && (
                        <div className="_editChatContext">
                            <ReadOnlyEditor content={content} />
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
});

interface CreateModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateModal: React.FC<CreateModalProps> = observer((props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [title, setTitle] = useState("");

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: projectStore.curProject?.bulletin_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_PROJECT,
        ownerId: projectStore.curProjectId,
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const createBulletin = async () => {
        if (title.trim() == "") {
            message.error("标题不能为空");
            return;
        }
        const content = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        if (is_empty_doc(content)) {
            message.error("内容不能为空");
            return;
        }
        const createRes = await request(create({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            title: title.trim(),
            content: JSON.stringify(content),
        }));
        //变更文件Owner
        await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_BULLETIN, createRes.bulletin_id);
        props.onOk();
        message.info("创建成功");
    };

    return (
        <Modal title="创建公告" open okText="创建" okButtonProps={{ disabled: title.trim() == "" }}
            width="calc(100vw - 600px)"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createBulletin();
            }}>
            <Form labelCol={{ span: 2 }}>
                <Form.Item label="标题">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="内容">
                    <div className="_editChatContext">{editor}</div>
                </Form.Item>
            </Form>
        </Modal>
    );
});


const PAGE_SIZE = 10;

const BulletinListPanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [bulletinList, setBulletinList] = useState<BulletinInfoKey[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showCreate, setShowCreate] = useState(false);
    const [showBulletinId, setShowBulletinId] = useState("");
    const [inEdit, setInEdit] = useState(false);
    const [removeBulletinInfo, setRemoveBulletinInfo] = useState<BulletinInfoKey | null>(null);

    const loadBulletinList = async () => {
        const res = await request(list_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_un_read: false,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setBulletinList(res.key_list);
    };

    const removeBulletin = async () => {
        if (removeBulletinInfo == null) {
            return;
        }
        await request(remove({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            bulletin_id: removeBulletinInfo.bulletin_id,
        }));
        setRemoveBulletinInfo(null);
        await loadBulletinList();
        message.info("删除成功");
    };

    const columns: ColumnsType<BulletinInfoKey> = [
        {
            title: "标题",
            render: (_, row: BulletinInfoKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setInEdit(false);
                    setShowBulletinId(row.bulletin_id);
                }}>{row.title}</a>
            ),
        },
        {
            title: "发布者",
            width: 150,
            render: (_, row: BulletinInfoKey) => (
                <div>
                    <UserPhoto logoUri={row.create_logo_uri} style={{ width: "20px", borderRadius: "10px", marginRight: "10px" }} />
                    {row.create_display_name}
                </div>
            ),
        },
        {
            title: "发布时间",
            width: 150,
            render: (_, row: BulletinInfoKey) => moment(row.create_time).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "操作",
            width: 120,
            render: (_, row: BulletinInfoKey) => (
                <Space size="large">
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={projectStore.isClosed || !projectStore.isAdmin}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setInEdit(true);
                            setShowBulletinId(row.bulletin_id);
                        }}>修改</Button>
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={projectStore.isClosed || !projectStore.isAdmin}
                        danger
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveBulletinInfo(row);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadBulletinList();
    }, [curPage]);

    useEffect(() => {
        if (curPage != 0) {
            setCurPage(0);
        } else {
            loadBulletinList();
        }
    }, [projectStore.curProjectId]);

    useEffect(() => {
        if (curPage == 0) {
            loadBulletinList();
        }
    }, [projectStore.curProject?.project_status.bulletin_count])

    return (
        <>
            <Collapse bordered={true} className={s.bulletin_list_wrap}>
                <Collapse.Panel key="bulletinList" header={<h1 className={s.head}>项目公告</h1>} extra={
                    <>
                        {projectStore.isAdmin && !projectStore.isClosed && (
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowCreate(true);
                            }}>发布公告</Button>
                        )}
                    </>
                }>
                    <Table rowKey="bulletin_id" dataSource={bulletinList} columns={columns}
                        pagination={{ current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }} />
                </Collapse.Panel>
            </Collapse>
            {showCreate == true && (
                <CreateModal onOk={() => {
                    if (curPage == 0) {
                        loadBulletinList();
                    } else {
                        setCurPage(0);
                    }
                    setShowCreate(false);
                }} onCancel={() => setShowCreate(false)} />
            )}
            {showBulletinId != "" && (
                <EditModal bulletinId={showBulletinId} inEdit={inEdit} onCancel={() => setShowBulletinId("")}
                    onOk={() => {
                        setShowBulletinId("");
                        loadBulletinList();
                    }} />
            )}
            {removeBulletinInfo != null && (
                <Modal title="删除公告" open
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveBulletinInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeBulletin();
                    }}>
                    <p>是否删除公告  {removeBulletinInfo.title}?</p>
                </Modal>
            )}
        </>
    );
};

export default observer(BulletinListPanel);