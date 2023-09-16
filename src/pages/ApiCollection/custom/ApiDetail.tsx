import React, { useState } from "react";
import { HTTP_BODY_NONE, type ApiItemInfo, remove_api_item, update_api_item, HTTP_BODY_TEXT, HTTP_BODY_URL_ENCODE, HTTP_BODY_MULTI_PART } from "@/api/http_custom";
import { Card, Form, Input, Modal, Popover, Select, Space, Tabs } from "antd";
import Button from "@/components/Button";
import { MoreOutlined } from "@ant-design/icons";
import { useCustomStores } from "./stores";
import { observer } from 'mobx-react';
import ParamPanel from "./ParamPanel";
import HeaderPanel from "./HeaderPanel";
import BodyPanel from "./BodyPanel";
import { request } from "@/utils/request";
import { type HttpVerb, type Response, Body, fetch, ResponseType } from '@tauri-apps/api/http';
import { readBinaryFile } from '@tauri-apps/api/fs';
import ResponsePanel from "./ResponsePanel";

interface ApiDetailProps {
    apiItem: ApiItemInfo;
}

const ApiDetail = (props: ApiDetailProps) => {
    const store = useCustomStores();

    const [apiItem, setApiItem] = useState<ApiItemInfo>(Object.assign({}, props.apiItem));
    const [hasChange, setHasChange] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [response, setResponse] = useState<Response<unknown> | null>(null);

    const removeApiItem = async () => {
        await request(remove_api_item({
            session_id: store.api.sessionId,
            project_id: store.api.projectId,
            api_coll_id: store.api.apiCollId,
            api_item_id: props.apiItem.api_item_id,
        }));
        store.api.removeApiItem(props.apiItem.api_item_id);
        setShowRemoveModal(false);
    };

    const updateApiItem = async () => {
        await request(update_api_item({
            session_id: store.api.sessionId,
            project_id: store.api.projectId,
            api_coll_id: store.api.apiCollId,
            group_id: apiItem.group_id,
            api_item_id: apiItem.api_item_id,
            api_item_name: apiItem.api_item_name,
            method: apiItem.method,
            url: apiItem.url,
            param_list: apiItem.param_list.slice(),
            header_list: apiItem.header_list.slice(),
            content_type: apiItem.content_type,
            body_type: apiItem.body_type,
            body: apiItem.body,
        }));
        await store.api.updateApiItem(apiItem.api_item_id);
        setHasChange(false);
    };

    const sendRequest = async () => {
        const url = new URL(`${store.api.protocol}://${store.api.remoteAddr}${apiItem.url}`);
        for (const param of apiItem.param_list) {
            if (param.key != "") {
                url.searchParams.append(param.key, param.value);
            }
        }
        const headers: Map<string, string> = new Map();
        if (apiItem.content_type != "") {
            headers.set("Content-Type", apiItem.content_type);
        }
        for (const header of apiItem.header_list) {
            if (header.key != "" && header.value != "") {
                headers.set(header.key, header.value);
            }
        }
        let body: Body | undefined = undefined;
        if (apiItem.body_type == HTTP_BODY_TEXT) {
            body = Body.text(apiItem.body.TextBody ?? "");
        } else if (apiItem.body_type == HTTP_BODY_URL_ENCODE) {
            const form = new FormData();
            for (const param of apiItem.body.UrlEncodeBody?.param_list ?? []) {
                if (param.key != "") {
                    form.append(param.key, param.value);
                }
            }
            body = Body.form(form);
        } else if (apiItem.body_type == HTTP_BODY_MULTI_PART) {
            const form = new FormData();
            for (const part of apiItem.body.MultiPartBody?.part_list ?? []) {
                if (part.key != "") {
                    if (part.is_file) {
                        const file = await readBinaryFile(part.value);
                        form.append(part.key, new Blob([file]), part.value);
                    } else {
                        form.append(part.key, part.value);
                    }
                }
            }
            body = Body.form(form);
        }

        const resp = await fetch(url.toString(), {
            method: apiItem.method as HttpVerb,
            headers: Object.fromEntries(headers),
            body: body,
            responseType: ResponseType.Binary,
        });
        setResponse(resp);
    };

    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 90px)", overflowY: "scroll" }}
            title={
                <Form layout="inline">
                    <Form.Item label="接口名称">
                        <Input value={apiItem.api_item_name} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setApiItem({ ...apiItem, api_item_name: e.target.value.trim() });
                            setHasChange(true);
                        }} />
                    </Form.Item>
                    <Form.Item label="接口分组">
                        <Select style={{ width: "100px" }} value={apiItem.group_id} onChange={value => {
                            setApiItem({ ...apiItem, group_id: value });
                            setHasChange(true);
                        }}>
                            {store.api.groupList.map(item => (
                                <Select.Option key={item.group_id} value={item.group_id}>{item.group_name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            }
            extra={
                <Space>
                    <Button type="default" disabled={!(hasChange && store.api.canEdit)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateApiItem();
                        }}>保存</Button>
                    <Popover trigger="click" placement="bottomLeft" content={
                        <Space direction="vertical">
                            <Button type="link" disabled={!hasChange} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setApiItem(Object.assign({}, props.apiItem));
                                setHasChange(false);
                            }}>重置接口</Button>
                            <Button type="link" danger disabled={!(store.api.canEdit)} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除接口</Button>
                        </Space>
                    }>
                        <MoreOutlined />
                    </Popover>
                </Space>
            }>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1, display: "flex" }}>
                    <Select value={apiItem.method} style={{ width: "100px" }} onChange={value => {
                        setApiItem({ ...apiItem, method: value, content_type: "", body_type: HTTP_BODY_NONE });
                        setHasChange(true);
                    }}>
                        {["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"].map(method => (
                            <Select.Option key={method} value={method}>{method}</Select.Option>
                        ))}
                    </Select>
                    <Input addonBefore={`${store.api.protocol}://${store.api.remoteAddr}`} value={apiItem.url} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value.startsWith("/")) {
                            setApiItem({ ...apiItem, url: value });
                            setHasChange(true);
                        }
                    }} />
                </div>
                <Button style={{ marginLeft: "10px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    sendRequest();
                }}>发送</Button>
            </div>
            <Tabs type="card" style={{ marginTop: "10px" }} items={[
                {
                    key: "param",
                    label: "参数",
                    children: (
                        <ParamPanel paramList={apiItem.param_list} onChange={newParamList => {
                            setApiItem({ ...apiItem, param_list: newParamList });
                            setHasChange(true);
                        }} />
                    ),
                },
                {
                    key: "body",
                    label: "请求内容",
                    disabled: ["GET", "HEAD", "OPTIONS"].includes(apiItem.method),
                    children: (
                        <BodyPanel bodyType={apiItem.body_type} body={apiItem.body} contentType={apiItem.content_type}
                            onChange={(newBodyType, newBody, newContentType) => {
                                setApiItem({ ...apiItem, body_type: newBodyType, body: newBody, content_type: newContentType });
                                setHasChange(true);
                            }} />
                    ),
                },
                {
                    key: "header",
                    label: "请求头",
                    children: (
                        <HeaderPanel headerList={apiItem.header_list} onChange={newHeaderList => {
                            setApiItem({ ...apiItem, header_list: newHeaderList });
                            setHasChange(true);
                        }} />
                    ),
                }
            ]} />
            {response != null && (
                <ResponsePanel response={response} onClose={() => setResponse(null)} />
            )}
            {showRemoveModal == true && (
                <Modal open title={`删除接口${props.apiItem.api_item_name}`}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeApiItem();
                    }}>
                    是否删除接口&nbsp;{props.apiItem.api_item_name}&nbsp;?
                </Modal>
            )}
        </Card>
    );
};

export default observer(ApiDetail);