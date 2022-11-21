import { Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React from "react";


interface RelInfo {
    name: string;
    repoUrl: string;
    url: string;
}

const relProjectInfoList: RelInfo[] = [
    {
        name: "vscode插件",
        repoUrl: "https://jihulab.com/linksaas/vs-extension",
        url: "https://marketplace.visualstudio.com/items?itemName=linksaas.local-api",
    },
    {
        name: "api client(python)",
        repoUrl: "https://jihulab.com/linksaas/analysis/openapi_py",
        url: "https://pypi.org/project/linksaas-local-api/"
    },
    {
        name: "研发行为库(python)",
        repoUrl: "https://jihulab.com/linksaas/analysis/events_py",
        url: "https://pypi.org/project/linksaas-events-py/"
    }
];

const columns: ColumnsType<RelInfo> = [
    {
        "title": "项目名称",
        render:(_, record: RelInfo) => (<a target="_blank" href={record.url}  rel="noreferrer">{record.name}</a>),
    },
    {
        "title": "代码仓库",
        render: (_, record: RelInfo) => (<a target="_blank" href={record.repoUrl}  rel="noreferrer">{record.repoUrl}</a>),
    }
];

export const RelProjectList = () => {
    return (
        <div>
            <Table columns={columns} dataSource={relProjectInfoList} pagination={false} />
        </div>
    );
};