import { type HTTP_BODY_TYPE, type Body, HTTP_BODY_NONE, HTTP_BODY_TEXT, HTTP_BODY_URL_ENCODE, HTTP_BODY_MULTI_PART } from "@/api/http_custom";
import { Button, Card, Checkbox, Form, Input, List, Select, Space } from "antd";
import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { DeleteOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import { open as open_dialog } from '@tauri-apps/api/dialog';

const TEXT_PLAIN = "text/plain";
const TEXT_HTML = "text/html";
const APP_JSON = "application/json";
const APP_XML = "application/xml";
const APP_URL_ENCODE = "application/x-www-form-urlencoded";
const APP_MULTI_PART = "multipart/form-data";

const CONTENT_TYPE_LIST = [
    TEXT_PLAIN,
    TEXT_HTML,
    APP_JSON,
    APP_XML,
    APP_URL_ENCODE,
    APP_MULTI_PART,
]

export interface BodyPanelProps {
    contentType: string;
    bodyType: HTTP_BODY_TYPE;
    body: Body;
    onChange: (newBodyType: HTTP_BODY_TYPE, newBody: Body, newContentType: string) => void;
}

const BodyPanel = (props: BodyPanelProps) => {

    const changeContentType = (newType: string) => {
        if (newType == "") {
            props.onChange(HTTP_BODY_NONE, { NodyBody: "" }, "");
        } else if (newType == TEXT_PLAIN) {
            props.onChange(HTTP_BODY_TEXT, { TextBody: "" }, newType);
        } else if (newType == TEXT_HTML) {
            props.onChange(HTTP_BODY_TEXT, { TextBody: "" }, newType);
        } else if (newType == APP_JSON) {
            props.onChange(HTTP_BODY_TEXT, { TextBody: "{}" }, newType);
        } else if (newType == APP_XML) {
            props.onChange(HTTP_BODY_TEXT, { TextBody: "<?xml encoding=\"utf-8\"?>" }, newType);
        } else if (newType == APP_URL_ENCODE) {
            props.onChange(HTTP_BODY_URL_ENCODE, { UrlEncodeBody: { param_list: [] } }, newType);
        } else if (newType == APP_MULTI_PART) {
            props.onChange(HTTP_BODY_MULTI_PART, { MultiPartBody: { part_list: [] } }, newType);
        }
    }

    const guessLang = () => {
        if (props.contentType == TEXT_HTML) {
            return "html";
        } else if (props.contentType == APP_JSON) {
            return "json";
        } else if (props.contentType == APP_XML) {
            return "xml";
        } else {
            return "text";
        }
    }

    const choicePath = async (id: string) => {
        if (props.body.MultiPartBody == undefined) {
            return;
        }
        const selected = await open_dialog({
            title: "选择文件",
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        const tmpList = props.body.MultiPartBody.part_list.slice();
        const index = tmpList.findIndex(tmpItem => tmpItem.id == id);
        if (index != -1) {
            tmpList[index].value = selected;
            props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList } }, props.contentType);
        }
    };

    return (
        <Card title={
            <Form layout="inline">
                <Form.Item label="请求类型">
                    <Select value={props.contentType} onChange={value => changeContentType(value)}
                        style={{ width: "200px" }}>
                        <Select.Option value="">None</Select.Option>
                        {CONTENT_TYPE_LIST.map(ct => (
                            <Select.Option key={ct} value={ct}>{ct}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        } bordered={false} extra={
            <>
                {(props.body.UrlEncodeBody !== undefined || props.body.MultiPartBody !== undefined) && (
                    <Space size="large">
                        <Button type="text" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.body.UrlEncodeBody !== undefined) {
                                props.onChange(props.bodyType, { UrlEncodeBody: { param_list: [] } }, props.contentType);
                            } else if (props.body.MultiPartBody !== undefined) {
                                props.onChange(props.bodyType, { MultiPartBody: { part_list: [] } }, props.contentType);
                            }
                        }}><DeleteOutlined /></Button>
                        <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.body.UrlEncodeBody !== undefined) {
                                const tmpList = props.body.UrlEncodeBody.param_list.slice();
                                tmpList.push({
                                    id: uniqId(),
                                    key: "",
                                    value: "",
                                });
                                props.onChange(props.bodyType, { UrlEncodeBody: { param_list: tmpList } }, props.contentType);
                            } else if (props.body.MultiPartBody !== undefined) {
                                const tmpList = props.body.MultiPartBody.part_list.slice();
                                tmpList.push({
                                    id: uniqId(),
                                    key: "",
                                    value: "",
                                    is_file: false,
                                });
                                props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList } }, props.contentType);
                            }
                        }}><PlusOutlined /></Button>
                    </Space>
                )}
            </>
        }>
            {props.body.TextBody !== undefined && (
                <CodeEditor
                    value={props.body.TextBody}
                    language={guessLang()}
                    minHeight={200}
                    placeholder="请输入......"
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const body = props.body;
                        body.TextBody = e.target.value;
                        props.onChange(props.bodyType, body, props.contentType);
                    }}
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        height: 300,
                    }}
                />
            )}
            {props.body.UrlEncodeBody !== undefined && (
                <List rowKey="id" dataSource={props.body.UrlEncodeBody.param_list} renderItem={(item, itemIndex) => (
                    <List.Item extra={
                        <Button type="text" danger onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = props.body.UrlEncodeBody!.param_list.filter(tmpItem => tmpItem.id != item.id);
                            props.onChange(props.bodyType, { UrlEncodeBody: { param_list: tmpList } }, props.contentType);
                        }}><DeleteOutlined /></Button>
                    }>
                        <div style={{ display: "flex", width: "100%" }}>
                            <Input style={{ flex: 1 }} placeholder={`字段名${itemIndex + 1}`} value={item.key} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = props.body.UrlEncodeBody!.param_list.slice();
                                const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                if (index != -1) {
                                    tmpList[index].key = e.target.value;
                                    props.onChange(props.bodyType, { UrlEncodeBody: { param_list: tmpList } }, props.contentType);
                                }
                            }} />
                            <Input style={{ flex: 1 }} placeholder={`字段值${itemIndex + 1}`} value={item.value} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = props.body.UrlEncodeBody!.param_list.slice();;
                                const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                if (index != -1) {
                                    tmpList[index].value = e.target.value;
                                    props.onChange(props.bodyType, { UrlEncodeBody: { param_list: tmpList } }, props.contentType);
                                }
                            }} />
                        </div>
                    </List.Item>
                )} />
            )}
            {props.body.MultiPartBody !== undefined && (
                <List rowKey="id" dataSource={props.body.MultiPartBody.part_list} renderItem={(item, itemIndex) => (
                    <List.Item extra={
                        <Button type="text" danger onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = props.body.MultiPartBody!.part_list.filter(tmpItem => tmpItem.id != item.id);
                            props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList }  }, props.contentType);
                        }}><DeleteOutlined /></Button>
                    }>
                        <div style={{ display: "flex", width: "100%" }}>
                            <Checkbox checked={item.is_file} style={{ lineHeight: "28px" }} onChange={e => {
                                e.stopPropagation();
                                const tmpList = props.body.MultiPartBody!.part_list.slice();
                                const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                if (index != -1) {
                                    tmpList[index].is_file = e.target.checked;
                                    props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList } }, props.contentType);
                                }
                            }}>文件</Checkbox>
                            <Input style={{ flex: 1 }} placeholder={`字段名${itemIndex + 1}`} value={item.key} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = props.body.MultiPartBody!.part_list.slice();
                                const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                if (index != -1) {
                                    tmpList[index].key = e.target.value;
                                    props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList } }, props.contentType);
                                }
                            }} />
                            <Input style={{ flex: 1 }} placeholder={`字段值${itemIndex + 1}`} value={item.value} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = props.body.MultiPartBody!.part_list.slice();
                                const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                if (index != -1) {
                                    tmpList[index].value = e.target.value;
                                    props.onChange(props.bodyType, { MultiPartBody: { part_list: tmpList } }, props.contentType);
                                }
                            }} addonAfter={
                                item.is_file == false ? null : (
                                    <Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        choicePath(item.id);
                                    }} />
                                )
                            } />
                        </div>
                    </List.Item>
                )} />
            )}
        </Card>
    );
};

export default BodyPanel;