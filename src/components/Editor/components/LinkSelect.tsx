import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Form, List } from 'antd';
import type { ModalProps } from 'antd';
import { Button } from 'antd';
import { Modal, Input } from 'antd';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkTaskInfo, LinkBugInfo, LinkDocInfo, LinkExterneInfo, LinkRequirementInfo, LinkSpritInfo, LinkBoardInfo, LinkApiCollInfo, LinkDataAnnoInfo } from '@/stores/linkAux';
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
import type { RequirementInfo } from '@/api/project_requirement';
import { list_requirement, REQ_SORT_UPDATE_TIME } from '@/api/project_requirement';
import type { EntryInfo } from "@/api/project_entry";
import { ENTRY_TYPE_BOARD, ENTRY_TYPE_DOC, ENTRY_TYPE_SPRIT, list as list_entry } from "@/api/project_entry";
import type { ApiCollInfo } from "@/api/api_collection";
import { API_COLL_CUSTOM, API_COLL_GRPC, API_COLL_OPENAPI, list as list_api_coll } from "@/api/api_collection";
import type { AnnoProjectInfo } from "@/api/data_anno_project";
import { ANNO_TYPE_AUDIO_CLASSIFI, ANNO_TYPE_AUDIO_SEG, ANNO_TYPE_AUDIO_SEG_TRANS, ANNO_TYPE_AUDIO_TRANS, ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT, ANNO_TYPE_IMAGE_BRUSH_SEG, ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT, ANNO_TYPE_IMAGE_CLASSIFI, ANNO_TYPE_IMAGE_KEYPOINT, ANNO_TYPE_IMAGE_POLYGON_SEG, ANNO_TYPE_TEXT_CLASSIFI, ANNO_TYPE_TEXT_NER, ANNO_TYPE_TEXT_SUMMARY, list as list_data_anno } from "@/api/data_anno_project";
import { CheckOutlined } from '@ant-design/icons';

const PAGE_SIZE = 6;

type TAB_TYPE = "" | "doc" | "requirement" | "task" | "bug" | "sprit" | "board" | "apicoll" | "dataanno" | "externe";

export interface LinkSelectProps {
  title: string;
  showDoc: boolean;
  showRequirement: boolean;
  showTask: boolean;
  showBug: boolean;
  showSprit: boolean;
  showBoard: boolean;
  showApiColl: boolean;
  showDataAnno: boolean;
  showExterne: boolean;
  onOk: (link: LinkInfo) => void;
  onCancel: () => void;
}

export const LinkSelect: React.FC<LinkSelectProps> = observer((props) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const modalProps: ModalProps = {};
  modalProps.footer = null;
  let defaultTab: TAB_TYPE = "";
  if (props.showDoc) {
    defaultTab = 'doc';
  } else if (props.showRequirement) {
    defaultTab = "requirement";
  } else if (props.showTask) {
    defaultTab = 'task';
  } else if (props.showBug) {
    defaultTab = 'bug';
  } else if (props.showSprit) {
    defaultTab = "sprit";
  } else if (props.showBoard) {
    defaultTab = "board";
  } else if (props.showApiColl) {
    defaultTab = "apicoll";
  } else if (props.showDataAnno) {
    defaultTab = "dataanno"
  } else if (props.showExterne) {
    defaultTab = 'externe';
  }

  const [requirementList, setRequirementList] = useState([] as RequirementInfo[]);
  const [taskList, setTaskList] = useState([] as IssueInfo[]);
  const [bugList, setBugList] = useState([] as IssueInfo[]);
  const [docList, setDocList] = useState([] as EntryInfo[]);
  const [spritList, setSpritList] = useState([] as EntryInfo[]);
  const [boardList, setBoardList] = useState([] as EntryInfo[]);
  const [apiCollList, setApiCollList] = useState([] as ApiCollInfo[]);
  const [dataAnnoList, setDataAnnoList] = useState([] as AnnoProjectInfo[]);
  const [externeUrl, setExterneUrl] = useState('');

  const [tab, setTab] = useState(defaultTab);
  const [keyword, setKeyword] = useState('');
  const [myWatch, setMyWatch] = useState(false);

  const tabList: { label: string, value: TAB_TYPE }[] = [];
  if (props.showDoc) {
    tabList.push({
      label: '项目文档',
      value: 'doc',
    });
  }
  if (props.showSprit) {
    tabList.push({
      label: '工作计划',
      value: 'sprit',
    });
  }
  if (props.showBoard) {
    tabList.push({
      label: '信息面板',
      value: 'board',
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
  if (props.showApiColl) {
    tabList.push({
      label: '接口集合',
      value: 'apicoll',
    });
  }
  if (props.showDataAnno) {
    tabList.push({
      label: '数据标注',
      value: 'dataanno',
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
      filter_by_watch: myWatch,
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
  }, [tab, keyword, myWatch, curPage]);

  useEffect(() => {
    if (["doc", "board", "sprit"].includes(tab) == false) {
      return;
    }
    let entryType = ENTRY_TYPE_DOC;
    if (tab == "board") {
      entryType = ENTRY_TYPE_BOARD;
    } else if (tab == "sprit") {
      entryType = ENTRY_TYPE_SPRIT;
    }
    request(list_entry({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      list_param: {
        filter_by_watch: myWatch,
        filter_by_tag_id: false,
        tag_id_list: [],
        filter_by_keyword: keyword != "",
        keyword: keyword,
        filter_by_mark_remove: true,
        mark_remove: false,
        filter_by_entry_type: true,
        entry_type_list: [entryType],
      },
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
    })).then((res) => {
      if (tab == "doc") {
        setDocList(res.entry_list);
      } else if (tab == "board") {
        setBoardList(res.entry_list);
      } else if (tab == "sprit") {
        setSpritList(res.entry_list);
      }
      setTotalCount(res.total_count);
    });
  }, [tab, keyword, myWatch, curPage]);

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
      filter_by_watch: myWatch,
    })).then(res => {
      setTotalCount(res.total_count);
      setRequirementList(res.requirement_list);
    })
  }, [tab, curPage, myWatch, keyword]);

  useEffect(() => {
    if (tab != "apicoll") {
      return;
    }
    request(list_api_coll({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      filter_by_watch: myWatch,
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
    })).then(res => {
      setTotalCount(res.total_count);
      setApiCollList(res.info_list);
    });
  }, [tab, myWatch, curPage]);

  useEffect(() => {
    if (tab != "dataanno") {
      return;
    }
    request(list_data_anno({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      filter_by_watch: myWatch,
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
    })).then(res => {
      setTotalCount(res.total_count);
      setDataAnnoList(res.info_list);
    });
  }, [tab, myWatch, curPage]);

  const renderItemContent = () => {
    if (props.showDoc && tab === 'doc') {
      return (
        <Card bordered={false} title="文档"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="entry_id" dataSource={docList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkDocInfo(item.entry_title, projectStore.curProjectId, item.entry_id));
              }}>{item.entry_title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showSprit && tab == "sprit") {
      return (
        <Card bordered={false} title="工作计划"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="entry_id" dataSource={spritList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkSpritInfo(item.entry_title, projectStore.curProjectId, item.entry_id));
              }}>{item.entry_title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showBoard && tab == "board") {
      return (
        <Card bordered={false} title="信息面板"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="entry_id" dataSource={boardList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkBoardInfo(item.entry_title, projectStore.curProjectId, item.entry_id));
              }}>{item.entry_title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showRequirement && tab == "requirement") {
      return (
        <Card bordered={false} title="项目需求"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="requirement_id" dataSource={requirementList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkRequirementInfo(item.base_info.title, projectStore.curProjectId, item.requirement_id));
              }}>{item.base_info.title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showTask && tab === 'task') {
      return (
        <Card bordered={false} title="任务"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="issue_id" dataSource={taskList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkTaskInfo(item.basic_info.title, projectStore.curProjectId, item.requirement_id));
              }}>{item.issue_index}&nbsp;&nbsp;{item.basic_info.title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showBug && tab === 'bug') {
      return (
        <Card bordered={false} title="缺陷"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={keyword} onChange={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setKeyword(e.target.value.trim());
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="issue_id" dataSource={bugList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkBugInfo(item.basic_info.title, projectStore.curProjectId, item.requirement_id));
              }}>{item.issue_index}&nbsp;&nbsp;{item.basic_info.title}</List.Item>
            )} />
        </Card>
      );
    } else if (props.showApiColl && tab == "apicoll") {
      return (
        <Card bordered={false} title="接口集合"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="api_coll_id" dataSource={apiCollList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkApiCollInfo(item.name, projectStore.curProjectId, item.api_coll_id));
              }}>
                {item.api_coll_type == API_COLL_GRPC && "GRPC"}
                {item.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                {item.api_coll_type == API_COLL_CUSTOM && "自定义接口"}
                :&nbsp;&nbsp;
                {item.name}
              </List.Item>
            )} />
        </Card>
      );
    } else if (props.showDataAnno && tab == "dataanno") {
      return (
        <Card bordered={false} title="数据标注"
          extra={
            <Form layout='inline'>
              <Form.Item label="我的关注">
                <Checkbox checked={myWatch} onChange={e => {
                  e.stopPropagation();
                  setMyWatch(e.target.checked);
                }} />
              </Form.Item>
            </Form>
          }>
          <List rowKey="anno_project_id" dataSource={dataAnnoList} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }}
            renderItem={item => (
              <List.Item style={{ cursor: "pointer" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(new LinkDataAnnoInfo(item.base_info.name, projectStore.curProjectId, item.anno_project_id));
              }}>
                {item.base_info.anno_type == ANNO_TYPE_AUDIO_CLASSIFI && "音频分类"}
                {item.base_info.anno_type == ANNO_TYPE_AUDIO_SEG && "音频分割"}
                {item.base_info.anno_type == ANNO_TYPE_AUDIO_TRANS && "音频翻译"}
                {item.base_info.anno_type == ANNO_TYPE_AUDIO_SEG_TRANS && "音频分段翻译"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_CLASSIFI && "图像分类"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT && "矩形对象检测"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_BRUSH_SEG && "画笔分割"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT && "圆形对象检测"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_KEYPOINT && "图像关键点"}
                {item.base_info.anno_type == ANNO_TYPE_IMAGE_POLYGON_SEG && "多边形分割"}
                {item.base_info.anno_type == ANNO_TYPE_TEXT_CLASSIFI && "文本分类"}
                {item.base_info.anno_type == ANNO_TYPE_TEXT_NER && "文本命名实体识别"}
                {item.base_info.anno_type == ANNO_TYPE_TEXT_SUMMARY && "文本摘要"}
                :&nbsp;&nbsp;
                {item.base_info.name}
              </List.Item>
            )} />
        </Card>
      );
    } else if (props.showExterne && tab === 'externe') {
      return (
        <Card title="请填写网页链接" bordered={false}>
          <Form>
            <Form.Item label="网站地址">
              <Input
                placeholder="请输入网站地址"
                value={externeUrl}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setExterneUrl(e.target.value);
                }}
                addonAfter={
                  <Button type="link" icon={<CheckOutlined />} style={{ height: 20 }} disabled={externeUrl == ""} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onOk(new LinkExterneInfo("", externeUrl));
                  }} />
                }
              />
            </Form.Item>
          </Form>
        </Card>
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
                  setTab(item.value as TAB_TYPE);
                  setTotalCount(0);
                  setCurPage(0);
                  setKeyword("");
                  setMyWatch(false);
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
