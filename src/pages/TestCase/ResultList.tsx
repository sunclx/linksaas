import React, { useEffect, useState } from "react";
import CardWrap from '@/components/CardWrap';
import { observer } from 'mobx-react';
import { MenuTab } from "./components/MenuTab";
import { Card, Select, Form, Empty } from "antd";
import { useStores } from "@/hooks";
import type { Result } from '@/api/project_test_case';
import { RESULT_TYPE_SUCCESS, RESULT_TYPE_WARN, RESULT_TYPE_FAIL, RESULT_TYPE_ALL, list_result } from '@/api/project_test_case';
import TestCaseResult from "./components/TestCaseResult";
import { request } from "@/utils/request";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

const ResultList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [memberUserId, setMemberUserId] = useState("");
    const [resultType, setResultType] = useState(RESULT_TYPE_ALL);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [resultList, setResultList] = useState<Result[]>([]);

    const loadResultList = async () => {
        const res = await request(list_result({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_entry_id: false,
                entry_id: "",
                filter_by_member_user_id: memberUserId !== "",
                member_user_id: memberUserId,
                filter_by_result_type: resultType != RESULT_TYPE_ALL,
                result_type: resultType == RESULT_TYPE_ALL ? 0 : resultType,
            },
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setResultList(res.result_list);
    };

    useEffect(() => {
        loadResultList();
    }, [curPage, memberUserId, resultType]);

    return (<CardWrap title="测试结果">
        <MenuTab activeKey="resultList">
            <Card
                title="测试结果列表"
                bordered={false}
                extra={
                    <Form layout="inline">
                        <Form.Item label="提交成员">
                            <Select value={memberUserId} style={{ width: "100px" }}
                                onChange={value => setMemberUserId(value)}>
                                <Select.Option key="" value="">全体成员</Select.Option>
                                {memberStore.memberList.map(item => (
                                    <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>{item.member.display_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="结果状态">
                            <Select value={resultType} style={{ width: "100px" }}
                                onChange={value => setResultType(value)}>
                                <Select.Option value={RESULT_TYPE_ALL}>全部</Select.Option>
                                <Select.Option value={RESULT_TYPE_SUCCESS}>成功</Select.Option>
                                <Select.Option value={RESULT_TYPE_WARN}>警告</Select.Option>
                                <Select.Option value={RESULT_TYPE_FAIL}>失败</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                }>
                <div style={{ height: "calc(100vh - 230px)", overflowY: "scroll" }}>
                    {resultList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    {resultList.map(item => <TestCaseResult key={item.result_id} result={item} onRemove={() => loadResultList()} showEntry={true} />)}
                    <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                </div>
            </Card>
        </MenuTab>
    </CardWrap>);
};

export default observer(ResultList);
