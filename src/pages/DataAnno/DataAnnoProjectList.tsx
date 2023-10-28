import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import Button from "@/components/Button";
import { Form, Modal, Popover, Space, Switch, Table, message } from "antd";
import addIcon from '@/assets/image/addIcon.png';
import { useStores } from "@/hooks";
import CreateAnnoProjectModal from "./components/CreateAnnoProjectModal";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import moment from "moment";
import { EditText } from "@/components/EditCell/EditText";
import { WarningOutlined } from "@ant-design/icons";
import ExportModal from "./components/ExportModal";
import s from "./DataAnnoProjectList.module.less";
import { watch, unwatch, WATCH_TARGET_DATA_ANNO } from "@/api/project_watch";
import UserPhoto from "@/components/Portrait/UserPhoto";

const PAGE_SIZE = 10;

const DataAnnoProjectList = () => {
    const userStore = useStores("userStore")
    const projectStore = useStores("projectStore");
    const linkAuxStore = useStores("linkAuxStore");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [annoProjectList, setAnnoProjectList] = useState<dataAnnoPrjApi.AnnoProjectInfo[]>([]);
    const [removeAnnoProjectInfo, setRemoveAnnoProjectInfo] = useState<dataAnnoPrjApi.AnnoProjectInfo | null>(null);
    const [exportAnnoProjectInfo, setExportAnnoProjectInfo] = useState<dataAnnoPrjApi.AnnoProjectInfo | null>(null);

    const [filterByWatch, setFilterByWatch] = useState(false);

    const loadAnnoProjectList = async () => {
        const res = await request(dataAnnoPrjApi.list({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: filterByWatch,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setAnnoProjectList(res.info_list);
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

    const loadAnnoProjectInfo = async (annoProjectId: string) => {
        const res = await request(dataAnnoPrjApi.get({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: annoProjectId,
        }));
        const tmpList = annoProjectList.slice();
        const index = tmpList.findIndex(item => item.anno_project_id == annoProjectId);
        if (index != -1) {
            tmpList[index] = res.info;
            setAnnoProjectList(tmpList);
        }
    };

    const unwatchDataAnno = async (annoProjectId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_DATA_ANNO,
            target_id: annoProjectId,
        }));
        await loadAnnoProjectInfo(annoProjectId);
    };

    const watchDataAnno = async (annoProjectId: string) => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_DATA_ANNO,
            target_id: annoProjectId,
        }));
        await loadAnnoProjectInfo(annoProjectId);
    };

    const columns: ColumnsType<dataAnnoPrjApi.AnnoProjectInfo> = [
        {
            title: "",
            dataIndex: "my_watch",
            width: 40,
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (row.my_watch) {
                        unwatchDataAnno(row.anno_project_id);
                    } else {
                        watchDataAnno(row.anno_project_id);
                    }
                }}>
                    <span className={row.my_watch ? s.isCollect : s.noCollect} />
                </a>
            ),
            fixed: true,
        },
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
                    }} onClick={() => linkAuxStore.openAnnoProjectPage(row.anno_project_id, row.base_info.name)} />
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
            title: "关注人",
            dataIndex: "",
            width: 140,
            align: 'left',
            render: (_, row: dataAnnoPrjApi.AnnoProjectInfo) => (
                <Popover trigger="hover" placement='top' content={
                    <div style={{ display: "flex", padding: "10px 10px", maxWidth: "300px", flexWrap: "wrap" }}>
                        {(row.watch_user_list ?? []).map(item => (
                            <Space key={item.member_user_id} style={{ margin: "4px 10px" }}>
                                <UserPhoto logoUri={item.logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                                {item.display_name}
                            </Space>
                        ))}
                    </div>
                }>
                    {(row.watch_user_list ?? []).length == 0 && "-"}
                    {(row.watch_user_list ?? []).length > 0 && `${(row.watch_user_list ?? []).length}人`}
                </Popover>
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
    }, [curPage, projectStore.curProjectId, filterByWatch]);

    return (
        <CardWrap title="标注项目列表" extra={
            <Space size="middle">
                <Form layout="inline">
                    <Form.Item label="只看我的关注">
                        <Switch checked={filterByWatch} onChange={value => setFilterByWatch(value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={!projectStore.isAdmin} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowCreateModal(true);
                        }}>
                            <img src={addIcon} alt="" />创建标注项目
                        </Button>
                    </Form.Item>
                </Form>
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
