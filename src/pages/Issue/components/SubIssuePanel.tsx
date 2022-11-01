import React, { useEffect, useState } from "react";
import { Table, Modal, Input, message } from 'antd';
import type { SubIssueInfo } from '@/api/project_issue';
import type { ColumnsType } from 'antd/lib/table';
import { create_sub_issue, list_sub_issue, update_sub_issue, update_sub_issue_state, remove_sub_issue } from '@/api/project_issue';
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import Button from "@/components/Button";

interface SybIssuePanelProps {
    issueId: string;
    canOptSubIssue: boolean;
}

export const SubIssuePanel: React.FC<SybIssuePanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');


    const [subIssueList, setSubIssueList] = useState<SubIssueInfo[]>([]);
    const [showAddSubIssue, setShowAddSubIssue] = useState(false);
    const [showUpdateSubIssue, setShowUpdateSubIssue] = useState(false);
    const [subIssueTitle, setSubIssueTitle] = useState("");
    const [curSubIssueId, setCurSubIssueId] = useState("");

    const loadSubIssue = async () => {
        const res = await request(list_sub_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
        }));
        if (res) {
            setSubIssueList(res.sub_issue_list);
            console.log(res.sub_issue_list);
        }
    };

    const addSubIssue = async () => {
        if (subIssueTitle == "") {
            message.error("子任务标题不能为空");
            return;
        }
        const res = await request(create_sub_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            basic_info: {
                title: subIssueTitle,
            },
        }));
        if (res) {
            message.info("添加子任务成功");
            setShowAddSubIssue(false);
            await loadSubIssue();
        }
    };

    const updateSubIssue = async () => {
        if (subIssueTitle == "") {
            message.error("子任务标题不能为空");
            return;
        }
        const res = await request(update_sub_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            sub_issue_id: curSubIssueId,
            basic_info: {
                title: subIssueTitle,
            },
        }));
        if (res) {
            const itemList = subIssueList.slice();
            const index = itemList.findIndex(item => item.sub_issue_id == curSubIssueId);
            if (index != -1) {
                itemList[index].basic_info.title = subIssueTitle;
                setSubIssueList(itemList);
            }
            setSubIssueTitle("");
            setCurSubIssueId("");
            setShowUpdateSubIssue(false);
            message.info("修改子任务标题成功");
        }
    };

    const updateSubIssueState = async (subIssueId: string, done: boolean) => {
        const res = await request(update_sub_issue_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            sub_issue_id: subIssueId,
            done: done,
        }));
        if (res) {
            const itemList = subIssueList.slice();
            const index = itemList.findIndex(item => item.sub_issue_id == subIssueId);
            if (index != -1) {
                itemList[index].done = done;
                setSubIssueList(itemList);
            }
            message.info("设置子任务状态成功");
        }
    };

    const removeSubIssue = async (subIssueId: string) => {
        const res = await request(remove_sub_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
            sub_issue_id: subIssueId,
        }));
        if (res) {
            const itemList = subIssueList.filter(item => item.sub_issue_id != subIssueId);
            setSubIssueList(itemList);
            message.info("删除子任务成功");
        }
    };

    const subIssueColums: ColumnsType<SubIssueInfo> = [
        {
            title: "标题",
            render: (_, record: SubIssueInfo) => {
                return <span style={{ textDecorationLine: record.done ? "line-through" : "none" }}>{record.basic_info.title}</span>
            },
        },
        {
            title: "创建者",
            width: 80,
            dataIndex: "create_display_name",
        },
        {
            title: "操作",
            width: 230,
            render: (_, record: SubIssueInfo) => {
                return (
                    <span>
                        <Button
                            type="link"
                            disabled={!props.canOptSubIssue}
                            style={{minWidth:"10px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateSubIssueState(record.sub_issue_id, !record.done);
                            }}>{record.done ? "标记成未完成" : "标记成已完成"}</Button>
                        <Button
                            type="link"
                            disabled={!props.canOptSubIssue}
                            style={{ minWidth: "10px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSubIssueTitle(record.basic_info.title);
                                setCurSubIssueId(record.sub_issue_id);
                                setShowUpdateSubIssue(true);
                            }}>修改</Button>
                        <Button
                            type="link"
                            style={{ minWidth: "10px" }}
                            disabled={!props.canOptSubIssue}
                            danger onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeSubIssue(record.sub_issue_id);
                            }}>删除</Button>
                    </span>
                );
            },
        }
    ];


    useEffect(() => {
        loadSubIssue();
    }, [props.issueId])

    return (
        <>
            <div style={{ position: "relative", paddingBottom: "28px" }}>
                <Button
                    style={{ position: "absolute", right: "10px" }}
                    type="primary"
                    disabled={!props.canOptSubIssue}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddSubIssue(true);
                    }}>新增子任务</Button>
            </div>
            <Table rowKey={'sub_issue_id'} dataSource={subIssueList} columns={subIssueColums} pagination={false} />
            {showAddSubIssue == true && (
                <Modal
                    open={showAddSubIssue}
                    title="新增子任务"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddSubIssue(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addSubIssue();
                    }}>
                    <Input addonBefore="子任务标题" onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSubIssueTitle(e.target.value);
                    }} />
                </Modal>)}
            {showUpdateSubIssue == true && (
                <Modal
                    open={showUpdateSubIssue}
                    title="修改子任务标题"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSubIssueTitle("");
                        setCurSubIssueId("");
                        setShowUpdateSubIssue(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateSubIssue();
                    }}
                >
                    <Input addonBefore="子任务标题" defaultValue={subIssueTitle} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSubIssueTitle(e.target.value);
                    }} />
                </Modal>
            )}
        </>
    );
};