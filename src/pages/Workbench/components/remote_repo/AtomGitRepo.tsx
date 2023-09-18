import { get_http_url } from "@/api/local_repo";
import React, { useEffect, useState } from "react";
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { Radio, Space, Table, message } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import { open as shell_open } from '@tauri-apps/api/shell';

type AtomIssue = {
    id: string;
    html_url: string;
    state: "open" | "closed";
    title: string;
    created_at: string;
    updated_at: string;
};

export interface AtomGitRepoProps {
    url: string;
    token: string;
}

const AtomGitRepo = (props: AtomGitRepoProps) => {
    const [issueState, setIssueState] = useState<"open" | "closed" | "all">("open");
    const [issueList, setIssueList] = useState<AtomIssue[]>([]);

    const loadIssueList = async () => {
        const tmpUrl = await get_http_url(props.url);
        const url = new URL(tmpUrl);
        const apiUrl = `https://api.${url.host}/repos${url.pathname}/issues?state=${issueState}`;
        try {
            const res = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${props.token}`,
                    "Accept": "application/json",
                },
                timeout: 10,
                responseType: ResponseType.JSON,
            });
            if (res.status != 200) {
                message.error("令牌权限不足");
                return;
            }
            setIssueList(res.data as AtomIssue[]);
        } catch (e) {
            console.log(e);
        }
    };

    const columns: ColumnsType<AtomIssue> = [
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
                    {row.state == "closed" && "关闭"}
                </span>
            ),
            filterDropdown: (
                <Radio.Group style={{ width: "100px", padding: "10px 20px" }} value={issueState} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIssueState(e.target.value);
                }}>
                    <Space direction="vertical">
                        <Radio value="open">打开</Radio>
                        <Radio value="closed">关闭</Radio>
                        <Radio value="all">全部</Radio>
                    </Space>
                </Radio.Group>
            )
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

export default AtomGitRepo;