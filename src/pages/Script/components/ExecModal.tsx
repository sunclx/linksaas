import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal, Form, Input, Tooltip, Select, message } from "antd";
import type { ExecParamDef, EnvParam } from '@/api/robot_script';
import { get_last_exec_param, exec_script_suit } from '@/api/robot_script';
import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import type { RobotInfo } from '@/api/robot';
import { list as list_robot } from '@/api/robot';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { LinkScriptExecInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";

interface ExecModalProps {
    scriptSuiteId: string;
    scriptSuiteName: string;
    execParamDef: ExecParamDef;
    onCancel: () => void;
}

const ExecModal: React.FC<ExecModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();
    const [form] = Form.useForm();

    const initValues = {};
    for (const envDef of props.execParamDef.env_param_def_list) {
        initValues[`env_${envDef.env_name}`] = envDef.default_value;
    }
    props.execParamDef.arg_param_def_list.forEach((item, index) => {
        initValues[`arg_${index}`] = item.default_value;
    });

    const [robotList, setRobotList] = useState<RobotInfo[] | null>(null);
    const [updateLastParam, setUpdateLastParam] = useState(false);

    const loadRobotList = async () => {
        const res = await request(list_robot({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: 0,
            limit: 999,
        }));
        const tmpList = res.robot_list.filter(item => item.robot_cap.deno_script);
        setRobotList(tmpList);
    };

    const loadLastParam = async () => {
        try {
            const res = await get_last_exec_param({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                script_suite_id: props.scriptSuiteId,
            });
            if (res.code == 0) {
                for (const envParam of res.exec_param.env_param_list) {
                    const key = `env_${envParam.env_name}`
                    if (initValues[key] != undefined) {
                        initValues[key] = envParam.env_value;
                    }
                }
                res.exec_param.arg_param_list.forEach((item, index) => {
                    const key = `arg_${index}`;
                    if (initValues[key] != undefined) {
                        initValues[key] = item;
                    }
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setUpdateLastParam(true);
        }
    };

    const execScript = async () => {
        const values: any = form.getFieldsValue();
        const envParamList: EnvParam[] = [];
        const argParamList: string[] = [];
        for (const envDef of props.execParamDef.env_param_def_list) {
            const key = `env_${envDef.env_name}`
            if (values[key] != undefined) {
                envParamList.push({
                    env_name: envDef.env_name,
                    env_value: values[key],
                });
            }
        }
        props.execParamDef.arg_param_def_list.forEach((item, index) => {
            const key = `arg_${index}`;
            if (values[key] == undefined) {
                message.error(`参数${index + 1}缺少，参数描述${item.desc}`);
                return;
            } else {
                argParamList.push(values[key]);
            }
        });
        if (values["robotId"] == undefined){
            message.error("未选择执行服务器");
            return;
        }
        const res = await request(exec_script_suit({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: props.scriptSuiteId,
            exec_param: {
                env_param_list: envParamList,
                arg_param_list: argParamList,
            },
            robot_id: values["robotId"],
        }));
        linkAuxStore.goToLink(new LinkScriptExecInfo("", projectStore.curProjectId, props.scriptSuiteId, res.exec_id), history);
    }

    useEffect(() => {
        loadRobotList();
        loadLastParam();
    }, []);

    return (
        <Modal open title={`执行服务端脚本 ${props.scriptSuiteName}`}
            okButtonProps={{
                disabled: robotList == null || robotList.length == 0,
            }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                execScript();
            }}>
            {updateLastParam == true && (
                <Form form={form} labelCol={{ span: 8 }} initialValues={initValues}>
                    {props.execParamDef.env_param_def_list.map((item, index) => (
                        <Form.Item key={`env${index}`}
                            label={
                                <span>
                                    {`环境变量 ${item.env_name}`}
                                    &nbsp;&nbsp;
                                    <Tooltip title={item.desc}>
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                </span>}
                            name={`env_${item.env_name}`} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    ))}
                    {props.execParamDef.arg_param_def_list.map((item, index) => (
                        <Form.Item key={`arg${index}`}
                            label={
                                <span>
                                    {`args${index + 1}`}
                                    &nbsp;&nbsp;
                                    <Tooltip title={item.desc}>
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                </span>} name={`arg_${index}`} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    ))}
                    {robotList != null && (
                        <Form.Item label={
                            <span>
                                服务器
                                &nbsp;&nbsp;
                                {robotList.length == 0 && (
                                    <Tooltip title="没有可用的服务器">
                                        <WarningOutlined style={{ color: "red" }} />
                                    </Tooltip>
                                )}
                            </span>
                        } name="robotId" rules={[{ required: true }]}>
                            <Select>
                                {robotList.map(item => (
                                    <Select.Option key={item.robot_id} value={item.robot_id}>{item.basic_info.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            )}

        </Modal>
    );
};

export default observer(ExecModal);