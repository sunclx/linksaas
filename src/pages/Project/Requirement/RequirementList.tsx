import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from './RequirementList.module.less';
import Button from "@/components/Button";
import { Card, Menu, Popover, Table, message } from "antd";
import type { CateInfo, RequirementInfo } from '@/api/project_requirement';
import { list_cate, list_requirement, update_requirement, set_requirement_cate } from '@/api/project_requirement';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { AddCateModal, RemoveCateModal, UpdateCateModal } from "./components/CateModal";
import { MoreOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { ColumnsType } from 'antd/lib/table';
import Pagination from "@/components/Pagination";
import moment from 'moment';
import { EditText } from "@/components/EditCell/EditText";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { LinkRequirementInfo } from "@/stores/linkAux";

const PAGE_SIZE = 10;

const RequirementList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [curCateId, setCurCateId] = useState("");
    const [cateList, setCateList] = useState<CateInfo[]>([]);
    const [showAddCate, setShowAddCate] = useState(false);
    const [updateCateInfo, setUpdateCateInfo] = useState<CateInfo | null>(null);
    const [removeCateInfo, setRemoveCateInfo] = useState<CateInfo | null>(null);

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [reqInfoList, setReqInfoList] = useState<RequirementInfo[]>([]);

    const loadCateList = async () => {
        const res = await request(list_cate({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        res.cate_info_list.unshift({
            cate_id: "",
            project_id: projectStore.curProjectId,
            cate_name: "未分类需求",
            requirement_count: -1,
            create_user_id: "",
            create_time: 0,
            create_display_name: "",
            create_logo_uri: "",
            update_user_id: "",
            update_time: 0,
            update_display_name: "",
            update_logo_uri: "",
        })
        setCateList(res.cate_info_list);
        const index = res.cate_info_list.findIndex(item => item.cate_id == curCateId);
        if (index == -1) {
            setCurCateId("");
        }
    };

    const loadReqInfoList = async () => {
        const res = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_cate_id: true,
            cate_id: curCateId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setReqInfoList(res.requirement_list);
    }

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "需求标题",
            width: 250,
            render: (_, row: RequirementInfo) => (
                <EditText editable={true} content={row.base_info.title}
                    onChange={async (value: string) => {
                        const title = value.trim();
                        if (title == "") {
                            message.error("标题不能为空");
                            return false;
                        }
                        try {
                            await request(update_requirement({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                requirement_id: row.requirement_id,
                                base_info: {
                                    title: title,
                                    content: row.base_info.content,
                                },
                            }));
                            return true;
                        } catch (e) {
                            console.log(e);
                        }
                        return false;
                    }} showEditIcon={true} />
            ),
        },
        {
            title: "任务数量",
            width: 80,
            dataIndex: "issue_link_count",
        },
        {
            title: "需求分类",
            width: 150,
            render: (_, row: RequirementInfo) => (
                <EditSelect editable={true} curValue={row.cate_id}
                    itemList={cateList.map(cateItem => ({
                        value: cateItem.cate_id,
                        label: cateItem.cate_name,
                        color: "black",
                    }))}
                    onChange={async (value) => {
                        if (value == row.cate_id) {
                            return true;
                        }
                        try {
                            await request(set_requirement_cate({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                requirement_id: row.requirement_id,
                                cate_id: value as string,
                            }));
                            await loadReqInfoList();
                            return true;
                        } catch (e) {
                            console.log(e);
                        }
                        return false;
                    }} showEditIcon={true} allowClear={false} />
            ),
        },
        {
            title: "操作",
            render: (_, row: RequirementInfo) => (
                <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        //跳转到详情页
                        linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, row.requirement_id), history);
                    }}>查看</Button>
            ),
        },
        {
            title: "创建用户",
            dataIndex: "create_display_name",
            width: 80,
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, record: RequirementInfo) => (
                <span>{moment(record.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
        {
            title: "更新用户",
            dataIndex: "update_display_name",
            width: 80,
        },
        {
            title: "更新时间",
            width: 150,
            render: (_, record: RequirementInfo) => (
                <span>{moment(record.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>
            ),
        },
    ];

    useEffect(() => {
        loadCateList();
    }, [projectStore.curProjectId]);

    useEffect(() => {
        loadReqInfoList();
    }, [curPage, curCateId])

    return (
        <CardWrap>
            <div className={s.content_wrap}>
                <div className={s.title}>
                    <h2>需求列表</h2>
                    <Button disabled={!projectStore.isAdmin} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, curCateId, history);
                    }}>创建需求</Button>
                </div>
                <div className={s.panel_wrap}>
                    <div className={s.left_panel_wrap}>
                        <Card title={<h2 className={s.head}>需求分类</h2>} bordered={false}
                            extra={
                                <Button disabled={!projectStore.isAdmin}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowAddCate(true);
                                    }}>
                                    创建分类
                                </Button>}>
                            <Menu selectedKeys={[curCateId]}
                                style={{ borderRight: "none" }}
                                onSelect={value => {
                                    if (value.selectedKeys.length == 1) {
                                        if (value.selectedKeys[0] != curCateId) {
                                            setCurCateId(value.selectedKeys[0]);
                                            setCurPage(0);
                                        }
                                    }
                                }}
                                items={cateList.map(item => (
                                    {
                                        key: item.cate_id,
                                        label: (
                                            <div className={s.cate_item}>
                                                <h3>{item.cate_name}</h3>
                                                {item.cate_id != "" && (
                                                    <Popover content={
                                                        <div style={{ padding: "10px 10px" }}>
                                                            <div>
                                                                <Button type="link"
                                                                    style={{ minWidth: "0px", padding: "0px 0px" }}
                                                                    disabled={!projectStore.isAdmin}
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        setUpdateCateInfo(item);
                                                                    }}>修改分类名称</Button>
                                                            </div>
                                                            <div>
                                                                <Button type="link"
                                                                    disabled={!(projectStore.isAdmin && item.requirement_count == 0)}
                                                                    danger style={{ minWidth: "0px", padding: "0px 0px" }}
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        setRemoveCateInfo(item);
                                                                    }}>删除分类</Button>
                                                            </div>
                                                        </div>
                                                    } placement="right" trigger="click">
                                                        <div className={s.more}>
                                                            <MoreOutlined />
                                                        </div>
                                                    </Popover>
                                                )}
                                            </div>
                                        ),
                                    }
                                ))} />
                        </Card>
                    </div>
                    <div className={s.right_panel_wrap}>
                        <Table rowKey="requirement_id" columns={columns} dataSource={reqInfoList} pagination={false} scroll={{ x: 900 }} />
                        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                    </div>
                </div>
            </div>
            {showAddCate == true && (
                <AddCateModal onCancel={() => setShowAddCate(false)} onOk={() => {
                    setShowAddCate(false);
                    loadCateList();
                }} />
            )}
            {updateCateInfo != null && (
                <UpdateCateModal
                    cateInfo={updateCateInfo}
                    onCancel={() => setUpdateCateInfo(null)} onOk={() => {
                        setUpdateCateInfo(null);
                        loadCateList();
                    }} />
            )}
            {removeCateInfo != null && (
                <RemoveCateModal cateInfo={removeCateInfo} onCancel={() => setRemoveCateInfo(null)}
                    onOk={() => {
                        setRemoveCateInfo(null);
                        loadCateList();
                    }} />
            )}
        </CardWrap>
    );
};

export default observer(RequirementList);
