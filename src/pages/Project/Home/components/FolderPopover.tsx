import React from "react";
import type { FolderInfo } from "@/api/project_entry";
import { Descriptions } from "antd";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";


export interface FolderPopoverProps {
    folderInfo: FolderInfo;
}

const FolderPopover = (props: FolderPopoverProps) => {
    return (
        <div style={{ width: "240px" }}>
            <Descriptions column={1} bordered labelStyle={{ width: "90px" }}>
                <Descriptions.Item label="创建用户">
                    <UserPhoto logoUri={props.folderInfo.create_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                    &nbsp;
                    {props.folderInfo.create_display_name}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    {moment(props.folderInfo.create_time).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
                {props.folderInfo.update_user_id != props.folderInfo.create_user_id && (
                    <Descriptions.Item label="更新用户">
                        <UserPhoto logoUri={props.folderInfo.update_logo_uri} style={{ width: "16px", borderRadius: "10px" }} />
                        &nbsp;
                        {props.folderInfo.update_display_name}
                    </Descriptions.Item>
                )}
                {props.folderInfo.update_time != props.folderInfo.create_time && (
                    <Descriptions.Item label="更新时间">
                        {moment(props.folderInfo.update_time).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </div>
    );
};

export default FolderPopover;