import React, { useEffect, useState } from "react";
import s from './ProjectList.module.less';
import { Card, Checkbox, Form, Input, Select, Space, Table } from "antd";
import Pagination from "@/components/Pagination";
import { get_admin_session, get_admin_perm } from '@/api/admin_auth';
import { list as list_project } from '@/api/project_admin';
import type { ProjectInfo } from '@/api/project';
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/es/table';
import Button from "@/components/Button";
import type { AdminPermInfo } from '@/api/admin_auth';
import { useHistory } from "react-router-dom";
import type { UserDetailState } from "../UserAdmin/UserDetail";
import { ADMIN_PATH_PROJECT_DETAIL_SUFFIX, ADMIN_PATH_USER_DETAIL_SUFFIX } from "@/utils/constant";
import { LinkOutlined } from "@ant-design/icons";
import moment from 'moment';
import type { ProjectDetailState } from "./ProjectDetail";


const PAGE_SIZE = 10;

const ProjectList = () => {
    const history = useHistory();

    const [keyword, setKeyword] = useState("");
    const [includeRemove, setIncludeRemove] = useState(false);
    const [prjClosed, setPrjClosed] = useState<boolean | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [projectList, setProjectList] = useState<ProjectInfo[]>([]);

    const [permInfo, setPermInfo] = useState<AdminPermInfo | null>(null);

    const loadProjectList = async () => {
        const sessionId = await get_admin_session();
        const res = await request(list_project({
            admin_session_id: sessionId,
            filter_closed: prjClosed != null,
            closed: prjClosed == null ? false : prjClosed,
            filter_by_user_id: false,
            user_id: "",
            filter_by_keyword: keyword.trim() != "",
            filter_by_remove: !includeRemove,
            remove: includeRemove,
            keyword: keyword,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setProjectList(res.project_info_list);
    };

    const columns: ColumnsType<ProjectInfo> = [
        {
            title: "项目名称",
            width: 100,
            render: (_, row: ProjectInfo) => (
                <>
                    {row.owner_user_id != "" && (
                        <Button type="link"
                            style={{ minWidth: 0, paddingLeft: 0 }}
                            disabled={!(permInfo?.project_perm.read ?? false)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const state: ProjectDetailState = {
                                    projectId: row.project_id,
                                };
                                history.push(ADMIN_PATH_PROJECT_DETAIL_SUFFIX, state);
                            }}
                        ><LinkOutlined />&nbsp;{row.basic_info.project_name}</Button>
                    )}
                    {row.owner_user_id == "" && <span style={{ textDecoration: "line-through" }}>{row.basic_info.project_name}</span>}
                </>
            ),
        },
        {
            title: "状态",
            width: 100,
            render: (_, row: ProjectInfo) => (
                row.closed ? "关闭" : "打开"
            ),
        },
        {
            title: "超级管理员",
            width: 100,
            render: (_, row: ProjectInfo) => (
                <>
                    {row.owner_user_id != "" && (
                        <Button type="link"
                            style={{ minWidth: 0, paddingLeft: 0 }}
                            disabled={!(permInfo?.user_perm.read ?? false)}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const state: UserDetailState = {
                                    userId: row.owner_user_id,
                                };
                                history.push(ADMIN_PATH_USER_DETAIL_SUFFIX, state);
                            }}><LinkOutlined />&nbsp;{row.owner_display_name}</Button>
                    )}
                </>
            ),
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, row: ProjectInfo) => moment(row.create_time).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "更新时间",
            width: 150,
            render: (_, row: ProjectInfo) => moment(row.update_time).format("YYYY-MM-DD HH:mm:ss"),
        },
    ];

    useEffect(() => {
        loadProjectList();
    }, [curPage, keyword, prjClosed, includeRemove]);

    useEffect(() => {
        get_admin_perm().then(res => setPermInfo(res));
    }, []);

    return (
        <Card title="项目列表" extra={
            <Space>
                <span className={s.filter_head}>过滤条件</span>
                <Form layout="inline">
                    <Form.Item label="项目名称">
                        <Input allowClear onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setKeyword(e.target.value.trim());
                        }} />
                    </Form.Item>
                    <Form.Item label="项目状态">
                        <Select style={{ width: 100 }} value={prjClosed} onChange={value => setPrjClosed(value)}>
                            <Select.Option value={null}>全部</Select.Option>
                            <Select.Option value={false}>打开</Select.Option>
                            <Select.Option value={true}>关闭</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="包含已删除项目">
                        <Checkbox checked={includeRemove} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIncludeRemove(e.target.checked);
                        }} />
                    </Form.Item>
                </Form>
            </Space>
        }>
            <div className={s.content_wrap}>
                <Table rowKey="project_id" columns={columns} dataSource={projectList} pagination={false} />
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
            </div>
        </Card>
    )
};

export default ProjectList;