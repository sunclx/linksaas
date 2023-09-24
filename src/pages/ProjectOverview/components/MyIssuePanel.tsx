import { Card, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { IssueInfo, ISSUE_TYPE } from "@/api/project_issue";
import {
    ASSGIN_USER_ALL, ISSUE_STATE_CHECK, ISSUE_STATE_PROCESS, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC,
    list as list_issue
} from "@/api/project_issue";
import { request } from "@/utils/request";
import type { Tab } from "rc-tabs/lib/interface";
import IssueList from "./IssueList";

const PAGE_SIZE = 10;

interface MyIssueListProps {
    issueType: ISSUE_TYPE;
}

const MyIssueList = (props: MyIssueListProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadIssueList = async () => {
        const res = await request(list_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_issue_type: true,
                issue_type: props.issueType,
                filter_by_state: true,
                state_list: [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK],
                filter_by_create_user_id: false,
                create_user_id_list: [],
                filter_by_assgin_user_id: true,
                assgin_user_id_list: [userStore.userInfo.userId],
                assgin_user_type: ASSGIN_USER_ALL,
                filter_by_sprit_id: false,
                sprit_id_list: [],
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "",
                filter_by_tag_id_list: false,
                tag_id_list: [],
                filter_by_watch: false,
                watch: false,
                ///任务相关
                filter_by_task_priority: false,
                task_priority_list: [],
                ///缺陷相关
                filter_by_software_version: false,
                software_version_list: [],
                filter_by_bug_priority: false,
                bug_priority_list: [],
                filter_by_bug_level: false,
                bug_level_list: [],
            },
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setIssueList(res.info_list);
    };

    useEffect(() => {
        loadIssueList();
    }, [curPage]);

    return (
        <IssueList issueList={issueList} totalCount={totalCount}
            curPage={curPage} pageSize={PAGE_SIZE}
            issueType={props.issueType} onChangePage={page => setCurPage(page)} />
    );
};

const MyTaskPanel = () => {
    const projectStore = useStores('projectStore');

    const getDefaultActiveKey = (): string => {
        if (projectStore.curProject?.setting.hide_my_todo_task == false) {
            return "task"
        }
        if (projectStore.curProject?.setting.hide_my_todo_bug == false) {
            return "bug";
        }
        return "";
    };

    const [activeKey, setActiveKey] = useState(getDefaultActiveKey());

    const getTabItems = () => {
        const retList: Tab[] = [];
        if (projectStore.curProject?.setting.hide_my_todo_task == false) {
            retList.push({
                key: "task",
                label: "任务",
                children: (
                    <>
                        {activeKey == "task" && (
                            <MyIssueList issueType={ISSUE_TYPE_TASK} />
                        )}
                    </>
                ),
            });
        }
        if (projectStore.curProject?.setting.hide_my_todo_task == false) {
            retList.push({
                key: "bug",
                label: "缺陷",
                children: (
                    <>
                        {activeKey == "bug" && (
                            <MyIssueList issueType={ISSUE_TYPE_BUG} />
                        )}
                    </>
                ),
            });
        }
        return retList;
    };

    return (
        <>
            {((projectStore.curProject?.setting.hide_my_todo_task == false) || (projectStore.curProject?.setting.hide_my_todo_bug == false)) && (
                <Card title="我的待办" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }}>
                    <Tabs type="card" items={getTabItems()} activeKey={activeKey} onChange={key => setActiveKey(key)} />
                </Card>
            )}
        </>
    );
};

export default observer(MyTaskPanel);