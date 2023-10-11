import React, { useEffect, useMemo, useState } from 'react';
import { Card, Form, Select } from 'antd';
import type { ModalProps } from 'antd';
import { Button } from 'antd';
import { Modal, Input } from 'antd';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkChannelInfo, LinkTaskInfo, LinkBugInfo, LinkDocInfo, LinkExterneInfo, LinkRequirementInfo } from '@/stores/linkAux';
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
import type { DocKey, DocSpace } from '@/api/project_doc';
import { list_doc_key, list_doc_space } from '@/api/project_doc';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import s from './LinkSelect.module.less';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import Pagination from '@/components/Pagination';
import type { RequirementInfo } from '@/api/project_requirement';
import { list_requirement, REQ_SORT_UPDATE_TIME } from '@/api/project_requirement';

const PAGE_SIZE = 10;

const ALL_DOC_SPACE: DocSpace = {
  doc_space_id: "",
  base_info: {
    title: "全部文档"
  },
  project_id: "",
  create_time: 0,
  update_time: 0,
  create_user_id: "",
  doc_count: 0,
  system_doc_space: false,
  user_perm: {
    can_update: false,
    can_remove: false,
  },
};

export interface LinkSelectProps {
  title: string;
  showChannel: boolean;
  showDoc: boolean;
  showRequirement: boolean;
  showTask: boolean;
  showBug: boolean;
  showExterne: boolean;
  onOk: (link: LinkInfo) => void;
  onCancel: () => void;
}

export const LinkSelect: React.FC<LinkSelectProps> = observer((props) => {
  const channelStore = useStores('channelStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const modalProps: ModalProps = {};
  modalProps.footer = null;
  let defaultTab = '';
  if (props.showChannel) {
    defaultTab = 'channel';
  } else if (props.showDoc) {
    defaultTab = 'doc';
  } else if (props.showRequirement) {
    defaultTab = "requirement";
  } else if (props.showTask) {
    defaultTab = 'task';
  } else if (props.showBug) {
    defaultTab = 'bug';
  } else if (props.showExterne) {
    defaultTab = 'externe';
  }

  const [requirementList, setRequirementList] = useState([] as RequirementInfo[]);
  const [taskList, setTaskList] = useState([] as IssueInfo[]);
  const [bugList, setBugList] = useState([] as IssueInfo[]);
  const [docSpaceList, setDocSpaceList] = useState([ALL_DOC_SPACE] as DocSpace[]);
  const [curDocSpaceId, setCurDocSpaceId] = useState("");
  const [docList, setDocList] = useState([] as DocKey[]);
  const [tab, setTab] = useState(defaultTab);
  const [keyword, setKeyword] = useState('');
  const [externeUrl, setExterneUrl] = useState('');

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
  if (props.showRequirement) {
    tabList.push({
      label: '项目需求',
      value: 'requirement',
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
  if (props.showExterne) {
    tabList.push({
      label: '外部链接',
      value: 'externe',
    });
  }

  const [curPage, setCurPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);


  useMemo(() => {
    if (tab == 'doc') {
      request(list_doc_space({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
      })).then(res => {
        const tmpList = res.doc_space_list.slice();
        tmpList.unshift(ALL_DOC_SPACE);
        setDocSpaceList(tmpList);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (!(tab == "task" || tab == "bug")) {
      return;
    }
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
      filter_by_tag_id_list: false,
      tag_id_list: [],
      filter_by_watch: false,
      watch: false,
    };
    if (tab == 'task') {
      request(
        list_issue({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          list_param: { ...listIssueParam, issue_type: ISSUE_TYPE_TASK },
          sort_type: SORT_TYPE_DSC,
          sort_key: SORT_KEY_UPDATE_TIME,

          offset: curPage * PAGE_SIZE,
          limit: PAGE_SIZE,
        }),
      ).then((res) => {
        setTaskList(res.info_list);
        setTotalCount(res.total_count);
      });
    } else if (tab == 'bug') {
      request(
        list_issue({
          session_id: userStore.sessionId,
          project_id: projectStore.curProjectId,
          list_param: { ...listIssueParam, issue_type: ISSUE_TYPE_BUG },
          sort_type: SORT_TYPE_DSC,
          sort_key: SORT_KEY_UPDATE_TIME,
          offset: curPage * PAGE_SIZE,
          limit: PAGE_SIZE,
        }),
      ).then((res) => {
        setBugList(res.info_list);
        setTotalCount(res.total_count);
      });
    }
  }, [tab, keyword, curPage]);

  useEffect(() => {
    if (tab != "doc") {
      return;
    }
    request(list_doc_key({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      filter_by_doc_space_id: curDocSpaceId != "",
      doc_space_id: curDocSpaceId,
      list_param: {
        filter_by_watch: false,
        watch: false,
        filter_by_tag_id: false,
        tag_id_list: [],
      },
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
    })).then((res) => {
      setDocList(res.doc_key_list);
      setTotalCount(res.total_count);
    });
  }, [tab, curPage, curDocSpaceId])

  useEffect(() => {
    if (tab != 'requirement') {
      return;
    }
    request(list_requirement({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      filter_by_keyword: keyword.trim() != "",
      keyword: keyword.trim(),
      filter_by_has_link_issue: false,
      has_link_issue: false,
      filter_by_closed: false,//FIXME
      closed: false,//FIXME
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort_type: REQ_SORT_UPDATE_TIME,//FIXME
      filter_by_tag_id_list: false,
      tag_id_list: [],
    })).then(res => {
      setTotalCount(res.total_count);
      setRequirementList(res.requirement_list);
    })
  }, [tab, curPage, keyword]);

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
        <Card bordered={false} extra={
          <Select value={curDocSpaceId} onChange={value => setCurDocSpaceId(value)}>
            {docSpaceList.map(item => (
              <Select.Option key={item.doc_space_id} value={item.doc_space_id}>{item.base_info.title}</Select.Option>
            ))}
          </Select>
        }>
          <div className={s.con_item_wrap}>
            {docList.map((item) => (
              <div
                className={s.con_item}
                key={item.doc_id}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  props.onOk(new LinkDocInfo(item.title, item.project_id, "", item.doc_id));
                }}
              >
                <div>{item.title}</div>
              </div>
            ))}
            <Pagination
              total={totalCount}
              pageSize={PAGE_SIZE}
              current={curPage + 1}
              onChange={(page: number) => setCurPage(page - 1)}
            />
          </div>
        </Card>
      );
    } else if (props.showRequirement && tab == "requirement") {
      return (
        <div className={s.con_item_wrap}>
          <Form layout='inline' style={{ paddingLeft: "20px", paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #e4e4e8" }}>
            <Form.Item label="标题">
              <Input
                style={{ width: 150 }}
                prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
                placeholder="输入关键词"
                value={keyword}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
          {requirementList.map((item) => (
            <div
              className={s.con_item}
              key={item.requirement_id}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkRequirementInfo(item.base_info.title, item.project_id, item.requirement_id));
              }}
            >
              <div>
                {item.base_info.title}
              </div>
            </div>
          ))}
          <Pagination
            total={totalCount}
            pageSize={PAGE_SIZE}
            current={curPage + 1}
            onChange={(page: number) => setCurPage(page - 1)}
          />
        </div>
      );
    } else if (props.showTask && tab === 'task') {
      return (
        <div className={s.con_item_wrap}>
          <Input
            style={{ background: '#FAFAFA', padding: "10px 10px" }}
            prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
            addonBefore="过滤任务标题:"
            placeholder="输入关键词"
            value={keyword}
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
            total={totalCount}
            pageSize={PAGE_SIZE}
            current={curPage + 1}
            onChange={(page: number) => setCurPage(page - 1)}
          />
        </div>
      );
    } else if (props.showBug && tab === 'bug') {
      return (
        <div className={s.con_item_wrap}>
          <Input
            style={{ background: '#FAFAFA', padding: "10px 10px" }}
            prefix={<SearchOutlined style={{ color: '#B7B7B7' }} />}
            addonBefore="过滤缺陷标题:"
            placeholder="输入关键词"
            value={keyword}
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
            total={totalCount}
            pageSize={PAGE_SIZE}
            current={curPage + 1}
            onChange={(page: number) => setCurPage(page - 1)}
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
      open={true}
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
                  if (item.value === 'task' || item.value === 'bug' || item.value == "requirement") {
                    setKeyword("");
                    setTotalCount(0);
                    setCurPage(0);
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
