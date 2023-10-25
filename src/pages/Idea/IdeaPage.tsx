import React from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from "./IdeaPage.module.less";
import Button from "@/components/Button";
import TagListPanel from "./components/TagListPanel";
import { useStores } from "@/hooks";
import ContentPanel from "./components/ContentPanel";
import { Popover, Space } from "antd";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import { MoreOutlined } from "@ant-design/icons";

const IdeaPage = () => {
    const ideaStore = useStores('ideaStore');
    const projectStore = useStores('projectStore');

    return (
        <CardWrap title="项目知识点" extra={
            <Space size="middle">
                <Button
                    disabled={projectStore.isClosed}
                    onClick={e => {
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
                        <TagListPanel />
                    </div>
                    <div>
                        <ContentPanel />
                    </div>
                </div>
            </div>
        </CardWrap>
    );
};

export default observer(IdeaPage);