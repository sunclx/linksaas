import type { ExtraBugInfo, ExtraTaskInfo, IssueInfo } from '@/api/project_issue';
import {
  assign_check_user,
  assign_exec_user,
  set_end_time,
  set_estimate_minutes,
  set_remain_minutes,
  set_exec_award,
  set_check_award,
  update,
  ISSUE_STATE_CLOSE
} from '@/api/project_issue';
import BugLevelSelect from '@/components/BugLevelSelect';
import BugPrioritySelect from '@/components/BugPrioritySelect';
import InputNumber from '@/components/InputNumber';
import MemberSelect from '@/components/MemberSelect';
import Pagination from '@/components/Pagination';
import PrioritySelect from '@/components/PrioritySelect';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { getIsTask, getTime } from '@/utils/utils';
import type { FormInstance, InputRef } from 'antd';
import { DatePicker, Form, Input, message, Table as TableAntd } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import type { ColumnsType } from 'antd/lib/table';
import { isNumber } from 'lodash';
import moment from 'moment';
import type { FC } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { PageOptType } from '..';
import useColumns, { TABLE_FORM_TYPE_ENUM } from './useColumns';
import { useLocation } from 'react-router-dom';




type TableProps = {
  isFilter: boolean;
  dataSource: IssueInfo[];
  setStageModelData: (boo: boolean, val: IssueInfo) => void;
  pageOpt: PageOptType;
  setPageOpt: (val: PageOptType) => void;
  setDataSource: React.Dispatch<React.SetStateAction<IssueInfo[]>>;
  onSuccess: () => void;
  userId: string;
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  formtype: TABLE_FORM_TYPE_ENUM;
  children: React.ReactNode;
  dataIndex: keyof IssueInfo & 'title';
  record: IssueInfo;
  handleSave: (record: IssueInfo) => void;
  onSuccess: () => void;
}

interface EditableRowProps {
  index: number;
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: FC<EditableCellProps> = ({
  title,
  editable,
  children,
  formtype,
  dataIndex,
  record,
  handleSave,
  onSuccess,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const userStore = useStores('userStore');
  const session_id = userStore.sessionId || '';
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      (editing && formtype === TABLE_FORM_TYPE_ENUM.TITLE) ||
      formtype === TABLE_FORM_TYPE_ENUM.VERSION
    ) {
      inputRef.current?.focus();
    }
  }, [editing, formtype]);

  const toggleEdit = () => {
    setEditing(!editing);

    if (formtype === TABLE_FORM_TYPE_ENUM.TITLE) {
      form.setFieldsValue({ [formtype]: record.basic_info.title });
    } else if (formtype === TABLE_FORM_TYPE_ENUM.PRIORITY) {
      form.setFieldsValue({
        [formtype]:
          record.extra_info[`${getIsTask(pathname) ? 'ExtraTaskInfo' : 'ExtraBugInfo'}`]?.priority,
      });
    } else if (formtype === TABLE_FORM_TYPE_ENUM.VERSION) {
      form.setFieldsValue({
        [formtype]: record.extra_info.ExtraBugInfo?.software_version,
      });
    } else if (formtype === TABLE_FORM_TYPE_ENUM.END) {
      let end_time = new Date();
      if (record.has_end_time) {
        end_time = new Date(record.end_time);
      }
      form.setFieldsValue({ [formtype]: moment(end_time, 'YYYY-MM-DD') });
    } else if (formtype === TABLE_FORM_TYPE_ENUM.LEVEL) {
      form.setFieldsValue({
        [formtype]: record.extra_info.ExtraBugInfo?.level,
      });
    } else if (
      formtype === TABLE_FORM_TYPE_ENUM.REMAIN ||
      formtype === TABLE_FORM_TYPE_ENUM.ESTIMATE
    ) {
      form.setFieldsValue({ [formtype]: record[formtype] / 60 });
    } else {
      form.setFieldsValue({ [formtype]: record[formtype] });
    }
  };

  const successRefresh = (msg: string = '修改成功') => {
    message.success(msg);
    onSuccess();
  };

  // 保存
  const save = async () => {
    try {
      const values = await form.validateFields();
      const val = values[formtype];
      if (!isNumber(val) && !val) return;

      const extra_info = record.extra_info;

      const ExtraTaskInfo: ExtraTaskInfo = {
        priority:
          formtype === TABLE_FORM_TYPE_ENUM.PRIORITY ? val : extra_info.ExtraTaskInfo?.priority,
      };

      const ExtraBugInfo: ExtraBugInfo = {
        software_version:
          formtype === TABLE_FORM_TYPE_ENUM.VERSION
            ? val
            : extra_info.ExtraBugInfo?.software_version || '',
        level: formtype === TABLE_FORM_TYPE_ENUM.LEVEL ? val : extra_info.ExtraBugInfo?.level,
        priority:
          formtype === TABLE_FORM_TYPE_ENUM.PRIORITY ? val : extra_info.ExtraBugInfo?.priority,
      };

      const data = {
        ...record,
        session_id,
        basic_info: {
          ...record.basic_info,
          title: formtype === TABLE_FORM_TYPE_ENUM.TITLE ? val : record.basic_info.title,
        },
        extra_info: getIsTask(pathname) ? { ExtraTaskInfo } : { ExtraBugInfo },
      };

      if (
        (formtype === TABLE_FORM_TYPE_ENUM.TITLE || formtype === TABLE_FORM_TYPE_ENUM.VERSION) &&
        (val !== record.basic_info.title ||
          val !== record.extra_info.ExtraBugInfo?.software_version)
      ) {
        await request(update(data));
        successRefresh();
      } else if (
        formtype === TABLE_FORM_TYPE_ENUM.PRIORITY ||
        formtype === TABLE_FORM_TYPE_ENUM.LEVEL
      ) {
        // 更新接口
        await request(update(data));
        successRefresh();
      }

      // 调用处理人接口
      if (val !== record.exec_user_id && formtype === TABLE_FORM_TYPE_ENUM.EXEC_USER) {
        await request(assign_exec_user(session_id, record.project_id, record.issue_id, val));
        successRefresh();
      }

      // 调用验收人接口
      if (val !== record.check_user_id && formtype === TABLE_FORM_TYPE_ENUM.CHECK_USER) {
        await request(assign_check_user(session_id, record.project_id, record.issue_id, val));
        successRefresh();
      }
      //处理人贡献
      if (val !== record.exec_award_point && formtype == TABLE_FORM_TYPE_ENUM.EXEC_USER_AWARD) {
        await request(set_exec_award({
          session_id,
          project_id: record.project_id,
          issue_id: record.issue_id,
          point: val,
        }));
        successRefresh();
      }
      //验收人贡献
      if (val !== record.check_award_point && formtype == TABLE_FORM_TYPE_ENUM.CHECK_USER_AWARD) {
        await request(set_check_award({
          session_id,
          project_id: record.project_id,
          issue_id: record.issue_id,
          point: val,
        }));
        successRefresh();
      }

      // 预估工时
      if (val !== record.estimate_minutes && formtype === TABLE_FORM_TYPE_ENUM.ESTIMATE) {
        await request(
          set_estimate_minutes(session_id, record.project_id, record.issue_id, val * 60),
        );
        successRefresh();
      }
      // 剩余工时
      if (val !== record.remain_minutes && formtype === TABLE_FORM_TYPE_ENUM.REMAIN) {
        await request(
          set_remain_minutes({
            session_id,
            project_id: record.project_id,
            issue_id: record.issue_id,
            remain_minutes: val * 60,
            has_spend_minutes: false,
            spend_minutes: 0,
          }),
        );
        successRefresh();
      }

      // 预估完成时间
      if (formtype === TABLE_FORM_TYPE_ENUM.END && getTime(val) !== record.end_time) {
        await request(set_end_time(session_id, record.project_id, record.issue_id, getTime(val)));
        successRefresh();
      }

      toggleEdit();
      // handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const renderChilds = (): React.ReactNode => {
    // 名称和软件版本
    if (formtype === TABLE_FORM_TYPE_ENUM.TITLE || formtype === TABLE_FORM_TYPE_ENUM.VERSION) {
      return (
        <Form.Item style={{ margin: 0 }} name={formtype}>
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      );
    }
    // 级别
    if (formtype === TABLE_FORM_TYPE_ENUM.LEVEL) {
      return (
        <BugLevelSelect onBlur={save} onChange={save} name={formtype} style={{ width: '90px' }} />
      );
    }
    // 任务的优先级
    if (formtype === TABLE_FORM_TYPE_ENUM.PRIORITY && getIsTask(pathname)) {
      return (
        <PrioritySelect onBlur={save} onChange={save} name={formtype} style={{ width: '100px' }} />
      );
    }
    // 缺陷的优先级
    if (formtype === TABLE_FORM_TYPE_ENUM.PRIORITY && !getIsTask(pathname)) {
      return (
        <BugPrioritySelect
          onBlur={save}
          onChange={save}
          name={formtype}
          style={{ width: '90px' }}
        />
      );
    }
    // 处理人、验收人
    if (
      formtype === TABLE_FORM_TYPE_ENUM.EXEC_USER ||
      formtype === TABLE_FORM_TYPE_ENUM.CHECK_USER
    ) {
      return (
        <MemberSelect onBlur={save} onChange={save} name={formtype} style={{ width: '90px' }} />
      );
    }
    //处理贡献，验收贡献
    if (formtype == TABLE_FORM_TYPE_ENUM.EXEC_USER_AWARD || formtype === TABLE_FORM_TYPE_ENUM.CHECK_USER_AWARD) {
      return (
        <Form.Item style={{ margin: 0 }} name={formtype}>
          <InputNumber style={{ width: 90 }} onPressEnter={save} onBlur={save} autoFocus />
        </Form.Item>
      );
    }
    // 剩余工时、预估工时
    if (formtype === TABLE_FORM_TYPE_ENUM.REMAIN || formtype === TABLE_FORM_TYPE_ENUM.ESTIMATE) {
      return (
        <Form.Item style={{ margin: 0 }} name={formtype}>
          <InputNumber style={{ width: 90 }} onPressEnter={save} onBlur={save} autoFocus />
        </Form.Item>
      );
    }

    // 预估完成时间
    if (formtype === TABLE_FORM_TYPE_ENUM.END) {
      return (
        <Form.Item style={{ margin: 0 }} name={formtype}>
          <DatePicker
            format={'YYYY-MM-DD'}
            style={{ width: 110 }}
            locale={locale}
            onChange={save}
          />
        </Form.Item>
      );
    }
    return '';
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      renderChilds()
    ) : (
      <div
        className={`${record?.state === ISSUE_STATE_CLOSE
          ? 'no-editable-cell-value-wrap'
          : 'editable-cell-value-wrap'
          }`}
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Table: FC<TableProps> = ({
  isFilter,
  dataSource,
  setStageModelData,
  pageOpt,
  setPageOpt,
  setDataSource,
  onSuccess,
  userId,
}) => {
  const { columns1 } = useColumns({
    setStageModelData,
    dataSource,
    setDataSource,
    onSuccess,
    userId,
  });
  return (
    <>
      <TableAntd
        style={{ marginTop: '8px' }}
        rowKey={'issue_id'}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        columns={columns1 as ColumnsType<IssueInfo>}
        scroll={{ x: 1300, y: `${isFilter ? 'calc(100vh - 340px)' : 'calc(100vh - 282px)'}` }}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        total={pageOpt.total!}
        pageSize={pageOpt.pageSize!}
        current={pageOpt.pageNum}
        onChange={(page: number) => setPageOpt({ pageNum: page })}
      />
    </>
  );
};

export default Table;
