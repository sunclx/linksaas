import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { RobotInfo as RepoRobotInfo, ActionInfo } from '@/api/robot_earthly';
import { list_action, remove_action } from '@/api/robot_earthly';
import { Card, Modal, Table } from "antd";
import { useStores } from "@/hooks";
import Button from "@/components/Button";
import addIcon from '@/assets/image/addIcon.png';
import s from './ActionList.module.less';
import ActionModal from "./ActionModal";
import { OPT_TYPE } from "./ActionModal";
import { request } from '@/utils/request';
import type { ColumnsType } from 'antd/es/table';
import ExecModal from "./ExecModal";
import { LinkEarthlyExecInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";


interface ActionListProps {
    repoId: string;
    robotList: RepoRobotInfo[];
}

const ActionList: React.FC<ActionListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [actionList, setActionList] = useState<ActionInfo[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [removeActionId, setRemoveActionId] = useState("");
    const [updateActionId, setUpdateActionId] = useState("");
    const [execActionId, setExecActionId] = useState("");

    const loadAction = async () => {
        const res = await request(list_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
        }));
        if (res) {
            setActionList(res.info_list);
        }
    };

    const getActionName = (actionId: string) => {
        const index = actionList.findIndex(item => item.action_id == actionId);
        if (index != -1) {
            return actionList[index].basic_info.action_name;
        }
        return "";
    };

    const getActionInfo = (actionId: string) => {
        const index = actionList.findIndex(item => item.action_id == actionId);
        if (index != -1) {
            return actionList[index];
        }
        return null;
    }

    const removeAction = async () => {
        const res = await request(remove_action({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            action_id: removeActionId,
        }));
        if (res) {
            setRemoveActionId("");
            loadAction();
        }
    };

    const columns: ColumnsType<ActionInfo> = [
        {
            title: "命令名称",
            dataIndex: ["basic_info", "action_name"],
        },
        {
            title: "本地路径",
            dataIndex: ["basic_info", "local_path"],
        },
        {
            title: "earthly目标",
            dataIndex: ["basic_info", "target"],
        },
        {
            title: "参数定义",
            width: 250,
            render: (_, record: ActionInfo) => (
                <div>
                    {record.basic_info.param_def_list.map((pd, index) => (
                        <div key={index}>
                            {index > 0 && <hr />}
                            <div>参数名：{pd.name}</div>
                            <div>默认值：{pd.default_value}</div>
                            <div>参数说明: {pd.desc}</div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "操作",
            width: 300,
            render: (_, record: ActionInfo) => (
                <div>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setExecActionId(record.action_id);
                    }}>执行</Button>
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpdateActionId(record.action_id);
                    }}>修改</Button>
                    <Button type="link" danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveActionId(record.action_id);
                    }}>删除</Button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        loadAction();
    }, [projectStore.curProjectId]);
    return (
        <Card title="命令列表" extra={
            <Button
                icon={<img src={addIcon} alt="" />}
                disabled={((projectStore.isAdmin == false) || (projectStore.curProject?.closed))}
                onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowCreateModal(true);
                }}>
                添加命令
            </Button>
        }>
            <div>
                <div className={s.info}>
                    <div className={s.info_label}>关联机器人列表</div>
                    <div>1111</div>
                </div>
                <div className={s.info}>
                    <div className={s.info_label}>仓库验证方式</div>
                    <div>1111</div>
                </div>
                <Table rowKey="action_id" dataSource={actionList} columns={columns} pagination={false} />
            </div>
            {showCreateModal && <ActionModal repoId={props.repoId} optType={OPT_TYPE.OPT_CREATE} onCancel={() => setShowCreateModal(false)} onOk={() => {
                loadAction();
                setShowCreateModal(false);
            }} />}
            {updateActionId != "" && <ActionModal repoId={props.repoId} optType={OPT_TYPE.OPT_UPDATE} actionId={updateActionId} onCancel={() => setUpdateActionId("")} onOk={() => {
                loadAction();
                setUpdateActionId("");
            }} />}
            {removeActionId != "" && (
                <Modal
                    title={`删除命令 ${getActionName(removeActionId)}`}
                    open={true}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveActionId("");
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeAction();
                    }}>
                    是否删除命令 {getActionName(removeActionId)}?
                </Modal>
            )}
            {execActionId != "" && <ExecModal
                repoId={props.repoId}
                actionInfo={getActionInfo(execActionId)!}
                onCancel={() => setExecActionId("")}
                onOk={(execId: string) => {
                    linkAuxStore.goToLink(new LinkEarthlyExecInfo("", projectStore.curProjectId, props.repoId, execActionId, execId), history);
                    setExecActionId("");
                }} />}
        </Card>
    );
};

export default observer(ActionList);