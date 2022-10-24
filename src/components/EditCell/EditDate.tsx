import React, { useState } from "react";
import moment from 'moment';
import { EditOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";

export interface EditDateProps {
    editable: boolean;
    hasTimeStamp: boolean;
    timeStamp: number;
    onChange: (t: number) => Promise<boolean>;
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
                <span style={{cursor: props.editable ? "pointer" : "default"}}>{hasTimeStamp ? moment(timeStamp).format("YYYY-MM-DD") : "-"}
                    {props.editable && props.showEditIcon &&
                        <a><EditOutlined /></a>
                    }
                </span>
            )}
            {inEdit && <DatePicker
                autoFocus
                open={true}
                value={hasTimeStamp ? moment(timeStamp) : moment()}
                onBlur={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setInEdit(false);
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
                    })
                }}
            />}
        </span>
    );

};