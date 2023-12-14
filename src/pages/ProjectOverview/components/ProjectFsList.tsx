import { Button, Descriptions, Modal, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import type { FsStatus } from "@/api/fs";
import { list_project_fs_status, gc_project_fs } from "@/api/fs";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

const ProjectFsList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [fsStatusList, setFsStatusList] = useState<FsStatus[]>([]);
    const [gcFsId, setGcFsId] = useState("");
    const [gcFileCount, setGcFileCount] = useState<number | null>(null);
    const [gcTotalSize, setGcTotalSize] = useState<number | null>(null);

    const loadFsStatusList = async () => {
        const res = await request(list_project_fs_status({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setFsStatusList(res.fs_status_list);
    };

    const runGcFs = async (fsId: string) => {
        const res = await request(gc_project_fs({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            fs_id: fsId,
        }));
        setGcFileCount(res.gc_file_count);
        setGcTotalSize(res.gc_total_size);
        await loadFsStatusList();
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
            render: (_, row: FsStatus) => getFsLabel(row.fs_id),
        },
        {
            title: "文件数量",
            dataIndex: "file_count",
        },
        {
            title: "最大文件数量",
            render: (_, row: FsStatus) => row.max_filecount <= 0 ? "无限制" : row.max_filecount
        },
        {
            title: "存储空间",
            render: (_, row: FsStatus) => getSizeStr(row.total_file_size),
        },
        {
            title: "最大存储空间",
            render: (_, row: FsStatus) => row.max_total_size <= 0 ? "无限制" : getSizeStr(row.max_total_size),
        },
        {
            title: "上次清理时间",
            render: (_, row: FsStatus) => row.last_gc_time <= 0 ? "-" : moment(row.last_gc_time).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "操作",
            width: 100,
            render: (_, row: FsStatus) => (
                <Button type="link" disabled={!projectStore.isAdmin || (moment().valueOf() - row.last_gc_time) < 12 * 2400 * 3600} style={{
                    minWidth: 0,
                    padding: "0px 0px",
                }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setGcFileCount(null);
                    setGcTotalSize(null);
                    setGcFsId(row.fs_id);
                    runGcFs(row.fs_id);
                }}>清理空间</Button>
            ),
        }
    ];

    useEffect(() => {
        loadFsStatusList();
    }, []);

    return (
        <>
            <Table rowKey="fs_id" dataSource={fsStatusList} columns={columns} pagination={false} />
            {gcFsId != "" && (
                <Modal open title="清理空间" footer={null} onCancel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setGcFsId("");
                }}>
                    {(gcFileCount == null || gcTotalSize == null) && (
                        <Space>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                            清理中
                        </Space>
                    )}
                    {gcFileCount != null && gcTotalSize != null && (
                        <Descriptions column={1} bordered labelStyle={{ width: "150px" }}>
                            <Descriptions.Item label="回收文件数量">
                                {gcFileCount}
                            </Descriptions.Item>
                            <Descriptions.Item label="回收空间">
                                {getSizeStr(gcTotalSize)}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>
            )}
        </>
    );
};

export default observer(ProjectFsList);