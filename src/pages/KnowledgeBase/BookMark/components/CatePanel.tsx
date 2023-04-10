import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useHistory, useLocation } from "react-router-dom";
import { LinkBookMarkCateInfo, type LinkBookMarkCateState } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { CateInfo } from "@/api/project_bookmark";
import { list_cate, create_cate, update_cate, remove_cate } from "@/api/project_bookmark";
import { Button, Card, Form, Input, List, Modal, Popover, Space, message } from "antd";
import s from "./CatePanel.module.less";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from 'classnames';

interface CateItemProps {
    cateInfo: CateInfo;
    curCateId: string;
    onUpdate: () => void;
    onRemove: () => void;
    onClick: () => void;
};

const CateItem: React.FC<CateItemProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [hover, setHover] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newCateName, setNewCateName] = useState("");

    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const updateCate = async () => {
        if (newCateName.trim() == "") {
            return;
        }
        await request(update_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_id: props.cateInfo.cate_id,
            cate_name: newCateName,
        }));
        setShowUpdateModal(false);
        props.onUpdate();
    };

    const removeCate = async () => {
        await request(remove_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_id: props.cateInfo.cate_id,
        }));
        setShowRemoveModal(false);
        props.onRemove();
    };

    return (
        <div onMouseEnter={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(true);
        }} onMouseLeave={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(false);
        }} className={classNames(s.item, props.curCateId == props.cateInfo.cate_id ? s.active : "")}>
            <Button type="text" className={s.label} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClick();
            }}>{props.cateInfo.cate_name}</Button>
            {hover == true && (
                <Popover trigger="click" placement="bottom" content={
                    <Space direction="vertical" style={{ padding: "10px 10px" }}>
                        <Button type="link" disabled={!projectStore.isAdmin} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setNewCateName(props.cateInfo.cate_name);
                            setShowUpdateModal(true);
                        }}>修改名称</Button>
                        <Button type="link" danger disabled={projectStore.isAdmin == false || props.cateInfo.book_mark_count > 0}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除分类</Button>
                    </Space>
                }>
                    <MoreOutlined style={{ padding: "0px 10px" }} />
                </Popover>
            )}
            {showUpdateModal == true && (
                <Modal open title="修改名称"
                    okText="修改" okButtonProps={{ disabled: newCateName.trim() == "" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setNewCateName(props.cateInfo.cate_name);
                        setShowUpdateModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateCate();
                    }}>
                    <Form>
                        <Form.Item label="分类名称">
                            <Input value={newCateName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNewCateName(e.target.value);
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {showRemoveModal == true && (
                <Modal open title="删除分类"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeCate();
                    }}>
                    是否要删除书签分类&nbsp;{props.cateInfo.cate_name}?
                </Modal>
            )}
        </div>
    );
}

const CatePanel = () => {
    const history = useHistory();
    const location = useLocation();
    const state: LinkBookMarkCateState = location.state as (LinkBookMarkCateState | undefined) ?? { cateId: "" };

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore')

    const [cateInfoList, setCateInfoList] = useState<CateInfo[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCateName, setNewCateName] = useState("");

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setCateInfoList(res.cate_info_list);
    };

    const createCate = async () => {
        if (newCateName.trim() == "") {
            return;
        }
        await request(create_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            cate_name: newCateName,
        }));
        setNewCateName("");
        setShowAddModal(false);
        message.info("增加分类成功");
        await loadCateList();
    };

    useEffect(() => {
        loadCateList();
    }, [state.cateId, location.search])

    return (
        <Card title="书签分类" bordered={false}
            bodyStyle={{ height: "calc(100vh - 200px)", overflowY: "scroll" }} className={s.content_wrap}
            extra={
                <>
                    {projectStore.isAdmin == true && (
                        <Button type="text"
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNewCateName("");
                                setShowAddModal(true);
                            }}><PlusOutlined /></Button>
                    )}
                </>
            }>
            <List>
                <List.Item>
                    <div className={classNames(s.item, state.cateId == "" ? s.active : "")}>
                        <Button type="text" className={s.label} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToLink(new LinkBookMarkCateInfo("", projectStore.curProjectId, ""), history);
                        }}>未分类书签</Button>
                    </div>
                </List.Item>
                {cateInfoList.map(cateInfo => (
                    <List.Item key={cateInfo.cate_id}>
                        <CateItem cateInfo={cateInfo} curCateId={state.cateId} onUpdate={() => loadCateList()}
                            onRemove={() => linkAuxStore.goToLink(new LinkBookMarkCateInfo("", projectStore.curProjectId, ""), history)}
                            onClick={() => linkAuxStore.goToLink(new LinkBookMarkCateInfo("", projectStore.curProjectId, cateInfo.cate_id), history)} />
                    </List.Item>))}
            </List>

            {showAddModal == true && (
                <Modal title="增加分类" open
                    okText="增加"
                    okButtonProps={{ disabled: newCateName.trim() == "" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setNewCateName("");
                        setShowAddModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createCate();
                    }}>
                    <Form>
                        <Form.Item label="分类名称">
                            <Input value={newCateName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNewCateName(e.target.value);
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </Card>
    )
};

export default observer(CatePanel);