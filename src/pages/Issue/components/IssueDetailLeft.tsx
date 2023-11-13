import React, { useState } from "react";
import s from './IssueDetailLeft.module.less';
import { is_empty_doc, ReadOnlyEditor, useCommonEditor } from "@/components/Editor";
import { Card, Space, Empty, message } from "antd";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { getIssueText, getIsTask } from "@/utils/utils";
import { ExtraIssueInfo } from "./ExtraIssueInfo";
import type { IssueInfo } from "@/api/project_issue";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { FILE_OWNER_TYPE_ISSUE } from "@/api/fs";
import { updateContent as updateIssueContent } from './utils';
import { flushEditorContent } from "@/components/Editor/common";

export interface IssueDetailLeftProps {
    issue: IssueInfo;
    onUpdate: () => void;
}

const IssueDetailLeft: React.FC<IssueDetailLeftProps> = (props) => {
    const { pathname } = useLocation();
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [issueContent, setIssueContent] = useState(props.issue.basic_info.content);
    const [isEmpty, setIsEmpty] = useState(is_empty_doc(JSON.parse(props.issue.basic_info.content)));


    const editor = useCommonEditor({
        content: props.issue.basic_info.content,
        fsId: projectStore.curProject?.issue_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_ISSUE,
        ownerId: props.issue.issue_id,
        projectId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        commonInToolbar: true,
        widgetInToolbar: true,
        showReminder: false,
    });

    const updateContent = async () => {
        await flushEditorContent();
        const data = editor.editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        const content = JSON.stringify(data);
        const res = await updateIssueContent(userStore.sessionId, projectStore.curProjectId, props.issue.issue_id, content);
        if (res) {
            setIssueContent(content);
            setInEdit(false);
            setIsEmpty(is_empty_doc(data));
            message.info("更新内容成功");
            props.onUpdate();
        } else {
            message.error("更新内容失败");
        }
    };

    const renderContentBtn = () => {
        if (inEdit) {
            return (<Space>
                <Button type="default" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    editor.editorRef.current?.setContent(issueContent);
                    setInEdit(false);
                }}>取消</Button>
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateContent();
                }}>更新内容</Button>
            </Space>);
        } else {
            return (<Button disabled={projectStore.isClosed || !props.issue.user_issue_perm.can_update} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setInEdit(true);
            }}>修改</Button>);
        }
    };

    return (
        <div className={s.leftCom}>
            <Card title={<h2>{getIssueText(pathname)}详情</h2>} bordered={false} extra={renderContentBtn()}>
                {inEdit && (<>
                    {editor.editor}
                </>)}
                {!inEdit && (
                    <>
                        {isEmpty && (<Empty description="内容为空" image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
                        {!isEmpty && (<ReadOnlyEditor content={issueContent} />)}
                    </>
                )}
            </Card>
            {getIsTask(pathname) && (props.issue?.issue_id ?? "") != "" && (
                <>
                    <hr />
                    <ExtraIssueInfo issueId={props.issue?.issue_id ?? ""}
                        canOptSubIssue={props.issue?.user_issue_perm.can_opt_sub_issue ?? false}
                        canOptDependence={props.issue?.user_issue_perm.can_opt_dependence ?? false} />
                </>
            )}
        </div>
    );
}

export default observer(IssueDetailLeft);