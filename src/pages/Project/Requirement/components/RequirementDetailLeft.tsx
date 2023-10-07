import React, { useState } from 'react';
import { observer } from 'mobx-react';
import type { RequirementInfo } from "@/api/project_requirement";
import { update_requirement } from "@/api/project_requirement";
import s from "./RequirementDetailLeft.module.less";
import { ReadOnlyEditor, is_empty_doc, useCommonEditor } from '@/components/Editor';
import { useStores } from '@/hooks';
import { FILE_OWNER_TYPE_REQUIRE_MENT } from '@/api/fs';
import { Card, Empty, Space, Tabs, message } from 'antd';
import Button from '@/components/Button';
import { request } from '@/utils/request';
import LinkIssuePanel from './LinkIssuePanel';
import { CommentList } from './CommentList';
import KanoPanel from './KanoPanel';
import FourQPanel from './FourQPanel';

interface RequirementDetailLeftProps {
    requirement: RequirementInfo;
    onUpdate: () => void;
}

const RequirementDetailLeft: React.FC<RequirementDetailLeftProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [inEdit, setInEdit] = useState(false);
    const [reqContent, setReqContent] = useState(props.requirement.base_info.content);
    const [isEmpty, setIsEmpty] = useState(is_empty_doc(JSON.parse(props.requirement.base_info.content)));


    const editor = useCommonEditor({
        content: props.requirement.base_info.content,
        fsId: projectStore.curProject?.require_ment_fs_id ?? "",
        ownerType: FILE_OWNER_TYPE_REQUIRE_MENT,
        ownerId: props.requirement.requirement_id,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: true,
        showReminder: false,
        channelMember: false,
    });

    const updateContent = async () => {
        const data = editor.editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        const content = JSON.stringify(data);
        const res = await request(update_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: props.requirement.requirement_id,
            base_info: {
                title: props.requirement.base_info.title,
                content: JSON.stringify(data),
                tag_id_list: props.requirement.base_info.tag_id_list,
            },
        }));
        if (res) {
            setReqContent(content);
            setInEdit(false);
            setIsEmpty(is_empty_doc(data));
            message.info("更新内容成功");
        } else {
            message.error("更新内容失败");
        }
    };

    const renderContentBtn = () => {
        if (inEdit) {
            return (<Space>
                <Button type="default"
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        editor.editorRef.current?.setContent(reqContent);
                        setInEdit(false);
                    }}>取消</Button>
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateContent();
                }}>更新内容</Button>
            </Space>);
        } else {
            return (
                <Button
                    disabled={projectStore.isClosed}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setInEdit(true);
                    }}>修改</Button>
            );
        }
    };

    return (
        <div className={s.leftCom}>
            <Card title={<h2>需求详情</h2>} bordered={false} extra={renderContentBtn()}>
                {inEdit && (<>
                    {editor.editor}
                </>)}
                {!inEdit && (
                    <>
                        {isEmpty && (<Empty description="内容为空" image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
                        {!isEmpty && (<ReadOnlyEditor content={reqContent} />)}
                    </>
                )}
            </Card>
            <hr />
            <LinkIssuePanel requirementId={props.requirement.requirement_id} onUpdate={() => props.onUpdate()} />
            <Card title={<h2>需求分析</h2>} bordered={false}>
                <Tabs defaultActiveKey='fourQ' type="card">
                    <Tabs.TabPane tab="四象限分析" key="fourQ">
                        <FourQPanel requirementId={props.requirement.requirement_id} onUpdate={() => props.onUpdate()} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Kano分析" key="kano">
                        <KanoPanel requirementId={props.requirement.requirement_id} onUpdate={() => props.onUpdate()} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
            <CommentList requirementId={props.requirement.requirement_id} />
        </div>
    );
};

export default observer(RequirementDetailLeft);