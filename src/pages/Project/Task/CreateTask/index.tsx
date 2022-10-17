import Button from '@/components/Button';
import CardWrap from '@/components/CardWrap';
import DetailsNav from '@/components/DetailsNav';
import { Form, Input, message, Modal } from 'antd';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import s from './index.module.less';
import { observer } from 'mobx-react';
import type { IssueInfo, ExtraInfo, GetResponse } from '@/api/project_issue';
import {
  assign_check_user,
  assign_exec_user,
  create,
  get,
  set_end_time,
  set_estimate_minutes,
  set_remain_minutes,
  set_exec_award,
  set_check_award,
  remove,
  update,
  ISSUE_STATE_PLAN,
  ISSUE_TYPE_TASK,
  ISSUE_TYPE_BUG,
  TASK_PRIORITY_LOW,
  BUG_LEVEL_MINOR,
  BUG_PRIORITY_LOW,
} from '@/api/project_issue';
import { useHistory, useLocation } from 'react-router-dom';
import { request } from '@/utils/request';
import useDetails from '../components/useDetails';
import {
  getExtraInfoText,
  getIssueText,
  getIssue_type,
  getIsTask,
  getTime,
  goBack,
  minuteToHour,
} from '@/utils/utils';
import editIcon from '@/assets/image/editIcon.png';
import moment from 'moment';
import BasicsForm from '../components/BasicsForm';
import { useCommonEditor, change_file_fs, change_file_owner } from '@/components/Editor';
import type { LinkIssueState } from '@/stores/linkAux';
import { useStores } from '@/hooks';
import { FILE_OWNER_TYPE_PROJECT, FILE_OWNER_TYPE_ISSUE } from '@/api/fs';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons/lib/icons';
import { showShortNote } from '@/utils/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG } from '@/api/short_note';

export enum TASK_INSIDE_PAGES_ENUM {
  ADD = 'add',
  EDIT = 'edit',
  DETAILS = 'details',
}

const CreateTask: FC = observer(() => {
  const location = useLocation();
  const history = useHistory();
  const pathname = location.pathname;
  const state: LinkIssueState | undefined = location.state as LinkIssueState | undefined;
  const id = state === undefined ? '' : state.issueId;
  const taskContent = state === undefined ? '' : state.content;
  const type =
    state === undefined ? TASK_INSIDE_PAGES_ENUM.ADD : (state.mode as TASK_INSIDE_PAGES_ENUM);
  const [form] = Form.useForm();
  const [pageType, setPageType] = useState<TASK_INSIDE_PAGES_ENUM>(
    type || TASK_INSIDE_PAGES_ENUM.ADD,
  );

  const projectStore = useStores('projectStore');
  const linkAuxStore = useStores('linkAuxStore');
  const userStore = useStores("userStore");

  const session_id = userStore.sessionId;
  const project_id = projectStore.curProjectId;

  const emptyIssue: IssueInfo = {
    issue_id: "",
    issue_type: getIssue_type(pathname),
    issue_index: 0,
    basic_info: {
      title: '',
      content: '',
    },
    project_id: projectStore.curProjectId,
    create_time: 0,
    update_time: 0,
    state: ISSUE_STATE_PLAN,
    create_user_id: "",
    exec_user_id: "",
    check_user_id: "",
    sprit_id: "",
    sprit_name: "",
    create_display_name: "",
    exec_display_name: "",
    check_display_name: "",
    msg_count: 0,
    ///计划相关字段
    has_start_time: false,
    start_time: 0,
    has_end_time: false,
    end_time: 0,
    has_estimate_minutes: false,
    estimate_minutes: 0,
    has_remain_minutes: false,
    remain_minutes: 0,
    ///登陆用户权限相关
    user_issue_perm: {
      can_assign_exec_user: false,
      can_assign_check_user: false,
      next_state_list: [],
      can_remove: false,
      can_opt_sub_issue: false,
      can_opt_dependence: false,
    },
    exec_award_point: 10,
    check_award_point: 10,
    extra_info: {
      //TODO
    },
  };
  const [details, setDetails] = useState<IssueInfo>(emptyIssue);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const { editor, editorRef } = id == "" ? useCommonEditor({
    content: taskContent,
    fsId: projectStore.curProject?.issue_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_PROJECT,
    ownerId: projectStore.curProjectId,
    historyInToolbar: false,
    clipboardInToolbar: false,
    widgetInToolbar: false,
    showReminder: false,
    channelMember: false,
  }) : useCommonEditor({
    content: taskContent,
    fsId: projectStore.curProject?.issue_fs_id ?? '',
    ownerType: FILE_OWNER_TYPE_ISSUE,
    ownerId: id,
    historyInToolbar: false,
    clipboardInToolbar: false,
    widgetInToolbar: false,
    showReminder: false,
    channelMember: false,
  });

  // 获取详情
  const getDetails = async () => {
    try {
      const res = await request<GetResponse>(get(session_id, project_id, id!));
      setDetails(res.info);
    } catch (error) {
      console.log(error);
      if (getIsTask(pathname)) {
        history.push("/app/project/task");
      } else {
        history.push("/app/project/bug");
      }
    }
  };

  // 详情左边、右边内容
  const { LeftCom, RightCom } = useDetails({
    form,
    details: details,
    getDetails,
  });

  useEffect(() => {
    if (id) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 点击编辑
  const setEditValue = () => {
    setPageType(TASK_INSIDE_PAGES_ENUM.EDIT);
    form.setFieldsValue({
      ...details,
      title: details.basic_info.title,
      end_time: details.has_end_time ? moment(new Date(details.end_time), 'YYYY-MM-DD') : null,
      estimate_minutes: minuteToHour(details.estimate_minutes),
      remain_minutes: minuteToHour(details.remain_minutes),
      priority: details.extra_info[`${getExtraInfoText(pathname)}`]?.priority,
      software_version: details.extra_info.ExtraBugInfo?.software_version,
      level: details.extra_info.ExtraBugInfo?.level,
    });
    setTimeout(() => {
      editorRef.current?.setContent(details.basic_info.content);
    }, 100);
  };

  const getTitle = () => {
    const title = `${getIssueText(pathname)}${pageType === TASK_INSIDE_PAGES_ENUM.ADD
      ? '创建'
      : pageType === TASK_INSIDE_PAGES_ENUM.EDIT
        ? '编辑'
        : `详情-[${details?.issue_index}]${details?.basic_info?.title}`
      }`;
    if (pageType == TASK_INSIDE_PAGES_ENUM.DETAILS) {
      return (<span>{title}&nbsp;&nbsp;<a
        onClick={e => {
          let projectName = "";
          projectStore.projectList.forEach(prj => {
            if (prj.project_id == details.project_id) {
              projectName = prj.basic_info.project_name;
            }
          })
          e.stopPropagation();
          e.preventDefault();
          showShortNote(userStore.sessionId, {
            shortNoteType: details.issue_type == ISSUE_TYPE_TASK ? SHORT_NOTE_TASK : SHORT_NOTE_BUG,
            data: details,
          }, projectName);
        }}
      ><ExportOutlined style={{ fontSize: "16px" }} /></a></span>);
    } else {
      return (<span>{title}</span>);
    }
  };

  // 保存
  const submit = async () => {
    const isPageAdd = () => pageType === TASK_INSIDE_PAGES_ENUM.ADD;
    const isPageEdit = () => pageType === TASK_INSIDE_PAGES_ENUM.EDIT;

    form.submit();
    const {
      title,
      priority,
      exec_user_id,
      check_user_id,
      estimate_minutes,
      remain_minutes,
      end_time,
      software_version,
      level,
      exec_award,
      check_award,
    } = form.getFieldsValue();
    const contentJson = editorRef.current?.getContent() || {
      type: 'doc',
    };
    if (id == "") {
      await change_file_fs(contentJson, projectStore.curProject?.issue_fs_id ?? '', userStore.sessionId, FILE_OWNER_TYPE_PROJECT, projectStore.curProjectId);
    } else {
      await change_file_fs(contentJson, projectStore.curProject?.issue_fs_id ?? '', userStore.sessionId, FILE_OWNER_TYPE_ISSUE, id);
    }
    if (!title) return;

    const task: ExtraInfo = {
      ExtraTaskInfo: {
        priority,
      },
    };
    const bug: ExtraInfo = {
      ExtraBugInfo: {
        software_version,
        level,
        priority,
      },
    };
    const info = getIsTask(pathname) ? task : bug;
    const data = {
      session_id,
      project_id,
      issue_type: getIssue_type(pathname),
      basic_info: {
        title,
        content: JSON.stringify(contentJson),
      },
      extra_info: {
        ...info,
      },
    };
    //补充缺失值
    if (data.issue_type == ISSUE_TYPE_TASK) {
      if (data.extra_info.ExtraTaskInfo === undefined) {
        data.extra_info.ExtraTaskInfo = { priority: TASK_PRIORITY_LOW };
      }
      if (data.extra_info.ExtraTaskInfo.priority === undefined) {
        data.extra_info.ExtraTaskInfo.priority = TASK_PRIORITY_LOW;
      }
    } else if (data.issue_type == ISSUE_TYPE_BUG) {
      if (data.extra_info.ExtraBugInfo === undefined) {
        data.extra_info.ExtraBugInfo = {
          software_version: '',
          level: BUG_LEVEL_MINOR,
          priority: BUG_PRIORITY_LOW,
        };
      }
      if (data.extra_info.ExtraBugInfo.software_version === undefined) {
        data.extra_info.ExtraBugInfo.software_version = '';
      }
      if (data.extra_info.ExtraBugInfo.level === undefined) {
        data.extra_info.ExtraBugInfo.level = BUG_LEVEL_MINOR;
      }
      if (data.extra_info.ExtraBugInfo.priority === undefined) {
        data.extra_info.ExtraBugInfo.priority = BUG_PRIORITY_LOW;
      }
    }
    const res: { issue_id: string } = { issue_id: details.issue_id };
    const userObj: [string, string] = [session_id, project_id];


    // 新增接口
    if (isPageAdd()) {
      const createRes = await request(create(data));
      res.issue_id = createRes.issue_id;
      await change_file_owner(contentJson, userStore.sessionId, FILE_OWNER_TYPE_ISSUE, res.issue_id);
    }

    // 更新接口
    if (isPageEdit()) {
      await request(update({ ...data, issue_id: details.issue_id }));
    }

    // 调用处理人接口
    if (isPageAdd() || (isPageEdit() && details.exec_user_id !== exec_user_id)) {
      if (exec_user_id !== undefined) {
        await request(assign_exec_user(...userObj, res.issue_id, exec_user_id));
      }
    }

    // 调用验收人接口
    if (isPageAdd() || (isPageEdit() && details.check_user_id !== check_user_id)) {
      if (check_user_id !== undefined) {
        await request(assign_check_user(...userObj, res.issue_id, check_user_id));
      }
    }

    // 预估工时
    if (
      isPageEdit() &&
      estimate_minutes !== undefined &&
      details.estimate_minutes !== estimate_minutes
    ) {
      await request(set_estimate_minutes(...userObj, res.issue_id, estimate_minutes * 60));
    }

    // 剩余工时
    if (isPageEdit() && remain_minutes !== undefined && details.remain_minutes !== remain_minutes) {
      await request(
        set_remain_minutes({
          session_id,
          project_id,
          issue_id: res.issue_id,
          remain_minutes: remain_minutes * 60,
          has_spend_minutes: false,
          spend_minutes: 0,
        }),
      );
    }
    console.log(details.end_time, getTime(end_time));

    // 预估完成时间
    if (isPageEdit() && end_time !== undefined && details.end_time !== getTime(end_time)) {
      await request(set_end_time(...userObj, res.issue_id, getTime(end_time)));
    }
    //奖励值
    await request(set_exec_award({
      session_id,
      project_id,
      issue_id: res.issue_id,
      point: exec_award ?? 0,
    }));
    await request(set_check_award({
      session_id,
      project_id,
      issue_id: res.issue_id,
      point: check_award ?? 0,
    }));

    message.success('保存成功');
    if (data.issue_type == ISSUE_TYPE_TASK) {
      linkAuxStore.goToTaskList(
        {
          stateList: [],
          execUserIdList: [],
          checkUserIdList: [],
        },
        history,
      );
    } else if (data.issue_type == ISSUE_TYPE_BUG) {
      linkAuxStore.goToBugList(
        {
          stateList: [],
          execUserIdList: [],
          checkUserIdList: [],
        },
        history,
      );
    }
  };

  const getBtn = () => {
    if (pageType === TASK_INSIDE_PAGES_ENUM.DETAILS) {
      return (
        <>
          <Button type="primary" onClick={setEditValue} disabled={id == ""}>
            <img src={editIcon} alt="" style={{ marginRight: '5px' }} />
            编辑
          </Button>
          {details.user_issue_perm.can_remove && (
            <Button danger onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              setShowRemoveModal(true);
            }}>
              <DeleteOutlined />删除
            </Button>)}
        </>
      );
    }
    return (
      <>
        <Button type="primary" ghost onClick={() => goBack()}>
          取消
        </Button>
        <Button type="primary" onClick={() => submit()}>
          保存
        </Button>
      </>
    );
  };

  return (
    <CardWrap>
      <DetailsNav title={getTitle()}>{getBtn()}</DetailsNav>
      <div className={s.content_wrap}>
        <Form
          form={form}
          className={s.createTaskForm}
          initialValues={{ priority: 0, exec_award: details.exec_award_point, check_award: details.check_award_point }}
        >
          <div className={s.content_left}>
            {pageType !== TASK_INSIDE_PAGES_ENUM.DETAILS && (
              <>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: '名称必填' }]}
                  className={s.antFormItem}
                >
                  <Input
                    allowClear
                    placeholder={`输入${getIssueText(pathname)}名称`}
                    style={{ marginBottom: '12px' }}
                  />
                </Form.Item>
                {editor}
              </>
            )}
            {pageType === TASK_INSIDE_PAGES_ENUM.DETAILS && <LeftCom />}
          </div>
          <div className={s.content_rigth}>
            <h2>基本信息</h2>
            <div className={s.info}>
              {pageType !== TASK_INSIDE_PAGES_ENUM.DETAILS && (
                <BasicsForm details={details} pageType={pageType} />
              )}
              {pageType === TASK_INSIDE_PAGES_ENUM.DETAILS && <RightCom />}
            </div>
          </div>
        </Form>
        {showRemoveModal && (
          <Modal
            title={`删除${getIssueText(pathname)}`}
            open={showRemoveModal}
            onCancel={() => setShowRemoveModal(false)}
            onOk={async (e): Promise<void> => {
              e.stopPropagation();
              e.preventDefault();
              await request(remove(userStore.sessionId, details.project_id, details.issue_id));
              message.info(`删除${getIssueText(pathname)}成功`);
              setShowRemoveModal(false);
              if (getIsTask(pathname)) {
                history.push("/app/project/task");
              } else {
                history.push("/app/project/bug");
              }
            }}
          >
            <p>是否删除当前{getIssueText(pathname)}?</p>
            <p style={{ color: "red" }}>删除后将无法恢复当前{getIssueText(pathname)}</p>
          </Modal>
        )}
      </div>
    </CardWrap>
  );
});

export default CreateTask;
