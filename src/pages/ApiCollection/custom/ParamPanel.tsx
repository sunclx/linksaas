import type { HttpKeyValue } from "@/api/http_custom";
import { uniqId } from "@/utils/utils";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, List, Space } from "antd";
import React from "react";

export interface ParamPanelProps {
    paramList: HttpKeyValue[];
    onChange: (newParamList: HttpKeyValue[]) => void;
}

const ParamPanel = (props: ParamPanelProps) => {
    return (
        <Card bordered={false} extra={
            <Space size="large">
                <Button type="text" danger style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.paramList.length > 0) {
                        props.onChange([]);
                    }
                }}><DeleteOutlined /></Button>
                <Button type="text" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onChange([...props.paramList, {
                        id: uniqId(),
                        key: "",
                        value: "",
                    }]);
                }}><PlusOutlined /></Button>
            </Space>
        }>
            <List rowKey="id" dataSource={props.paramList} renderItem={(item, itemIndex) => (
                <List.Item extra={
                    <Button type="text" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const tmpList = props.paramList.filter(tmpItem => tmpItem.id != item.id);
                        props.onChange(tmpList);
                    }}><DeleteOutlined /></Button>
                }>
                    <div style={{ display: "flex", width: "100%" }}>
                        <Input style={{ flex: 1 }} placeholder={`参数名${itemIndex + 1}`} value={item.key} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = props.paramList.slice();
                            const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                            if (index != -1) {
                                tmpList[index].key = e.target.value;
                                props.onChange(tmpList);
                            }
                        }} />
                        <Input style={{ flex: 1 }} placeholder={`参数值${itemIndex + 1}`} value={item.value} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = props.paramList.slice();
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

export default ParamPanel;