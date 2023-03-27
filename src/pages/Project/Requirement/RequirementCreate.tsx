import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import DetailsNav from "@/components/DetailsNav";
import Button from "@/components/Button";
import { Form, Input, Select, Space, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import s from './RequirementCreate.module.less';
import { change_file_fs, change_file_owner, useCommonEditor } from "@/components/Editor";
import { LinkRequirementInfo } from "@/stores/linkAux";
import type { LinkRequirementState } from "@/stores/linkAux";
import { useStores } from "@/hooks";
import { FILE_OWNER_TYPE_PROJECT, FILE_OWNER_TYPE_REQUIRE_MENT } from "@/api/fs";
import type { CateInfo } from '@/api/project_requirement';
import { request } from "@/utils/request";
import { list_cate, create_requirement } from '@/api/project_requirement';

const RequirementCreate = () => {
    const location = useLocation();
    const history = useHistory();

    const state: LinkRequirementState | undefined = location.state as LinkRequirementState | undefined;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');


    const { editor, editorRef } = useCommonEditor({
        content: state?.content ?? "",
        fsId: projectStore.curProject?.issue_fs_id ?? '',
        ownerType: FILE_OWNER_TYPE_PROJECT,
        ownerId: projectStore.curProjectId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: false,
        showReminder: false,
        channelMember: false,
    });


    const [title, setTitle] = useState("");
    const [curCateId, setCurCateId] = useState(state?.cateId ?? "");
    const [cateList, setCateList] = useState<CateInfo[]>([]);

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        res.cate_info_list.unshift({
            cate_id: "",
            project_id: projectStore.curProjectId,
            cate_name: "未分类需求",
            requirement_count: -1,
            create_user_id: "",
            create_time: 0,
            create_display_name: "",
            create_logo_uri: "",
            update_user_id: "",
            update_time: 0,
            update_display_name: "",
            update_logo_uri: "",
        })
        setCateList(res.cate_info_list);
    };

    const createRequirement = async () => {
        if (title == "") {
            message.error("标题不能为空");
            return;
        }
        const content = editorRef.current?.getContent() ?? {
            type: 'doc',
        };
        //更新文件存储
        await change_file_fs(
            content,
            projectStore.curProject?.issue_fs_id ?? '',
            userStore.sessionId,
            FILE_OWNER_TYPE_PROJECT,
            projectStore.curProjectId,
        );
        //创建项目需求
        const createRes = await request(create_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            base_info: {
                title: title,
                content: JSON.stringify(content),
            },
            cate_id: curCateId,
        }));
        //变更文件Owner
        await change_file_owner(content, userStore.sessionId, FILE_OWNER_TYPE_REQUIRE_MENT, createRes.requirement_id);

        message.info("创建需求成功");
        //跳转到详情页面
        linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, createRes.requirement_id), history);
    };

    useEffect(() => {
        loadCateList();
    }, [projectStore.curProjectId]);

    return (
        <CardWrap>
            <DetailsNav title={<Space size="large">
                创建需求
                <Form layout="inline">
                    <Form.Item label="需求分类">
                        <Select style={{ width: "100px" }} value={curCateId} bordered={false}
                            onChange={value => {
                                setCurCateId(value);
                            }}>
                            {cateList.map(item => (
                                <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>

            </Space>} >
                <Space>
                    <Button type="default" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        history.goBack();
                    }}>取消</Button>
                    <Button
                        title={title == "" ? "标题为空" : ""}
                        disabled={title == ""}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            createRequirement();
                        }}>创建</Button>
                </Space>
            </DetailsNav>
            <div className={s.content_wrap}>
                <Input
                    allowClear
                    bordered={false}
                    placeholder={`请输入需求标题`}
                    style={{ marginBottom: '12px', borderBottom: "1px solid #e4e4e8" }}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                />
                <div className="_reqContext">{editor}</div>
            </div>
        </CardWrap>
    );
};

export default observer(RequirementCreate);