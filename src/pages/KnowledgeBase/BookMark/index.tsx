import { Button, Card, Modal } from "antd";
import React, { useState } from "react";
import s from "./index.module.less";
import CatePanel from "./components/CatePanel";
import BookMarkPanel from "./components/BookMarkPanel";

const BookMark = () => {
    const [showUsageModal, setShowUsageModal] = useState(false);

    return (
        <Card title={<h1 className={s.head}>项目书签</h1>}
            style={{ width: "calc(100% - 200px)" }} bordered={false}
            extra={
                <Button type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowUsageModal(true);
                }}>使用说明</Button>
            }>
            <div className={s.content_wrap}>
                <CatePanel />
                <BookMarkPanel />
            </div>
            {showUsageModal == true && (
                <Modal title="使用说明" open footer={null}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowUsageModal(false);
                    }}>
                    <div className={s.useage}>
                        <p>项目书签需要和浏览器插件配合使用，目前只支持chrome和edge浏览器。</p>
                        <h1>下载插件</h1>
                        <p>点击<a href="http://linksaas.pro/release/chrome-extension.zip" target="_blank" rel="noreferrer">这里</a>下载插件</p>
                        <h1>安装插件</h1>
                        <h2>chrome</h2>
                        <p>在chrome浏览器打开&nbsp;chrome://extensions&nbsp;地址，把刚才下载的插件从文件浏览器拖入即可</p>
                        <h2>edge</h2>
                        <p>在edge浏览器打开&nbsp;edge://extensions&nbsp;地址，把刚才下载的插件从文件浏览器拖入即可</p>
                        <h1>使用插件</h1>
                        <p>在浏览器中右键打开上下文菜单，点击收藏到凌鲨即可完成页面的收藏。</p>
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default BookMark;