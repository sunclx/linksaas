import React, { useState } from "react";
import type { UserAppPerm } from "@/api/user_app";
import { Checkbox, Form, Popover, Space } from "antd";
import type { CheckboxOptionType } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons";


const netOptionList: CheckboxOptionType[] = [
    {
        label: (
            <Space size="small">
                <span>跨域http访问</span>
                <Popover content={
                    <div style={{ padding: "10px 10px" }}>
                        可以调用tauri的http相关接口,查看
                        <a href="https://tauri.app/v1/api/js/http" target="_blank" rel="noreferrer">接口详情</a>。
                    </div>
                }>
                    <InfoCircleOutlined style={{ color: "blue" }} />
                </Popover>
            </Space>
        ),
        value: "cross_domain_http",
    },
];

const fsOptionList: CheckboxOptionType[] = [
    {
        label: "读本地文件",
        value: "read_file",
    },
    {
        label: "写本地文件",
        value: "write_file",
    },
];

interface UserAppPermPanelProps {
    perm?: UserAppPerm;
    onChange: (perm: UserAppPerm) => void;
}

const UserAppPermPanel: React.FC<UserAppPermPanelProps> = (props) => {
    const tmpNetValues: string[] = [];
    const tmpFsValues: string[] = [];

    if (props.perm != undefined) {

        if (props.perm.net_perm.cross_domain_http) {
            tmpNetValues.push("cross_domain_http");
        }

        if (props.perm.fs_perm.read_file) {
            tmpFsValues.push("read_file");
        }
        if (props.perm.fs_perm.write_file) {
            tmpFsValues.push("write_file");
        }
    }

    const [netValues, setNetValues] = useState<string[]>(tmpNetValues);
    const [fsValues, setFsValues] = useState<string[]>(tmpFsValues);

    const calcPerm = (netPermList: string[], fsPermList: string[]) => {
        const tempPerm: UserAppPerm = {
            net_perm: {
                cross_domain_http: false,
            },
            fs_perm: {
                read_file: false,
                write_file: false,
            },
        };
        netPermList.forEach(permStr => {
            if (permStr == "cross_domain_http") {
                tempPerm.net_perm.cross_domain_http = true;
            }
        });
        fsPermList.forEach(permStr => {
            if (permStr == "read_file") {
                tempPerm.fs_perm.read_file = true;
            } else if (permStr == "write_file") {
                tempPerm.fs_perm.write_file = true;
            }
        })
        props.onChange(tempPerm);
    };
    return (
        <Form labelCol={{ span: 5 }}>
                <Form.Item label="网络权限">
                    <Checkbox.Group options={netOptionList} value={netValues}
                        onChange={values => {
                            setNetValues(values as string[]);
                            calcPerm(values as string[],  fsValues);
                        }} />
                </Form.Item>
                <Form.Item label="本地文件权限">
                    <Checkbox.Group  options={fsOptionList} value={fsValues}
                        onChange={values => {
                            setFsValues(values as string[]);
                            calcPerm(netValues, values as string[]);
                        }} />
                </Form.Item>
            </Form>
    );
};

export default UserAppPermPanel;