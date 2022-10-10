import React, { useMemo, useState } from 'react';
import type { ModalProps } from 'antd';
import { Button } from 'antd';
import { Modal, Input } from 'antd';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkChannelInfo, LinkTaskInfo, LinkBugInfo, LinkDocInfo, LinkExterneInfo } from '@/stores/linkAux';
import { useStores } from '@/hooks';
import {
  list as list_issue,
  SORT_TYPE_DSC,
  SORT_KEY_UPDATE_TIME,
  ISSUE_TYPE_TASK,
  ISSUE_TYPE_BUG,
  ASSGIN_USER_ALL,
} from '@/api/project_issue';
import type { IssueInfo, ListParam as ListIssueParam } from '@/api/project_issue';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import s from './LinkSelect.module.less';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import type { PageOptType } from '@/pages/Project/Task';
import Pagination from '@/components/Pagination';

export interface LinkSelectProps {
  title: string;
  showChannel: boolean;
  showDoc: boolean;
  showTask: boolean;
  showBug: boolean;
  showExterne: boolean;
  onOk: (link: LinkInfo) => void;
  onCancel: () => void;
}

export const LinkSelect: React.FC<LinkSelectProps> = observer((props) => {
  const modalProps: ModalProps = {};
  modalProps.footer = null;
  let defaultTab = '';
  if (props.showChannel) {
    defaultTab = 'channel';
  } else if (props.showDoc) {
    defaultTab = 'doc';
  } else if (props.showTask) {
    defaultTab = 'task';
  } else if (props.showBug) {
    defaultTab = 'bug';
  } else if (props.showExterne) {
    defaultTab = 'externe';
  }
  const [taskPage] = useState(0);
  const [bugPage] = useState(0);
  const [taskList, setTaskList] = useState([] as IssueInfo[]);
  const [bugList, setBugList] = useState([] as IssueInfo[]);
  const [tab, setTab] = useState(defaultTab);
  const [keyword, setKeyword] = useState('');
  const [externeUrl, setExterneUrl] = useState('');

  const channelStore = useStores('channelStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const tabList = [];
  if (props.showChannel) {
    tabList.push({
      label: '频道',
      value: 'channel',
    });
  }
  if (props.showDoc) {
    tabList.push({
      label: '项目文档',
      value: 'doc',
    });
  }
  if (props.showTask) {
    tabList.push({
      label: '任务',
      value: 'task',
    });
  }
  if (props.showBug) {
    tabList.push({
      label: '缺陷',
      value: 'bug',
    });
  }
  if (props.showExterne){
    tabList.push({
      label: '外部链接',
      value: 'externe',
    });
  }
  
  const [pageOpt, setPageOpt] = useSetState<Partial<PageOptType>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
  });

  useMemo(() => {
    const listIssueParam: ListIssueParam = {
      filter_by_issue_type: true,
      issue_type: ISSUE_TYPE_TASK,
      filter_by_state: false,
      state_list: [],
      filter_by_create_user_id: false,
      create_user_id_list: [],
      filter_by_assgin_user_id: false,
      assgin_user_id_list: [],
      assgin_user_type: ASSGIN_USER_ALL,
      filter_by_sprit_id: false,
      sprit_id_list: [],
      filter_by_create_time: false,
      from_create_time: 0,
      to_create_time: 0,
      filter_by_update_time: false,
      from_update_time: 0,
      to_update_time: 0,
      filter_by_task_priority: false,
      task_priority_list: [],
      filter_by_software_version: false,
      software_version_list: [],
      filter_by_bug_priority: false,
      bug_priority_list: [],
      filter_by_bug_level: false,
      bug_level_list: [],
      filter_by_title_keyword: keyword != '',
      title_keyword: keyword,
    };
    if (tab == 'task') {
      request(
        list_issue({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          list_param: { ...listIssueParam, issue_type: ISSUE_TYPE_TASK },
          sort_type: SORT_TYPE_DSC,
          sort_key: SORT_KEY_UPDATE_TIME,

          offset: (pageOpt.pageNum! - 1) * pageOpt.pageSize!,
          limit: pageOpt.pageSize!,
        }),
      ).then((res) => {
        setTaskList(res.info_list);
        setPageOpt({ total: res.total_count });
      });
    } else if (tab == 'bug') {
      request(
        list_issue({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          list_param: { ...listIssueParam, issue_type: ISSUE_TYPE_BUG },
          sort_type: SORT_TYPE_DSC,
          sort_key: SORT_KEY_UPDATE_TIME,
          offset: (pageOpt.pageNum! - 1) * pageOpt.pageSize!,
          limit: pageOpt.pageSize!,
        }),
      ).then((res) => {
        setBugList(res.info_list);
        setPageOpt({ total: res.total_count });
      });
    } else if (tab == 'doc') {
      docStore.loadDocKey(projectStore.curProject?.default_doc_space_id ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskPage, bugPage, tab, keyword, pageOpt.pageNum]);

  // =====
  const renderItemContent = () => {
    if (props.showChannel && tab === 'channel') {
      return (
        <div className={s.con_item_wrap}>
          {channelStore.channelList.map((item) => (
            <div
              className={s.con_item}
              key={item.channelInfo.channel_id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(
                  new LinkChannelInfo(
                    item.channelInfo.basic_info.channel_name,
                    item.channelInfo.project_id,
                    item.channelInfo.channel_id,
                  ),
                );
              }}
            >
              <div># {item.channelInfo.basic_info.channel_name}</div>
            </div>
          ))}
        </div>
      );
    } else if (props.showDoc && tab === 'doc') {
      return (
        <div className={s.con_item_wrap}>
          {docStore.curDocKeyList.map((item) => (
            <div
              className={s.con_item}
              key={item.doc_id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkDocInfo(item.title, item.project_id, item.doc_id));
              }}
            >
              <div>{item.title}</div>
            </div>
          ))}
        </div>
      );
    } else if (props.showTask && tab === 'task') {
      return (
        <div className={s.con_item_wrap}>
          <Input
            style={{ background: '#FAFAFA' }}
            prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
            placeholder="输入关键词"
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setKeyword(e.target.value);
            }}
          />
          {taskList.map((item) => (
            <div
              className={s.con_item}
              key={item.issue_id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkTaskInfo(item.basic_info.title, item.project_id, item.issue_id));
              }}
            >
              <div>
                {item.issue_index}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item.basic_info.title}
              </div>
            </div>
          ))}
          <Pagination
            total={pageOpt.total!}
            pageSize={pageOpt.pageSize!}
            current={pageOpt.pageNum}
            onChange={(page: number) => setPageOpt({ pageNum: page })}
          />
        </div>
      );
    } else if (props.showBug && tab === 'bug') {
      return (
        <div className={s.con_item_wrap}>
          <Input
            style={{ background: '#FAFAFA' }}
            prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
            placeholder="输入关键词"
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setKeyword(e.target.value);
            }}
          />
          {bugList.map((item) => (
            <div
              className={s.con_item}
              key={item.issue_id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkBugInfo(item.basic_info.title, item.project_id, item.issue_id));
              }}
            >
              <div>
                {item.issue_index}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item.basic_info.title}
              </div>
            </div>
          ))}
          <Pagination
            total={pageOpt.total!}
            pageSize={pageOpt.pageSize!}
            current={pageOpt.pageNum}
            onChange={(page: number) => setPageOpt({ pageNum: page })}
          />
        </div>
      );
    } else if (props.showExterne && tab === 'externe') {
      return (
        <div className={s.exteren_wrap}>
          <div className={s.exteren_title}>请填写网页链接</div>
          <Input
            addonBefore="网站地址:"
            placeholder="请输入网站地址"
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setExterneUrl(e.target.value);
            }}
          />
          <div className={s.btn_wrap}>
            <Button type="primary" onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              props.onOk(new LinkExterneInfo("", externeUrl));
            }}>完成</Button>
          </div>
        </div>
      );
    }
    return '';
  };

  return (
    <Modal
      {...modalProps}
      visible={true}
      title={null}
      onCancel={() => {
        props.onCancel();
      }}
      bodyStyle={{
        padding: '0px',
        boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.16)',
        borderRadius: '6px',
      }}
    >
      <div>
        <div className={s.title}>{props.title}</div>
        <div className={s.bodywrap}>
          <div className={s.bodyleft}>
            {tabList.map((item) => (
              <div
                className={classNames(s.item, tab === item.value ? s.active : '')}
                key={item.value}
                onClick={() => {
                  setTab(item.value);
                  if (item.value === 'task' || item.value === 'bug') {
                    setPageOpt({ total: 0, pageNum: 1 });
                  }
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className={s.bodyright}>{renderItemContent()}</div>
        </div>
      </div>
    </Modal>
  );
});
