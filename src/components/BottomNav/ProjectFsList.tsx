import { Card, Table } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { FsStatus } from "@/api/fs";
import { list_project_fs_status } from "@/api/fs";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';

const ProjectFsList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [fsStatusList, setFsStatusList] = useState<FsStatus[]>([]);

    const loadFsStatusList = async () => {
        const res = await request(list_project_fs_status({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setFsStatusList(res.fs_status_list);
    };

    const getFsLabel = (fsId: string) => {
        if (projectStore.curProject?.issue_fs_id == fsId) {
            return "任务/缺陷存储";
        } else if (projectStore.curProject?.project_fs_id == fsId) {
            return "项目设置存储";
        } else if (projectStore.curProject?.doc_fs_id == fsId) {
            return "文档存储";
        } else if (projectStore.curProject?.require_ment_fs_id == fsId) {
            return "需求存储";
        } else if (projectStore.curProject?.idea_fs_id == fsId) {
            return "知识点存储";
        } else if (projectStore.curProject?.bulletin_fs_id == fsId) {
            return "公告存储";
        } else if (projectStore.curProject?.data_anno_fs_id == fsId) {
            return "数据标注存储";
        } else if (projectStore.curProject?.api_coll_fs_id == fsId) {
            return "接口集合存储";
        } else if (projectStore.curProject?.pages_fs_id == fsId) {
            return "静态网页存储";
        } else if (projectStore.curProject?.board_fs_id == fsId) {
            return "信息面板存储";
        } else if (projectStore.curProject?.file_fs_id == fsId) {
            return "内容文件存储";
        }
        return "";
    };

    const getSizeStr = (fileSize: number) => {
        let tmpSize = fileSize;
        if (tmpSize < 1024) {
            return `${tmpSize}B`;
        }

        tmpSize = tmpSize / 1024;
        if (tmpSize < 1024) {
            return `${tmpSize.toFixed(1)}K`;
        }

        tmpSize = tmpSize / 1024;
        if (tmpSize < 1024) {
            return `${tmpSize.toFixed(1)}M`;
        }

        tmpSize = tmpSize / 1024;
        return `${tmpSize.toFixed(1)}G`;
    };

    const columns: ColumnsType<FsStatus> = [
        {
            title: "存储类型",
            width: 100,
            render: (_, row: FsStatus) => getFsLabel(row.fs_id),
        },
        {
            title: "文件数量",
            width: 80,
            dataIndex: "file_count",
        },
        {
            title: "存储空间",
            width: 100,
            render: (_, row: FsStatus) => getSizeStr(row.total_file_size),
        }
    ];

    useEffect(() => {
        loadFsStatusList();
    }, []);

    return (
        <Card title="项目存储空间">
            <Table rowKey="fs_id" dataSource={fsStatusList} columns={columns} pagination={false} scroll={{ y: 400 }} style={{ width: "300px" }} />
        </Card>
    );
};

export default observer(ProjectFsList);