import React from 'react';
import s from "./index.module.less";
import SpritDetail from './SpritDetail';


const WorkPlan = () => {
    return (
        <div className={s.work_plan_wrap}>
            <SpritDetail />
        </div>
    );
};

export default WorkPlan;