import React, { useEffect, useState } from "react";
import { InputNumber, Space } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";


export interface EditNumberProps {
    editable: boolean;
    value?: number;
    onChange: (value: number) => Promise<boolean>;
    showEditIcon: boolean;
    fixedLen?: number;
    min?: number;
    max?: number;
}

export const EditNumber: React.FC<EditNumberProps> = (props) => {
    const [inEdit, setInEdit] = useState(false);
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        if (props.value !== undefined) {
            setValue(props.value);
        }
    }, [props.value])

    return (
        <span onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (props.editable) {
                setInEdit(true);
            }
        }}>
            {!inEdit && (
                <span title={(value ?? "-").toString()} style={{ cursor: props.editable ? "pointer" : "default" }}>{value == undefined ? "-" : value.toFixed(props.fixedLen ?? 2)}
                    {props.editable && props.showEditIcon &&
                        <a><EditOutlined /></a>
                    }
                </span>)}
            {inEdit && (
                <InputNumber value={value ?? 0}
                    controls={false}
                    autoFocus={true}
                    precision={props.fixedLen ?? 2}
                    min={props.min}
                    max={props.max}
                    style={{ width: "calc(100% - 50px)" }} addonAfter={
                        <Space>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setValue(props.value);
                                setInEdit(false);
                            }}><CloseOutlined /></a>
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onChange(value ?? -1).then(res => {
                                    if (!res) {
                                        setValue(props.value);
                                    }
                                    setInEdit(false);
                                })
                            }}><CheckOutlined /></a>
                        </Space>}
                    onBlurCapture={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (value == props.value) {
                            setInEdit(false);
                        }
                    }}
                    onChange={v => {
                        setValue(v!);
                    }} onKeyDown={e => {
                        if (e.key == "Escape") {
                            e.stopPropagation();
                            e.preventDefault();
                            setValue(props.value);
                            setInEdit(false);
                        } else if (e.key == "Enter") {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onChange(value ?? -1).then(res => {
                                if (!res) {
                                    setValue(props.value);
                                }
                                setInEdit(false);
                            })
                        }
                    }} />
            )}
        </span>
    )
};