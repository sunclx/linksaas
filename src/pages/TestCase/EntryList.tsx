import React, { useEffect, useState } from "react";
import CardWrap from '@/components/CardWrap';
import { observer } from 'mobx-react';
import { MenuTab } from "./components/MenuTab";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkTestCaseEntryState } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { GetEntryResponse, ENTRY_TYPE } from '@/api/project_test_case';
import { get_entry, ENTRY_TYPE_DIR, ENTRY_TYPE_TC, create_entry } from '@/api/project_test_case';
import { Breadcrumb, Form, Input, Modal, Space, message } from 'antd';
import s from './common.module.less';
import Button from "@/components/Button";
import DirContent from "./components/DirContent";
import TcDetail from "./components/TcDetail";

const EntryList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const location = useLocation();
    let state = location.state as (LinkTestCaseEntryState | undefined);
    if (state == undefined) {
        state = {
            entryId: "",
        };
    }
    const history = useHistory();

    const [curEntryRes, setCurEntryRes] = useState<GetEntryResponse | null>(null);
    const [showCreateEntry, setShowCreateEntry] = useState<ENTRY_TYPE | null>(null);
    const [newTitle, setNewTitle] = useState("");

    const loadCurEntry = async () => {
        const res = await request(get_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: state!.entryId,
        }));
        setCurEntryRes(res);
    };

    const createEntry = async () => {
        if (newTitle == "") {
            message.warn("名称不能为空");
            return;
        }
        await request(create_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_type: showCreateEntry!,
            title: newTitle,
            parent_entry_id: state!.entryId,
        }));
        setNewTitle("");
        setShowCreateEntry(null);
        await loadCurEntry();
    };

    useEffect(() => {
        loadCurEntry();
    }, [state.entryId]);

    return (<CardWrap title="测试用例">
        <MenuTab activeKey="entryList">
            {curEntryRes != null && (
                <div className={s.content_wrap}>
                    <div className={s.nav_head}>
                        <div>
                            <Breadcrumb>
                                {curEntryRes.path_element_list.map(el => (
                                    <Breadcrumb.Item key={el.entry_id}>
                                        <a onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            linkAuxStore.goToTestCaseList({ entryId: el.entry_id }, history);
                                        }}>{el.title}</a>
                                    </Breadcrumb.Item>))}
                            </Breadcrumb>
                        </div>
                        <div className={s.btn_wrap}>
                            {curEntryRes.entry.entry_type == ENTRY_TYPE_DIR && (
                                <Space size="middle">
                                    <Button type="default" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowCreateEntry(ENTRY_TYPE_DIR);
                                    }}>新建目录</Button>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowCreateEntry(ENTRY_TYPE_TC);
                                    }}>新建测试用例</Button>
                                </Space>
                            )}
                        </div>
                    </div>
                    {curEntryRes.entry.entry_type == ENTRY_TYPE_DIR && curEntryRes.entry.entry_id == state!.entryId && <DirContent entryId={state!.entryId} childCount={curEntryRes.child_count} />}
                    {curEntryRes.entry.entry_type == ENTRY_TYPE_TC && curEntryRes.entry.entry_id == state!.entryId && <TcDetail entryId={state!.entryId}/>}
                </div>
            )}
        </MenuTab>
        {showCreateEntry != null && (
            <Modal
                open
                title={`创建${showCreateEntry == ENTRY_TYPE_DIR ? "目录" : "测试用例"}`}
                onCancel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowCreateEntry(null);
                }}
                onOk={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    createEntry();
                }}>
                <Form>
                    <Form.Item name="title" label="名称" rules={[{ required: true }]}>
                        <Input onChange={e => setNewTitle(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>
        )}
    </CardWrap>);
};


export default observer(EntryList);
