import React from 'react';
import s from "./index.module.less";
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import SpritList from './SpritList';
import SpritDetail from './SpritDetail';


const WorkPlan = () => {
    const spritStore = useStores('spritStore');

    return (
        <div className={s.work_plan_wrap}>
            {spritStore.curSpritId == "" && (
                <SpritList/>
            )}
            {spritStore.curSpritId != "" && (
                <SpritDetail/>
            )}
        </div>
    );
};

export default observer(WorkPlan);