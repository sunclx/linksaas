import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Empty, Space } from "antd";
import Button from "@/components/Button";
import type { EntryContent } from '@/api/project_test_case';
import { get_test_content, set_test_content } from '@/api/project_test_case';
import { useStores } from "@/hooks";
import { ReadOnlyEditor, useCommonEditor } from "@/components/Editor";
import { FILE_OWNER_TYPE_TEST_CASE } from "@/api/fs";
import { request } from "@/utils/request";

interface ContentPanelProps {
    entryId: string;
}

const ContentPanel: React.FC<ContentPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [content, setContent] = useState<EntryContent | null>(null);

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: projectStore.curProject?.test_case_fs_id ?? '',
        ownerType: FILE_OWNER_TYPE_TEST_CASE,
        ownerId: props.entryId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        channelMember: false,
    });

    const loadContent = async () => {
        try {
            const res = await get_test_content({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: props.entryId,
            });
            if (res.code == 0) {
                setContent(res.entry_content);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const updateContent = async () => {
        const newContent = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        await request(set_test_content({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            content: JSON.stringify(newContent),
        }));
        await loadContent();
        setInEdit(false);
    }

    useEffect(() => {
        loadContent();
    }, [props.entryId])

    return (
        <Card
            title="测试步骤"
            bordered={false}
            extra={
                <>
                    {inEdit == true && (
                        <Space size="large">
                            <Button type="default" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setInEdit(false);
                            }}>取消</Button>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateContent();
                            }}>保存</Button>
                        </Space>
                    )}
                    {inEdit == false && (
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            editorRef.current?.setContent(content?.content ?? "");
                            setInEdit(true);
                        }}>修改</Button>
                    )}
                </>
            }>
            {inEdit == false && content == null && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {inEdit == false && content != null && <ReadOnlyEditor content={content.content} collapse={false} />}
            <div style={{ display: inEdit ? "block" : "none" }}>
                {editor}
            </div>
        </Card>
    );
}

export default observer(ContentPanel);