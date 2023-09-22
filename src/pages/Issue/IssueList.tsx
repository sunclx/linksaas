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
import { ISSUE_TAB_LIST_TYPE, type LinkIssueListState } from '@/stores/linkAux';
import IssueEditList from "./components/IssueEditList";
import { ASSGIN_USER_ALL, ASSGIN_USER_CHECK, ASSGIN_USER_EXEC, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC, list as list_issue, get as get_issue, list_id as list_issue_id, ISSUE_STATE_PROCESS_OR_CHECK, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from "@/api/project_issue";
import type { IssueInfo, ListRequest, ListParam } from "@/api/project_issue";
import { request } from '@/utils/request';
import StageModel from "./components/StageModel";
import Pagination from "@/components/Pagination";
import BatchCreate from "./components/BatchCreate";
import { Popover, Space } from "antd";
import type { TagInfo } from "@/api/project";
import { list_tag, TAG_SCOPRE_TASK, TAG_SCOPRE_BUG } from "@/api/project";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import { MoreOutlined } from "@ant-design/icons";
import Filtration from "./components/Filtration";


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
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');
    const linkAuxStore = useStores('linkAuxStore');

    const filterState: LinkIssueListState = location.state as LinkIssueListState ?? {
        priorityList: [],
        softwareVersionList: [],
        levelList: [],
        tagId: "",
        stateList: [ISSUE_STATE_PROCESS_OR_CHECK],
        execUserIdList: [userStore.userInfo.userId],
        checkUserIdList: [userStore.userInfo.userId],
        tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME,
        curPage: 0,
    };
    const [isFilter, setIsFilter] = useState(true);

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [issueIdList, setIssueIdList] = useState<string[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [stageIssue, setStageIssue] = useState<IssueInfo | undefined>(undefined);
    const [showBatchModal, setShowBatchModal] = useState(false);

    const [tagDefList, setTagDefList] = useState<TagInfo[] | null>(null);
    const [lastState, setLastState] = useState<LinkIssueListState | null>(null);

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
        setLastState(filterState);
        let newFilterState = filterState.stateList.slice();
        if (newFilterState !== undefined && newFilterState.length > 0 && newFilterState.includes(ISSUE_STATE_PROCESS_OR_CHECK)) {
            newFilterState = [ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK];
        }
        if (newFilterState == undefined) {
            newFilterState = [];
        }
        const listParam: ListParam = {
            filter_by_issue_type: true,
            issue_type: getIssue_type(location.pathname),
            filter_by_state: newFilterState.length > 0,
            state_list: newFilterState, //阶段
            filter_by_create_user_id: filterState.tabType === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_MY_CREATE,
            create_user_id_list: [userStore.userInfo.userId],
            filter_by_assgin_user_id: filterState.execUserIdList.length > 0 || filterState.checkUserIdList.length > 0,
            assgin_user_id_list: [...filterState.execUserIdList, ...filterState.checkUserIdList],
            assgin_user_type:
                filterState.tabType === ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME ||
                    (filterState.execUserIdList.length > 0 && filterState.checkUserIdList.length > 0)
                    ? ASSGIN_USER_ALL
                    : filterState.execUserIdList.length > 0
                        ? ASSGIN_USER_EXEC
                        : filterState.checkUserIdList.length > 0
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
            filter_by_task_priority: getIsTask(location.pathname) && (filterState.priorityList?.length ?? 0) > 0,
            task_priority_list: getIsTask(location.pathname) ? (filterState.priorityList ?? []) : [], // 优先级
            filter_by_software_version:
                !getIsTask(location.pathname) && (filterState.softwareVersionList ?? []).length > 0,
            software_version_list: !getIsTask(location.pathname) ? (filterState.softwareVersionList ?? []) : [],
            filter_by_bug_level: !getIsTask(location.pathname) && (filterState.levelList ?? []).length > 0,
            bug_level_list: !getIsTask(location.pathname) ? (filterState.levelList ?? []) : [],
            filter_by_bug_priority: !getIsTask(location.pathname) && (filterState.priorityList?.length ?? 0) > 0,
            bug_priority_list: !getIsTask(location.pathname) ? (filterState.priorityList ?? []) : [], // 优先级,
            filter_by_title_keyword: false,
            title_keyword: "",
            filter_by_tag_id_list: (filterState.tagId ?? "") != "",
            tag_id_list: (filterState.tagId ?? "") == "" ? [] : [filterState.tagId!],
            filter_by_watch: false,
            watch: false,
        };
        const req: ListRequest = {
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sort_type: SORT_TYPE_DSC, // SORT_TYPE_DSC SORT_TYPE_ASC
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: (filterState.curPage ?? 0) * PAGE_SIZE,
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

    const loadTagDefList = async () => {
        const tagScope = getIsTask(location.pathname) ? TAG_SCOPRE_TASK : TAG_SCOPRE_BUG;
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: tagScope,
        }));
        setTagDefList(res.tag_info_list);
    };

    const isSameArray = (a: unknown[], b: unknown[]): boolean => {
        if (a.length != b.length) {
            return false;
        }
        for (const av of a) {
            if (!b.includes(av)) {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        let hasChange = false;
        if (lastState == null) {
            hasChange = true;
        } else {
            if (!isSameArray(lastState.stateList, filterState.stateList)) {
                hasChange = true;
            } else if (!isSameArray(lastState.execUserIdList, filterState.execUserIdList)) {
                hasChange = true;
            } else if (!isSameArray(lastState.checkUserIdList, filterState.checkUserIdList)) {
                hasChange = true;
            } else if (!isSameArray(lastState.priorityList ?? [], filterState.priorityList ?? [])) {
                hasChange = true;
            } else if (!isSameArray(lastState.softwareVersionList ?? [], filterState.softwareVersionList ?? [])) {
                hasChange = true;
            } else if (!isSameArray(lastState.levelList ?? [], filterState.levelList ?? [])) {
                hasChange = true;
            } else if (lastState.tabType != filterState.tabType) {
                hasChange = true;
            } else if (lastState.tagId != filterState.tagId) {
                hasChange = true;
            } else if (lastState.curPage != filterState.curPage) {
                hasChange = true;
            }
        }
        if (hasChange) {
            loadIssueList();
        }
    }, [projectStore.curProjectId, filterState.stateList, filterState.execUserIdList,
    filterState.checkUserIdList, filterState.tabType, filterState.priorityList,
    filterState.softwareVersionList, filterState.levelList, filterState.tagId, filterState.curPage
    ]);

    useEffect(() => {
        loadTagDefList();
    }, [projectStore.curProjectId, projectStore.curProject?.tag_version]);

    return (
        <CardWrap title={`${getIssueText(location.pathname)}列表`} extra={
            <Space size="middle">
                <Button
                    className={s.btn}
                    type="primary"
                    onClick={() => history.push(getIssueCreateUrl(location.pathname))}
                    disabled={projectStore.curProject?.closed}
                >
                    <img src={addIcon} alt="" />
                    创建{getIssueText(location.pathname)}
                </Button>
                <Popover placement="bottom" trigger="click" content={
                    <div style={{ padding: "10px 10px" }}>
                        <Space direction="vertical">
                            {getIsTask(location.pathname) == true && (
                                <Button type="link" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowBatchModal(true);
                                }}>批量创建</Button>
                            )}
                            <Button type="link" disabled={!projectStore.isAdmin} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST;
                            }}>管理标签</Button>
                        </Space>
                    </div>
                }>
                    <MoreOutlined className={s.more} />
                </Popover>
            </Space>}>
            <div className={s.task_wrap}>
                <div style={{ marginRight: '20px' }}>
                    <Tabs
                        activeVal={filterState.tabType ?? ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME}
                        list={tabList}
                        onChang={value => {
                            if (value == ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME) {
                                if (getIsTask(location.pathname)) {
                                    linkAuxStore.goToTaskList({
                                        stateList: [ISSUE_STATE_PROCESS_OR_CHECK],
                                        execUserIdList: [userStore.userInfo.userId],
                                        checkUserIdList: [userStore.userInfo.userId],
                                        tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME,
                                        curPage: 0,
                                    }, history);
                                } else {
                                    linkAuxStore.goToBugList({
                                        stateList: [ISSUE_STATE_PROCESS_OR_CHECK],
                                        execUserIdList: [userStore.userInfo.userId],
                                        checkUserIdList: [userStore.userInfo.userId],
                                        tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ASSGIN_ME,
                                        curPage: 0,
                                    }, history);
                                }
                            } else {
                                if (getIsTask(location.pathname)) {
                                    linkAuxStore.goToTaskList({
                                        stateList: [],
                                        execUserIdList: [],
                                        checkUserIdList: [],
                                        tabType: value,
                                        curPage: 0,
                                    }, history);
                                } else {
                                    linkAuxStore.goToBugList({
                                        stateList: [],
                                        execUserIdList: [],
                                        checkUserIdList: [],
                                        tabType: value,
                                        curPage: 0,
                                    }, history);
                                }
                            }
                        }}
                        isFilter={isFilter}
                        setIsFilter={setIsFilter}
                    />
                    {isFilter && tagDefList != null && <Filtration tagDefList={tagDefList} />}
                </div>
                {tagDefList != null && (
                    <IssueEditList isFilter={isFilter} dataSource={issueList}
                        issueIdList={issueIdList} onChange={issueId => updateIssue(issueId)} showStage={issueId => showStage(issueId)}
                        tagDefList={tagDefList} />
                )}
                <Pagination
                    total={totalCount}
                    pageSize={PAGE_SIZE}
                    current={(filterState.curPage ?? 0) + 1}
                    onChange={(page: number) => {
                        if (getIsTask(location.pathname)) {
                            linkAuxStore.goToTaskList({ ...filterState, curPage: page - 1 }, history);
                        } else {
                            linkAuxStore.goToBugList({ ...filterState, curPage: page - 1 }, history);
                        }
                    }}
                />
            </div>

            {stageIssue !== undefined && <StageModel
                issue={stageIssue}
                onCancel={() => setStageIssue(undefined)}
                onOk={() => {
                    updateIssue(stageIssue.issue_id).then(() => {
                        setStageIssue(undefined)
                    });
                    spritStore.updateIssue(stageIssue.issue_id);
                }}
            />}
            {showBatchModal == true && <BatchCreate
                onCancel={() => setShowBatchModal(false)}
                onOk={() => {
                    setShowBatchModal(false);
                    if (getIsTask(location.pathname)) {
                        linkAuxStore.goToTaskList({
                            stateList: [],
                            execUserIdList: [],
                            checkUserIdList: [],
                            tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL,
                            priorityList: [],
                            softwareVersionList: [],
                            levelList: [],
                            tagId: "",
                        }, history);
                    } else {
                        linkAuxStore.goToTaskList({
                            stateList: [],
                            execUserIdList: [],
                            checkUserIdList: [],
                            tabType: ISSUE_TAB_LIST_TYPE.ISSUE_TAB_LIST_ALL,
                            priorityList: [],
                            softwareVersionList: [],
                            levelList: [],
                            tagId: "",
                        }, history);
                    }
                }}
            />}
        </CardWrap >
    );
};

export default observer(IssueList);