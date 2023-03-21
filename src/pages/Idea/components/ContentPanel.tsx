import { Card, Form, List, Select } from "antd";
import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from 'mobx-react';
import type { IdeaPageState } from "../IdeaPage";
import { useLocation } from "react-router-dom";
import s from "./ContentPanel.module.less";
import type { Idea, KEYWORD_SEARCH_TYPE } from "@/api/project_idea";
import { get_idea, list_idea, IDEA_SORT_APPRAISE, IDEA_SORT_UPDATE_TIME, KEYWORD_SEARCH_AND, KEYWORD_SEARCH_OR } from "@/api/project_idea";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import IdeaContent from "./IdeaContent";
import { runInAction } from "mobx";


const PAGE_SIZE = 10;

const ContentPanel = () => {
    const location = useLocation();

    let state: IdeaPageState | undefined = location.state as IdeaPageState | undefined;
    if (state == undefined) {
        state = {
            keywordList: [],
            tagId: "",
        }
    }

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const ideaStore = useStores('ideaStore');

    const [keywordList, setKeywordList] = useState(state.keywordList);
    const [keywordSearchType, setKeywordSearchType] = useState<KEYWORD_SEARCH_TYPE>(KEYWORD_SEARCH_AND);

    const localStore = useLocalObservable(() => ({
        ideaList: [] as Idea[],
        setIdeaList(value: Idea[]) {
            runInAction(() => {
                this.ideaList = value;
            });
        }
    }));
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const updateIdea = async (ideaId: string) => {
        const res = await request(get_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: ideaId,
        }));
        const index = localStore.ideaList.findIndex(item => item.idea_id == ideaId);
        if (index != -1) {
            const tmpList = localStore.ideaList.slice();
            tmpList[index] = res.idea;
            localStore.setIdeaList(tmpList);
        }
    };

    const loadIdeaList = async () => {
        const res = await request(list_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            list_param: {
                filter_by_tag: state?.tagId != "",
                tag_id_list: state!.tagId == "" ? [] : [state!.tagId],
                filter_by_keyword: keywordList.length > 0,
                keyword_list: keywordList,
                keyword_search_type: keywordSearchType,
            },
            sort_type: keywordList.length > 0 ? IDEA_SORT_APPRAISE : IDEA_SORT_UPDATE_TIME,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        localStore.setIdeaList(res.idea_list);
    };

    useEffect(() => {
        loadIdeaList();
    }, [keywordList, curPage, state.tagId, keywordSearchType]);

    return (
        <Card title="知识点列表" bordered={false} extra={
            <Form layout="inline">
                <Form.Item label="关键词模式">
                    <Select value={keywordSearchType} style={{ width: "120px" }} onChange={value => setKeywordSearchType(value as KEYWORD_SEARCH_TYPE)}>
                        <Select.Option value={KEYWORD_SEARCH_AND}>匹配所有关键词</Select.Option>
                        <Select.Option value={KEYWORD_SEARCH_OR}>匹配任一关键词</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="关键词">
                    <Select value={keywordList} onChange={value => setKeywordList(value as string[])} mode="multiple"
                        style={{ minWidth: "300px" }}>
                        {ideaStore.keywordList.map(item => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        }>
            <div className={s.content_list}>
                <List dataSource={localStore.ideaList} split={false} renderItem={item => (
                    <List.Item key={item.idea_id}>
                        <IdeaContent idea={item} onChange={() => updateIdea(item.idea_id)} onRemove={() => loadIdeaList()} />
                    </List.Item>
                )} pagination={{
                    total: totalCount,
                    pageSize: PAGE_SIZE,
                    current: curPage + 1,
                    onChange: page => setCurPage(page - 1),
                }} />
            </div>
        </Card>
    );
};

export default observer(ContentPanel);