import React from "react";
import type { FeatureSchema } from "./schema";
import { Checkbox, Form } from "antd";

export interface SelectFeatureProps {
    featureList: FeatureSchema[];
    onChange: (featMap: Map<string, boolean>) => void;
}

const SelectFeature = (props: SelectFeatureProps) => {

    return (
        <Form labelCol={{ span: 6 }} onValuesChange={(_, values) => {
            const featMap: Map<string, boolean> = new Map();
            for (const key of Object.keys(values)) {
                if (values[key] == undefined) {
                    featMap.set(key, false);
                } else {
                    featMap.set(key, values[key] as boolean);
                }
            }
            props.onChange(featMap);
        }}>
            {props.featureList.map(feature => (
                <Form.Item key={feature.id} name={feature.id} label={feature.name} help={feature.tip ?? ""} valuePropName="checked">
                    <Checkbox />
                </Form.Item>
            ))}
        </Form>
    )
};

export default SelectFeature;