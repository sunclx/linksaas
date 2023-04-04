import React, { useEffect, useMemo, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import s from './RequirementRefWidget.module.less';
import Button from '@/components/Button';
import { LinkOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Form, Input, Modal, Select, Space, Table } from 'antd';
import { RequirementInfo, CateInfo, REQ_SORT_UPDATE_TIME } from '@/api/project_requirement';
import { list_requirement, list_cate, get_requirement, list_requirement_by_id } from '@/api/project_requirement';
import type { ColumnsType } from 'antd/lib/table';
import { useStores } from '@/hooks';
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import Pagination from '@/components/Pagination';
import { request } from '@/utils/request';
import moment from 'moment';
import { LinkRequirementInfo } from '@/stores/linkAux';
import { useHistory } from 'react-router-dom';



export interface WidgetData {
    requirementIdList: string[]; //需求ID列表
}

export const requirementRefWidgetInitData: WidgetData = {
    requirementIdList: [],
}

interface AddRequirementModalProps {
    requirementIdList: string[];
    onCancel: () => void;
    onOk: (requirementIdList: string[]) => void;
}

const PAGE_SIZE = 10;
const AddRequirementModal: React.FC<AddRequirementModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [cateList, setCateList] = useState([] as CateInfo[]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(props.requirementIdList);

    const [curCateId, setCurCateId] = useState<string | null>(null);
    const [keyword, setKeyword] = useState("");

    const [requirementList, setRequirementList] = useState<RequirementInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

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
    };

    const loadRequirementList = async () => {
        const res = await request(list_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_cate_id: curCateId != null,
            cate_id: curCateId ?? "",
            filter_by_keyword: keyword.trim() != "",
            keyword: keyword.trim(),
            filter_by_has_link_issue: false,
            has_link_issue: false,
            filter_by_closed: false,//FIXME
            closed: false,//FIXME
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
            sort_type: REQ_SORT_UPDATE_TIME,//FIXME
        }));
        setTotalCount(res.total_count);
        setRequirementList(res.requirement_list);
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "需求标题",
            width: 200,
            ellipsis: true,
            dataIndex: ["base_info", "title"],
        },
        {
            title: "关联任务数量",
            width: 80,
            dataIndex: "issue_link_count",
        },
        {
            title: "创建者",
            width: 100,
            dataIndex: "create_display_name",
        }
    ];

    useEffect(() => {
        loadRequirementList();
    }, [curPage, curCateId, keyword]);

    useEffect(() => {
        loadCateList();
    }, []);

    return (
        <Modal open title="引用需求"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onOk(selectedRowKeys.map(item => item.toString()));
            }}>
            <Card bordered={false} extra={
                <Space>
                    <span className={s.filter_title}>过滤条件:</span>
                    <Form layout='inline'>
                        <Form.Item label="标题">
                            <Input allowClear onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setKeyword(e.target.value);
                            }} />
                        </Form.Item>
                        <Form.Item label="分类">
                            <Select value={curCateId} style={{ width: "100px" }}
                                onChange={value => setCurCateId(value)}>
                                <Select.Option value={null}>全部分类</Select.Option>
                                {cateList.map(item => (
                                    <Select.Option key={item.cate_id} value={item.cate_id}>{item.cate_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Space>
            }>
                <div className={s.modal_content}>
                    <Table rowKey="requirement_id" columns={columns} dataSource={requirementList}
                        pagination={false}
                        rowSelection={{
                            type: "checkbox",
                            selectedRowKeys: selectedRowKeys,
                            onChange: keys => setSelectedRowKeys(keys),
                        }} />
                    <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1} onChange={page => setCurPage(page - 1)} />
                </div>
            </Card>
        </Modal>
    );
};

const EditRequirementRef: React.FC<WidgetProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [dataSource, setDataSource] = useState<RequirementInfo[]>([]);

    const [showAddReq, setShowAddReq] = useState(false);

    const addRequirement = async (requirementIdList: string[]) => {
        const requirementList = dataSource.slice();
        for (const requirementId of requirementIdList) {
            const index = requirementList.findIndex(item => item.requirement_id == requirementId);
            if (index != -1) {
                continue;
            }
            const res = await request(get_requirement({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                requirement_id: requirementId,
            }));
            requirementList.push(res.requirement);
        }
        setDataSource(requirementList);
        const saveData: WidgetData = {
            requirementIdList: requirementList.map(item => item.requirement_id),
        };
        props.writeData(saveData);
    };

    const removeRequirement = async (requirementId: string) => {
        const tmpList = dataSource.filter(item => item.requirement_id != requirementId);
        setDataSource(tmpList);
        const saveData: WidgetData = {
            requirementIdList: tmpList.map(item => item.requirement_id),
        };
        props.writeData(saveData);
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "需求标题",
            width: 200,
            ellipsis: true,
            render: (_, row: RequirementInfo) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Deliconsvg
                        style={{ marginRight: '10px', cursor: 'pointer', color: '#0E83FF' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeRequirement(row.requirement_id);
                        }}
                    />
                    {row.base_info.title}
                </div>
            ),
        },
        {
            title: "关联任务数量",
            width: 80,
            dataIndex: "issue_link_count",
        },
        {
            title: "创建者",
            width: 100,
            dataIndex: "create_display_name",
        },
        {
            title: "创建时间",
            width: 150,
            render: (_, row: RequirementInfo) => (moment(row.create_time).format("YYYY-MM-DD HH:mm::ss")),
        }
    ];

    return (
        <EditorWrap onChange={() => props.removeSelf()}>
            <div className={s.add}>
                <Button
                    ghost
                    style={{ minWidth: '60px', borderRadius: '4px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddReq(true);
                    }}
                >
                    <PlusOutlined />
                    添加
                </Button>
                <Table
                    style={{ marginTop: '8px' }}
                    rowKey='requirement_id'
                    columns={columns}
                    className={s.EditReqRef_table}
                    scroll={{ x: 100 }}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
            {showAddReq && (
                <AddRequirementModal requirementIdList={dataSource.map(item => item.requirement_id)}
                    onCancel={() => setShowAddReq(false)}
                    onOk={requirementIdList => {
                        addRequirement(requirementIdList);
                        setShowAddReq(false);
                    }} />)}
        </EditorWrap>
    );
};

const ViewRequirementRef: React.FC<WidgetProps> = (props) => {
    const data = props.initData as WidgetData;

    const history = useHistory();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [dataSource, setDataSource] = useState<RequirementInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await request(list_requirement_by_id({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                requirement_id_list: data.requirementIdList,
            }));
            setDataSource(res.requirement_list);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    const columns: ColumnsType<RequirementInfo> = [
        {
            title: "需求标题",
            width: 200,
            ellipsis: true,
            render: (_, row: RequirementInfo) => (
                <Button type="link"
                    style={{ minWidth: "0px", padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(new LinkRequirementInfo("", row.project_id, row.requirement_id), history);
                    }}>
                    <LinkOutlined />&nbsp;{row.base_info.title}
                </Button>
            ),
        },
        {
            title: "关联任务数量",
            width: 80,
            dataIndex: "issue_link_count",
        },
        {
            title: "创建者",
            width: 100,
            dataIndex: "create_display_name",
        }
    ];

    useMemo(() => {
        loadData();
    }, []);

    return (
        <EditorWrap>
            <div className={s.sync_wrap}>
                <Button
                    className={s.sync}
                    disabled={loading}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        loadData();
                    }} icon={<SyncOutlined />}>
                    &nbsp;&nbsp;刷新
                </Button>
            </div>
            <Table
                loading={loading}
                style={{ marginTop: '8px' }}
                rowKey={'requirement_id'}
                columns={columns}
                className={s.EditReqRef_table}
                scroll={{ x: 100 }}
                dataSource={dataSource}
                pagination={false}
            />
        </EditorWrap>
    );
};

export const RequirementRefWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditRequirementRef {...props} />;
    } else {
        return <ViewRequirementRef {...props} />;
    }
};