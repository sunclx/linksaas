import { Card, Space, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import type { ISSUE_TYPE, IssueInfo } from "@/api/project_issue";
import { ASSGIN_USER_ALL, ISSUE_TYPE_BUG, ISSUE_TYPE_TASK, SORT_KEY_UPDATE_TIME, SORT_TYPE_DSC, list as list_issue } from "@/api/project_issue";
import { observer } from "mobx-react";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import IssueList from "./IssueList";
import type { ENTRY_TYPE, EntryInfo } from "@/api/project_entry";
import { ENTRY_TYPE_BOARD, ENTRY_TYPE_DOC, ENTRY_TYPE_FILE, ENTRY_TYPE_PAGES, ENTRY_TYPE_SPRIT, list as list_entry } from "@/api/project_entry";
import type { ColumnsType, ColumnType } from 'antd/lib/table';
import { EditTag } from "@/components/EditCell/EditTag";
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { LinkApiCollInfo, LinkDataAnnoInfo, LinkEntryInfo, LinkRequirementInfo } from "@/stores/linkAux";
import type { Tab } from "rc-tabs/lib/interface";
import type { RequirementInfo } from "@/api/project_requirement";
import { REQ_SORT_UPDATE_TIME, list_requirement } from "@/api/project_requirement";
import type { ApiCollInfo } from "@/api/api_collection";
import { API_COLL_CUSTOM, API_COLL_GRPC, API_COLL_OPENAPI, list as list_api_coll } from "@/api/api_collection";
import type { AnnoProjectInfo } from "@/api/data_anno_project";
import { ANNO_TYPE_AUDIO_CLASSIFI, ANNO_TYPE_AUDIO_SEG, ANNO_TYPE_AUDIO_SEG_TRANS, ANNO_TYPE_AUDIO_TRANS, ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT, ANNO_TYPE_IMAGE_BRUSH_SEG, ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT, ANNO_TYPE_IMAGE_CLASSIFI, ANNO_TYPE_IMAGE_KEYPOINT, ANNO_TYPE_IMAGE_POLYGON_SEG, ANNO_TYPE_TEXT_CLASSIFI, ANNO_TYPE_TEXT_NER, ANNO_TYPE_TEXT_SUMMARY, list as list_data_anno } from "@/api/data_anno_project";
import PagesModal from "@/pages/Project/Home/components/PagesModal";
import FileModal from "@/pages/Project/Home/components/FileModal";

type EntryColumnType = ColumnType<EntryInfo> & {
    entryType?: ENTRY_TYPE;
};

const PAGE_SIZE = 10;

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

interface WatchEntryListProps {
    entryType: ENTRY_TYPE;
}

const WatchEntryList = (props: WatchEntryListProps) => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [entryList, setEntryList] = useState([] as EntryInfo[]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showPagesEntryInfo, setShowPagesEntryInfo] = useState<EntryInfo | null>(null);
    const [showFileEntryInfo, setShowFileEntryInfo] = useState<EntryInfo | null>(null);

    const loadEntryList = async () => {
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_watch: true,
                filter_by_tag_id: false,
                tag_id_list: [],
                filter_by_keyword: false,
                keyword: "",
                filter_by_mark_remove: true,
                mark_remove: false,
                filter_by_entry_type: true,
                entry_type_list: [props.entryType],
            },
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setEntryList(res.entry_list);
    };

    const getTagDefList = () => {
        if (projectStore.curProject == undefined) {
            return [];
        }
        return projectStore.curProject.tag_list.filter(item => {
            return item.use_in_entry;
        });
    };

    const columns: EntryColumnType[] = [
        {
            title: "名称",
            width: 150,
            render: (_, row: EntryInfo) => (<a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (row.entry_type == ENTRY_TYPE_PAGES) {
                    setShowPagesEntryInfo(row);
                } else if (row.entry_type == ENTRY_TYPE_FILE) {
                    setShowFileEntryInfo(row);
                } else {
                    linkAuxStore.goToLink(new LinkEntryInfo("", projectStore.curProjectId, row.entry_id), history);
                }
            }}>{row.entry_title}</a>),
        },
        {
            title: "系统面板",
            width: 100,
            render: (_, row: EntryInfo) => row.mark_sys ? "是" : "否",
        },
        {
            title: "标签",
            width: 200,
            render: (_, row: EntryInfo) => (
                <EditTag editable={false} tagIdList={row.tag_list.map(item => item.tag_id)} tagDefList={getTagDefList()} onChange={() => { }} />
            ),
        },
        {
            title: "开始时间",
            width: 100,
            entryType: ENTRY_TYPE_SPRIT,
            render: (_, row: EntryInfo) => row.extra_info.ExtraSpritInfo == undefined ? "-" : moment(row.extra_info.ExtraSpritInfo.start_time).format("YYYY-MM-DD"),
        },
        {
            title: "结束时间",
            width: 100,
            entryType: ENTRY_TYPE_SPRIT,
            render: (_, row: EntryInfo) => row.extra_info.ExtraSpritInfo == undefined ? "-" : moment(row.extra_info.ExtraSpritInfo.end_time).format("YYYY-MM-DD"),
        },
        {
            title: "文件名",
            width: 150,
            entryType: ENTRY_TYPE_FILE,
            render: (_, row: EntryInfo) => row.extra_info.ExtraFileInfo?.file_name ?? "",
        },
        {
            title: "创建者",
            width: 100,
            dataIndex: "create_display_name",
        }
    ];

    useEffect(() => {
        loadEntryList();
    }, [curPage]);

    return (
        <div>
            <Table rowKey="entry_id" dataSource={entryList}
                columns={columns.filter(item => (item.entryType == undefined || item.entryType == props.entryType))}
                pagination={{
                    current: curPage + 1,
                    pageSize: PAGE_SIZE,
                    total: totalCount,
                    onChange: page => setCurPage(page - 1),
                    hideOnSinglePage: true,
                }} style={{ minHeight: "200px" }} />
            {showPagesEntryInfo != null && (
                <PagesModal fileId={showPagesEntryInfo.extra_info.ExtraPagesInfo?.file_id ?? ""}
                    entryId={showPagesEntryInfo.entry_id} entryTitle={showPagesEntryInfo.entry_title}
                    onClose={() => setShowPagesEntryInfo(null)} />
            )}
            {showFileEntryInfo != null && (
                <FileModal fileId={showFileEntryInfo.extra_info.ExtraFileInfo?.file_id ?? ""} fileName={showFileEntryInfo.extra_info.ExtraFileInfo?.file_name ?? ""}
                    onClose={() => setShowFileEntryInfo(null)} />
            )}
        </div>
    );
};

const WatchRequirementList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [reqList, setReqList] = useState([] as RequirementInfo[]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadReqList = async () => {
        const res = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_keyword: false,
            keyword: "",
            filter_by_has_link_issue: false,
            has_link_issue: false,
            filter_by_closed: false,
            closed: false,
            filter_by_tag_id_list: false,
            tag_id_list: [],
            filter_by_watch: true,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_type: REQ_SORT_UPDATE_TIME,
        }));
        setTotalCount(res.total_count);
        setReqList(res.requirement_list);
    };

    const getTagDefList = () => {
        if (projectStore.curProject == undefined) {
            return [];
        }
        return projectStore.curProject.tag_list.filter(item => {
            return item.use_in_req;
        });
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "名称",
            width: 150,
            render: (_, row: RequirementInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, row.requirement_id), history);
                }}>{row.base_info.title}</a>
            ),
        },
        {
            title: "状态",
            width: 80,
            render: (_, row: RequirementInfo) => row.closed ? "关闭" : "打开",
        },
        {
            title: "任务数量",
            width: 80,
            dataIndex: "issue_link_count",
        },
        {
            title: "标签",
            width: 200,
            render: (_, row: RequirementInfo) => (
                <EditTag editable={false} tagIdList={row.tag_info_list.map(item => item.tag_id)} tagDefList={getTagDefList()} onChange={() => { }} />
            ),
        },
        {
            title: "KANO系数",
            width: 600,
            render: (_, row: RequirementInfo) => (
                <Space size="small">
                    <span>兴奋型：{row.kano_excite_value.toFixed(3)}</span>
                    <span>期望型：{row.kano_expect_value.toFixed(3)}</span>
                    <span>基础型：{row.kano_basic_value.toFixed(3)}</span>
                    <span>无差异：{row.kano_nodiff_value.toFixed(3)}</span>
                    <span>反向型：{row.kano_reverse_value.toFixed(3)}</span>
                    <span>可疑数值：{row.kano_dubiouse_value.toFixed(3)}</span>
                </Space>
            ),
        },
        {
            title: "紧急系数",
            width: 80,
            render: (_, row: RequirementInfo) => row.four_q_urgency_value.toFixed(3),
        },
        {
            title: "重要系数",
            width: 80,
            render: (_, row: RequirementInfo) => row.four_q_important_value.toFixed(3),
        },
        {
            title: "创建者",
            dataIndex: "create_display_name",
            width: 100,
        }
    ];

    useEffect(() => {
        loadReqList();
    }, [curPage]);

    return (
        <Table rowKey="requirement_id" dataSource={reqList} columns={columns}
            pagination={{
                current: curPage + 1,
                pageSize: PAGE_SIZE,
                total: totalCount,
                onChange: page => setCurPage(page - 1),
                hideOnSinglePage: true,
            }} style={{ minHeight: "200px" }} scroll={{ x: 1400 }} />
    );
};

const WatchApiCollList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [apiCollList, setApiCollList] = useState([] as ApiCollInfo[]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadApiCollList = async () => {
        const res = await request(list_api_coll({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: true,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setApiCollList(res.info_list);
    };

    const columns: ColumnsType<ApiCollInfo> = [
        {
            title: "名称",
            width: 150,
            render: (_, row: ApiCollInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkApiCollInfo("", projectStore.curProjectId, row.api_coll_id), history);
                }}>{row.name}</a>
            ),
        },
        {
            title: "类型",
            width: 150,
            render: (_, row) => (
                <>
                    {row.api_coll_type == API_COLL_GRPC && "GRPC"}
                    {row.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    {row.api_coll_type == API_COLL_CUSTOM && "自定义接口"}
                </>
            ),
        },
        {
            title: "服务地址",
            width: 200,
            dataIndex: "default_addr",
        },
        {
            title: "创建者",
            dataIndex: "create_display_name",
            width: 100,
        }
    ];

    useEffect(() => {
        loadApiCollList();
    }, [curPage]);

    return (
        <Table rowKey="api_coll_id" dataSource={apiCollList} columns={columns}
            pagination={{
                current: curPage + 1,
                pageSize: PAGE_SIZE,
                total: totalCount,
                onChange: page => setCurPage(page - 1),
                hideOnSinglePage: true,
            }} style={{ minHeight: "200px" }} />
    );
};

const WatchDataAnnoList = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [dataAnnoList, setDataAnnoList] = useState([] as AnnoProjectInfo[]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadDataAnnoList = async () => {
        const res = await request(list_data_anno({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: true,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setDataAnnoList(res.info_list);
    };

    const columns: ColumnsType<AnnoProjectInfo> = [
        {
            title: "名称",
            width: 250,
            render: (_, row: AnnoProjectInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkDataAnnoInfo("", projectStore.curProjectId, row.anno_project_id), history);
                }}>{row.base_info.name}</a>
            ),
        },
        {
            title: "标注类型",
            width: 150,
            render: (_, row: AnnoProjectInfo) => (
                <>
                    {row.base_info.anno_type == ANNO_TYPE_AUDIO_CLASSIFI && "音频分类"}
                    {row.base_info.anno_type == ANNO_TYPE_AUDIO_SEG && "音频分割"}
                    {row.base_info.anno_type == ANNO_TYPE_AUDIO_TRANS && "音频翻译"}
                    {row.base_info.anno_type == ANNO_TYPE_AUDIO_SEG_TRANS && "音频分段翻译"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_CLASSIFI && "图像分类"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT && "矩形对象检测"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_BRUSH_SEG && "画笔分割"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT && "圆形对象检测"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_KEYPOINT && "图像关键点"}
                    {row.base_info.anno_type == ANNO_TYPE_IMAGE_POLYGON_SEG && "多边形分割"}
                    {row.base_info.anno_type == ANNO_TYPE_TEXT_CLASSIFI && "文本分类"}
                    {row.base_info.anno_type == ANNO_TYPE_TEXT_NER && "文本命名实体识别"}
                    {row.base_info.anno_type == ANNO_TYPE_TEXT_SUMMARY && "文本摘要"}
                </>
            ),
        },
        {
            title: "任务数",
            width: 100,
            render: (_, row: AnnoProjectInfo) => `${row.done_task_count}/${row.all_task_count}`,
        },
        {
            title: "创建者",
            dataIndex: "create_display_name",
            width: 100,
        }
    ];

    useEffect(() => {
        loadDataAnnoList();
    }, [curPage]);

    return (
        <Table rowKey="anno_project_id" dataSource={dataAnnoList} columns={columns}
            pagination={{
                current: curPage + 1,
                pageSize: PAGE_SIZE,
                total: totalCount,
                onChange: page => setCurPage(page - 1),
                hideOnSinglePage: true,
            }} style={{ minHeight: "200px" }} />
    );
};

const MyWatchPanel = () => {
    const projectStore = useStores('projectStore');

    const [activeKey, setActiveKey] = useState("watchSprit");

    const getTabItems = () => {
        const items: Tab[] = [
            {
                key: "watchSprit",
                label: "工作计划",
                children: (
                    <>
                        {activeKey == "watchSprit" && (
                            <WatchEntryList entryType={ENTRY_TYPE_SPRIT} />
                        )}
                    </>
                ),
            },
            {
                key: "watchDoc",
                label: "文档",
                children: (
                    <>
                        {activeKey == "watchDoc" && (
                            <WatchEntryList entryType={ENTRY_TYPE_DOC} />
                        )}
                    </>
                ),
            },
            {
                key: "watchPages",
                label: "静态网页",
                children: (
                    <>
                        {activeKey == "watchPages" && (
                            <WatchEntryList entryType={ENTRY_TYPE_PAGES} />
                        )}
                    </>
                ),
            },
            {
                key: "watchBoard",
                label: "信息面板",
                children: (
                    <>
                        {activeKey == "watchBoard" && (
                            <WatchEntryList entryType={ENTRY_TYPE_BOARD} />
                        )}
                    </>
                ),
            },
            {
                key: "watchFile",
                label: "文件",
                children: (
                    <>
                        {activeKey == "watchFile" && (
                            <WatchEntryList entryType={ENTRY_TYPE_FILE} />
                        )}
                    </>
                ),
            },
            {
                key: "watchRequirement",
                label: "需求",
                children: (
                    <>
                        {activeKey == "watchRequirement" && (
                            <WatchRequirementList />
                        )}
                    </>
                ),
            },
            {
                key: "watchTask",
                label: "任务",
                children: (
                    <>
                        {activeKey == "watchTask" && (
                            <WatchIssueList issueType={ISSUE_TYPE_TASK} />
                        )}
                    </>
                ),
            },
            {
                key: "watchBug",
                label: "缺陷",
                children: (
                    <>
                        {activeKey == "watchBug" && (
                            <WatchIssueList issueType={ISSUE_TYPE_BUG} />
                        )}
                    </>
                ),
            },
        ];
        if (projectStore.curProject?.setting.disable_api_collection == false) {
            items.push({
                key: "watchApiColl",
                label: "接口集合",
                children: (
                    <>
                        {activeKey == "watchApiColl" && (
                            <WatchApiCollList />
                        )}
                    </>
                ),
            });
        }
        if (projectStore.curProject?.setting.disable_data_anno == false) {
            items.push({
                key: "watchDataAnno",
                label: "数据标注",
                children: (
                    <>
                        {activeKey == "watchDataAnno" && (
                            <WatchDataAnnoList />
                        )}
                    </>
                ),
            });
        }
        return items;
    };

    return (
        <Card title="我的关注" headStyle={{ backgroundColor: "#f5f5f5", fontSize: "16px", fontWeight: 600 }} style={{ marginTop: "10px" }}>
            <Tabs type="card" items={getTabItems()} activeKey={activeKey} onChange={key => setActiveKey(key)} />
        </Card>
    );
};

export default observer(MyWatchPanel);