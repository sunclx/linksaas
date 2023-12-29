import React, { useState } from "react";
import { Input } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";


export interface EditTextProps {
    editable: boolean;
    content: string;
    onChange: (content: string) => Promise<boolean>;
    showEditIcon: boolean;
    textDecoration?: string;
    width?: string;
    onClick?: () => void;
}

export const EditText: React.FC<EditTextProps> = (props) => {
    const [inEdit, setInEdit] = useState(false);
    const [content, setContent] = useState(props.content);

    return (
        <span onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (props.editable) {
                setInEdit(true);
            }
        }} style={{ width: props.width ?? "auto" }}>
            {!inEdit && (
                <span title={content} style={{ cursor: props.editable ? "pointer" : "default", textDecorationLine: props.textDecoration ?? "none" }}>
                    {content == "" ? "-" : <>
                        {props.onClick === undefined && content}
                        {props.onClick !== undefined && (
                            <a onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onClick!();
                            }}>{content}</a>
                        )}
                    </>}
                    {props.editable && props.showEditIcon &&
                        <a style={{ marginLeft: "12px" }}><EditOutlined /></a>
                    }
                </span>)}
            {inEdit && (
                <Input value={content}
                    autoFocus={true}
                    style={{ width: props.width ?? "calc(100% - 50px)" }} suffix={<>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setContent(props.content);
                            setInEdit(false);
                        }}><CloseOutlined /></a>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onChange(content).then(res => {
                                if (!res) {
                                    setContent(props.content);
                                }
                                setInEdit(false);
                            })
                        }}><CheckOutlined /></a>
                    </>}
                    onBlurCapture={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (content == props.content) {
                            setInEdit(false);
                        }
                    }}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setContent(e.target.value);
                    }} onKeyDown={e => {
                        if (e.key == "Escape") {
                            e.stopPropagation();
                            e.preventDefault();
                            setContent(props.content);
                            setInEdit(false);
                        } else if (e.key == "Enter") {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onChange(content).then(res => {
                                if (!res) {
                                    setContent(props.content);
                                }
                                setInEdit(false);
                            })
                        }
                    }} />
            )}
        </span>
    )
};