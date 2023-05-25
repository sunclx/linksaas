import React, { useEffect, useState } from "react";
import type { TagInfo } from "@/api/project";
import { Button, Select, Space } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

export interface EditTagProps {
    editable: boolean;
    tagIdList: string[];
    tagDefList: TagInfo[];
    onChange: (tagIdList: string[]) => void;
}

export const EditTag: React.FC<EditTagProps> = (props) => {
    const [inEdit, setInEdit] = useState(false);
    const [tagIdList, setTagIdList] = useState(props.tagIdList);

    useEffect(() => {
        setTagIdList(props.tagIdList);
    }, [props.tagIdList]);

    return (
        <>
            {inEdit == true && (
                <div>
                    <Select mode="multiple" value={tagIdList} style={{ width: "100%" }}
                        onChange={value => setTagIdList(value)} placement="topLeft">
                        {props.tagDefList.map(tagDef => (
                            <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                                <span style={{ padding: "2px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
                            </Select.Option>
                        ))}
                    </Select>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                        <Space>
                            <Button icon={<CloseOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setTagIdList(props.tagIdList);
                                setInEdit(false);
                            }}>取消</Button>
                            <Button type="primary" icon={<CheckOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onChange(tagIdList);
                                console.log(tagIdList, props.tagDefList);
                                setInEdit(false);
                            }}>更新</Button>
                        </Space>
                    </div>
                </div>
            )}
            {inEdit == false && (
                <div style={{ display: "flex" }}>
                    {tagIdList.length == 0 && "-"}
                    {props.tagDefList.filter(tagDef => tagIdList.includes(tagDef.tag_id)).map(tagDef => (
                        <span style={{ padding: "2px 4px", marginRight:"4px", backgroundColor: tagDef.bg_color }} key={tagDef.tag_id}>{tagDef.tag_name}</span>
                    ))}
                    {props.editable == true && (
                        <a style={{ marginLeft: "10px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setInEdit(true);
                        }}><EditOutlined /></a>
                    )}
                </div>
            )}
        </>
    );
}