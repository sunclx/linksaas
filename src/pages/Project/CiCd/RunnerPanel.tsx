import React, { useEffect, useState } from "react";
import { type ExecRunner, list_runner, PLATFORM_TYPE_LINUX, PLATFORM_TYPE_DARWIN } from "@/api/project_cicd";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/lib/table';
import { Table } from "antd";

const RunnerPanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [runnerList, setRunnerList] = useState<ExecRunner[]>([]);

    const loadRunnerList = async () => {
        const res = await request(list_runner({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setRunnerList(res.runner_list);
    };

    const columns: ColumnsType<ExecRunner> = [
        {
            title: "主机名称",
            dataIndex: "hostname",
        },
        {
            title: "服务地址",
            dataIndex: "serv_addr",
        },
        {
            title: "系统类型",
            render: (_, row: ExecRunner) => {
                if (row.plat_form_type == PLATFORM_TYPE_LINUX) {
                    return "linux";
                } else if (row.plat_form_type == PLATFORM_TYPE_DARWIN) {
                    return "macos";
                } else {
                    return "windows"
                }
            }
        },
        {
            title: "是否在线",
            render: (_, row: ExecRunner) => row.online ? "是" : "否",
        }
    ];
    useEffect(() => {
        loadRunnerList();
    }, []);

    return (
        <Table rowKey="runner_id" dataSource={runnerList} columns={columns} pagination={false} />
    );
};

export default RunnerPanel;