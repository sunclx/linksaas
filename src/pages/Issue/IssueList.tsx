import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './IssueList.module.less';
import CardWrap from '@/components/CardWrap';
import { getIssueText, getIssue_type, getIsTask, getIssueViewUrl } from '@/utils/utils';
import Button from '@/components/Button';
import { useHistory, useLocation } from "react-router-dom";
import { useStores } from "@/hooks";
import Tabs from './components/Tabs';
import addIcon from '@/assets/image/addIcon.png';
import type { LinkIssueListState } from '@/stores/linkAux';
import { ISSUE_TAB_LIST_TYPE } from './components/constant';
import Filtration from "./components/Filtration";
import type { FilterDataType } from "./components/Filtration";
import { useSetState } from 'ahooks';
import IssueEditList from "./components/IssueEditList";
import { ASSGIN_USER_ALL, ASSGIN_USER_CHECK, ASSGIN_USER_EXEC, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC, list as list_issue, get as get_issue } from "@/api/project_issue";
import type { IssueInfo, ListRequest } from "@/api/project_issue";
import { request } from '@/utils/request';
import StageModel from "./components/StageModel";
import Pagination from "@/components/Pagination";

const tabList = [
    {
        name: "指派给我",
        value: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME,
    },
    {
        name: "由我创建",
        value: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_MY_CREATE,
    },
    {
        name: "全部",
        value: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL
    },
]

const PAGE_SIZE = 10;

const IssueList = () => {
    const location = useLocation();
    const { push } = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const filterState: LinkIssueListState | undefined = location.state as LinkIssueListState | undefined;
    const [activeVal, setActiveVal] = useState<ISSUE_TAB_LIST_TYPE>(filterState ? ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL : ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME);
    const [isFilter, setIsFilter] = useState(true);
    const [filterData, setFilterData] = useSetState<FilterDataType>({
        priority_list: [],
        state_list: filterState?.stateList ?? [],
        exec_user_id_list: filterState?.execUserIdList ?? [],
        check_user_id_list: filterState?.checkUserIdList ?? [],
        software_version_list: [],
        level_list: [],
    });
    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [stageIssue, setStageIssue] = useState<IssueInfo | undefined>(undefined);


    const updateIssue = async (issueId: string) => {
        const tmpList = issueList.slice();
        const index = tmpList.findIndex(item => item.issue_id == issueId);
        if (index == -1) {
            return;
        }
        const res = await request(get_issue(userStore.sessionId, projectStore.curProjectId, issueId));
        if (res) {
            tmpList[index] = res.info;
            setIssueList(tmpList);
        }
    };

    const showStage = (issueId: string) => {
        const issue = issueList.find(item => item.issue_id == issueId);
        if (issue !== undefined) {
            setStageIssue(issue);
        }
    };

    const loadIssueList = async () => {
        const req: ListRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sort_type: SORT_TYPE_DSC, // SORT_TYPE_DSC SORT_TYPE_ASC
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            list_param: {
                filter_by_issue_type: true,
                issue_type: getIssue_type(location.pathname),
                filter_by_state: !!filterData.state_list?.length,
                state_list: filterData.state_list!, //阶段
                filter_by_create_user_id: activeVal === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_MY_CREATE,
                create_user_id_list: [userStore.userInfo.userId],
                filter_by_assgin_user_id:
                    activeVal === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME
                        ? true
                        : filterData.exec_user_id_list?.length || filterData.check_user_id_list?.length
                            ? true
                            : false,
                assgin_user_id_list:
                    activeVal === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME
                        ? [userStore.userInfo.userId]
                        : [...filterData.exec_user_id_list!, ...filterData.check_user_id_list!],
                assgin_user_type:
                    activeVal === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME ||
                        (filterData.exec_user_id_list?.length && filterData.check_user_id_list?.length)
                        ? ASSGIN_USER_ALL
                        : filterData.exec_user_id_list?.length
                            ? ASSGIN_USER_EXEC
                            : filterData.check_user_id_list?.length
                                ? ASSGIN_USER_CHECK
                                : ASSGIN_USER_ALL,
                filter_by_sprit_id: false,
                sprit_id_list: [],
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_task_priority: getIsTask(location.pathname) && !!filterData.priority_list?.length,
                task_priority_list: getIsTask(location.pathname) ? filterData.priority_list! : [], // 优先级
                filter_by_software_version:
                    !getIsTask(location.pathname) && !!filterData.software_version_list?.length,
                software_version_list: !getIsTask(location.pathname) ? filterData.software_version_list! : [],
                filter_by_bug_level: !getIsTask(location.pathname) && !!filterData.level_list?.length,
                bug_level_list: !getIsTask(location.pathname) ? filterData.level_list! : [],
                filter_by_bug_priority: !getIsTask(location.pathname) && !!filterData.priority_list?.length,
                bug_priority_list: !getIsTask(location.pathname) ? filterData.priority_list! : [], // 优先级,
                filter_by_title_keyword: false,
                title_keyword: "",
            },
        };
        const res = await request(list_issue(req));
        if (res) {
            setIssueList(res.info_list);
            setTotalCount(res.total_count);
        }
    };

    useEffect(() => {
        loadIssueList();
    }, [curPage, activeVal, projectStore.curProjectId])

    return (
        <CardWrap>
            <div className={s.task_wrap}>
                <div style={{ marginRight: '20px' }}>
                    <div className={s.title}>
                        <h2>{getIssueText(location.pathname)}列表</h2>
                        <Button
                            type="primary"
                            onClick={() => push(getIssueViewUrl(location.pathname))}
                            disabled={projectStore.curProject?.closed}
                        >
                            <img src={addIcon} alt="" />
                            创建{getIssueText(location.pathname)}
                        </Button>
                    </div>
                    <Tabs
                        activeVal={activeVal}
                        list={tabList}
                        onChang={setActiveVal}
                        isFilter={isFilter}
                        setIsFilter={setIsFilter}
                    />
                    {isFilter && <Filtration setFilterData={setFilterData} activeVal={activeVal} filterData={filterData} />}
                </div>
                <IssueEditList isFilter={isFilter} dataSource={issueList} onChange={issueId => updateIssue(issueId)} showStage={issueId => showStage(issueId)} />
                <Pagination
                    total={totalCount}
                    pageSize={PAGE_SIZE}
                    current={curPage + 1}
                    onChange={(page: number) => setCurPage(page - 1)}
                />
            </div>

            {stageIssue !== undefined && <StageModel
                issue={stageIssue}
                onCancel={() => setStageIssue(undefined)}
                onOk={() => {
                    updateIssue(stageIssue.issue_id).then(() => {
                        setStageIssue(undefined)
                    });
                }}
            />}
        </CardWrap >
    );
};

export default observer(IssueList);