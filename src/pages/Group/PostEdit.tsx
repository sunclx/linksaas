import React, { useEffect, useState } from "react";
import { get_post_key, get_post_content, add_post, update_post_content, update_post_tag } from "@/api/group_post";
import { useHistory } from "react-router-dom";
import { change_file_owner, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_GROUP_POST, FILE_OWNER_TYPE_NONE } from "@/api/fs";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { Card, Form, Input, Select, Space, message } from "antd";
import s from "./PostEdit.module.less";
import classNames from 'classnames';
import PostTocPanel from "./components/PostDocPanel";
import Button from "@/components/Button";
import { APP_GROUP_POST_DETAIL_PATH, APP_GROUP_POST_LIST_PATH } from "@/utils/constant";
import { observer, useLocalObservable } from 'mobx-react';
import ActionModal from "@/components/ActionModal";
import { type EditorRef, flushEditorContent } from "@/components/Editor/common";
import { runInAction } from "mobx";


interface PostEditInnerProps {
    editor: React.JSX.Element;
    editorRef: React.MutableRefObject<EditorRef | null>;
}

const PostEditInner = observer((props: PostEditInnerProps) => {
    const history = useHistory();

    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const groupStore = useStores('groupStore');

    const [title, setTitle] = useState(groupStore.curPostKey?.title ?? "");
    const [tagList, setTagList] = useState<string[]>(groupStore.curPostKey?.tag_list ?? []);

    const localStore = useLocalObservable(() => ({
        loaded: false,
        setLoaded(val: boolean) {
            runInAction(() => {
                this.loaded = val;
            });
        }
    }));



    const loadPostContent = async () => {
        if (groupStore.curPostKey == null || localStore.loaded) {
            return;
        }
        const res = await request(get_post_content({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey.post_id,
        }));
        props.editorRef.current?.setContent(res.content);
        localStore.setLoaded(true);
    };

    const createPost = async () => {
        await flushEditorContent();
        const content = props.editorRef.current?.getContent() ?? { type: "doc" };
        const addRes = await request(add_post({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            title: title,
            content: JSON.stringify(content),
            tag_list: tagList,
        }));
        await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_GROUP_POST, addRes.post_id);
        const res = await request(get_post_key({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: addRes.post_id,
        }));
        groupStore.curPostKey = res.post_key;
        history.push(APP_GROUP_POST_DETAIL_PATH);
        message.info("发布成功");
    };

    const updatePost = async () => {
        await flushEditorContent();
        const content = props.editorRef.current?.getContent() ?? { type: "doc" };
        await request(update_post_content({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            title: title,
            content: JSON.stringify(content),
        }));
        await request(update_post_tag({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
            tag_list: tagList,
        }));
        const res = await request(get_post_key({
            session_id: userStore.sessionId,
            group_id: groupStore.curGroup?.group_id ?? "",
            post_id: groupStore.curPostKey?.post_id ?? "",
        }));
        groupStore.curPostKey = res.post_key;
        history.push(APP_GROUP_POST_DETAIL_PATH);
        message.info("更新成功");
    };

    useEffect(() => {
        if (groupStore.curPostKey !== null && props.editorRef.current !== null) {
            loadPostContent();
        }
    }, [groupStore.curPostKey, props.editorRef.current]);

    useEffect(() => {
        appStore.inEdit = true;
        return () => {
            appStore.inEdit = false;
            appStore.clearCheckLeave();
        };
    }, []);

    return (
        <Card bordered={false}
            title={
                <Input
                    style={{ width: "calc(100vw - 600px)", borderBottom: "1px solid #e4e4e8", fontSize: "18px", fontWeight: 600 }}
                    allowClear
                    bordered={false}
                    placeholder={`请输入帖子标题`}
                    value={title}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value.trim());
                    }}
                />
            }
            extra={
                <Space size="middle">
                    <Button type="default" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (groupStore.curPostKey == null) {
                            history.push(APP_GROUP_POST_LIST_PATH);
                        } else {
                            history.push(APP_GROUP_POST_DETAIL_PATH);
                        }
                    }}>取消</Button>
                    <Button disabled={title == ""} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (groupStore.curPostKey == null) {
                            createPost();
                        } else {
                            updatePost();
                        }
                    }}>{groupStore.curPostKey == null ? "发布" : "更新"}</Button>
                </Space>
            }>
            <div className={s.post_wrap}>
                <div className={classNames(s.post, "_postContext")}>
                    {props.editor}
                    <Form style={{ marginTop: "10px" }}>
                        <Form.Item label={<span style={{ fontSize: "18px", fontWeight: 600 }}>标签列表</span>}>
                            <Select mode="tags" bordered={false} open={false} style={{ borderBottom: "1px solid #e4e4e8", fontSize: "18px", fontWeight: 600, color: "orange" }}
                                value={tagList} onChange={value => setTagList(value)} />
                        </Form.Item>
                    </Form>
                </div>
                <PostTocPanel />
            </div>
            {appStore.checkLeave && <ActionModal
                open={appStore.checkLeave}
                title="离开页面"
                width={330}
                okText="离开"
                okButtonProps={{ danger: true }}
                onCancel={() => appStore.clearCheckLeave()}
                onOK={() => {
                    const onLeave = appStore.onLeave;
                    appStore.clearCheckLeave();
                    if (onLeave != null) {
                        onLeave();
                    }
                }}
            >
                <h1 style={{ textAlign: 'center', fontWeight: 550, fontSize: '14px' }}>
                    页面有未保存内容，是否确认离开此页面？
                    <br /> 系统将不会记住未保存内容
                </h1>
            </ActionModal>
            }
        </Card>
    )
});

const PostEdit = () => {
    const projectStore = useStores('projectStore');
    const groupStore = useStores('groupStore');
    const editorStore = useStores('editorStore');

    const { editor, editorRef } = useCommonEditor({
        content: '',
        fsId: groupStore.curGroup?.fs_id ?? "",
        ownerType: groupStore.curPostKey == null ? FILE_OWNER_TYPE_NONE : FILE_OWNER_TYPE_GROUP_POST,
        ownerId: groupStore.curPostKey == null ? "" : groupStore.curPostKey.post_id,
        projectId: projectStore.curProjectId,
        historyInToolbar: true,
        clipboardInToolbar: true,
        commonInToolbar: true,
        widgetInToolbar: true,
        showReminder: false,
        tocCallback: (result) => editorStore.tocList = result,
    });

    return (
        <PostEditInner editor={editor} editorRef={editorRef} />
    );
};

export default observer(PostEdit);