import { Button, Form, Input, List, Modal, Popover, message } from "antd";
import React, { useEffect, useState } from "react";
import s from "./TagListPanel.module.less";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import type { IdeaTag } from "@/api/project_idea";
import { list_tag, create_tag, update_tag, remove_tag } from "@/api/project_idea";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { TwitterPicker } from 'react-color';
import randomColor from 'randomcolor';
import { useHistory, useLocation } from "react-router-dom";
import { observer } from 'mobx-react';
import type { IdeaPageState } from "../IdeaPage";


const TagListPanel = () => {
    const history = useHistory();
    const location = useLocation();

    let state: IdeaPageState | undefined = location.state as IdeaPageState | undefined;
    if (state == undefined) {
        state = {
            keywordList: [],
            tagId: null,
        }
    }


    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [tagList, setTagList] = useState<IdeaTag[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [tagTitle, setTagTitle] = useState("");
    const [tagColor, setTagColor] = useState(randomColor({ luminosity: "dark", format: "hex", alpha: 1.0 }));
    const [showUpdateTag, setShowUpdateTag] = useState<IdeaTag | null>(null);
    const [showRemoveTag, setShowRemoveTag] = useState<IdeaTag | null>(null);

    const loadTagList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setTagList(res.tag_list);
    }

    const createTag = async () => {
        const title = tagTitle.trim();
        if (title == "") {
            message.error("标签标题不能为空");
            return;
        }
        await request(create_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            basic_info: {
                tag_name: title,
                tag_color: tagColor,
            },
        }));
        setShowCreate(false);
        message.info("创建标签成功");
        await loadTagList();
    };

    const updateTag = async () => {
        const title = tagTitle.trim();
        if (title == "") {
            message.error("标签标题不能为空");
            return;
        }
        await request(update_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_id: showUpdateTag?.tag_id ?? "",
            basic_info: {
                tag_name: title,
                tag_color: tagColor,
            },
        }));
        setShowUpdateTag(null);
        message.info("修改标签成功");
        await loadTagList();
    }

    const removeTag = async () => {
        if (showRemoveTag == null) {
            return;
        }
        await request(remove_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_id: showRemoveTag.tag_id,
        }));
        message.info("删除标签成功");
        if (showRemoveTag.tag_id == state?.tagId) {
            setShowRemoveTag(null);
            linkAuxStore.goToIdeaList(state?.keywordList ?? [], null, history);
        }else{
            setShowRemoveTag(null);
            await loadTagList();
        }
    };

    useEffect(() => {
        loadTagList();
    }, [projectStore.curProjectId])

    return (
        <div>
            <div className={s.head}>
                <h3>标签列表</h3>
                <Button type="link" className={s.btn} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setTagTitle("");
                    setTagColor(randomColor({ luminosity: "light", format: "hex", alpha: 0.8 }));
                    setShowCreate(true);
                }}><PlusOutlined /></Button>
            </div>
            <List className={s.tag_list} dataSource={tagList} renderItem={item => (
                <List.Item key={item.tag_id} className={item.tag_id == state?.tagId ? s.cur_tag : ""}>
                    <div className={s.tag} style={{ backgroundColor: item.basic_info.tag_color }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (state?.tagId == item.tag_id) {
                                linkAuxStore.goToIdeaList(state?.keywordList ?? [], null, history);
                            } else {
                                linkAuxStore.goToIdeaList(state?.keywordList ?? [], item.tag_id, history);
                            }
                        }}
                    >{item.basic_info.tag_name}</div>
                    <Popover trigger="click" placement="right"
                        content={
                            <div style={{ padding: "4px 10px" }}>
                                <div>
                                    <Button type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setTagTitle(item.basic_info.tag_name);
                                        setTagColor(item.basic_info.tag_color);
                                        setShowUpdateTag(item);
                                    }}>修改标签</Button>
                                </div>
                                <div>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRemoveTag(item);
                                    }}>删除标签</Button>
                                </div>
                            </div>
                        }>
                        <Button type="text" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}>
                            <MoreOutlined />
                        </Button>
                    </Popover>
                </List.Item>
            )} />
            {showCreate == true && (
                <Modal open title="创建标签"
                    okText="创建" okButtonProps={{ disabled: tagTitle.trim() == "" }}
                    width={300}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowCreate(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        createTag();
                    }}>
                    <Form labelCol={{ span: 6 }}>
                        <Form.Item label="标签名称">
                            <Input onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTagTitle(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="标签颜色">
                            <Popover content={
                                <TwitterPicker triangle="hide" onChange={color => setTagColor(color.hex)} />
                            } placement="bottomLeft" trigger="click">
                                <div style={{ width: "40px", backgroundColor: tagColor, height: "20px", cursor: "pointer" }} />
                            </Popover>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {showUpdateTag != null && (
                <Modal open title="修改标签"
                    okText="修改" okButtonProps={{ disabled: tagTitle.trim() == "" }}
                    width={300}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowUpdateTag(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateTag();
                    }}>
                    <Form labelCol={{ span: 6 }}>
                        <Form.Item label="标签名称">
                            <Input value={tagTitle} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTagTitle(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="标签颜色">
                            <Popover content={
                                <TwitterPicker triangle="hide" onChange={color => setTagColor(color.hex)} />
                            } placement="bottomLeft" trigger="click">
                                <div style={{ width: "40px", backgroundColor: tagColor, height: "20px", cursor: "pointer" }} />
                            </Popover>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {showRemoveTag != null && (
                <Modal open title={`删除标签 ${showRemoveTag.basic_info.tag_name}`} width={300}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveTag(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeTag();
                    }}>
                    是否删除 标签 <span style={{ backgroundColor: showRemoveTag.basic_info.tag_color }}>{showRemoveTag.basic_info.tag_name}</span>?
                    <p>删除标签不会删除引用当前标签的知识点！</p>
                </Modal>
            )}
        </div>
    );
}

export default observer(TagListPanel);