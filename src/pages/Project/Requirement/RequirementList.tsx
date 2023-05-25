import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from './RequirementList.module.less';
import Button from "@/components/Button";
import { Card, Form, Input, Menu, Popover, Select, Space, Table, message } from "antd";
import type { CateInfo, RequirementInfo, REQ_SORT_TYPE } from '@/api/project_requirement';
import {
    list_cate, list_requirement, update_requirement, set_requirement_cate, open_requirement, close_requirement,
    REQ_SORT_UPDATE_TIME, REQ_SORT_CREATE_TIME, REQ_SORT_KANO, REQ_SORT_URGENT, REQ_SORT_IMPORTANT,
    update_tag_id_list
} from '@/api/project_requirement';
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
import type { TagInfo } from "@/api/project";
import { list_tag, TAG_SCOPRE_REQ } from "@/api/project";
import { EditTag } from "@/components/EditCell/EditTag";

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

    const [keyword, setKeyword] = useState("");
    const [hasLinkIssue, setHasLinkIssue] = useState<boolean | null>(null);
    const [filterClosed, setFilterClosed] = useState<boolean | null>(null);
    const [sortType, setSortType] = useState<REQ_SORT_TYPE>(REQ_SORT_UPDATE_TIME);

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [reqInfoList, setReqInfoList] = useState<RequirementInfo[]>([]);

    const [tagDefList, setTagDefList] = useState<TagInfo[]>([]);
    const [filterTagId, setFilterTagId] = useState<string | null>(null);

    const loadTagDefList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_REQ,
        }));
        setTagDefList(res.tag_info_list);
    };

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
            filter_by_keyword: keyword.trim() != "",
            keyword: keyword,
            filter_by_has_link_issue: hasLinkIssue !== null,
            has_link_issue: hasLinkIssue == null ? false : hasLinkIssue,
            filter_by_closed: filterClosed != null,
            closed: filterClosed == null ? false : filterClosed,
            filter_by_tag_id_list: (filterTagId ?? "") != "",
            tag_id_list: (filterTagId ?? "") == "" ? [] : [filterTagId!],
            sort_type: sortType,
        }));
        setTotalCount(res.total_count);
        setReqInfoList(res.requirement_list);
    }

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "需求标题",
            width: 250,
            render: (_, row: RequirementInfo) => (
                <Space size="middle" style={{ lineHeight: "28px" }}>
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
                                        tag_id_list: row.base_info.tag_id_list,
                                    },
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                            }
                            return false;
                        }} showEditIcon={true} onClick={() => {
                            linkAuxStore.goToLink(new LinkRequirementInfo("", projectStore.curProjectId, row.requirement_id), history);
                        }} />

                </Space>
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
            title: "标签",
            width: 200,
            render: (_, row: RequirementInfo) => (
                <>
                    {tagDefList != null && (
                        <EditTag editable={projectStore.isAdmin} tagIdList={row.base_info.tag_id_list} tagDefList={tagDefList}
                            onChange={(tagIdList: string[]) => {
                                request(update_tag_id_list({
                                    session_id: userStore.sessionId,
                                    project_id: row.project_id,
                                    requirement_id: row.requirement_id,
                                    tag_id_list: tagIdList,
                                })).then(() => {
                                    const tmpList = reqInfoList.slice();
                                    const index = tmpList.findIndex(item => item.requirement_id == row.requirement_id);
                                    if (index != -1) {
                                        tmpList[index].base_info.tag_id_list = tagIdList;
                                        tmpList[index].tag_info_list = tagDefList.filter(tag => tagIdList.includes(tag.tag_id)).map(tag => (
                                            {
                                                tag_id: tag.tag_id,
                                                tag_name: tag.tag_name,
                                                bg_color: tag.bg_color,
                                            }
                                        ));
                                        setReqInfoList(tmpList);
                                    }
                                });
                            }} />
                    )}
                </>
            ),
        },
        {
            title: "状态",
            width: 120,
            render: (_, row: RequirementInfo) => (
                <EditSelect editable={projectStore.isAdmin} curValue={row.closed ? 1 : 0} itemList={[
                    {
                        value: 1,
                        label: "关闭状态",
                        color: "black",
                    },
                    {
                        value: 0,
                        label: "打开状态",
                        color: "black",
                    },
                ]} onChange={async (value) => {
                    try {
                        if ((value as number) > 0.8) {
                            await request(close_requirement({
                                session_id: userStore.sessionId,
                                project_id: row.project_id,
                                requirement_id: row.requirement_id,
                            }));
                        } else {
                            await request(open_requirement({
                                session_id: userStore.sessionId,
                                project_id: row.project_id,
                                requirement_id: row.requirement_id,
                            }));
                        }
                    } catch (e) {
                        console.log(e);
                        return false;
                    }
                    return true;
                }} showEditIcon={true} allowClear={false} />
            ),
        },
        {
            title: "KANO系数",
            width: 600,
            render: (_, row: RequirementInfo) => (
                <Space size="small">
                    <span>兴奋型：{row.kano_excite_value.toFixed(3)}</span>
                    <span>期望型：{row.kano_expect_value.toFixed(3)}</span>
                    <span>基础型：{row.kano_basic_value.toFixed(3)}</span>
                    <span>无差异：{row.kano_nodiff_value.toFixed(3)}</span>
                    <span>反向型：{row.kano_reverse_value.toFixed(3)}</span>
                    <span>可疑数值：{row.kano_dubiouse_value.toFixed(3)}</span>
                </Space>
            ),
        },
        {
            title: "紧急系数",
            width: 80,
            render: (_, row: RequirementInfo) => row.four_q_urgency_value.toFixed(3),
        },
        {
            title: "重要系数",
            width: 80,
            render: (_, row: RequirementInfo) => row.four_q_important_value.toFixed(3),
        },
        {
            title: "创建用户",
            dataIndex: "create_display_name",
            width: 100,
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
            width: 100,
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
        loadTagDefList();
    }, [projectStore.curProjectId]);

    useEffect(() => {
        loadReqInfoList();
    }, [curPage, curCateId, keyword, hasLinkIssue, filterClosed, sortType, filterTagId]);



    return (
        <CardWrap title="需求列表" extra={
            <Space>
                <Button disabled={!projectStore.isAdmin} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, curCateId, history);
                }}>创建需求</Button>
            </Space>
        }>
            <div className={s.content_wrap}>
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
                        <Card bordered={false}
                            extra={<Space>
                                <Form layout="inline">
                                    <Form.Item>
                                        <Input value={keyword} style={{ width: 150 }} onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setKeyword(e.target.value ?? "");
                                        }} placeholder="标题:" allowClear />
                                    </Form.Item>
                                    <Form.Item>
                                        <Select style={{ width: 100 }} value={hasLinkIssue} onChange={value => setHasLinkIssue(value ?? null)}
                                            placeholder="任务关联:" allowClear>
                                            <Select.Option value={true}>有关联</Select.Option>
                                            <Select.Option value={false}>无关联</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        {tagDefList != null && (
                                            <Select style={{ width: 100 }} value={filterTagId} onChange={value => setFilterTagId(value ?? null)}
                                                placeholder="标签" allowClear>
                                                {tagDefList.map(tag => (
                                                    <Select.Option key={tag.tag_id} value={tag.tag_id}>
                                                        <span style={{ padding: "2px 4px", backgroundColor: tag.bg_color }}>{tag.tag_name}</span>
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Select style={{ width: 100 }} value={filterClosed} onChange={value => setFilterClosed(value ?? null)}
                                            placeholder="状态:" allowClear>
                                            <Select.Option value={false}>打开状态</Select.Option>
                                            <Select.Option value={true}>关闭状态</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="排序">
                                        <Select style={{ width: 100 }} value={sortType} onChange={value => setSortType(value)}>
                                            <Select value={REQ_SORT_UPDATE_TIME}>更新时间</Select>
                                            <Select value={REQ_SORT_CREATE_TIME}>创建时间</Select>
                                            <Select value={REQ_SORT_KANO}>KANO系数</Select>
                                            <Select value={REQ_SORT_URGENT}>紧急层度</Select>
                                            <Select value={REQ_SORT_IMPORTANT}>重要层度</Select>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Space>}>
                            <div className={s.table_wrap}>
                                <Table rowKey="requirement_id" columns={columns} dataSource={reqInfoList} pagination={false} scroll={{ x: 1900 }} />
                                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                            </div>
                        </Card>

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
