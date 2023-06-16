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
    {
        label: "代理redis访问",
        value: "proxy_redis",
    },
    {
        label: "代理mysql访问",
        value: "proxy_mysql",
    },
    {
        label: "代理mongo访问",
        value: "proxy_mongo",
    }
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

const extraOptionList: CheckboxOptionType[] = [
    {
        label: (
            <Space size="small">
                <span>crossOriginIsolated</span>
                <Popover content={
                    <div style={{ padding: "10px 10px" }}>
                        设置windows.crossOriginIsolated为true
                        <a href="https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated" target="_blank" rel="noreferrer">详细信息</a>。
                    </div>
                }>
                    <InfoCircleOutlined style={{ color: "blue" }} />
                </Popover>
            </Space>
        ),
        value: "cross_origin_isolated",
    },
    {
        label: "打开浏览器",
        value: "open_browser",
    }
];

interface UserAppPermPanelProps {
    perm?: UserAppPerm;
    onChange: (perm: UserAppPerm) => void;
}

const UserAppPermPanel: React.FC<UserAppPermPanelProps> = (props) => {
    const tmpNetValues: string[] = [];
    const tmpFsValues: string[] = [];
    const tmpExtraValues: string[] = [];

    if (props.perm != undefined) {

        if (props.perm.net_perm.cross_domain_http) {
            tmpNetValues.push("cross_domain_http");
        }
        if (props.perm.net_perm.proxy_redis) {
            tmpNetValues.push("proxy_redis");
        }
        if (props.perm.net_perm.proxy_mysql) {
            tmpNetValues.push("proxy_mysql");
        }
        if (props.perm.net_perm.proxy_mongo) {
            tmpNetValues.push("proxy_mongo");
        }

        if (props.perm.fs_perm.read_file) {
            tmpFsValues.push("read_file");
        }
        if (props.perm.fs_perm.write_file) {
            tmpFsValues.push("write_file");
        }
        if (props.perm.extra_perm.cross_origin_isolated) {
            tmpExtraValues.push("cross_origin_isolated");
        }
        if (props.perm.extra_perm.open_browser) {
            tmpExtraValues.push("open_browser");
        }
    }

    const [netValues, setNetValues] = useState<string[]>(tmpNetValues);
    const [fsValues, setFsValues] = useState<string[]>(tmpFsValues);
    const [extraValues, setExtraValues] = useState<string[]>(tmpExtraValues);

    const calcPerm = (netPermList: string[], fsPermList: string[], extraPermList: string[]) => {
        const tempPerm: UserAppPerm = {
            net_perm: {
                cross_domain_http: false,
                proxy_redis: false,
                proxy_mysql: false,
                proxy_mongo: false,
            },
            fs_perm: {
                read_file: false,
                write_file: false,
            },
            extra_perm: {
                cross_origin_isolated: false,
                open_browser: false,
            }
        };
        netPermList.forEach(permStr => {
            if (permStr == "cross_domain_http") {
                tempPerm.net_perm.cross_domain_http = true;
            } else if (permStr == "proxy_redis") {
                tempPerm.net_perm.proxy_redis = true;
            } else if (permStr == "proxy_mysql") {
                tempPerm.net_perm.proxy_mysql = true;
            } else if (permStr == "proxy_mongo") {
                tempPerm.net_perm.proxy_mongo = true;
            }
        });
        fsPermList.forEach(permStr => {
            if (permStr == "read_file") {
                tempPerm.fs_perm.read_file = true;
            } else if (permStr == "write_file") {
                tempPerm.fs_perm.write_file = true;
            }
        })
        extraPermList.forEach(permStr => {
            if (permStr == "cross_origin_isolated") {
                tempPerm.extra_perm.cross_origin_isolated = true;
            } else if (permStr == "open_browser") {
                tempPerm.extra_perm.open_browser = true;
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
                        calcPerm(values as string[], fsValues, extraValues);
                    }} />
            </Form.Item>
            <Form.Item label="本地文件权限">
                <Checkbox.Group options={fsOptionList} value={fsValues}
                    onChange={values => {
                        setFsValues(values as string[]);
                        calcPerm(netValues, values as string[], extraValues);
                    }} />
            </Form.Item>
            <Form.Item label="其他权限">
                <Checkbox.Group options={extraOptionList} value={extraValues}
                    onChange={values => {
                        setExtraValues(values as string[]);
                        calcPerm(netValues, fsValues, values as string[]);
                    }} />
            </Form.Item>
        </Form>
    );
};

export default UserAppPermPanel;