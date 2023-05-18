import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import Button from "@/components/Button";
import s from './ScriptList.module.less';
import { useStores } from "@/hooks";
import addIcon from '@/assets/image/addIcon.png';
import { useHistory } from "react-router-dom";
import { request } from "@/utils/request";
import type { ScriptSuiteKey } from "@/api/robot_script";
import { list_script_suite_key } from "@/api/robot_script";
import type { ColumnsType } from 'antd/es/table';
import { Space, Table } from "antd";
import Pagination from "@/components/Pagination";
import { LinkScriptSuiteInfo } from "@/stores/linkAux";
import moment from 'moment';

const PAGE_SIZE = 10;

const ScriptList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [scriptSuiteKeyList, setScriptSuiteKeyList] = useState<ScriptSuiteKey[]>([]);

    const loadScriptSuiteKey = async () => {
        const res = await request(list_script_suite_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setScriptSuiteKeyList(res.script_suite_key_list);
    }

    const columns: ColumnsType<ScriptSuiteKey> = [
        {
            title: "脚本名称",
            width: 150,
            render: (_, record: ScriptSuiteKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkScriptSuiteInfo("", projectStore.curProjectId, record.script_suite_id, false, 0, "scriptContent"), history);
                }}>{record.script_suite_name}</a>
            ),
        },
        {
            title: "执行用户(操作系统)",
            dataIndex: "exec_user",
            width: 100,
        },
        {
            title: "执行次数",
            dataIndex: "exec_count",
            width: 60,
        },
        {
            title: "操作",
            width: 80,
            render: (_, record: ScriptSuiteKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkScriptSuiteInfo("", projectStore.curProjectId, record.script_suite_id, false, 0, "execList"), history);
                }}>查看执行记录</a>
            ),
        },
        {
            title: "创建用户",
            dataIndex: "create_display_name",
            width: 80,
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, record: ScriptSuiteKey) => (
                <span>{moment(record.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
        {
            title: "更新用户",
            dataIndex: "update_display_name",
            width: 80,
        },
        {
            title: "更新时间",
            width: 150,
            render: (_, record: ScriptSuiteKey) => (
                <span>{moment(record.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
    ];

    useEffect(() => {
        loadScriptSuiteKey();
    }, [projectStore.curProjectId, curPage]);

    return (
        <CardWrap title="服务端脚本列表" extra={
            <Space>
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToCreateScript(history);
                }} disabled={!projectStore.isAdmin}>
                    <img src={addIcon} alt="" />
                    创建服务端脚本
                </Button>
            </Space>
        }>
            <div className={s.content_wrap}>
                <div style={{ marginRight: '20px' }}>
                    <div className={s.script_list}>
                        <Table rowKey="script_suite_id" columns={columns} dataSource={scriptSuiteKeyList}
                            pagination={false} scroll={{ x: 1200 }} />
                        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
                            onChange={page => setCurPage(page - 1)} />
                    </div>
                </div>
            </div>
        </CardWrap>
    );
};

export default observer(ScriptList);