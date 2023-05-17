import React from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from "./IdeaPage.module.less";
import Button from "@/components/Button";
import TagListPanel from "./components/TagListPanel";
import { useStores } from "@/hooks";
import ContentPanel from "./components/ContentPanel";
import { Space } from "antd";

const IdeaPage = () => {
    const ideaStore = useStores('ideaStore');

    return (
        <CardWrap title="项目知识点" extra={
            <Space>
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    ideaStore.setShowCreateIdea("", "");
                }}>创建知识点</Button>
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