import { Card, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import {
    type UnReadInfo, list_un_read, remove_un_read,
    COMMENT_TARGET_ENTRY, COMMENT_TARGET_REQUIRE_MENT, COMMENT_TARGET_TASK, COMMENT_TARGET_BUG, COMMENT_TARGET_API_COLL, COMMENT_TARGET_DATA_ANNO
} from "@/api/project_comment";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import CommentModal from "../CommentEntry/CommentModal";
import { type MyWatchInfo, list_my_watch, WATCH_TARGET_ENTRY, WATCH_TARGET_REQUIRE_MENT, WATCH_TARGET_TASK, WATCH_TARGET_BUG, WATCH_TARGET_API_COLL, WATCH_TARGET_DATA_ANNO } from "@/api/project_watch";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { LinkApiCollInfo, LinkBugInfo, LinkDataAnnoInfo, LinkEntryInfo, LinkRequirementInfo, LinkTaskInfo } from "@/stores/linkAux";

const PAGE_SIZE = 10;

const CommentList = observer(() => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [unReadInfoList, setUnReadInfoList] = useState<UnReadInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [showUnReadInfo, setShowUnReadInfo] = useState<UnReadInfo | null>(null);

    const loadUnReadInfoList = async () => {
        const res = await request(list_un_read({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setUnReadInfoList(res.un_read_info_list);
    };

    const removeUnRead = async (info: UnReadInfo) => {
        await request(remove_un_read({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: info.target_type,
            target_id: info.target_id,
        }));
        await loadUnReadInfoList();
    };

    const columns: ColumnsType<UnReadInfo> = [
        {
            title: "类型",
            width: 100,
            render: (_, row: UnReadInfo) => (
                <span>
                    {row.target_type == COMMENT_TARGET_ENTRY && "内容"}
                    {row.target_type == COMMENT_TARGET_REQUIRE_MENT && "需求"}
                    {row.target_type == COMMENT_TARGET_TASK && "任务"}
                    {row.target_type == COMMENT_TARGET_BUG && "缺陷"}
                    {row.target_type == COMMENT_TARGET_API_COLL && "接口集合"}
                    {row.target_type == COMMENT_TARGET_DATA_ANNO && "数据标注"}
                </span>
            ),
        },
        {
            title: "标题",
            render: (_, row: UnReadInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowUnReadInfo(row);
                }}>{row.title}</a>
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: UnReadInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeUnRead(row);
                }}>标记为已读</a>
            ),
        }
    ];

    useEffect(() => {
        loadUnReadInfoList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <div>
            <Table rowKey="target_id" dataSource={unReadInfoList} columns={columns}
                pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            {showUnReadInfo != null && (
                <CommentModal
                    projectId={projectStore.curProjectId}
                    targetType={showUnReadInfo.target_type}
                    targetId={showUnReadInfo.target_id}
                    myUserId={userStore.userInfo.userId}
                    myAdmin={projectStore.isAdmin}
                    onCancel={() => setShowUnReadInfo(null)}
                />
            )}
        </div>
    );
});

const MyWatchList = observer(() => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [myWatchList, setMyWatchList] = useState<MyWatchInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadMyWatchList = async () => {
        const res = await request(list_my_watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_target_type: false,
            target_type: 0,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setMyWatchList(res.info_list);
    };

    const openTarget = async (info: MyWatchInfo) => {
        if (info.target_type == WATCH_TARGET_ENTRY) {
            await linkAuxStore.goToLink(new LinkEntryInfo("", projectStore.curProjectId, info.target_id), history);
        } else if (info.target_type == WATCH_TARGET_REQUIRE_MENT) {
            await linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, info.target_id), history);
        } else if (info.target_type == WATCH_TARGET_TASK) {
            await linkAuxStore.goToLink(new LinkTaskInfo("", projectStore.curProjectId, info.target_id), history);
        } else if (info.target_type == WATCH_TARGET_BUG) {
            await linkAuxStore.goToLink(new LinkBugInfo("", projectStore.curProjectId, info.target_id), history);
        } else if (info.target_type == WATCH_TARGET_API_COLL) {
            await linkAuxStore.goToLink(new LinkApiCollInfo("", projectStore.curProjectId, info.target_id), history);
        } else if (info.target_type == WATCH_TARGET_DATA_ANNO) {
            await linkAuxStore.goToLink(new LinkDataAnnoInfo("", projectStore.curProjectId, info.target_id), history);
        }
    };

    const columns: ColumnsType<MyWatchInfo> = [
        {
            title: "类型",
            width: 100,
            render: (_, row: MyWatchInfo) => (
                <span>
                    {row.target_type == WATCH_TARGET_ENTRY && "内容"}
                    {row.target_type == WATCH_TARGET_REQUIRE_MENT && "需求"}
                    {row.target_type == WATCH_TARGET_TASK && "任务"}
                    {row.target_type == WATCH_TARGET_BUG && "缺陷"}
                    {row.target_type == WATCH_TARGET_API_COLL && "接口集合"}
                    {row.target_type == WATCH_TARGET_DATA_ANNO && "数据标注"}
                </span>
            ),
        },
        {
            title: "标题",
            width: 300,
            render: (_, row: MyWatchInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    openTarget(row);
                }}>{row.title}</a>
            ),
        },
        {
            title: "关注时间",
            width: 100,
            render: (_, row: MyWatchInfo) => moment(row.watch_time).format("YYYY-MM-DD"),
        }

    ];

    useEffect(() => {
        loadMyWatchList();
    }, [projectStore.curProjectId, curPage]);

    return (
        <Table rowKey="target_id" dataSource={myWatchList} columns={columns}
            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
    );
});

const CommentAndWatchPanel = () => {
    const [activeKey, setActiveKey] = useState("comment");
    return (
        <Card title="评论和我的关注">
            <Tabs style={{ width: "500px" }} type="card"
                activeKey={activeKey} onChange={value => setActiveKey(value)}
                items={[
                    {
                        key: "comment",
                        label: "未读评论",
                        children: (
                            <div style={{ height: "calc(100vh - 500px)", overflowY: "scroll" }}>
                                {activeKey == "comment" && (
                                    <CommentList />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: "watch",
                        label: "我的关注",
                        children: (
                            <div style={{ height: "calc(100vh - 500px)", overflowY: "scroll" }}>
                                {activeKey == "watch" && (
                                    <MyWatchList />
                                )}
                            </div>
                        ),
                    }
                ]} />
        </Card>
    );
};

export default CommentAndWatchPanel;