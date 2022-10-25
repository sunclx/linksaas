import React, { useState } from "react";
import moment from 'moment';
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";

export interface EditDateProps {
    editable: boolean;
    hasTimeStamp: boolean;
    timeStamp: number;
    onChange: (t: number | undefined) => Promise<boolean>;
    showEditIcon: boolean;
}

export const EditDate: React.FC<EditDateProps> = (props) => {
    const [inEdit, setInEdit] = useState(false);
    const [hasTimeStamp, setHasTimeStamp] = useState(props.hasTimeStamp);
    const [timeStamp, setTimeStamp] = useState(props.timeStamp);

    return (
        <span onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (props.editable) {
                setInEdit(true);
            }
        }}>
            {!inEdit && (
                <span style={{ cursor: props.editable ? "pointer" : "default" }}>{hasTimeStamp ? moment(timeStamp).format("YYYY-MM-DD") : "-"}
                    {props.editable && props.showEditIcon &&
                        <a><EditOutlined /></a>
                    }
                </span>
            )}
            {inEdit && (
                <Space>
                    <DatePicker
                        autoFocus
                        allowClear={false}
                        open={true}
                        value={hasTimeStamp ? moment(timeStamp) : moment()}
                        onBlur={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTimeout(() => {
                                setInEdit(false);
                            }, 200);
                        }}
                        onChange={value => {
                            if (value == null) {
                                setInEdit(false);
                                return;
                            }
                            props.onChange(value.valueOf()).then(res => {
                                if (res) {
                                    setHasTimeStamp(true);
                                    setTimeStamp(value.valueOf());
                                }
                                setInEdit(false);
                            });
                        }}
                    />
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        props.onChange(undefined).then(res => {
                            if (res) {
                                setHasTimeStamp(false);
                                setTimeStamp(0);
                            }
                            setInEdit(false);
                        });
                    }}><CloseCircleOutlined /></a>
                </Space>)}
        </span>
    );

};