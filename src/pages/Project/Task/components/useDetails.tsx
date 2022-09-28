import type { IssueInfo } from '@/api/project_issue';
import Button from '@/components/Button';
import StageFormItem, { STAGE_FORM_TYPE_ENUM } from '@/components/StageFormItem';
import type { FormInstance } from 'antd';
import { Timeline } from 'antd';
import React, { useEffect, useState } from 'react';
import s from './useDetails.module.less';
import { bugLevel, bugPriority, statusText, taskPriority } from '@/utils/constant';
import { request } from '@/utils/request';
import RenderSelectOpt from '@/components/RenderSelectOpt';
import { getIssueText, getIsTask, minuteToHour, timeToDateString } from '@/utils/utils';
import type { PluginEvent } from '@/api/events';
import { EVENT_REF_TYPE_BUG } from '@/api/events';
import { EVENT_TYPE_BUG } from '@/api/events';
import { EVENT_REF_TYPE_TASK, EVENT_TYPE_TASK, list_event_by_ref } from '@/api/events';
import { useLocation } from 'react-router-dom';
import EventCom from '@/components/EventCom';
import { updateIssue } from './common';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { ReadOnlyEditor, useCommonEditor, change_file_fs } from '@/components/Editor';
import { CommentList } from './CommentList';
import { FILE_OWNER_TYPE_ISSUE } from '@/api/fs';

type UseDetailsType = {
  details: IssueInfo;
  form: FormInstance<any>;
  getDetails: () => void;
};

type TimeLineType = PluginEvent;

const useDetails = (props: UseDetailsType) => {
  const { details, form, getDetails } = props;
  const { pathname } = useLocation();

  const LeftCom = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const { editor, editorRef } = useCommonEditor({
      content: '',
      fsId: projectStore.curProject?.issue_fs_id ?? '',
      ownerType: FILE_OWNER_TYPE_ISSUE,
      ownerId: details?.issue_id ?? '',
      historyInToolbar: false,
      clipboardInToolbar: false,
      widgetInToolbar: false,
      showReminder: false,
      channelMember: false,
    });
    // 提交
    const submit = async () => {
      const { stage_item_select_user, stage_item_status } = form.getFieldsValue();

      const commentJson = editorRef.current?.getContent() || {
        type: 'doc',
      };
      await change_file_fs(
        commentJson,
        projectStore.curProject?.issue_fs_id ?? '',
        userStore.sessionId,
        FILE_OWNER_TYPE_ISSUE,
        details?.issue_id ?? '',
      );

      await updateIssue(
        {
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          issue_id: details?.issue_id || '',
          state: stage_item_status,
        },
        stage_item_select_user,
        commentJson,
        details,
      );
      getDetails();
    };

    return (
      <div className={s.leftCom}>
        <div className={s.top_wrap}>
          <h2>{getIssueText(pathname)}详情</h2>
          <div className={s.content_wrap}>
            <ReadOnlyEditor content={details?.basic_info?.content ?? ''} />
          </div>
        </div>
        <div className={s.stage_form_wrap}>
          <h2>{details.user_issue_perm.next_state_list.length > 0 ? "阶段更新" : ""}</h2>
          <StageFormItem
            form={form}
            details={details}
            type={STAGE_FORM_TYPE_ENUM.DETAILS}
            editor={editor}
          />
          <div className={s.submit}>
            <Button onClick={submit}>提交</Button>
          </div>
        </div>
        <CommentList issueId={details.issue_id} />
      </div>
    );
  };

  const RightCom = () => {
    const [timeLine, setTimeLine] = useState<TimeLineType[]>();
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    // 详情动态
    const getListEvent = async () => {
      const data = {
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        event_type: getIsTask(pathname) ? EVENT_TYPE_TASK : EVENT_TYPE_BUG,
        ref_type: getIsTask(pathname) ? EVENT_REF_TYPE_TASK : EVENT_REF_TYPE_BUG,
        ref_id: details.issue_id,
      };
      const res = await request(list_event_by_ref(data));

      if (res) {
        setTimeLine(res.event_list);
      }
    };

    useEffect(() => {
      if (details.issue_id) {
        getListEvent();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={s.RightCom}>
        <div className={s.basic_info_wrap}>
          <div className={s.basic_info}>
            <span>当前阶段</span>
            <div>{statusText[details.state]}</div>
          </div>
          {!getIsTask(pathname) && (
            <>
              <div className={s.basic_info}>
                <span>软件版本</span>
                <div title={details.extra_info?.ExtraBugInfo?.software_version}>
                  {details.extra_info?.ExtraBugInfo?.software_version}
                </div>
              </div>
              <div className={s.basic_info}>
                <span>级别</span>
                <div>{RenderSelectOpt(bugLevel[details.extra_info?.ExtraBugInfo?.level || 0])}</div>
              </div>
            </>
          )}
          <div className={s.basic_info}>
            <span>优先级</span>
            <div>
              {getIsTask(pathname)
                ? RenderSelectOpt(taskPriority[details.extra_info?.ExtraTaskInfo?.priority || 0])
                : RenderSelectOpt(bugPriority[details.extra_info?.ExtraBugInfo?.priority || 0])}
            </div>
          </div>
          <div className={s.basic_info}>
            <span>处理人</span>
            <div>{details.exec_display_name}</div>
          </div>
          <div className={s.basic_info}>
            <span>验收人</span>
            <div>{details.check_display_name}</div>
          </div>
          <div className={s.basic_info}>
            <span>预估工时</span>
            <div>
              {details.has_estimate_minutes ? `${minuteToHour(details.estimate_minutes)} h` : '-'}
            </div>
          </div>
          <div className={s.basic_info}>
            <span>剩余工时</span>
            <div>
              {details.has_remain_minutes ? `${minuteToHour(details.remain_minutes)} h` : '-'}
            </div>
          </div>
          <div className={s.basic_info}>
            <span>预计完成时间</span>
            <div>{details.has_end_time ? timeToDateString(details.end_time) : '-'}</div>
          </div>
          <div className={s.basic_info}>
            <span>创建者</span>
            <div>{details.create_display_name}</div>
          </div>
          <div className={s.basic_info}>
            <span>创建时间</span>
            <div>{timeToDateString(details.create_time)}</div>
          </div>
          <div className={s.basic_info}>
            <span>更新时间</span>
            <div>{timeToDateString(details.update_time)}</div>
          </div>
        </div>
        <div className={s.hr} />
        <div
          className={s.time_line_wrap}
          style={{
            height: `${!getIsTask(pathname) ? 'calc(100% - 470px)' : 'calc(100% - 390px)'}`,
          }}
        >
          <h2>动态</h2>
          <Timeline className={`${s.timeLine} detailsTimeline`} reverse={true}>
            {timeLine?.map((item) => (
              <Timeline.Item color="gray" key={item.event_id}>
                <p>{timeToDateString(item.event_time)}</p>
                <EventCom item={item} skipProjectName={true} skipLink={true} showMoreLink={true} />
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    );
  };
  return {
    LeftCom: observer(LeftCom),
    RightCom: observer(RightCom),
  };
};

export default useDetails;
