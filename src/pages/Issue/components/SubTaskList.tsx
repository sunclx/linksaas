import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { SubIssueInfo } from '@/api/project_issue';
import { List, Space } from "antd";
import { list_sub_issue } from "@/api/project_issue";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { CheckOutlined } from "@ant-design/icons";

export interface SubTaskListProps {
    issueId: string;
}

const SubTaskList = (props: SubTaskListProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [subTaskList, setSubTaskList] = useState<SubIssueInfo[]>([]);

    const loadSubTaskList = async () => {
        const res = await request(list_sub_issue({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            issue_id: props.issueId,
        }));
        setSubTaskList(res.sub_issue_list);
    };

    useEffect(() => {
        loadSubTaskList();
    }, [props.issueId]);

    return (
        <List style={{ marginLeft: "140px" }}
            rowKey="sub_issue_id" dataSource={subTaskList} renderItem={item => (
                <List.Item style={{ padding: "0px 0px", borderBottom: "none" }}>
                    <Space>
                        <div style={{width:"16px"}}>
                            {item.done && <CheckOutlined style={{ color: "green" }} />}
                        </div>
                        <span title={`子任务：${item.basic_info.title}`}>{item.basic_info.title}</span>
                    </Space>
                </List.Item>
            )} />
    );
};

export default observer(SubTaskList);