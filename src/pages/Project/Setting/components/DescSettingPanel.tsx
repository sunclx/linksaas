import { Button, Card, Form, Input, Space } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import type { PanelProps } from "./common";
import { observer } from "mobx-react";
import { useStores } from "@/hooks";
import { ReadOnlyEditor, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_PROJECT } from "@/api/fs";
import { update as update_project } from "@/api/project";
import { flushEditorContent } from "@/components/Editor/common";
import { request } from "@/utils/request";

const DescSettingPanel = (props: PanelProps) => {

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [title, setTitle] = useState(projectStore.curProject?.basic_info.project_name ?? "");

    const { editor, editorRef } = useCommonEditor({
        content: projectStore.curProject?.basic_info.project_desc ?? '',
        fsId: projectStore.curProject?.project_fs_id ?? '',
        ownerType: FILE_OWNER_TYPE_PROJECT,
        ownerId: projectStore.curProjectId,
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: false,
        showReminder: false,
    });

    const updateProject = async () => {
        await flushEditorContent();
        const content = await editorRef.current?.getContent() ?? { type: "doc" };
        await request(update_project(userStore.sessionId, projectStore.curProjectId, {
            project_name: title,
            project_desc: JSON.stringify(content),
        }));
        setInEdit(false);
    };

    useEffect(() => {
        props.onChange(inEdit);
    }, [inEdit]);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            extra={
                <Space>
                    {inEdit == false && (
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setInEdit(true);
                        }}>编辑</Button>
                    )}
                    {inEdit && (
                        <>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTitle(projectStore.curProject?.basic_info.project_name ?? "");
                                editorRef.current?.setContent(projectStore.curProject?.basic_info.project_desc ?? '');
                                setInEdit(false);
                            }}>取消</Button>
                            <Button type="primary" disabled={title == ""} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateProject();
                            }}>保存</Button>
                        </>
                    )}
                </Space>
            }>
            <Form>
                <Form.Item label="项目名称">
                    {inEdit && (
                        <Input value={title} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTitle(e.target.value.trim());
                        }} />
                    )}
                    {inEdit == false && <span>{title}</span>}
                </Form.Item>
                <Form.Item>
                    <div className="_projectEditContext">
                        {inEdit && (
                            <>
                                {editor}
                            </>
                        )}
                        {inEdit == false && (
                            <ReadOnlyEditor content={projectStore.curProject?.basic_info.project_desc ?? ''} />
                        )}
                    </div>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default observer(DescSettingPanel);