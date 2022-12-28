import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Empty } from "antd";
import Button from "@/components/Button";
import AddResultModal from "./AddResultModal";
import type { Result } from '@/api/project_test_case';
import { list_result } from '@/api/project_test_case';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import Pagination from "@/components/Pagination";
import TestCaseResult from "./TestCaseResult";

interface ResultPanelProps {
    entryId: string;
}

const PAGE_SIZE = 10;

const ResultPanel: React.FC<ResultPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [showAddModal, setShowAddModal] = useState(false);
    const [resultList, setResultList] = useState<Result[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadResultList = async () => {
        const res = await request(list_result({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_entry_id: true,
                entry_id: props.entryId,
                filter_by_member_user_id: false,
                member_user_id: "",
                filter_by_result_type: false,
                result_type: 0,
            },
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setResultList(res.result_list);
    };

    useEffect(() => {
        loadResultList();
    }, [props.entryId, curPage]);

    return (
        <Card title="测试结果" bordered={false} extra={
            <Button onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowAddModal(true);
            }}>新增测试结果</Button>
        }>
            <div>
                {resultList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                {resultList.map(item => <TestCaseResult key={item.result_id} result={item} onRemove={() => loadResultList()} showEntry={false}/>)}
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </div>
            {showAddModal == true && <AddResultModal entryId={props.entryId} onCancel={() => setShowAddModal(false)} onOk={() => {
                if (curPage == 0) {
                    loadResultList();
                } else {
                    setCurPage(0);
                }
                setShowAddModal(false);
            }} />}
        </Card>
    );
};

export default observer(ResultPanel);