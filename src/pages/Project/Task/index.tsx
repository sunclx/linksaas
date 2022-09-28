import CardWrap from '@/components/CardWrap';
import Tabs from '@/components/Tabs';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import type { IssueInfo, ListRequest, ListResponse } from '@/api/project_issue';
import { SORT_TYPE_DSC, SORT_KEY_UPDATE_TIME, ASSGIN_USER_ALL, ASSGIN_USER_EXEC, ASSGIN_USER_CHECK } from '@/api/project_issue';
import { list } from '@/api/project_issue';
import { useSetState } from 'ahooks';
import { tabList, TAB_LIST_ENUM } from '@/utils/constant';
import Filtration from '@/components/Filtration';
import StageModel from './components/StageModel';
import useVisible from '@/hooks/useVisible';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import addIcon from '@/assets/image/addIcon.png';
import Table from './components/Table';
import { getIssueText, getIssue_type, getIsTask, getIssueViewUrl } from '@/utils/utils';
import type { LinkIssueListState } from '@/stores/linkAux';

export type FilterDataType = {
  priority_list?: number[];
  state_list?: number[];
  exec_user_id_list?: string[];
  check_user_id_list?: string[];
  software_version_list: string[];
  level_list?: number[];
};

export type PageOptType = {
  pageSize?: number;
  pageNum?: number;
  total?: number;
};

const Task: FC = observer(() => {
  const location = useLocation();

  const filterState: LinkIssueListState | undefined = location.state as LinkIssueListState | undefined;

  const [activeVal, setActiveVal] = useState<TAB_LIST_ENUM>(filterState ? TAB_LIST_ENUM.全部 : TAB_LIST_ENUM.指派给我);
  const [isFilter, setIsFilter] = useState(filterState ? (filterState.checkUserIdList.length > 0 || filterState.execUserIdList.length > 0 || filterState.stateList.length > 0) : false);
  const [stageModelData, setStageModelData] = useVisible<IssueInfo>();
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const { push } = useHistory();
  const [dataSource, setDataSource] = useState<IssueInfo[]>([]);
  const [pageOpt, setPageOpt] = useSetState<Partial<PageOptType>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
  });
  const [filterData, setFilterData] = useSetState<FilterDataType>({
    priority_list: [],
    state_list: filterState?.stateList ?? [],
    exec_user_id_list: filterState?.execUserIdList ?? [],
    check_user_id_list: filterState?.checkUserIdList ?? [],
    software_version_list: [],
    level_list: [],
  });
  const session_id = userStore.sessionId;
  const project_id = projectStore.curProjectId;
  const getList = async () => {
    console.log('getList', filterData);
    const data: ListRequest = {
      session_id,
      project_id,
      sort_type: SORT_TYPE_DSC, // SORT_TYPE_DSC SORT_TYPE_ASC
      sort_key: SORT_KEY_UPDATE_TIME,
      offset: (pageOpt.pageNum! - 1) * pageOpt.pageSize!,
      limit: pageOpt.pageSize!,
      list_param: {
        filter_by_issue_type: true,
        issue_type: getIssue_type(location.pathname),
        filter_by_state: !!filterData.state_list?.length,
        state_list: filterData.state_list!, //阶段
        filter_by_create_user_id: activeVal === TAB_LIST_ENUM.由我创建,
        create_user_id_list: [userStore.userInfo.userId],
        filter_by_assgin_user_id:
          activeVal === TAB_LIST_ENUM.指派给我
            ? true
            : filterData.exec_user_id_list?.length || filterData.check_user_id_list?.length
              ? true
              : false,
        assgin_user_id_list:
          activeVal === TAB_LIST_ENUM.指派给我
            ? [userStore.userInfo.userId]
            : [...filterData.exec_user_id_list!, ...filterData.check_user_id_list!],
        // tab 选择“指派给我” type 为 ASSGIN_USER_ALL ，或者处理人和验收人两个都有选择 type 也为 ASSGIN_USER_ALL；
        // 处理人有选择 type 为 ASSGIN_USER_EXEC；验收人有选择 type 为 ASSGIN_USER_CHECK
        assgin_user_type:
          activeVal === TAB_LIST_ENUM.指派给我 ||
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

    try {
      const res = await request<ListResponse>(list(data));
      setPageOpt({
        total: res.total_count,
      });
      setDataSource(res.info_list);
    } catch (error) { }
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOpt.pageNum, activeVal, filterData]);

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
        <Table
          isFilter={isFilter}
          dataSource={dataSource || []}
          setStageModelData={setStageModelData}
          pageOpt={pageOpt}
          setPageOpt={setPageOpt}
          setDataSource={setDataSource}
          onSuccess={getList}
          userId={userStore.userInfo.userId}
        />
      </div>
      {
        stageModelData.visible && (
          <StageModel
            visible={stageModelData.visible}
            details={stageModelData.param!}
            handleCancel={(bool) => setStageModelData(bool)}
            title={`${getIssueText(location.pathname)}阶段更新`}
            onSuccess={getList}
          />
        )
      }
    </CardWrap >
  );
});

export default Task;
