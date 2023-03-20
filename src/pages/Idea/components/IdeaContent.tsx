import React, { useState } from "react";
import type { Idea, APPRAISE_TYPE } from "@/api/project_idea";
import { APPRAISE_AGREE, APPRAISE_DIS_AGREE, set_appraise, cancel_appraise, lock_idea, unlock_idea } from "@/api/project_idea";
import { Card, Select, Space, Tag } from "antd";
import { ReadOnlyEditor } from '@/components/Editor';
import s from "./IdeaContent.module.less";
import { DislikeFilled, DislikeOutlined, EditOutlined, LikeFilled, LikeOutlined, LockOutlined, MoreOutlined, UnlockOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import Button from "@/components/Button";

interface IdeaContentProps {
    idea: Idea;
    onChange: () => void;
}

const IdeaContent: React.FC<IdeaContentProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const ideaStore = useStores('ideaStore');

    const [title, setTitle] = useState(props.idea.basic_info.title);
    const [inEditContent, setInEditContent] = useState(false);

    const [inEditTag, setInEditTag] = useState(false);
    const [tagIdList, setTagIdList] = useState(props.idea.basic_info.tag_id_list);

    const [inEditKeyword, setInEditKeyword] = useState(false);
    const [keywordList, setKeywordList] = useState(props.idea.basic_info.keyword_list);

    const setAgree = async (appraiseType: APPRAISE_TYPE) => {
        await request(set_appraise({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
            appraise_type: appraiseType,
        }));
        props.onChange();
    };

    const cancelAgree = async () => {
        await request(cancel_appraise({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
        }));
        props.onChange();
    };

    const lockIdea = async () => {
        await request(lock_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
        }));
        props.onChange();
    };

    const unLockIdea = async () => {
        await request(unlock_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
        }));
        props.onChange();
    };
    return (
        <div className={s.content_wrap}>
            <div className={s.content}>
                <Card title={
                    <Space style={{ fontSize: "20px" }}>
                        {props.idea.locked == true && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px" }} disabled={!props.idea.user_perm.can_change_lock}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    unLockIdea();
                                }}>
                                <LockOutlined />
                            </Button>)}
                        {props.idea.locked == false && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px" }} disabled={!props.idea.user_perm.can_change_lock}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    lockIdea();
                                }}
                            >
                                <UnlockOutlined />
                            </Button>)}
                        {props.idea.basic_info.title}
                    </Space>
                } bordered={false} extra={
                    <>
                        {inEditContent == false && (
                            <Space size="small">
                                <Button disabled={!props.idea.user_perm.can_update} 
                                onClick={e=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setInEditContent(true);
                                }}>编辑</Button>
                                <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }}><MoreOutlined /></Button>
                            </Space>
                        )}
                        {inEditContent == true && (
                            <Space size="small">
                                <Button type="default" onClick={e=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setInEditContent(false);
                                }}>取消</Button>
                                <Button onClick={e=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    //TODO
                                }}>保存</Button>
                            </Space>
                        )}
                    </>
                }>
                    <ReadOnlyEditor content={props.idea.basic_info.content} collapse={false} />
                </Card>
            </div>
            <div className={s.side}>
                <div className={s.extra_info}>
                    <h3>标签:</h3>
                    {inEditTag == false && (
                        <div>
                            {props.idea.tag_list.map(tag => (
                                <Tag key={tag.tag_id}><span style={{ backgroundColor: tag.tag_color, padding: "0px 4px" }}>{tag.tag_name}</span></Tag>
                            ))}
                            {props.idea.user_perm.can_update && <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setInEditTag(true);
                            }}><EditOutlined /></a>}
                        </div>
                    )}
                    <h3>关键词:</h3>
                    {inEditKeyword == false && (
                        <div>
                            {props.idea.basic_info.keyword_list.map(keyword => (
                                <Tag key={keyword}>{keyword}</Tag>
                            ))}
                            {props.idea.user_perm.can_update && <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setInEditKeyword(true);
                            }}><EditOutlined /></a>}
                        </div>
                    )}
                    {inEditKeyword == true && (
                        <>
                            <Select value={keywordList} mode="tags"
                                style={{ width: "100%" }}
                                onChange={value => setKeywordList(value as string[])}>
                                {ideaStore.curKeywordList.map(keyword => (
                                    <Select.Option key={keyword} value={keyword}>{keyword}</Select.Option>
                                ))}
                            </Select>
                            <div className={s.btn_wrap}>
                                <Space className={s.btn}>
                                    <Button type="default" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setKeywordList(props.idea.basic_info.keyword_list);
                                        setInEditKeyword(false);
                                    }}>取消</Button>
                                    <Button>保存</Button>
                                </Space>
                            </div>
                        </>
                    )}
                </div>
                <div className={s.agree_wrap}>
                    <div className={s.icon}>
                        {!(props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_AGREE) && <LikeOutlined onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setAgree(APPRAISE_AGREE);
                        }} />}
                        {props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_AGREE && <LikeFilled onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            cancelAgree();
                        }} />}
                        &nbsp;{props.idea.agree_count}
                    </div>
                    <div className={s.icon}>
                        {!(props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_DIS_AGREE) && <DislikeOutlined onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setAgree(APPRAISE_DIS_AGREE);
                        }} />}
                        {props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_DIS_AGREE && <DislikeFilled onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            cancelAgree();
                        }} />}
                        &nbsp;{props.idea.disagree_count}
                    </div>
                    <div className={s.icon}>
                        <MoreOutlined />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(IdeaContent);