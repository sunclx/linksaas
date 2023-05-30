import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from "./IdeaPage.module.less";
import Button from "@/components/Button";
import TagListPanel from "./components/TagListPanel";
import { useStores } from "@/hooks";
import ContentPanel from "./components/ContentPanel";
import { Popover, Space } from "antd";
import type { TagInfo } from "@/api/project";
import { list_tag, TAG_SCOPRE_IDEA } from "@/api/project";
import { request } from "@/utils/request";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import { MoreOutlined } from "@ant-design/icons";

const IdeaPage = () => {
    const ideaStore = useStores('ideaStore');

    const [tagList, setTagList] = useState<TagInfo[]>([]);

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const loadTagList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_IDEA,
        }));
        setTagList(res.tag_info_list);
    };

    useEffect(() => {
        loadTagList();
    }, [projectStore.curProjectId, projectStore.curProject?.tag_version]);

    return (
        <CardWrap title="项目知识点" extra={
            <Space size="middle">
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    ideaStore.setShowCreateIdea("", "");
                }}>创建知识点</Button>
                <Popover placement="bottom" trigger="click" content={
                    <div style={{ padding: "10px 10px" }}>
                        <Button type="link" disabled={!projectStore.isAdmin} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST;
                        }}>管理标签</Button>
                    </div>
                }>
                    <MoreOutlined className={s.more} />
                </Popover>
            </Space>}>
            <div className={s.content_wrap}>
                <div className={s.panel_wrap}>
                    <div className={s.tag_panel_wrap}>
                        <TagListPanel tagDefList={tagList} />
                    </div>
                    <div>
                        <ContentPanel tagDefList={tagList}/>
                    </div>
                </div>
            </div>
        </CardWrap>
    );
};

export default observer(IdeaPage);