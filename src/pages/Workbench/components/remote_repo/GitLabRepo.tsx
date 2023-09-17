import { get_http_url } from "@/api/local_repo";
import React, { useEffect, useState } from "react";
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { Radio, Space, Table, message } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import { open as shell_open } from '@tauri-apps/api/shell';


type GitlabIssue = {
    id: number;
    state: "opened" | "closed";
    title: string;
    web_url: string;
    created_at: string;
    updated_at: string;
};

export interface GitlabRepoProps {
    protocol: string;
    url: string;
    token: string;
}

const GitlabRepo = (props: GitlabRepoProps) => {
    const [issueState, setIssueState] = useState<"opened" | "closed" | "all">("opened");
    const [issueList, setIssueList] = useState<GitlabIssue[]>([]);

    const loadIssueList = async () => {
        const tmpUrl = await get_http_url(props.url);
        const url = new URL(tmpUrl);
        const apiUrl = `${props.protocol}://${url.hostname}/api/v4/projects/${url.pathname.substring(1).replaceAll("/", "%2F")}/issues?state=${issueState}`;
        try {
            const res = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "PRIVATE-TOKEN": props.token,
                    "Accept": "application/json",
                },
                timeout: 10,
                responseType: ResponseType.JSON,
            });
            if (res.status != 200) {
                message.error("令牌权限不足");
                return;
            }
            setIssueList(res.data as GitlabIssue[]);
        } catch (e) {
            console.log(e);
        }
    }
    const columns: ColumnsType<GitlabIssue> = [
        {
            title: "标题",
            width: 250,
            render: (_, row) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    shell_open(row.web_url);
                }}>{row.title}</a>
            ),
        },
        {
            title: "状态",
            dataIndex: "state",
            width: 100,
            render: (_, row) => (
                <span>
                    {row.state == "opened" && "打开"}
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
                        <Radio value="opened">打开</Radio>
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
    }, [props.protocol, props.url, props.token, issueState]);

    return (
        <Table rowKey="id" dataSource={issueList} columns={columns} pagination={false} />
    );
};

export default GitlabRepo;