import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from './IssueList.module.less';
import CardWrap from '@/components/CardWrap';
import { getIssueText, getIssue_type, getIsTask, getIssueCreateUrl } from '@/utils/utils';
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
import { ASSGIN_USER_ALL, ASSGIN_USER_CHECK, ASSGIN_USER_EXEC, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC, list as list_issue, get as get_issue, list_id as list_issue_id, ISSUE_STATE_PROCESS_OR_CHECK, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from "@/api/project_issue";
import type { IssueInfo, ListRequest, ListParam, ISSUE_STATE } from "@/api/project_issue";
import { request } from '@/utils/request';
import StageModel from "./components/StageModel";
import Pagination from "@/components/Pagination";
import Dropdown from "antd/lib/dropdown";
import BatchCreate from "./components/BatchCreate";
import { Space } from "antd";

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
    let defaultStateList: ISSUE_STATE[] = [];
    if (filterState !== undefined && filterState.stateList !== undefined) {
        defaultStateList = filterState.stateList;
    } else {
        if (activeVal == ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME) {
            defaultStateList = [ISSUE_STATE_PROCESS_OR_CHECK];
        }
    }
    const [filterData, setFilterData] = useSetState<FilterDataType>({
        priority_list: [],
        state_list: defaultStateList,
        exec_user_id_list: filterState?.execUserIdList ?? [],
        check_user_id_list: filterState?.checkUserIdList ?? [],
        software_version_list: [],
        level_list: [],
    });
    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [issueIdList, setIssueIdList] = useState<string[]>([]);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [stageIssue, setStageIssue] = useState<IssueInfo | undefined>(undefined);
    const [showBatchModal, setShowBatchModal] = useState(false);

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
        let newFilterState = filterData.state_list;
        if (newFilterState !== undefined && newFilterState.length > 0 && newFilterState.includes(ISSUE_STATE_PROCESS_OR_CHECK)) {
            newFilterState = [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK];
        }
        if (newFilterState == undefined) {
            newFilterState = [];
        }
        const listParam: ListParam = {
            filter_by_issue_type: true,
            issue_type: getIssue_type(location.pathname),
            filter_by_state: !!filterData.state_list?.length,
            state_list: newFilterState, //阶段
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
            filter_by_tag_id_list: false,
            tag_id_list: [],
        };
        const req: ListRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sort_type: SORT_TYPE_DSC, // SORT_TYPE_DSC SORT_TYPE_ASC
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            list_param: listParam,
        };
        const res = await request(list_issue(req));
        if (res) {
            setIssueList(res.info_list);
            setTotalCount(res.total_count);
        }
        const idRes = await request(list_issue_id({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: listParam,
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            max_count: 999,
        }));
        if (idRes) {
            setIssueIdList(idRes.issue_id_list);
        }
    };

    useEffect(() => {
        loadIssueList();
    }, [curPage, activeVal, filterData, projectStore.curProjectId])

    return (
        <CardWrap title={`${getIssueText(location.pathname)}列表`} extra={
            <Space>
                {getIsTask(location.pathname) == true && <Dropdown.Button
                    className={s.btn}
                    type="primary"
                    menu={{
                        items: [
                            {
                                label: "批量创建",
                                key: "batch"
                            }
                        ],
                        onClick: (e) => {
                            if (e.key == "batch") {
                                setShowBatchModal(true);
                            }
                        },
                    }}
                    onClick={() => push(getIssueCreateUrl(location.pathname))}
                    disabled={projectStore.curProject?.closed}
                >
                    <img src={addIcon} alt="" />
                    创建{getIssueText(location.pathname)}
                </Dropdown.Button>
                }
                {getIsTask(location.pathname) == false && <Button
                    className={s.btn}
                    type="primary"
                    onClick={() => push(getIssueCreateUrl(location.pathname))}
                    disabled={projectStore.curProject?.closed}
                >
                    <img src={addIcon} alt="" />
                    创建{getIssueText(location.pathname)}
                </Button>
                }
            </Space>}>
            <div className={s.task_wrap}>
                <div style={{ marginRight: '20px' }}>
                    <Tabs
                        activeVal={activeVal}
                        list={tabList}
                        onChang={value => {
                            setActiveVal(value);
                            if (value == ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME) {
                                setFilterData({
                                    ...filterData,
                                    state_list: [ISSUE_STATE_PROCESS_OR_CHECK],
                                });
                                setIsFilter(false);
                                setTimeout(() => {
                                    setIsFilter(true);
                                }, 200);
                            }

                        }}
                        isFilter={isFilter}
                        setIsFilter={setIsFilter}
                    />
                    {isFilter && <Filtration setFilterData={setFilterData} activeVal={activeVal} filterData={filterData} />}
                </div>
                <IssueEditList isFilter={isFilter} dataSource={issueList} issueIdList={issueIdList} onChange={issueId => updateIssue(issueId)} showStage={issueId => showStage(issueId)} />
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
            {showBatchModal == true && <BatchCreate
                onCancel={() => setShowBatchModal(false)}
                onOk={() => {
                    setFilterData({
                        priority_list: [],
                        state_list: [],
                        exec_user_id_list: [],
                        check_user_id_list: [],
                        software_version_list: [],
                        level_list: [],
                    });
                    setIsFilter(false);
                    if (activeVal != ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL) {
                        setActiveVal(ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL);
                    } else {
                        if (curPage > 0) {
                            setCurPage(0);
                        } else {
                            loadIssueList();
                        }
                    }
                    setShowBatchModal(false);
                }}
            />}
        </CardWrap >
    );
};

export default observer(IssueList);