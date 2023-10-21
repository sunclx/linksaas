import React from "react";
import { observer } from 'mobx-react';
import s from "./ProjectWatch.module.less";

const ProjectWatch = () => {
    return (
        <div className={s.content_wrap}/>
    )
};

export default observer(ProjectWatch);