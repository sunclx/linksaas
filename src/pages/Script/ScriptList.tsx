import React from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import Button from "@/components/Button";
import s from './ScriptList.module.less';
import { useStores } from "@/hooks";
import addIcon from '@/assets/image/addIcon.png';
import { useHistory } from "react-router-dom";

const ScriptList = () => {
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    return (
        <CardWrap>
            <div className={s.content_wrap}>
                <div style={{ marginRight: '20px' }}>
                    <div className={s.title}>
                        <h2>迭代列表</h2>
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.goToCreateScript(history);
                        }} disabled={!projectStore.isAdmin}>
                            <img src={addIcon} alt="" />
                            创建迭代
                        </Button>
                    </div>
                    xxx
                </div>
            </div>
            1111
        </CardWrap>
    );
};

export default observer(ScriptList);