import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import Button from "@/components/Button";
import { Modal, Space, Table, message } from "antd";
import addIcon from '@/assets/image/addIcon.png';
import { useStores } from "@/hooks";
import CreateAnnoProjectModal from "./components/CreateAnnoProjectModal";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import { EditText } from "@/components/EditCell/EditText";
import { WarningOutlined } from "@ant-design/icons";
import ExportModal from "./components/ExportModal";


const PAGE_SIZE = 10;

const DataAnnoProjectList = () => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [annoProjectList, setAnnoProjectList] = useState<dataAnnoPrjApi.AnnoProjectInfo[]>([]);
    const [removeAnnoProjectInfo, setRemoveAnnoProjectInfo] = useState<dataAnnoPrjApi.AnnoProjectInfo | null>(null);
    const [exportAnnoProjectInfo, setExportAnnoProjectInfo] = useState<dataAnnoPrjApi.AnnoProjectInfo | null>(null);

    const loadAnnoProjectList = async () => {
        const res = await request(dataAnnoPrjApi.list({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: false,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setAnnoProjectList(res.info_list);
    };

    const showAnnoProject = async (annoProjectId: string, annoName: string) => {
        const label = `dataAnno:${annoProjectId}`
        const view = WebviewWindow.getByLabel(label);
        if (view != null) {
            await view.setAlwaysOnTop(true);
            await view.show();
            await view.unminimize();
            setTimeout(() => {
                view.setAlwaysOnTop(false);
            }, 200);
            return;
        }
        const pos = await appWindow.innerPosition();

        new WebviewWindow(label, {
            title: `标注项目(${annoName})`,
            url: `data_anno.html?projectId=${projectStore.curProjectId}&annoProjectId=${annoProjectId}&admin=${projectStore.isAdmin}&fsId=${projectStore.curProject?.data_anno_fs_id ?? ""}`,
            width: 1000,
            minWidth: 800,
            height: 800,
            minHeight: 600,
            resizable: true,
            center: true,
            x: pos.x + Math.floor(Math.random() * 200),
            y: pos.y + Math.floor(Math.random() * 200),
        });
    };

    const updateAnnoProjectName = async (info: dataAnnoPrjApi.AnnoProjectInfo, newName: string) => {
        await request(dataAnnoPrjApi.update({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: info.anno_project_id,
            base_info: { ...info.base_info, name: newName },
        }));
        const tmpList = annoProjectList.slice();
        const index = tmpList.findIndex(item => item.anno_project_id == info.anno_project_id);
        if (index != -1) {
            tmpList[index].base_info.name = newName;
            setAnnoProjectList(tmpList);
        }
    };

    const removeAnnoProject = async () => {
        await request(dataAnnoPrjApi.remove({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: removeAnnoProjectInfo?.anno_project_id ?? "",
        }));
        await loadAnnoProjectList();
        setRemoveAnnoProjectInfo(null);
        message.info("删除成功");
    };

    const columns: ColumnsType<dataAnnoPrjApi.AnnoProjectInfo> = [
        {
            title: "任务名称",
            width: 150,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <EditText editable={(!projectStore.isClosed) && projectStore.isAdmin} content={row.base_info.name} showEditIcon
                    onChange={async (value) => {
                        if (value == "") {
                            return false;
                        }
                        try {
                            await updateAnnoProjectName(row, value);
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        return true;
                    }} onClick={() => showAnnoProject(row.anno_project_id, row.base_info.name)} />
            ),
        },
        {
            title: "类型",
            width: 100,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <>
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_CLASSIFI && "音频分类"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG && "音频分割"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS && "音频翻译"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG_TRANS && "音频分段翻译"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI && "图像分类"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT && "矩形对象检测"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_BRUSH_SEG && "画笔分割"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT && "圆形对象检测"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_KEYPOINT && "图像关键点"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_POLYGON_SEG && "多边形分割"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI && "文本分类"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_NER && "文本命名实体识别"}
                    {row.base_info.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_SUMMARY && "文本摘要"}
                </>
            ),
        },
        {
            title: "成员数量",
            width: 80,
            dataIndex: "member_count",
        },
        {
            title: "资源数量",
            width: 80,
            dataIndex: "resource_count",
        },
        {
            title: "总任务数",
            width: 100,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <div title={`完成任务数: ${row.done_task_count},总任务数: ${row.all_task_count}`}>{row.done_task_count}/{row.all_task_count}</div>
            ),
        },
        {
            title: "我的进度",
            width: 100,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <div title={`完成任务数: ${row.my_done_count},总任务数: ${row.my_task_count}`}>{row.my_done_count}/{row.my_task_count}</div>
            ),
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <span>{moment(row.create_time).format("YYYY-MM-DD")}</span>
            ),
        },
        {
            title: "操作",
            width: 200,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <Space size="large">
                    <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setExportAnnoProjectInfo(row);
                        }}>导出</Button>
                    <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                        disabled={projectStore.isClosed}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoveAnnoProjectInfo(row);
                        }}>删除</Button>
                </Space>
            ),
        }
    ];

    useEffect(() => {
        loadAnnoProjectList();
    }, [curPage, projectStore.curProjectId]);

    return (
        <CardWrap title="标注项目列表" extra={
            <Space size="middle">
                <Button disabled={!projectStore.isAdmin} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowCreateModal(true);
                }}>
                    <img src={addIcon} alt="" />创建标注项目
                </Button>
            </Space>
        }>
            <Table rowKey="anno_project_id" dataSource={annoProjectList} columns={columns}
                scroll={{ x: 1000, y: "calc(100vh - 180px)" }} style={{ padding: "10px 10px" }}
                pagination={{
                    total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1,
                    hideOnSinglePage: true, onChange: page => setCurPage(page - 1),
                    showSizeChanger: false
                }} />
            {showCreateModal == true && (
                <CreateAnnoProjectModal onCancel={() => setShowCreateModal(false)} onOk={() => {
                    if (curPage != 0) {
                        setCurPage(0);
                    } else {
                        loadAnnoProjectList();
                    }
                    setShowCreateModal(false);
                }} />
            )}
            {removeAnnoProjectInfo !== null && (
                <Modal open title={<span><WarningOutlined style={{ color: "red" }} />&nbsp;删除标注项目</span>}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveAnnoProjectInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeAnnoProject();
                    }}>
                    <p>是否删除标注项目&nbsp; {removeAnnoProjectInfo.base_info.name} &nbsp; ?</p>
                    <p>下面数据将被清除:</p>
                    <ul style={{ paddingLeft: "10px" }}>
                        <li>标注成员</li>
                        <li>标注资源</li>
                        <li>标注任务</li>
                        <li>标注结果</li>
                    </ul>
                </Modal>
            )}
            {exportAnnoProjectInfo != null && (
                <ExportModal annoProjectId={exportAnnoProjectInfo.anno_project_id} onCancel={() => setExportAnnoProjectInfo(null)} />
            )}
        </CardWrap>
    );
};

export default observer(DataAnnoProjectList);