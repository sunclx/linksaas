import { Form, Modal, Input, Popover, Select,message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { QuestionCircleOutlined } from "@ant-design/icons";
import s from './AddRepoModal.module.less';
import { useHistory, useLocation } from "react-router-dom";
import { useStores } from "@/hooks";
import type { RobotInfo } from '@/api/robot';
import { list as list_robot } from '@/api/robot';
import {add_repo} from '@/api/robot_earthly';
import { request } from "@/utils/request";

interface AddRepoModalProps {
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    repoUrl: string | undefined;
    robotIdList: string[] | undefined;
}

const AddRepoModal: React.FC<AddRepoModalProps> = (props) => {
    const [form] = Form.useForm();

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const location = useLocation();
    const history = useHistory();

    const [robotList, setRobotList] = useState<RobotInfo[]>([]);

    const addRepo = async () => {
        const formValue = form.getFieldsValue() as FormValue;
        if(formValue.repoUrl == undefined){
            message.error("请输入仓库地址");
            return;
        }
        if(formValue.robotIdList == undefined){
            formValue.robotIdList = [];
        }
        const res = await request(add_repo({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            basic_info: {
                repo_url:formValue.repoUrl,
            },
            robot_id_list: formValue.robotIdList,
        }));
        if (res){
            props.onOk();
        }
    }

    const loadRobot = async () => {
        const res = await request(list_robot({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            offset: 0,
            limit: 999,
        }));
        if (res) {
            setRobotList(res.robot_list);
        }
    };

    useEffect(() => {
        loadRobot();
    }, [projectStore.curProjectId])

    return (
        <Modal
            title="添加代码仓库"
            open={true}
            onCancel={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addRepo();
            }}>
            <Form
                form={form}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item label={<span>
                    仓库地址&nbsp;&nbsp;
                    <Popover content={<div className={s.tips}>
                        <h4>支持https和ssh格式</h4>
                        比如：
                        <ul>
                            <li>https://jihulab.com/linksaas/desktop</li>
                            <li>https://jihulab.com/linksaas/desktop.git</li>
                            <li>git@jihulab.com:linksaas/desktop.git</li>
                        </ul>
                    </div>}><a><QuestionCircleOutlined /></a></Popover>
                </span>} name="repoUrl" rules={[{
                    // required: true,
                    validator: (_, value: string, callback: (error?: string) => void) => {
                        if (value.startsWith("https://") || value.startsWith("http://")) {
                            return;
                        } else if (value.includes("@") && value.includes(":") && value.endsWith(".git")) {
                            return;
                        }
                        callback("请输入正确的仓库地址");
                    }
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<span>
                    关联服务器代理&nbsp;
                    <Popover content={<div className={s.tips}>
                        你可以去<a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onCancel();
                            const pos = location.pathname.lastIndexOf("/")
                            history.push(location.pathname.substring(0, pos) + "/robot")
                        }}>这里</a>添加服务器代理
                    </div>}>
                        <a><QuestionCircleOutlined /></a>
                    </Popover>
                </span>} name="robotIdList">
                    <Select
                        mode="multiple"
                        placeholder="关联服务器代理"
                        showSearch={false}
                        allowClear
                    >
                        {robotList.map(robot=>(<Select.Option key={robot.robot_id} value={robot.robot_id}>{robot.basic_info.name}</Select.Option>))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default observer(AddRepoModal);