import { get_http_url } from "@/api/local_repo";
import React, { useEffect, useState } from "react";
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { Radio, Space, Table, message } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import { open as shell_open } from '@tauri-apps/api/shell';

type GiteeIssue = {
    id: number;
    html_url: string;
    state: "open" | "progressing" | "closed" | "rejected";
    title: string;
    issue_type: string;
    created_at: string;
    updated_at: string;
}

export interface GiteeRepoProps {
    url: string;
    token: string;
}

const GiteeRepo = (props: GiteeRepoProps) => {
    // Issue的状态: open（开启的）, progressing(进行中), closed（关闭的）, rejected（拒绝的）
    const [issueState, setIssueState] = useState<"open" | "progressing" | "closed" | "rejected" | "all">("open");
    const [issueList, setIssueList] = useState<GiteeIssue[]>([]);

    const loadIssueList = async () => {
        const tmpUrl = await get_http_url(props.url);
        const url = new URL(tmpUrl);
        const apiUrl = `https://gitee.com/api/v5/repos${url.pathname}/issues?access_token=${props.token}&state=${issueState}&sort=created&direction=desc&page=1&per_page=20`;
        try {
            const res = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                timeout: 10,
                responseType: ResponseType.JSON,
            });
            if (res.status != 200) {
                message.error("令牌权限不足");
            }
            setIssueList(res.data as GiteeIssue[]);
        } catch (e) {
            console.log(e);
        }
    };

    const columns: ColumnsType<GiteeIssue> = [
        {
            title: "标题",
            width: 250,
            render: (_, row) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    shell_open(row.html_url);
                }}>{row.title}</a>
            ),
        },
        {
            title: "状态",
            dataIndex: "state",
            width: 100,
            render: (_, row) => (
                <span>
                    {row.state == "open" && "打开"}
                    {row.state == "progressing" && "进行中"}
                    {row.state == "closed" && "关闭"}
                    {row.state == "rejected" && "拒绝"}
                </span>
            ),
            filterDropdown: (
                <Radio.Group style={{ width: "120px", padding: "10px 20px" }} value={issueState} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIssueState(e.target.value);
                }}>
                    <Space direction="vertical">
                        <Radio value="open">打开</Radio>
                        <Radio value="progressing">进行中</Radio>
                        <Radio value="closed">关闭</Radio>
                        <Radio value="rejected">拒绝</Radio>
                        <Radio value="all">全部</Radio>
                    </Space>
                </Radio.Group>
            )
        },
        {
            title: "工单类型",
            width: 100,
            dataIndex: "issue_type",
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
        },
        {
            title: "更新时间",
            dataIndex: "updated_at",
        },
    ];

    useEffect(() => {
        loadIssueList();
    }, [props.url, props.token, issueState]);

    return (
        <Table rowKey="id" dataSource={issueList} columns={columns} pagination={false} />
    );
};

export default GiteeRepo;

