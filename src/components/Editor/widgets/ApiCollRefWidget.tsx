import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import type { ApiCollInfo, API_COLL_TYPE } from "@/api/api_collection";
import { API_COLL_GRPC, API_COLL_OPENAPI, list as list_api_coll } from "@/api/api_collection";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';
import { Button, List, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';

// 为了防止编辑器出错，WidgetData结构必须保存稳定
export interface WidgetData {
    apiCollId: string;
    name: string;
    defaultAddr: string;
    apiCollType: API_COLL_TYPE;
}

export const apiCollRefWidgetInitData: WidgetData = {
    apiCollId: "",
    name: "",
    defaultAddr: "",
    apiCollType: API_COLL_GRPC,
}

const PAGE_SIZE = 10;

const EditApiCollRef: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const [apiCollId, setApiCollId] = useState(widgetData.apiCollId);
    const [name, setName] = useState(widgetData.name);
    const [defaultAddr, setDefaultAddr] = useState(widgetData.defaultAddr);
    const [apiCollType, setApiCollType] = useState(widgetData.apiCollType);

    const [showModal, setShowModal] = useState(false);
    const [apiCollInfoList, setApiCollInfoList] = useState<ApiCollInfo[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadApiCollInfoList = async () => {
        const res = await request(list_api_coll({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: false,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setApiCollInfoList(res.info_list);
        setTotalCount(res.total_count);
    };

    useEffect(() => {
        const saveData: WidgetData = {
            apiCollId,
            name,
            defaultAddr,
            apiCollType,
        };
        props.writeData(saveData);
    }, [apiCollId, name, defaultAddr, apiCollType]);

    useEffect(() => {
        if (showModal) {
            loadApiCollInfoList();
        } else {
            setApiCollInfoList([]);
            setTotalCount(0);
            if (curPage != 0) {
                setCurPage(0);
            }
        }
    }, [showModal, curPage]);

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <div style={{ display: "flex" }}>
                    <a style={{ flex: 1 }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.openApiCollPage(apiCollId, name, apiCollType, defaultAddr, false, false);
                    }}>{name}</a>
                    <div style={{ flex: 1 }}>
                        {apiCollId != "" && apiCollType == API_COLL_GRPC && "GRPC"}
                        {apiCollId != "" && apiCollType == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    </div>
                    <div style={{ flex: 1 }}>{defaultAddr}</div>
                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowModal(true);
                        }}>
                        <EditOutlined />&nbsp;选择接口集合
                    </Button>
                </div>
                {showModal == true && (
                    <Modal open title="选择接口集合" footer={null}
                        bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowModal(false);
                        }}>
                        <List rowKey="api_coll_id" dataSource={apiCollInfoList}
                            pagination={{ total: totalCount, current: curPage + 1, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1) }}
                            renderItem={item => (
                                <List.Item key={item.api_coll_id}>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: "150px" }}>{item.name}</div>
                                        <div style={{ width: "150px" }}>
                                            {item.api_coll_type == API_COLL_GRPC && "GRPC"}
                                            {item.api_coll_type == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                                        </div>
                                        <div style={{ width: "150px" }}>{item.default_addr}</div>
                                        <div><a onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setApiCollId(item.api_coll_id);
                                            setName(item.name);
                                            setDefaultAddr(item.default_addr);
                                            setApiCollType(item.api_coll_type);
                                            setShowModal(false);
                                        }}>选择</a></div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Modal>
                )}
            </EditorWrap>
        </ErrorBoundary>
    );
};


const ViewApiCollRef: React.FC<WidgetProps> = (props) => {
    const widgetData = props.initData as WidgetData;

    const linkAuxStore = useStores('linkAuxStore');

    return (
        <ErrorBoundary>
            <EditorWrap>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                        <span>接口集合:&nbsp;&nbsp;</span>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.openApiCollPage(widgetData.apiCollId, widgetData.name, widgetData.apiCollType, widgetData.defaultAddr, false, false);
                        }}>{widgetData.name}</a>
                    </div>
                    <div style={{ flex: 1 }}>
                        {widgetData.apiCollId != "" && widgetData.apiCollType == API_COLL_GRPC && "GRPC"}
                        {widgetData.apiCollId != "" && widgetData.apiCollType == API_COLL_OPENAPI && "OPENAPI/SWAGGER"}
                    </div>
                    <div style={{ flex: 1 }}>{widgetData.defaultAddr}</div>
                    {widgetData.apiCollId != "" && (
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            linkAuxStore.openApiCollPage(widgetData.apiCollId, widgetData.name, widgetData.apiCollType, widgetData.defaultAddr, false, false);
                        }}>打开接口集合</Button>
                    )}
                </div>
            </EditorWrap>
        </ErrorBoundary>
    );
}

export const ApiCollRefWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditApiCollRef {...props} />;
    } else {
        return <ViewApiCollRef {...props} />;
    }
};