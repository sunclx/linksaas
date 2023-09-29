import React from "react";
import s from "./index.module.less";
import MyIssuePanel from "./components/MyIssuePanel";
import MemberStatePanel from "./components/MemberStatePanel";

const ProjectMyWork = () => {
    return (
        <div className={s.my_work_wrap}>
            <MemberStatePanel />
            <MyIssuePanel />
        </div>
    );
}

export default ProjectMyWork;