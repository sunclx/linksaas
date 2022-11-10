import { Modal, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { ParamDef } from '@/api/robot_earthly';
import { get_action, create_action, update_action } from '@/api/robot_earthly';
import { uniqId } from '@/utils/utils';
import Button from "@/components/Button";
import s from './ActionModal.module.less';
import { request } from '@/utils/request';
import { useStores } from "@/hooks";

export enum OPT_TYPE {
    OPT_CREATE = "create",
    OPT_UPDATE = "update",
}

interface ActionModalProps {
    repoId: string;
    actionId?: string;
    optType: OPT_TYPE;
    onCancel: () => void;
    onOk: () => void;
}

type ParamDefEx = ParamDef & {
    id: string;
};

const ActionModal: React.FC<ActionModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [actionName, setActionName] = useState("");
    const [localPath, setLocalPath] = useState("");
    const [target, setTarget] = useState("");
    const [paramDefList, setParamDefList] = useState<ParamDefEx[]>([]);
    const [dataReady, setDataReady] = useState(false);

    const createAction = async () => {
        if (actionName == "") {
            message.error("请输入命令名称");
            return;
        }
        if (target == "") {
            message.error("请指定earthly目标");
            return;
        }
        const res = await request(create_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            basic_info: {
                action_name: actionName,
                local_path: localPath,
                target: target.replace("+", ""),
                param_def_list: paramDefList.filter(item => item.name != "").map(item => {
                    return {
                        name: item.name,
                        desc: item.desc,
                        default_value: item.default_value,
                    };
                }),
            },
        }));
        if (res) {
            props.onOk();
        }
    };

    const updateAction = async () => {
        if (actionName == "") {
            message.error("请输入命令名称");
            return;
        }
        if (target == "") {
            message.error("请指定earthly目标");
            return;
        }
        const res = await request(update_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            action_id: props.actionId ?? "",
            basic_info: {
                action_name: actionName,
                local_path: localPath,
                target: target,
                param_def_list: paramDefList.filter(item => item.name != "").map(item => {
                    return {
                        name: item.name,
                        desc: item.desc,
                        default_value: item.default_value,
                    };
                }),
            },
        }));
        if (res) {
            props.onOk();
        }
    };

    const addParamDef = () => {
        const tmpList = paramDefList.slice();
        tmpList.push({
            id: uniqId(),
            name: "",
            desc: "",
            default_value: "",
        });
        setParamDefList(tmpList);
    };

    const removeParamDef = (id: string) => {
        const tmpList = paramDefList.filter(pd => pd.id != id);
        setParamDefList(tmpList);
    }
    const setParamName = (id: string, value: string) => {
        const tmpList = paramDefList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].name = value;
        }
        setParamDefList(tmpList);
    };

    const setParamDefaultValue = (id: string, value: string) => {
        const tmpList = paramDefList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].default_value = value;
        }
        setParamDefList(tmpList);
    };

    const setParamDesc = (id: string, value: string) => {
        const tmpList = paramDefList.slice();
        const index = tmpList.findIndex(item => item.id == id);
        if (index != -1) {
            tmpList[index].desc = value;
        }
        setParamDefList(tmpList);
    };

    const loadAction = async () => {
        if (props.optType != OPT_TYPE.OPT_UPDATE) {
            setDataReady(true);
            return;
        }
        const res = await request(get_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            action_id: props.actionId ?? "",
        }));
        if (res) {
            setActionName(res.info.basic_info.action_name);
            setLocalPath(res.info.basic_info.local_path);
            setTarget(res.info.basic_info.target);
            setParamDefList(res.info.basic_info.param_def_list.map(item => {
                return {
                    id: uniqId(),
                    name: item.name,
                    desc: item.desc,
                    default_value: item.default_value,
                };
            }));
            setDataReady(true);
        }
    };

    useEffect(() => {
        loadAction();
    }, [props.actionId]);

    return (
        <Modal
            title={props.optType == OPT_TYPE.OPT_CREATE ? "创建命令" : "修改命令"}
            open={true}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (props.optType == OPT_TYPE.OPT_CREATE) {
                    createAction();
                } else if (props.optType == OPT_TYPE.OPT_UPDATE) {
                    updateAction();
                }
            }}>
            {dataReady && (<Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                initialValues={{
                    "action_name": actionName,
                    "local_path": localPath,
                    "target": target,
                }}>
                <Form.Item label="名称" rules={[{ required: true, min: 2 }]} name="action_name">
                    <Input onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setActionName(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="本地路径" name="local_path">
                    <Input onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setLocalPath(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="earthly目标" rules={[{ required: true, min: 2 }]} name="target">
                    <Input onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTarget(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item label="参数定义">
                    <div className={s.btn_wrap}>
                        <Button className={s.btn} type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            addParamDef();
                        }}>增加参数定义</Button>
                    </div>
                    <div>
                        {paramDefList.map(pd => (
                            <div key={pd.id} className={s.param}>
                                <hr />
                                <div className={s.btn_wrap}>
                                    <Button className={s.btn} type="link" onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeParamDef(pd.id);
                                    }}>删除参数定义</Button>
                                </div>
                                <div className={s.param_item}>
                                    <span>参数名:</span><Input value={pd.name} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setParamName(pd.id, e.target.value);
                                    }} />
                                </div>
                                <div className={s.param_item}>
                                    <span>默认值:</span><Input value={pd.default_value} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setParamDefaultValue(pd.id, e.target.value);
                                    }} />
                                </div>
                                <div className={s.param_item}>
                                    <span>参数说明:</span><Input value={pd.desc} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setParamDesc(pd.id, e.target.value);
                                    }} />
                                </div>
                            </div>)
                        )}
                    </div>
                </Form.Item>
            </Form>
            )}
        </Modal>
    );
}

export default observer(ActionModal);