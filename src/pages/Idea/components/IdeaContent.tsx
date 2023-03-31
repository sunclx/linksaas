import React, { useState } from "react";
import type { Idea, APPRAISE_TYPE } from "@/api/project_idea";
import {
    APPRAISE_AGREE, APPRAISE_DIS_AGREE, set_appraise, cancel_appraise,
    lock_idea, unlock_idea, update_idea_content, remove_idea, update_idea_tag, update_idea_keyword
} from "@/api/project_idea";
import { Card, Input, Modal, Popover, Select, Space, Tag, message } from "antd";
import { ReadOnlyEditor, useCommonEditor } from '@/components/Editor';
import s from "./IdeaContent.module.less";
import { DislikeFilled, DislikeOutlined, EditOutlined, LikeFilled, LikeOutlined, LockOutlined, MoreOutlined, UnlockOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import Button from "@/components/Button";
import { FILE_OWNER_TYPE_IDEA } from "@/api/fs";
import IdeaAppraiseModal from "./IdeaAppraiseModal";
import IdeaEventModal from "./IdeaEventModal";

interface IdeaContentProps {
    idea: Idea;
    onChange: () => void;
    onRemove: () => void;
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

    const [showAppraise, setShowAppraise] = useState(false);
    const [showEvent, setShowEvent] = useState(false);
    const [showRemove, setShowRemove] = useState(false);

    const { editor, editorRef } = useCommonEditor({
        content: props.idea.basic_info.content,
        fsId: projectStore.curProject?.idea_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_IDEA,
        ownerId: props.idea.idea_id,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        channelMember: false,
    });

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

    const updateContent = async () => {
        if (title.trim() == "") {
            message.error("标题不能为空");
            return;
        }
        const content = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        await request(update_idea_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
            title: title.trim(),
            content: JSON.stringify(content),
        }));
        props.onChange();
        setInEditContent(false);
    };

    const removeIdea = async () => {
        await request(remove_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
        }));
        setShowRemove(false);
        props.onRemove();
    }

    const updateTag = async () => {
        await request(update_idea_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
            tag_id_list: tagIdList,
        }));
        setInEditTag(false);
        props.onChange();
    };

    const updateKeyword = async () => {
        await request(update_idea_keyword({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            idea_id: props.idea.idea_id,
            keyword_list: keywordList,
        }));
        setInEditKeyword(false);
        props.onChange();
    }

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
                        {inEditContent == false && props.idea.basic_info.title}
                        {inEditContent == true && (
                            <Input value={title} style={{ width: "calc(100vw - 1000px)" }} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTitle(e.target.value);
                            }} />
                        )}
                    </Space>
                } bordered={false} extra={
                    <>
                        {inEditContent == false && (
                            <Space size="small">
                                <Button disabled={!props.idea.user_perm.can_update}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setTitle(props.idea.basic_info.title);
                                        editorRef.current?.setContent(props.idea.basic_info.content);
                                        setInEditContent(true);
                                    }}>编辑</Button>
                                <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }}>
                                    <Popover placement="bottom" trigger="click" content={
                                        <div style={{ padding: "10px 10px" }}>
                                            <div>
                                                <Button type="link" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setShowEvent(true);
                                                }}>查看操作记录</Button>
                                            </div>
                                            <div>
                                                <Button type="link" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setShowAppraise(true);
                                                }}>查看评价详情</Button>
                                            </div>
                                            <div>
                                                <Button type="link" danger disabled={!props.idea.user_perm.can_remove} onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setShowRemove(true);
                                                }}>删除知识点</Button>
                                            </div>
                                        </div>
                                    }>
                                        <MoreOutlined style={{ fontSize: "16px" }} />
                                    </Popover>
                                </Button>
                            </Space>
                        )}
                        {inEditContent == true && (
                            <Space size="small">
                                <Button type="default" onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setTitle(props.idea.basic_info.title);
                                    editorRef.current?.setContent(props.idea.basic_info.content);
                                    setInEditContent(false);
                                }}>取消</Button>
                                <Button disabled={title.trim() == ""} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    updateContent();
                                }}>保存</Button>
                            </Space>
                        )}
                    </>
                }>
                    {inEditContent == false && (
                        <div className="_editChatContext">
                            <ReadOnlyEditor content={props.idea.basic_info.content} />
                        </div>
                    )}
                    {inEditContent == true && (
                        <div className="_editChatContext">
                            {editor}
                        </div>
                    )}
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
                    {inEditTag == true && (
                        <>
                            <Select value={tagIdList} mode="multiple" style={{ width: "100%" }}
                                onChange={value => {
                                    if ((value as string[]).length > 0) {
                                        setTagIdList(value as string[]);
                                    }
                                }}
                                placement="topLeft">
                                {ideaStore.tagList.map(tag => (
                                    <Select.Option key={tag.tag_id} value={tag.tag_id}>
                                        <span style={{ backgroundColor: tag.basic_info.tag_color, padding: "0px 4px" }}>{tag.basic_info.tag_name}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                            <div className={s.btn_wrap}>
                                <Space className={s.btn}>
                                    <Button type="default" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setTagIdList(props.idea.basic_info.tag_id_list);
                                        setInEditTag(false);
                                    }}>取消</Button>
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        updateTag();
                                    }}>保存</Button>
                                </Space>
                            </div>
                        </>
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
                                onChange={value => {
                                    if ((value as string[]).length > 0) {
                                        setKeywordList((value as string[]).map(item => item.toLowerCase()));
                                    }
                                }}
                                placement="topLeft">
                                {ideaStore.keywordList.map(keyword => (
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
                                    <Button onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        updateKeyword();
                                    }}>保存</Button>
                                </Space>
                            </div>
                        </>
                    )}
                </div>
                <div className={s.agree_wrap}>
                    <div>
                        {!(props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_AGREE) && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.idea.user_perm.can_appraise}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setAgree(APPRAISE_AGREE);
                                }}><span className={s.icon}><LikeOutlined />&nbsp;{props.idea.agree_count}</span></Button>
                        )}
                        {props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_AGREE && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.idea.user_perm.can_appraise}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    cancelAgree();
                                }}><span className={s.icon}><LikeFilled />&nbsp;{props.idea.agree_count}</span></Button>
                        )}
                    </div>
                    <div>
                        {!(props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_DIS_AGREE) && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.idea.user_perm.can_appraise}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setAgree(APPRAISE_DIS_AGREE);
                                }}><span className={s.icon}><DislikeOutlined />&nbsp;{props.idea.disagree_count}</span></Button>
                        )}
                        {props.idea.has_my_appraise && props.idea.my_appraise_type == APPRAISE_DIS_AGREE && (
                            <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!props.idea.user_perm.can_appraise}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    cancelAgree();
                                }}><span className={s.icon}><DislikeFilled />&nbsp;{props.idea.disagree_count}</span></Button>
                        )}

                    </div>
                </div>
            </div>
            {showAppraise == true && (
                <IdeaAppraiseModal ideaId={props.idea.idea_id} onCancel={() => setShowAppraise(false)} />
            )}
            {showEvent == true && (
                <IdeaEventModal ideaId={props.idea.idea_id} onCancel={() => setShowEvent(false)} />
            )}
            {showRemove == true && (
                <Modal open title="删除知识点"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemove(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeIdea();
                    }}>
                    是否删除知识点&nbsp;{props.idea.basic_info.title}?
                </Modal>
            )}
        </div>
    );
};

export default observer(IdeaContent);