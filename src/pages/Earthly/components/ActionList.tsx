import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { RobotInfo as RepoRobotInfo, ActionInfo } from '@/api/robot_earthly';
import { list_action, remove_action, link_robot, unlink_robot } from '@/api/robot_earthly';
import { Card, Modal, Table, Tooltip } from "antd";
import { useStores } from "@/hooks";
import Button from "@/components/Button";
import addIcon from '@/assets/image/addIcon.png';
import s from './ActionList.module.less';
import ActionModal from "./ActionModal";
import { OPT_TYPE } from "./ActionModal";
import { request } from '@/utils/request';
import type { ColumnsType } from 'antd/es/table';
import { LinkEarthlyActionInfo } from "@/stores/linkAux";
import { useHistory } from "react-router-dom";
import EditRobotList from "./EditRobotList";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { LinkOutlined } from "@ant-design/icons";


interface ActionListProps {
    repoId: string;
    repoUrl: string;
    robotList: RepoRobotInfo[];
}

const sshAuthStr = `auth_type: ssh
key_path: your_private_ssh_key_path`;

const passwordAuthStr = `auth_type: password
username: your_git_username
password: your_git_password`;

const ActionList: React.FC<ActionListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [actionList, setActionList] = useState<ActionInfo[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [removeActionId, setRemoveActionId] = useState("");
    const [updateActionId, setUpdateActionId] = useState("");

    const getRepoDomain = () => {
        if (props.repoUrl.includes("@") && props.repoUrl.includes(":")) {
            const pos1 = props.repoUrl.indexOf("@");
            const pos2 = props.repoUrl.indexOf(":");
            return props.repoUrl.substring(pos1 + 1, pos2);
        } else if (props.repoUrl.startsWith("https://")) {
            const pos = props.repoUrl.indexOf("/", 8);
            if (pos == -1) {
                return "";
            }
            return props.repoUrl.substring(8, pos);
        } else if (props.repoUrl.startsWith("http://")) {
            const pos = props.repoUrl.indexOf("/", 7);
            if (pos == -1) {
                return "";
            }
            return props.repoUrl.substring(7, pos);
        }
        return "";
    };

    const repoDomain = getRepoDomain();


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
            width: 100,
            dataIndex: ["basic_info", "action_name"],
            render: (_, record: ActionInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkEarthlyActionInfo("", projectStore.curProjectId, props.repoId, record.action_id), history);
                }}><LinkOutlined />&nbsp;{record.basic_info.action_name}</a>
            ),
        },
        {
            title: "本地路径",
            width: 100,
            dataIndex: ["basic_info", "local_path"],
        },
        {
            title: "earthly目标",
            width: 100,
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
            title: "执行记录",
            width: 60,
            render: (_, record: ActionInfo) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToLink(new LinkEarthlyActionInfo("", projectStore.curProjectId, props.repoId, record.action_id), history);
                }}>{record.exec_count}</a>
            ),
        },
        {
            title: "操作",
            width: 200,
            render: (_, record: ActionInfo) => (
                <div>
                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }} onClick={e => {
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
        <div>
            <div className={s.info}>
                <div className={s.info_label}>关联服务器代理列表：</div>
                <EditRobotList
                    editable={projectStore.isAdmin}
                    robotInfoList={props.robotList}
                    showEditIcon={true}
                    onAddRobot={async (robotId: string) => {
                        try {
                            const res = await link_robot({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                repo_id: props.repoId,
                                robot_id: robotId,
                            });
                            return res.code == 0;
                        } catch (_) {
                            return false;
                        }
                    }}
                    onRemoveRobot={async (robotId: string) => {
                        try {
                            const res = await unlink_robot({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                repo_id: props.repoId,
                                robot_id: robotId,
                            });
                            return res.code == 0;
                        } catch (_) {
                            return false;
                        }
                    }} />
            </div>
            <div className={s.info}>
                <div className={s.info_label}>仓库验证方式：</div>
                <div>你可以配置/etc/linksaas/auth/{repoDomain}.yaml 。 目前支持
                    <Tooltip
                        color="white"
                        style={{ width: "200px" }}
                        title={<div>
                            <CodeEditor
                                value={sshAuthStr}
                                language="yaml"
                                disabled
                                style={{
                                    fontSize: 14,
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        </div>}><a>&nbsp;SSH&nbsp;</a></Tooltip>
                    和
                    <Tooltip
                        color="white"
                        style={{ width: "200px" }}
                        title={<div>
                            <CodeEditor
                                value={passwordAuthStr}
                                language="yaml"
                                disabled
                                style={{
                                    fontSize: 14,
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        </div>}><a>&nbsp;密码&nbsp;</a></Tooltip>
                    两种git验证模式</div>
            </div>
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
                <Table rowKey="action_id" dataSource={actionList} columns={columns} pagination={false}/>
            </Card>
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
        </div>
    );
};

export default observer(ActionList);