import { Button, Card } from "antd";
import React from "react";
import s from "./index.module.less";
import CatePanel from "./components/CatePanel";
import BookMarkPanel from "./components/BookMarkPanel";

const BookMark = () => {
    return (
        <Card title={<h1 className={s.head}>项目书签</h1>}
            style={{ width: "calc(100% - 200px)" }} bordered={false}
            extra={
                <Button type="link">使用说明</Button>
            }>
            <div className={s.content_wrap}>
                <CatePanel/>
                <BookMarkPanel/>
            </div>
        </Card>
    );
};

export default BookMark;