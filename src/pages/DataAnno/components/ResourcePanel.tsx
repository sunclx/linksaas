import React, { useEffect, useState } from "react";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import AddResourceModal from "./AddResourceModal";
import { Button, Card, List, Modal, Space, Image, message } from "antd";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { DeleteOutlined } from "@ant-design/icons";

export interface ResourcePanelProps {
    projectId: string;
    annoProjectId: string;
    annoType: dataAnnoPrjApi.ANNO_TYPE;
    showAddModal: boolean;
    fsId: string;
    onChange: (resourceCount: number) => void;
    onRemove: () => void;
    onCancelAdd: () => void;
}

const PAGE_SIZE = 10;

const ResourcePanel = (props: ResourcePanelProps) => {
    const [resourceList, setResourceList] = useState<dataAnnoPrjApi.ResourceInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const [removeResourceId, setRemoveResourceId] = useState("");

    const loadResourceList = async () => {
        const sessionId = await get_session();
        const res = await request(dataAnnoPrjApi.list_resource({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setResourceList(res.info_list);
        props.onChange(res.total_count);
    };

    const getUrl = (fileId: string) => {
        const isOsWindows = navigator.userAgent.toLowerCase().indexOf("windows") > -1;
        if (isOsWindows) {
            return `https://fs.localhost/${props.fsId}/${fileId}/resource`;
        } else {
            return `fs://localhost/${props.fsId}/${fileId}/resource`;
        }
    }

    const removeResource = async () => {
        const sessionId = await get_session();
        await request(dataAnnoPrjApi.remove_resource({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            resource_id: removeResourceId,
        }));
        setRemoveResourceId("");
        props.onRemove();
        await loadResourceList();
        message.info("成功删除标注资源");
    }

    useEffect(() => {
        loadResourceList();
    }, [curPage]);

    return (
        <div>
            <List rowKey="resource_id" dataSource={resourceList} renderItem={item => (
                <>
                    {item.store_as_file == false && item.content && (
                        <List.Item>
                            <Card style={{width:"100%"}} extra={
                                <Space size="large" style={{ marginLeft: "20px" }}>
                                    <span>任务数量:&nbsp;{item.task_count}</span>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setRemoveResourceId(item.resource_id);
                                    }}><DeleteOutlined /></Button>
                                </Space>}>
                                {item.content}
                            </Card>
                        </List.Item>
                    )}
                    {item.store_as_file == true && dataAnnoPrjApi.isAnnoAudio(props.annoType) == true && (
                        <List.Item extra={
                            <Space size="large" style={{ marginLeft: "20px" }}>
                                <span>任务数量:&nbsp;{item.task_count}</span>
                                <Button type="link" danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setRemoveResourceId(item.resource_id);
                                }}><DeleteOutlined /></Button>
                            </Space>
                        }>
                            <audio controls style={{ width: "calc(100% - 180px)" }}>
                                <source src={getUrl(item.content)} />
                            </audio>
                        </List.Item>
                    )}
                    {item.store_as_file == true && dataAnnoPrjApi.isAnnoImage(props.annoType) == true && (
                        <List.Item>
                            <Card style={{width:"100%"}} extra={
                                <Space size="large" style={{ marginLeft: "20px" }}>
                                    <span>任务数量:&nbsp;{item.task_count}</span>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setRemoveResourceId(item.resource_id);
                                    }}><DeleteOutlined /></Button>
                                </Space>}>
                                <Image src={getUrl(item.content)} preview={false} />
                            </Card>
                        </List.Item>
                    )}
                </>
            )} pagination={{ total: totalCount, pageSize: PAGE_SIZE, current: curPage + 1, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />
            {props.showAddModal == true && (
                <AddResourceModal projectId={props.projectId} annoProjectId={props.annoProjectId} annoType={props.annoType}
                    fsId={props.fsId}
                    onCancel={() => props.onCancelAdd()}
                    onOk={() => {
                        if (curPage != 0) {
                            setCurPage(0);
                        } else {
                            loadResourceList();
                        }
                        props.onCancelAdd();
                    }} />
            )}
            {removeResourceId != "" && (
                <Modal open title="删除标注资源" okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveResourceId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeResource();
                    }}>
                    是否删除标注资源?
                </Modal>
            )}
        </div>
    );
};

export default ResourcePanel;