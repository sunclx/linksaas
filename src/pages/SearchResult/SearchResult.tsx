import { SEARCH_SCOPE_ALL_BOOKMARK_CATE, SEARCH_SCOPE_ALL_CHANNEL, SEARCH_SCOPE_ALL_DOC_SPACE, SEARCH_SCOPE_BUG, SEARCH_SCOPE_CUR_BOOKMARK_CATE, SEARCH_SCOPE_CUR_CHANNEL, SEARCH_SCOPE_CUR_DOC_SPACE, SEARCH_SCOPE_TASK } from "@/components/SearchBar";
import { Card } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import ChannelResult from "./ChannelResult";
import DocSpaceResult from "./DocSpaceResult";
import IssueResult from "./IssueResult";
import s from "./common.module.less";
import { appWindow } from '@tauri-apps/api/window';
import { ISSUE_TYPE_BUG, ISSUE_TYPE_TASK } from "@/api/project_issue";
import BookMarkResult from "./BookMarkResult";


export const SearchResult = () => {
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId");
    const keyword = urlParams.get("keyword");
    const scope = urlParams.get("scope");
    const scopeValue = urlParams.get("scopeValue");
    const fromTimeStr = urlParams.get("fromTime");
    const toTimeStr = urlParams.get("toTime");
    let fromTime: number | null = null;
    let toTime: number | null = null;
    if (fromTimeStr != null && fromTimeStr != "") {
        fromTime = parseInt(fromTimeStr);
    }
    if (toTimeStr != null && toTimeStr != "") {
        toTime = parseInt(toTimeStr);
    }

    appWindow.setTitle("搜索结果");
    appWindow.setAlwaysOnTop(true);
    setTimeout(() => {
        appWindow.setAlwaysOnTop(false);
    }, 200);

    return (<Card
        title={<div style={{ fontSize: "16px", fontWeight: 500 }} data-tauri-drag-region={true}>搜索结果</div>}
        extra={<div className={s.btn_close} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            appWindow.close();
        }} title="关闭" />}>
        <div className={s.result_wrap}>
            {(scope == SEARCH_SCOPE_CUR_CHANNEL || scope == SEARCH_SCOPE_ALL_CHANNEL) && (
                <ChannelResult projectId={projectId} keyword={keyword} channelId={scopeValue} fromTime={fromTime} toTime={toTime} />
            )}
            {(scope == SEARCH_SCOPE_CUR_DOC_SPACE || scope == SEARCH_SCOPE_ALL_DOC_SPACE) && (
                <DocSpaceResult projectId={projectId} keyword={keyword} docSpaceId={scopeValue} fromTime={fromTime} toTime={toTime} />
            )}
            {(scope == SEARCH_SCOPE_CUR_BOOKMARK_CATE || scope == SEARCH_SCOPE_ALL_BOOKMARK_CATE) && (
                <BookMarkResult projectId={projectId} keyword={keyword} cateId={scope == SEARCH_SCOPE_CUR_BOOKMARK_CATE ? scopeValue : null} fromTime={fromTime} toTime={toTime} />
            )}
            {(scope == SEARCH_SCOPE_TASK || scope == SEARCH_SCOPE_BUG) && (
                <IssueResult projectId={projectId} keyword={keyword} issueType={scope == SEARCH_SCOPE_TASK ? ISSUE_TYPE_TASK : ISSUE_TYPE_BUG} fromTime={fromTime} toTime={toTime} />
            )}
        </div>
    </Card>);
}