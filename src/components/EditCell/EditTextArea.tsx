import React, { useState } from "react";
import { Input, Space } from 'antd'
import { EditOutlined } from "@ant-design/icons";
import Button from "../Button";


export interface EditTextAreaProps {
    editable: boolean;
    content: string;
    onChange: (content: string) => Promise<boolean>;
    showEditIcon: boolean;
}

export const EditTextArea: React.FC<EditTextAreaProps> = (props) => {
    const [inEdit, setInEdit] = useState(false);
    const [content, setContent] = useState(props.content);


    return (
        <span onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (props.editable) {
                setInEdit(true);
            }
        }}>
            {!inEdit && (
                <pre title={content} style={{ cursor: props.editable ? "pointer" : "default" }}><code>{content == "" ? "-" : content}</code>
                    {props.editable && props.showEditIcon &&
                        <a><EditOutlined /></a>
                    }
                </pre>)}
            {inEdit && (
                <div style={{ position: "relative", paddingBottom: "30px" }}>
                    <Input.TextArea value={content}
                        autoFocus={true}
                        style={{ width: "calc(100% - 50px)" }}
                        rows={4}
                        onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setContent(e.target.value);
                        }} />
                    <div style={{ position: "absolute", right: "50px", marginTop: "10px" }}>
                        <Space>
                            <Button type="default" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setContent(props.content);
                                setInEdit(false);
                            }}>取消</Button>
                            <Button onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onChange(content).then(res => {
                                    if (!res) {
                                        setContent(props.content);
                                    }
                                    setInEdit(false);
                                })
                            }}>保存</Button>
                        </Space>
                    </div>
                </div>
            )}
        </span>
    )
};