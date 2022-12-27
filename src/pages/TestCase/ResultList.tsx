import React from "react";
import CardWrap from '@/components/CardWrap';
import { observer } from 'mobx-react';
import { MenuTab } from "./components/MenuTab";


const ResultList = () => {
    return (<CardWrap title="测试结果">
        <MenuTab activeKey="resultList">222222</MenuTab>
    </CardWrap>);
};

export default observer(ResultList);
