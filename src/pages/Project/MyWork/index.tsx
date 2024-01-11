import React from "react";
import s from "./index.module.less";
import MyIssuePanel from "./components/MyIssuePanel";
import MyEventList from "./components/MyEventList";
import MyWatchPanel from "./components/MyWatchPanel";

const ProjectMyWork = () => {
    return (
        <div className={s.my_work_wrap}>
            <MyIssuePanel />
            <MyWatchPanel />
            <MyEventList />
        </div>
    );
}

export default ProjectMyWork;