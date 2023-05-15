import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Form, Input, Modal, Select, message } from "antd";
import { change_file_fs, change_file_owner, useCommonEditor } from "@/components/Editor";
import { useStores } from "@/hooks";
import { FILE_OWNER_TYPE_IDEA, FILE_OWNER_TYPE_PROJECT } from "@/api/fs";
import type { IdeaTag } from "@/api/project_idea";
import { list_tag, create_idea } from "@/api/project_idea";
import { request } from "@/utils/request";
import { useHistory } from "react-router-dom";
import { LinkIdeaPageInfo } from "@/stores/linkAux";

const CreateModal = () => {
    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const ideaStore = useStores('ideaStore');
    const linkAuxStore = useStores('linkAuxStore');

    const { editor, editorRef } = useCommonEditor({
        content: ideaStore.createContent,
        fsId: projectStore.curProject?.idea_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_PROJECT,
        ownerId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        channelMember: false,
    });

    const [tagList, setTagList] = useState<IdeaTag[]>([]);

    const [title, setTitle] = useState(ideaStore.createTitle);
    const [tagIdList, setTagIdList] = useState<string[]>([]);
    const [keywordList, setKeywordList] = useState<string[]>([]);

    const loadTagList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setTagList(res.tag_list);
    };

    const createIdea = async () => {
        if (title.trim() == "") {
            message.error("标题不能为空");
            return;
        }
        const content = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        //更新文件存储
        await change_file_fs(
            content,
            projectStore.curProject?.idea_fs_id ?? '',
            userStore.sessionId,
            FILE_OWNER_TYPE_PROJECT,
            projectStore.curProjectId,
        );
        const createRes = await request(create_idea({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            basic_info: {
                title: title.trim(),
                content: JSON.stringify(content),
                tag_id_list: tagIdList,
                keyword_list: keywordList,
            },
        }));
        //变更文件Owner
        await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_IDEA, createRes.idea_id);
        ideaStore.closeShowCreateIdea();
        linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", []), history);
    };

    useEffect(() => {
        loadTagList();
    }, [projectStore.curProjectId]);

    return (
        <Modal open title="创建知识点"
        width={600}
            okText="创建" okButtonProps={{ disabled: title.trim() == "" || keywordList.length == 0 }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                ideaStore.closeShowCreateIdea();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createIdea();
            }}>
            <Form labelCol={{ span: 2 }}>
                <Form.Item label="标题">
                    <Input value={title} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="内容">
                    <div className="_editChatContext">
                        {editor}
                    </div>
                </Form.Item>
                <Form.Item label="标签">
                    <Select mode="multiple" onChange={value => setTagIdList(value as string[])}
                        placement="topLeft" placeholder="请选择对应的知识点标签">
                        {tagList.map(item => (
                            <Select.Option key={item.tag_id} value={item.tag_id}>
                                <span style={{ backgroundColor: item.basic_info.tag_color, padding: "0px 10px" }}>{item.basic_info.tag_name}</span>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="关键词">
                    <Select mode="tags" onChange={value => setKeywordList((value as string[]).map(item => item.toLowerCase()))}
                        placement="topLeft" placeholder="请设置知识点相关的关键词">
                        {ideaStore.keywordList.map(keyword => (
                            <Select.Option key={keyword} value={keyword}>{keyword}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreateModal);