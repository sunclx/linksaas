import React from "react";
import { Tabs } from 'antd';
import { SubIssuePanel } from "./SubIssuePanel";



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
                <Tabs.TabPane tab="依赖工单" key="myDepend">
                    Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="被依赖工单" key="dependMe">
                    Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs>
            
        </>
    );
};