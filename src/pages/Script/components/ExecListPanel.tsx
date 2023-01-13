import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Table, Tag } from "antd";
import type { ExecInfo } from '@/api/robot_script';
import { list_exec } from '@/api/robot_script';
import { useStores } from "@/hooks";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkScriptSuiteSate } from "@/stores/linkAux";
import type { ColumnsType } from 'antd/es/table';
import { request } from "@/utils/request";
import Pagination from "@/components/Pagination";
import moment from 'moment';
import { EXEC_STATE_INIT, EXEC_STATE_RUN, EXEC_STATE_SUCCESS, EXEC_STATE_FAIL } from "@/api/robot_script";
import Button from "@/components/Button";
import { LinkScriptExecInfo } from '@/stores/linkAux';

const PAGE_SIZE = 10;

const ExecListPanel = () => {
    const userStore = useStores("userStore");
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores('linkAuxStore');

    const location = useLocation();
    const history = useHistory();

    const state = location.state as LinkScriptSuiteSate;

    const [execInfoList, setExecInfoList] = useState<ExecInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadExecList = async () => {
        const res = await request(list_exec({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: state.scriptSuiteId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setExecInfoList(res.exec_info_list);
    };

    const columns: ColumnsType<ExecInfo> = [
        {
            title: "执行状态",
            width: 60,
            render: (_, record: ExecInfo) => (
                <>
                    {record.exec_state == EXEC_STATE_INIT && <span>准备执行</span>}
                    {record.exec_state == EXEC_STATE_RUN && <span>执行中</span>}
                    {record.exec_state == EXEC_STATE_SUCCESS && <span style={{ color: "green" }}>执行成功</span>}
                    {record.exec_state == EXEC_STATE_FAIL && <span style={{ color: "red" }}>执行失败</span>}
                </>
            ),
        },
        {
            title: "环境参数",
            width: 100,
            render: (_, record: ExecInfo) => (
                <div>
                    {record.exec_param.env_param_list.map((item, index) => (
                        <Tag key={index}>{item.env_name}={item.env_value}</Tag>
                    ))}
                </div>
            ),
        },
        {
            title: "命令行参数",
            width: 100,
            render: (_, record: ExecInfo) => (
                <div>
                    {record.exec_param.arg_param_list.map((item, index) => (
                        <Tag key={index}>{item}</Tag>
                    ))}
                </div>
            ),
        },
        {
            title: "执行人",
            width: 80,
            dataIndex: "exec_display_name",
        },
        {
            title: "执行时间",
            width: 150,
            render: (_, record: ExecInfo) => (
                <span>{moment(record.exec_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: ExecInfo) => (
                <Button type="link"
                    style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkScriptExecInfo("", projectStore.curProjectId, state.scriptSuiteId, record.exec_id), history);
                    }}>查看执行结果</Button>
            ),
        }
    ];

    useEffect(() => {
        loadExecList();
    }, [state.scriptSuiteId, curPage]);
    return (
        <div style={{ height: "calc(100vh - 270px)", overflowY: "scroll" }}>
            <Table rowKey="exec_id" columns={columns} dataSource={execInfoList} pagination={false} />
            <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
        </div>
    );
};

export default observer(ExecListPanel);