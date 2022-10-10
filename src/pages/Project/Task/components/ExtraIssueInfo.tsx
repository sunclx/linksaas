import React from "react";
import { Tabs } from 'antd';
import { SubIssuePanel } from "./SubIssuePanel";
import { MyDependPanel } from "./MyDependPanel";
import { DependMePanel } from "./DependMePanel";



interface ExtraIssueInfoProps {
    issueId: string;
}

export const ExtraIssueInfo: React.FC<ExtraIssueInfoProps> = (props) => {
 

    return (
        <>
            <h2>额外信息</h2>
            <Tabs defaultActiveKey="sub">
                <Tabs.TabPane tab="子工单" key="sub">
                    <SubIssuePanel issueId={props.issueId}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="我的依赖" key="myDepend">
                    <MyDependPanel issueId={props.issueId}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="依赖我的" key="dependMe">
                    <DependMePanel issueId={props.issueId}/>
                </Tabs.TabPane>
            </Tabs>
            
        </>
    );
};