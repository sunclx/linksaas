import React, { useEffect } from "react";
import type { VariableSchema } from "./schema";
import { Button, Form, Input } from "antd";
import InputNumber from "@/components/InputNumber";
import { useForm } from "antd/lib/form/Form";
import { FolderOpenOutlined } from "@ant-design/icons";
import { open as open_dialog } from '@tauri-apps/api/dialog';

export interface VairableSettingProps {
    valCfgList: VariableSchema[];
    valueMap: Map<string, string | number>;
    onChange: (newValueMap: Map<string, string | number>) => void;
}

const VairableSetting = (props: VairableSettingProps) => {
    const [form] = useForm();

    const choicePath = async (key: string, dir: boolean) => {
        const selected = await open_dialog({
            title: dir ? "选择目录" : "选择文件",
            directory: dir,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        const values: any = form.getFieldsValue();
        values[key] = selected;
        form.setFieldsValue(values);
    }

    useEffect(() => {
        form.setFieldsValue(Object.fromEntries(props.valueMap));
        console.log(props.valCfgList);
    }, [props.valueMap]);

    return (
        <Form form={form} labelCol={{ span: 6 }} onValuesChange={(_, values) => {
            const tmpMap: Map<string, string | number> = new Map();
            for (const key of Object.keys(values)) {
                if (values[key] !== undefined) {
                    tmpMap.set(key, values[key]);
                }
            }
            props.onChange(tmpMap);
        }}>
            {props.valCfgList.map(item => (
                <>
                    {item.valueType == "string" && (
                        <Form.Item key={item.id} name={item.id} label={item.name}>
                            <Input />
                        </Form.Item>
                    )}
                    {item.valueType == "integer" && (
                        <Form.Item key={item.id} name={item.id} label={item.name}>
                            <InputNumber min={item.minValue} max={item.maxValue} precision={0} controls={false} />
                        </Form.Item>
                    )}
                    {item.valueType == "float" && (
                        <Form.Item key={item.id} name={item.id} label={item.name}>
                            <InputNumber min={item.minValue} max={item.maxValue} controls={false} />
                        </Form.Item>
                    )}
                    {item.valueType == "filePath" && (
                        <Form.Item key={item.id} name={item.id} label={item.name}>
                            <Input addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                choicePath(item.id, false);
                            }} />} />
                        </Form.Item>
                    )}
                    {item.valueType == "dirPath" && (
                        <Form.Item key={item.id} name={item.id} label={item.name}>
                            <Input addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                choicePath(item.id, true);
                            }} />} />
                        </Form.Item>
                    )}
                </>
            ))}
        </Form>
    );
};


export default VairableSetting;