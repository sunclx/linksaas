import React, { useEffect, useState } from "react";
import type { ExecResult } from "@/api/project_cicd";
import { list_exec_result } from "@/api/project_cicd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import { Table } from "antd";
import moment from "moment";
import { OpenPipeLineWindow } from "./utils";

const PAGE_SIZE = 10;

const ExecResultPanel = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [resultList, setResultList] = useState<ExecResult[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadResultList = async () => {
        const res = await request(list_exec_result({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_pipe_line_id: false,
            pipe_line_id: "",
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setResultList(res.result_list);
    };

    const columns: ColumnsType<ExecResult> = [
        {
            title: "流水线名称",
            render: (_, row: ExecResult) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    OpenPipeLineWindow(row.pipe_line_name, projectStore.curProjectId, projectStore.curProject?.ci_cd_fs_id ?? "", row.pipe_line_id, false, false, projectStore.isAdmin, row.exec_id);
                }}>{row.pipe_line_name}</a>
            ),
        },
        {
            title: "运行人",
            dataIndex: "exec_display_name",
        },
        {
            title: "运行结果",
            render: (_, row: ExecResult) => row.success ? "成功" : "失败",
        },
        {
            title: "开始时间",
            render: (_, row: ExecResult) => moment(row.exec_start_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "结束时间",
            render: (_, row: ExecResult) => row.exec_stop_time == 0 ? "-" : moment(row.exec_stop_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "运行主机",
            render: (_, row: ExecResult) => (
                <span title={row.runner_serv_addr}>{row.runner_hostname}</span>
            ),
        }
    ];

    useEffect(() => {
        loadResultList();
    }, [curPage]);

    return (
        <Table rowKey="exec_id" dataSource={resultList} columns={columns}
            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, hideOnSinglePage: true, onChange: page => setCurPage(page - 1) }} />
    )
};

export default ExecResultPanel;