import { Card, Checkbox, Form, Input, List, Modal, Space } from "antd";
import React, { useEffect, useState } from "react";
import type { ProjectInfo } from '@/api/project';
import { get_admin_session } from '@/api/admin_auth';
import { list as list_project } from '@/api/project_admin';
import { request } from "@/utils/request";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export interface SelectProjectModalProps {
    title: string;
    projectIdList: string[];
    onOk: (projectIdList: string[]) => void;
    onCancel: () => void;
};

const SelectProjectModal: React.FC<SelectProjectModalProps> = (props) => {
    const [selectProjectIdList, setSelectProjectIdList] = useState(props.projectIdList);
    const [projectInfoList, setProjectInfoList] = useState<ProjectInfo[]>([]);

    const [projectKeyword, setProjectKeyword] = useState("");
    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const loadProjectList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_project({
            admin_session_id: sessionId,
            filter_closed: true,
            closed: false,
            filter_by_user_id: false,
            user_id: "",
            filter_by_keyword: projectKeyword.trim() != "",
            keyword: projectKeyword.trim(),
            filter_by_remove: true,
            remove: false,

            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setProjectInfoList(res.project_info_list);
    };

    const addSelectProjectId = (projectId: string) => {
        const tmpList = selectProjectIdList.slice();
        tmpList.push(projectId);
        setSelectProjectIdList(tmpList);
    };

    const removeSelectProjectId = (projectId: string) => {
        const tmpList = selectProjectIdList.filter(item => item != projectId);
        setSelectProjectIdList(tmpList);
    };

    useEffect(() => {
        loadProjectList();
    }, [curPage, projectKeyword])

    return (
        <Modal open title={props.title}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(selectProjectIdList);
            }}>
            <Card extra={
                <Form layout="inline">
                    <Form.Item label="项目名称">
                        <Input value={projectKeyword} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setProjectKeyword(e.target.value);
                        }} />
                    </Form.Item>
                </Form>
            }>
                <List dataSource={projectInfoList}
                    style={{ height: "calc(100vh - 450px)", overflowY: "scroll" }}
                    renderItem={item => (
                        <List.Item key={item.project_id}>
                            <Space>
                                <Checkbox checked={selectProjectIdList.includes(item.project_id)} onChange={e => {
                                    e.stopPropagation();
                                    if (e.target.checked) {
                                        addSelectProjectId(item.project_id);
                                    } else {
                                        removeSelectProjectId(item.project_id);
                                    }
                                }} />
                                <span>{item.basic_info.project_name}</span>
                            </Space>
                        </List.Item>
                    )} />
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </Card>
        </Modal>
    );
};

export default SelectProjectModal;