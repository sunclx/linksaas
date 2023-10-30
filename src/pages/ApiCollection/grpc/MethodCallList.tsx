import React, { useEffect, useState } from "react";
import type { MethodWithServiceInfo } from "./types";
import type { Tab } from "rc-tabs/lib/interface";
import { Tabs } from "antd";
import { ApiOutlined } from "@ant-design/icons";
import MethodCall from "./MethodCall";
import CommentEntry from "@/components/CommentEntry";
import { COMMENT_TARGET_API_COLL } from "@/api/project_comment";


export interface MethodCallListProps {
    projectId: string;
    userId: string;
    apiCollId: string;
    canAdmin: boolean;
    remoteAddr: string;
    secure: boolean;
    protoPath: string;
    curMethodList: MethodWithServiceInfo[];
    onClose: (method: MethodWithServiceInfo) => void;
}

const MethodCallList = (props: MethodCallListProps) => {
    const [tabList, setTabList] = useState<Tab[]>([]);

    const getSvcName = (name: string) => {
        const parts = name.split(".");
        if (parts.length == 2) {
            return parts[1];
        }
        return name;
    }

    const adjustTabList = () => {
        const newKeyList = props.curMethodList.map(item => `${item.serviceName}.${item.method.methodName}`);
        //关闭tab
        const tmpList = tabList.filter(item => newKeyList.includes(item.key));
        //新增tab
        const oldKeyList = tmpList.map(item => item.key);
        for (const method of props.curMethodList) {
            const key = `${method.serviceName}.${method.method.methodName}`;
            if (oldKeyList.includes(key)) {
                continue;
            }
            tmpList.push({
                key: key,
                label: <span title={key}><ApiOutlined />{getSvcName(method.serviceName)}:{method.method.methodName}</span>,
                children: <MethodCall protoPath={props.protoPath} remoteAddr={props.remoteAddr} secure={props.secure} method={method} />,
            });
        }
        setTabList(tmpList);
    };

    useEffect(() => {
        adjustTabList();
    }, [props.curMethodList]);

    return (
        <Tabs type="editable-card" tabBarStyle={{ margin: "0px 0px" }}
            items={tabList} hideAdd onEdit={(targetKey, action) => {
                if (action == "remove") {
                    const method = props.curMethodList.find(item => targetKey == `${item.serviceName}.${item.method.methodName}`);
                    if (method !== undefined) {
                        props.onClose(method);
                    }
                }
            }} tabBarExtraContent={
                <div style={{ marginRight: "20px" }}>
                    <CommentEntry projectId={props.projectId} targetType={COMMENT_TARGET_API_COLL}
                        targetId={props.apiCollId} myUserId={props.userId} myAdmin={props.canAdmin} />
                </div>
            } />
    );
};

export default MethodCallList;