import React from 'react';
import s from "./index.module.less";
import { observer } from 'mobx-react';


const WorkPlan = () => {
    return (
        <div className={s.work_plan_wrap}>
            工作计划
        </div>
    );
};

export default observer(WorkPlan);