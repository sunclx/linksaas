import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import Button from "@/components/Button";
import { Space, Table } from "antd";
import addIcon from '@/assets/image/addIcon.png';
import { useStores } from "@/hooks";
import CreateAnnoProjectModal from "./components/CreateAnnoProjectModal";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { WebviewWindow } from '@tauri-apps/api/window';
import { EditText } from "@/components/EditCell/EditText";


const PAGE_SIZE = 10;

const DataAnnoProjectList = () => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [annoProjectList, setAnnoProjectList] = useState<dataAnnoPrjApi.AnnoProjectInfo[]>([]);


    const loadAnnoProjectList = async () => {
        const res = await request(dataAnnoPrjApi.list({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
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
        new WebviewWindow(label, {
            title: `标注项目(${annoName})`,
            url: `data_anno.html?projectId=${projectStore.curProjectId}&annoProjectId=${annoProjectId}&admin=${projectStore.isAdmin}`,
            width: 1000,
            minWidth: 800,
            height: 800,
            minHeight: 600,
            resizable: true,
            center: true,
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

    const columns: ColumnsType<dataAnnoPrjApi.AnnoProjectInfo> = [
        {
            title: "任务名称",
            width: 150,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <EditText editable={projectStore.isAdmin} content={row.base_info.name} showEditIcon
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
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI && "音频实体识别"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS && "音频翻译"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI && "图片分类"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_PIXEL_SEG && "图片像素分割"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_IMAGE_SEG && "图片分割"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI && "文本分类"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REC && "文本命名实体识别"}
                    {row.base_info.config.anno_type == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REL && "文本实体关系"}
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
                scroll={{ x: 800, y: "calc(100vh - 180px)" }} style={{ padding: "10px 10px" }}
                pagination={{
                    total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1,
                    hideOnSinglePage: true, onChange: page => setCurPage(page - 1)
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
        </CardWrap>
    );
};

export default observer(DataAnnoProjectList);