import { Button, Card, Form, Input, List, Modal, Radio, Space, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import type { ExecRunner } from '@/api/project_cicd';
import { list_runner, calc_req_sign, GIT_REF_TYPE_BRANCH, GIT_REF_TYPE_TAG, REQ_ACTION_EXEC } from '@/api/project_cicd';
import { get_session, get_user_id } from '@/api/user';
import { request } from "@/utils/request";
import { useStores } from "./stores";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";
import { start_exec } from "@/api/cicd_runner";

interface ExecParam {
    id: string;
    name: string;
    value: string;
}

export interface RunParamModalProps {
    onClose: () => void;
}

const RunParamModal = (props: RunParamModalProps) => {
    const store = useStores();

    const [paramList, setParamList] = useState<ExecParam[]>([]);
    const [gitRefType, setGitRefType] = useState(GIT_REF_TYPE_BRANCH);
    const [gitRefName, setGitRefName] = useState("");
    const [inRun, setInRun] = useState(false);

    const listRunner = async (): Promise<ExecRunner[]> => {
        const sessionId = await get_session();
        //列出runner
        try {
            const res = await request(list_runner({
                session_id: sessionId,
                project_id: store.paramStore.projectId,
            }));
            if (store.pipeLineStore.pipeLine == null) {
                return [];
            }
            return res.runner_list.filter(item => item.online).filter(item => item.plat_form_type == store.pipeLineStore.pipeLine!.plat_form);
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    const runByRunner = async (runner: ExecRunner): Promise<string> => {
        const sessionId = await get_session();
        try {
            //获取服务器时间
            const signRes = await request(calc_req_sign({
                session_id: sessionId,
                project_id: store.paramStore.projectId,
                req_action: REQ_ACTION_EXEC,
            }));
            const userId = await get_user_id();
            //调用执行
            const res = await request(start_exec(runner.serv_addr, {
                project_id: store.paramStore.projectId,
                pipe_line_id: store.pipeLineStore.pipeLine?.pipe_line_id ?? "",
                pipe_line_time: store.pipeLineStore.pipeLine?.update_time ?? 0,
                param_list: paramList.filter(item => item.name != "").map(item => {
                    return {
                        name: item.name,
                        value: item.value,
                    };
                }),
                git_ref_type: gitRefType,
                git_ref_name: gitRefName,
                exec_user_id: userId,
                random_str: signRes.random_str,
                time_stamp: signRes.time_stamp,
                sign: signRes.sign,
            }));
            return res.exec_id;
        } catch (e) {
            console.log(e);
            return "";
        } 
    }

    const runPipeLine = async () => {
        setInRun(true);
        const runnerList = await listRunner();
        if (runnerList.length == 0) {
            message.error("没有对应平台的运行代理");
            setInRun(false);
            return;
        }
        let execId = "";
        for (const runner of runnerList) {
            execId = await runByRunner(runner);
            if (execId != "") {
                break;
            }
        }
        console.log("execId:", execId);
        if (execId == "") {
            message.error("运行代理繁忙");
            setInRun(false);
            return;
        }
        setInRun(false);
        props.onClose();
        //TODO 加载执行信息
    }

    return (
        <Modal open title="运行流水线"
            okText="运行" okButtonProps={{ disabled: gitRefName == "" || inRun }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                runPipeLine();
            }}>
            <Form labelCol={{ span: 4 }}>
                <Form.Item label="Git引用类型">
                    <Radio.Group value={gitRefType} onChange={e => {
                        e.stopPropagation();
                        setGitRefType(e.target.value);
                    }}>
                        <Radio value={GIT_REF_TYPE_BRANCH}>分支(Branch)</Radio>
                        <Radio value={GIT_REF_TYPE_TAG}>标记(Tag)</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Git引用名称" help="对应的分支或标记名称">
                    <Input value={gitRefName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGitRefName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="执行参数">
                    <Card bordered={false} extra={
                        <Button type="text" icon={<PlusOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            const tmpList = paramList.slice();
                            tmpList.push({
                                id: uniqId(),
                                name: "",
                                value: "",
                            });
                            setParamList(tmpList);
                        }} disabled={!store.paramStore.canUpdate} />
                    }>
                        <List rowKey="id" dataSource={paramList}
                            renderItem={item => (
                                <List.Item extra={
                                    <Button type="text" danger icon={<DeleteOutlined />}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const tmpList = paramList.filter(tmpItem => tmpItem.id != item.id);
                                            setParamList(tmpList);
                                        }} />
                                }>
                                    <Space size="small">
                                        <Input style={{ width: "100px" }} value={item.name} onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const tmpList = paramList.slice();
                                            const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                            if (index != -1) {
                                                tmpList[index].name = e.target.value.trim();
                                                setParamList(tmpList);
                                            }
                                        }} />
                                        =
                                        <Input style={{ width: "200px" }} value={item.value} onChange={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const tmpList = paramList.slice();
                                            const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                            if (index != -1) {
                                                tmpList[index].value = e.target.value.trim();
                                                setParamList(tmpList);
                                            }
                                        }} />
                                    </Space>
                                </List.Item>
                            )} />
                    </Card>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(RunParamModal);