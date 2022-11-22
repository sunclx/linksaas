import React from "react";
import { observer } from 'mobx-react';
import { Card } from "antd";
import s from './BookList.module.less';
import { BookOutlined } from "@ant-design/icons";
import Button from "@/components/Button";

const BookList = ()=>{
    return (
        <Card 
        title={<h1 className={s.header}><BookOutlined /> 电子书库</h1>}
        bordered={false}
        extra={<Button type="primary" style={{ height: "30px" }} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            //TODO
        }}>上传电子书</Button>}>
            111
        </Card>
    );
};

export default observer(BookList);