import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { Card, Table, Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";
import { request } from "@/utils/request";
import { type DocKey, list_doc_key } from "@/api/project_doc";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { EditTag } from "@/components/EditCell/EditTag";
import { list_tag, TAG_SCOPRE_DOC, type TagInfo } from "@/api/project";
import { useHistory } from "react-router-dom";
import { LinkDocInfo, LinkSpritInfo } from "@/stores/linkAux";
import { type SpritInfo, list as list_sprit } from "@/api/project_sprit";
import { type ISSUE_TYPE, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, type IssueInfo, list as list_issue, SORT_TYPE_DSC, SORT_KEY_UPDATE_TIME, ASSGIN_USER_ALL } from "@/api/project_issue";
import IssueList from "./IssueList";


const PAGE_SIZE = 10;

const WatchDocList = observer(() => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [totalCount, setTotalCount] = useState(0);
    const [docKeyList, setDocKeyList] = useState<DocKey[]>([]);
    const [curPage, setCurPage] = useState(0);

    const [tagDefList, setTagDefList] = useState<TagInfo[]>([]);


    const loadTagDefList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_DOC,
        }));
        setTagDefList(res.tag_info_list);
    }

    const loadDocList = async () => {
        const res = await request(list_doc_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_doc_space_id: false,
            doc_space_id: "",
            list_param: {
                filter_by_watch: true,
                watch: true,
                filter_by_tag_id: false,
                tag_id_list: [],
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setDocKeyList(res.doc_key_list);
    };

    const columns: ColumnsType<DocKey> = [
        {
            title: "标题",
            width: 200,
            render: (_, row: DocKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkDocInfo("", projectStore.curProjectId, row.doc_space_id, row.doc_id), history);
                }}>{row.title}</a>
            )
        },
        {
            title: "标签",
            width: 200,
            render: (_, row: DocKey) => (
                <>
                    {tagDefList.length > 0 && (
                        <EditTag editable={false} tagIdList={row.tag_info_list.map(tag => tag.tag_id)}
                            tagDefList={tagDefList} onChange={() => { }} />
                    )}
                </>
            ),
        },
        {
            title: "更新时间",
            width: 200,
            render: (_, row: DocKey) => moment(row.update_time).format("YYYY-MM-DD HH:mm:ss"),
        }
    ];

    useEffect(() => {
        loadDocList();
    }, [curPage]);

    useEffect(() => {
        loadTagDefList();
    }, []);

    return (
        <Table rowKey="doc_id" dataSource={docKeyList} columns={columns} style={{ height: "300px", overflowY: "scroll" }}
            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
    );
});

const WatchWorkPlanList = observer(() => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [spritList, setSpritList] = useState<SpritInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadSpritInfo = async () => {
        const res = await request(list_sprit(userStore.sessionId, projectStore.curProjectId, true, true, PAGE_SIZE * curPage, PAGE_SIZE));
        setTotalCount(res.total_count);
        setSpritList(res.info_list);
    };

    const columns: ColumnsType<SpritInfo> = [
        {
            title: "标题",
            width: 200,
            render: (_, row: SpritInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkSpritInfo("", projectStore.curProjectId, row.sprit_id), history);
                }}>{row.basic_info.title}</a>
            ),
        },
        {
            title: "开始时间",
            width: 150,
            render: (_, row: SpritInfo) => moment(row.basic_info.start_time).format("YYYY-MM-DD"),
        },
        {
            title: "结束时间",
            width: 150,
            render: (_, row: SpritInfo) => moment(row.basic_info.end_time).format("YYYY-MM-DD"),
        },
        {
            title: "任务数",
            dataIndex: "task_count",
            width: 80,
        },
        {
            title: "缺陷数",
            dataIndex: "bug_count",
            width: 80,
        }
    ];

    useEffect(() => {
        loadSpritInfo();
    }, [curPage]);

    return (
        <Table rowKey="sprit_id" dataSource={spritList} columns={columns} style={{ height: "300px", overflowY: "scroll" }}
            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
    );
});

interface WatchIssueListProps {
    issueType: ISSUE_TYPE;
}

const WatchIssueList = (props: WatchIssueListProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [issueList, setIssueList] = useState<IssueInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadIssueList = async () => {
        const res = await request(list_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_issue_type: true,
                issue_type: props.issueType,
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
                filter_by_title_keyword: false,
                title_keyword: "",
                filter_by_tag_id_list: false,
                tag_id_list: [],
                filter_by_watch: true,
                watch: true,

                ///任务相关
                filter_by_task_priority: false,
                task_priority_list: [],
                ///缺陷相关
                filter_by_software_version: false,
                software_version_list: [],
                filter_by_bug_priority: false,
                bug_priority_list: [],
                filter_by_bug_level: false,
                bug_level_list: [],
            },
            sort_type: SORT_TYPE_DSC,
            sort_key: SORT_KEY_UPDATE_TIME,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setIssueList(res.info_list);
    };

    useEffect(() => {
        loadIssueList();
    }, [curPage]);

    return (
        <IssueList issueList={issueList} totalCount={totalCount}
            curPage={curPage} pageSize={PAGE_SIZE}
            issueType={props.issueType} onChangePage={page => setCurPage(page)} />
    );
};

const MyWatchPanel = () => {
    const projectStore = useStores('projectStore');

    const getDefaultActiveKey = (): string => {
        if ((projectStore.curProject?.setting.hide_watch_doc == false) && (projectStore.curProject?.setting.disable_kb == false)) {
            return "doc";
        }
        if ((projectStore.curProject?.setting.hide_watch_walk_plan == false) && (projectStore.curProject?.setting.disable_work_plan == false)) {
            return "workplan"
        }
        if (projectStore.curProject?.setting.hide_watch_task == false) {
            return "task"
        }
        if (projectStore.curProject?.setting.hide_watch_bug == false) {
            return "bug";
        }
        return "";
    };

    const [activeKey, setActiveKey] = useState(getDefaultActiveKey());

    const getTabItems = () => {
        const retList: Tab[] = [];
        if ((projectStore.curProject?.setting.hide_watch_doc == false) && (projectStore.curProject?.setting.disable_kb == false)) {
            retList.push({
                key: "doc",
                label: "文档",
                children: (
                    <>
                        {activeKey == "doc" && (
                            <WatchDocList />
                        )}
                    </>
                ),
            });
        }
        if ((projectStore.curProject?.setting.hide_watch_walk_plan == false) && (projectStore.curProject?.setting.disable_work_plan == false)) {
            retList.push({
                key: "workplan",
                label: "工作计划",
                children: (
                    <>
                        {activeKey == "workplan" && (
                            <WatchWorkPlanList />
                        )}
                    </>
                ),
            });
        }
        if (projectStore.curProject?.setting.hide_watch_task == false) {
            retList.push({
                key: "task",
                label: "任务",
                children: (
                    <>
                        {activeKey == "task" && (
                            <WatchIssueList issueType={ISSUE_TYPE_TASK} />
                        )}
                    </>
                ),
            });
        }
        if (projectStore.curProject?.setting.hide_watch_bug == false) {
            retList.push({
                key: "bug",
                label: "缺陷",
                children: (
                    <>
                        {activeKey == "bug" && (
                            <WatchIssueList issueType={ISSUE_TYPE_BUG} />
                        )}
                    </>
                ),
            });
        }
        return retList;
    };

    return (
        <>
            {((projectStore.curProject?.setting.hide_watch_doc == false) || (projectStore.curProject?.setting.hide_watch_walk_plan == false) || (projectStore.curProject?.setting.hide_watch_task == false) || (projectStore.curProject?.setting.hide_watch_bug == false)) && (
                <Card title="我的关注" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }}>
                    <Tabs type="card" items={getTabItems()} activeKey={activeKey} onChange={key => setActiveKey(key)} />
                </Card>
            )}
        </>
    );
};

export default observer(MyWatchPanel);