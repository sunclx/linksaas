import { Table } from "antd";
import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/lib/table';
import type { WebProjectInfo } from "@/stores/project";
import { LinkOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_CHAT_PATH } from "@/utils/constant";
import moment from 'moment';

const MyProjectList = () => {
    const history = useHistory();

    const projectStore = useStores('projectStore');

    const columns: ColumnsType<WebProjectInfo> = [
        {
            title: "项目名称",
            width: 150,
            render: (_, row: WebProjectInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    projectStore.setCurProjectId(row.project_id).then(()=>{
                        history.push(APP_PROJECT_CHAT_PATH);
                    });
                }}><LinkOutlined />&nbsp;{row.basic_info.project_name}</a>
            )
        },
        {
            title: "项目状态",
            width: 80,
            render: (_, row: WebProjectInfo) => (
                row.closed ? "已结束" : "进行中"
            ),
        },
        {
            title: "超级管理员",
            width: 80,
            dataIndex: "owner_display_name",
        },
        {
            title:"创建时间",
            width:150,
            render: (_, row: WebProjectInfo) => (moment(row.create_time).format("YYYY-MM-DD HH:mm:ss")),
        }
    ];
    return (
        <Table rowKey="project_id" columns={columns} dataSource={projectStore.filterProjectList} pagination={false} />
    );
};

export default observer(MyProjectList);