import React, { useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import DetailsNav from "@/components/DetailsNav";
import Button from "@/components/Button";
import CreateSubscribeModal from "./components/CreateSubscribeModal";

const SubscribeList = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <CardWrap>
            <DetailsNav title="研发事件订阅" >
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddModal(true);
                }}>新增订阅</Button>
            </DetailsNav>
            {showAddModal == true && <CreateSubscribeModal onCancel={() => setShowAddModal(false)} onOk={() => {
                //TODO
            }} />}
        </CardWrap>
    );
}

export default observer(SubscribeList);