import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import s from './RequirementList.module.less';
import Button from "@/components/Button";
import { Card, Form, Input, Popover, Select, Space, Switch, Table, message } from "antd";
import type { RequirementInfo, REQ_SORT_TYPE } from '@/api/project_requirement';
import {
    list_requirement, update_requirement, open_requirement, close_requirement, get_requirement,
    REQ_SORT_UPDATE_TIME, REQ_SORT_CREATE_TIME, REQ_SORT_KANO, REQ_SORT_URGENT, REQ_SORT_IMPORTANT,
    update_tag_id_list
} from '@/api/project_requirement';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { MoreOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import type { ColumnsType } from 'antd/lib/table';
import Pagination from "@/components/Pagination";
import moment from 'moment';
import { EditText } from "@/components/EditCell/EditText";
import { EditSelect } from "@/components/EditCell/EditSelect";
import { LinkRequirementInfo } from "@/stores/linkAux";
import { EditTag } from "@/components/EditCell/EditTag";
import { PROJECT_SETTING_TAB } from "@/utils/constant";
import { watch, unwatch, WATCH_TARGET_REQUIRE_MENT } from "@/api/project_watch";
import UserPhoto from "@/components/Portrait/UserPhoto";

const PAGE_SIZE = 10;

const RequirementList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [keyword, setKeyword] = useState("");
    const [hasLinkIssue, setHasLinkIssue] = useState<boolean | null>(null);
    const [filterClosed, setFilterClosed] = useState<boolean | null>(null);
    const [sortType, setSortType] = useState<REQ_SORT_TYPE>(REQ_SORT_UPDATE_TIME);

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [reqInfoList, setReqInfoList] = useState<RequirementInfo[]>([]);

    const [filterTagId, setFilterTagId] = useState<string | null>(null);
    const [filterByWatch, setFilterByWatch] = useState(false);

    const loadReqInfoList = async () => {
        const res = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
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
            filter_by_watch: filterByWatch,
        }));
        setTotalCount(res.total_count);
        setReqInfoList(res.requirement_list);
    }

    const updateRequirement = async (requirementId: string) => {
        const res = await request(get_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: requirementId,
        }));
        const tmpList = reqInfoList.slice();
        const index = tmpList.findIndex(item => item.requirement_id == requirementId);
        if (index != -1) {
            tmpList[index] = res.requirement;
            setReqInfoList(tmpList);
        }
    };

    const unwatchRequirement = async (requirementId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_REQUIRE_MENT,
            target_id: requirementId,
        }));
        await updateRequirement(requirementId);
    };

    const watchRequirement = async (requirementId: string) => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_REQUIRE_MENT,
            target_id: requirementId,
        }));
        await updateRequirement(requirementId);
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "",
            dataIndex: "my_watch",
            width: 40,
            render: (_, record: RequirementInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (record.my_watch) {
                        unwatchRequirement(record.requirement_id);
                    } else {
                        watchRequirement(record.requirement_id);
                    }
                }}>
                    <span className={record.my_watch ? s.isCollect : s.noCollect} />
                </a>
            ),
            fixed: true,
        },
        {
            title: "需求标题",
            width: 250,
            render: (_, row: RequirementInfo) => (
                <Space size="middle" style={{ lineHeight: "28px" }}>
                    <EditText editable={(!projectStore.isClosed) && row.user_requirement_perm.can_update} content={row.base_info.title}
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
            title: "标签",
            width: 200,
            render: (_, row: RequirementInfo) => (
                <>
                    <EditTag editable={(!projectStore.isClosed) && row.user_requirement_perm.can_update} tagIdList={row.base_info.tag_id_list} tagDefList={(projectStore.curProject?.tag_list ?? []).filter(tag => tag.use_in_req)}
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
                                    tmpList[index].tag_info_list = (projectStore.curProject?.tag_list ?? []).filter(tag => tag.use_in_req).filter(tag => tagIdList.includes(tag.tag_id)).map(tag => (
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

                </>
            ),
        },
        {
            title: "状态",
            width: 120,
            render: (_, row: RequirementInfo) => (
                <EditSelect editable={(!projectStore.isClosed) && (row.user_requirement_perm.can_open || row.user_requirement_perm.can_close)} curValue={row.closed ? 1 : 0} itemList={[
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
            title: "关注人",
            dataIndex: "",
            width: 140,
            align: 'left',
            render: (_, row: RequirementInfo) => (
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
        loadReqInfoList();
    }, [curPage, keyword, hasLinkIssue, filterClosed, sortType, filterTagId, filterByWatch]);



    return (
        <CardWrap title="需求列表" extra={
            <Space size="middle">
                <Button disabled={projectStore.isClosed} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToCreateRequirement("", projectStore.curProjectId, history);
                }}>创建需求</Button>
                <Popover placement="bottom" trigger="click" content={
                    <div style={{ padding: "10px 10px" }}>
                        <Button type="link" disabled={!projectStore.isAdmin} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST;
                        }}>管理标签</Button>
                    </div>
                }>
                    <MoreOutlined className={s.more} />
                </Popover>
            </Space>
        }>
            <div className={s.content_wrap}>
                <Card bordered={false}
                    extra={<Space>
                        <Form layout="inline">
                            <Form.Item label="只看我的关注">
                                <Switch checked={filterByWatch} onChange={value => {
                                    setFilterByWatch(value);
                                }} />
                            </Form.Item>
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
                                <Select style={{ width: 100 }} value={filterTagId} onChange={value => setFilterTagId(value ?? null)}
                                    placeholder="标签" allowClear>
                                    {(projectStore.curProject?.tag_list ?? []).filter(tag => tag.use_in_req).map(tag => (
                                        <Select.Option key={tag.tag_id} value={tag.tag_id}>
                                            <span style={{ padding: "2px 4px", backgroundColor: tag.bg_color }}>{tag.tag_name}</span>
                                        </Select.Option>
                                    ))}
                                </Select>
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
                        <Table rowKey="requirement_id" columns={columns} dataSource={reqInfoList} pagination={false} scroll={{ x: 1800 }} />
                        <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                    </div>
                </Card>

            </div>
        </CardWrap >
    );
};

export default observer(RequirementList);
