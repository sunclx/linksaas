import type { HttpKeyValue } from "@/api/http_custom";
import { uniqId } from "@/utils/utils";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, List, Select, Space } from "antd";
import React from "react";

const HEADER_LIST = ["Accept", "Accept-charset", "Accept-Encoding", "Cookie", "Referrer", "User-Agent"];

export interface HeaderPanelProps {
    headerList: HttpKeyValue[];
    onChange: (newHeaderList: HttpKeyValue[]) => void;
}

const HeaderPanel = (props: HeaderPanelProps) => {
    return (
        <Card bordered={false} extra={
            <Space size="large">
                <Button type="text" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.headerList.length > 0) {
                        props.onChange([]);
                    }
                }}><DeleteOutlined /></Button>
                <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onChange([...props.headerList, {
                        id: uniqId(),
                        key: "",
                        value: "",
                    }]);
                }}><PlusOutlined /></Button>
            </Space>
        }>
            <List rowKey="id" dataSource={props.headerList} renderItem={(item, itemIndex) => (
                <List.Item extra={
                    <Button type="text" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const tmpList = props.headerList.filter(tmpItem => tmpItem.id != item.id);
                        props.onChange(tmpList);
                    }}><DeleteOutlined /></Button>
                }>
                    <div style={{ display: "flex", width: "100%" }}>
                        <Select style={{ flex: 1 }} value={item.key == "" ? null : item.key} placeholder={`请求头${itemIndex + 1}`} onChange={value => {
                            const tmpList = props.headerList.slice();
                            const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                            if (index != -1) {
                                tmpList[index].key = value;
                                props.onChange(tmpList);
                            }
                        }}>
                            {HEADER_LIST.filter(k => props.headerList.findIndex(tmpItem => tmpItem.key == k) == -1).map(k => (
                                <Select.Option key={k} value={k}>{k}</Select.Option>
                            ))}
                        </Select>
                        <Input style={{ flex: 1 }} placeholder={`请求头值${itemIndex + 1}`} value={item.value} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = props.headerList.slice();
                            const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                            if (index != -1) {
                                tmpList[index].value = e.target.value;
                                props.onChange(tmpList);
                            }
                        }} />
                    </div>
                </List.Item>
            )} />
        </Card>
    );
};

export default HeaderPanel;