import { useStores } from "@/hooks";
import { Button, Checkbox, Form, Modal, Popover, Select, Space, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import type { PipeLine, PipeLinePerm, SimpleCredential } from "@/api/project_cicd";
import {
    PLATFORM_TYPE_LINUX, PLATFORM_TYPE_DARWIN, PLATFORM_TYPE_WINDOWS, list_pipe_line, get_pipe_line, remove_pipe_line,
    update_pipe_line_perm, update_pipe_line_job, update_pipe_line_name, update_pipe_line_plat_form, list_credential, CREDENTIAL_TYPE_KEY
} from "@/api/project_cicd";
import { request } from "@/utils/request";
import type { ColumnsType } from 'antd/lib/table';
import { EditText } from "@/components/EditCell/EditText";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditSelect, type EditSelectItem } from "@/components/EditCell/EditSelect";
import { OpenPipeLineWindow } from "./utils";
import s from "./PipeLinePanel.module.less";
import { watch, unwatch, WATCH_TARGET_CI_CD } from "@/api/project_watch";

interface UpdatePermModalProps {
    type: "update" | "exec";
    pipeLineId: string;
    perm: PipeLinePerm,
    onCancel: () => void;
    onOk: () => void;
}

const UpdatePermModal = (props: UpdatePermModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [forAll, setForAll] = useState(props.type == "update" ? props.perm.update_for_all : props.perm.exec_for_all);
    const [extraUserIdList, setExtraUserIdList] = useState(props.type == "update" ? props.perm.extra_update_user_id_list : props.perm.extra_exec_user_id_list);
    const [hasChange, setHasChange] = useState(false);

    const updatePerm = async () => {
        await request(update_pipe_line_perm({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            pipe_line_id: props.pipeLineId,
            pipe_line_perm: {
                update_for_all: props.type == "update" ? forAll : props.perm.update_for_all,
                extra_update_user_id_list: props.type == "update" ? extraUserIdList : props.perm.extra_update_user_id_list,
                exec_for_all: props.type == "exec" ? forAll : props.perm.exec_for_all,
                extra_exec_user_id_list: props.type == "exec" ? extraUserIdList : props.perm.extra_exec_user_id_list,
            },
        }));
        props.onOk();
    };

    return (
        <Modal open title={`修改${props.type == "update" ? "更新" : "运行"}权限`}
            okText="修改" okButtonProps={{ disabled: !hasChange }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updatePerm();
            }}>
            <Form>
                <Form.Item label="全部成员">
                    <Checkbox checked={forAll} onChange={e => {
                        e.stopPropagation();
                        setForAll(e.target.checked);
                        if (e.target.checked) {
                            setExtraUserIdList([]);
                        }
                        setHasChange(true);
                    }} />
                </Form.Item>
                {forAll == false && (
                    <Form.Item label="指定成员" help="管理员具有全部权限">
                        <Select mode="multiple" value={extraUserIdList} onChange={value => {
                            setExtraUserIdList(value);
                            setHasChange(true);
                        }}>
                            {memberStore.memberList.filter(item => !item.member.can_admin).map(item => (
                                <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                                    <Space>
                                        <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: '8px' }} />
                                        {item.member.display_name}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export interface PipeLinePanelProps {
    filterByWatch: boolean;
    version: number;
}

const PAGE_SIZE = 10;

const PipeLinePanel = (props: PipeLinePanelProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const memberStore = useStores('memberStore');

    const [credList, setCredList] = useState<SimpleCredential[]>([]);

    const [pipeLineList, setPipeLineList] = useState<PipeLine[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [editUpdatePermPipeLine, setEditUpdatePermPipeLine] = useState<PipeLine | null>(null);
    const [editExecPermPipeLine, setEditExecPermPipeLine] = useState<PipeLine | null>(null);

    const [removePipeLineInfo, setRemovePipeLineInfo] = useState<PipeLine | null>(null);


    const loadPipeLineList = async () => {
        const res = await request(list_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            filter_by_watch: props.filterByWatch,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        setPipeLineList(res.pipe_line_list);
        setTotalCount(res.total_count);
    };

    const loadPipeLine = async (pipeLineId: string) => {
        const res = await request(get_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            pipe_line_id: pipeLineId,
            with_update_time: false,
            update_time: 0,
        }));
        const tmpList = pipeLineList.slice();
        const index = tmpList.findIndex(item => item.pipe_line_id == pipeLineId);
        if (index != -1) {
            tmpList[index] = res.pipe_line;
            setPipeLineList(tmpList);
        }
    };

    const unwatchPipeLine = async (pipeLineId: string) => {
        await request(unwatch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_CI_CD,
            target_id: pipeLineId,
        }));
        await loadPipeLine(pipeLineId);
    };

    const watchPipeLine = async (pipeLineId: string) => {
        await request(watch({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            target_type: WATCH_TARGET_CI_CD,
            target_id: pipeLineId,
        }));
        await loadPipeLine(pipeLineId);
    };

    const loadCredList = async () => {
        const res = await request(list_credential({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setCredList(res.credential_list);
    };

    const removePipeLine = async () => {
        if (removePipeLineInfo == null) {
            return;
        }
        await request(remove_pipe_line({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            pipe_line_id: removePipeLineInfo.pipe_line_id,
        }));
        setRemovePipeLineInfo(null);
        await loadPipeLineList();
        message.info("删除成功");
    };

    const columns: ColumnsType<PipeLine> = [
        {
            title: "",
            dataIndex: "my_watch",
            width: 40,
            render: (_, row: PipeLine) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (row.my_watch) {
                        unwatchPipeLine(row.pipe_line_id);
                    } else {
                        watchPipeLine(row.pipe_line_id);
                    }
                }}>
                    <span className={row.my_watch ? s.isCollect : s.noCollect} />
                </a>
            ),
            fixed: true,
        },
        {
            title: "名称",
            width: 200,
            render: (_, row: PipeLine) => (
                <EditText editable={projectStore.isAdmin || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)}
                    content={row.pipe_line_name} showEditIcon={true}
                    onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        try {
                            await request(update_pipe_line_name({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                pipe_line_id: row.pipe_line_id,
                                pipe_line_name: value.trim(),
                            }));
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }}
                    onClick={() => {
                        let canUpdate = false;
                        if (projectStore.isAdmin || row.pipe_line_perm.update_for_all || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)) {
                            canUpdate = true;
                        }
                        let canExec = false;
                        if (projectStore.isAdmin || row.pipe_line_perm.exec_for_all || row.pipe_line_perm.extra_exec_user_id_list.includes(userStore.userInfo.userId)) {
                            canExec = true;
                        }
                        OpenPipeLineWindow(row.pipe_line_name, projectStore.curProjectId, projectStore.curProject?.ci_cd_fs_id ?? "", row.pipe_line_id, canUpdate, canExec);
                    }}
                />
            ),
        },
        {
            title: "运行平台",
            width: 180,
            render: (_, row: PipeLine) => {
                return (
                    <EditSelect editable={projectStore.isAdmin || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)}
                        curValue={row.plat_form} itemList={[
                            {
                                value: PLATFORM_TYPE_LINUX,
                                label: "LINUX",
                                color: "black",
                            },
                            {
                                value: PLATFORM_TYPE_DARWIN,
                                label: "MAC",
                                color: "black",
                            },
                            {
                                value: PLATFORM_TYPE_WINDOWS,
                                label: "WINDOWS",
                                color: "black",
                            },
                        ]}
                        onChange={async value => {
                            try {
                                await request(update_pipe_line_plat_form({
                                    session_id: userStore.sessionId,
                                    project_id: projectStore.curProjectId,
                                    pipe_line_id: row.pipe_line_id,
                                    plat_form_type: value as number,
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                                return false;
                            }
                        }} showEditIcon={true} allowClear={false} width="150px" />
                );
            },
        },
        {
            title: "GIT地址",
            width: 250,
            render: (_, row: PipeLine) => (
                <EditText editable={projectStore.isAdmin || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)}
                    content={row.gitsource_job.git_url} showEditIcon={true}
                    onChange={async value => {
                        if (value.trim() == "") {
                            return false;
                        }
                        try {
                            await request(update_pipe_line_job({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                pipe_line_id: row.pipe_line_id,
                                gitsource_job: { ...row.gitsource_job, git_url: value.trim() },
                                exec_job_list: row.exec_job_list,
                            }));
                            return true;
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                    }}
                />
            ),
        },
        {
            title: "GIT登录凭证",
            width: 180,
            render: (_, row: PipeLine) => {
                const itemList: EditSelectItem[] = [
                    {
                        value: "",
                        label: "无需验证",
                        color: "black",
                    },
                ];
                for (const cred of credList) {
                    itemList.push({
                        value: cred.credential_id,
                        label: `${cred.credential_type == CREDENTIAL_TYPE_KEY ? "SSH密钥" : "密码"} ${cred.credential_name}`,
                        color: "black",
                    });
                }
                return (
                    <EditSelect editable={projectStore.isAdmin || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)}
                        curValue={row.gitsource_job.credential_id} itemList={itemList}
                        onChange={async value => {
                            try {
                                await request(update_pipe_line_job({
                                    session_id: userStore.sessionId,
                                    project_id: projectStore.curProjectId,
                                    pipe_line_id: row.pipe_line_id,
                                    gitsource_job: { ...row.gitsource_job, credential_id: value as string },
                                    exec_job_list: row.exec_job_list,
                                }));
                                return true;
                            } catch (e) {
                                console.log(e);
                                return false;
                            }
                        }} showEditIcon={true} allowClear={false} width="150px" />
                );
            },
        },
        {
            title: "修改权限",
            width: 200,
            render: (_, row: PipeLine) => (
                <>
                    {row.pipe_line_perm.update_for_all && "全体成员可修改"}
                    {row.pipe_line_perm.update_for_all == false && (
                        <div>
                            {row.pipe_line_perm.extra_update_user_id_list.map(userId => memberStore.getMember(userId)).filter(item => item != undefined).map(item => (
                                <Tag key={item!.member.member_user_id ?? ""}>
                                    <Space>
                                        <UserPhoto logoUri={item!.member.logo_uri} style={{ width: "16px", borderRadius: "8px" }} />
                                        {item!.member.display_name}
                                    </Space>
                                </Tag>
                            ))}
                        </div>
                    )}
                    {(projectStore.isAdmin || row.pipe_line_perm.update_for_all || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)) && (
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEditUpdatePermPipeLine(row);
                        }}><EditOutlined /></Button>
                    )}
                </>
            ),
        },
        {
            title: "运行权限",
            width: 200,
            render: (_, row: PipeLine) => (
                <>
                    {row.pipe_line_perm.exec_for_all && "全体成员可运行"}
                    {row.pipe_line_perm.exec_for_all == false && (
                        <div>
                            {row.pipe_line_perm.extra_exec_user_id_list.map(userId => memberStore.getMember(userId)).filter(item => item != undefined).map(item => (
                                <Tag key={item!.member.member_user_id ?? ""}>
                                    <Space>
                                        <UserPhoto logoUri={item!.member.logo_uri} style={{ width: "16px", borderRadius: "8px" }} />
                                        {item!.member.display_name}
                                    </Space>
                                </Tag>
                            ))}
                        </div>
                    )}
                    {(projectStore.isAdmin || row.pipe_line_perm.update_for_all || row.pipe_line_perm.extra_update_user_id_list.includes(userStore.userInfo.userId)) && (
                        <Button type="link" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEditExecPermPipeLine(row);
                        }}><EditOutlined /></Button>
                    )}
                </>
            ),
        },
        {
            title: "关注人",
            dataIndex: "",
            width: 140,
            align: 'left',
            render: (_, row: PipeLine) => (
              <Popover trigger="hover" placement='top' content={
                <div style={{ display: "flex", padding: "10px 10px", maxWidth: "300px", flexWrap: "wrap" }}>
                  {(row.watch_user_list ?? []).map(item => (
                    <Space key={item.member_user_id} style={{margin:"4px 10px"}}>
                      <UserPhoto logoUri={item.logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                      {item.display_name}
                    </Space>
                  ))}
                </div>
              }>
                {(row.watch_user_list ?? []).length == 0 && "-"}
                {(row.watch_user_list ?? []).length > 0 && `${(row.watch_user_list ?? []).length}人`}
              </Popover>
            ),
          },
        {
            title: "操作",
            width: 100,
            render: (_, row: PipeLine) => (
                <Button type="link" danger style={{ minWidth: 0, padding: "0px 0px" }}
                    disabled={projectStore.isClosed || !projectStore.isAdmin}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemovePipeLineInfo(row);
                    }}>删除</Button>
            ),
        },
        {
            title: "创建人",
            dataIndex: "create_display_name",
            width: 100,
        },
        {
            title: "创建时间",
            width: 100,
            render: (_, row: PipeLine) => moment(row.create_time).format("YYYY-MM-DD"),
        },
        {
            title: "更新人",
            dataIndex: "update_display_name",
            width: 100,
        },
        {
            title: "更新时间",
            width: 100,
            render: (_, row: PipeLine) => moment(row.update_time).format("YYYY-MM-DD"),
        },
    ];

    useEffect(() => {
        if (curPage == 0) {
            loadPipeLineList();
        } else {
            setCurPage(0);
        }
    }, [props.version, props.filterByWatch]);

    useEffect(() => {
        if (!(curPage == 0 && props.version == 0)) {
            loadPipeLineList();
        }
    }, [curPage]);

    useEffect(() => {
        loadCredList();
    }, []);

    return (
        <div>
            <Table rowKey="pipe_line_id" dataSource={pipeLineList} columns={columns}
                scroll={{ x: "max-content" }}
                pagination={{
                    current: curPage + 1, total: totalCount, pageSize: PAGE_SIZE, onChange: page => setCurPage(page - 1), hideOnSinglePage: true
                }} />
            {editUpdatePermPipeLine != null && (
                <UpdatePermModal type="update" pipeLineId={editUpdatePermPipeLine.pipe_line_id} perm={editUpdatePermPipeLine.pipe_line_perm}
                    onCancel={() => setEditUpdatePermPipeLine(null)}
                    onOk={() => {
                        loadPipeLine(editUpdatePermPipeLine.pipe_line_id);
                        setEditUpdatePermPipeLine(null);
                    }} />
            )}
            {editExecPermPipeLine != null && (
                <UpdatePermModal type="exec" pipeLineId={editExecPermPipeLine.pipe_line_id} perm={editExecPermPipeLine.pipe_line_perm}
                    onCancel={() => setEditExecPermPipeLine(null)}
                    onOk={() => {
                        loadPipeLine(editExecPermPipeLine.pipe_line_id);
                        setEditExecPermPipeLine(null);
                    }} />
            )}
            {removePipeLineInfo != null && (
                <Modal open title={`删除流水线${removePipeLineInfo.pipe_line_name}`}
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemovePipeLineInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removePipeLine();
                    }}>
                    是否删除流水线&nbsp;{removePipeLineInfo.pipe_line_name}&nbsp;?
                    <div style={{ color: "red" }}>
                        该流水线所有执行结果都会被清除
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PipeLinePanel;