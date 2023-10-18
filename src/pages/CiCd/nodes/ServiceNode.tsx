import React, { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import { observer } from 'mobx-react';
import { useStores } from "../stores";
import { Button, Card, Descriptions, Form, InputNumber, Modal, Progress, Space, message } from "antd";
import { EditText } from "@/components/EditCell/EditText";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Handle, Position } from 'reactflow';
import RunOnParam from "./RunOnParam";
import EnvList from "./EnvList";
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { write_file, get_file_name, set_file_owner, FILE_OWNER_TYPE_PIPE_LINE, type FsProgressEvent, download_file } from "@/api/fs";
import { get_session } from "@/api/user";
import { platform as get_platform } from '@tauri-apps/api/os';
import { exists } from '@tauri-apps/api/fs';
import { pack_docker_compose } from "@/api/project_cicd";
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import { open as shell_open } from '@tauri-apps/api/shell';

interface UploadDirModalProps {
    dirPath: string;
    onCancel: () => void;
    onOk: (fileId: string) => void;
}

const UploadDirModal = (props: UploadDirModalProps) => {
    const store = useStores();

    const [packFile, setPackFile] = useState("");
    const [uploadRatio, setUploadRatio] = useState(0);

    const runUpload = async (traceId: string) => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
        const tmpFile = await pack_docker_compose(props.dirPath, traceId);
        setPackFile("");
        const sessionId = await get_session();
        const upRes = await write_file(sessionId, store.paramStore.fsId, tmpFile, traceId);
        await set_file_owner({
            session_id: sessionId,
            fs_id: store.paramStore.fsId,
            file_id: upRes.file_id,
            owner_type: FILE_OWNER_TYPE_PIPE_LINE,
            owner_id: store.pipeLineStore.pipeLine.pipe_line_id,
        });
        setUploadRatio(100);
        props.onOk(upRes.file_id);
        message.info("上传成功");
    };

    useEffect(() => {
        const traceId = uniqId();
        const unListenFn = listen<string>(traceId, ev => {
            setPackFile(ev.payload);
        });
        const unListenFn2 = listen<FsProgressEvent>("uploadFile_" + traceId, ev => {
            const ratio = ev.payload.total_step <= 0 ? 0 : (ev.payload.cur_step * 100 / ev.payload.total_step);
            setUploadRatio(Math.floor(ratio));
        });
        runUpload(traceId);

        return () => {
            unListenFn.then((unListen) => unListen());
            unListenFn2.then((unListen) => unListen());
        };
    }, []);

    return (
        <Modal open title="上传DockerCompose配置目录" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Descriptions column={1}>
                <Descriptions.Item label="打包文件">
                    {packFile != "" && packFile}
                    {packFile == "" && uploadRatio > 0 && "完成打包"}
                </Descriptions.Item>
                <Descriptions.Item label="上传进度">
                    <Progress percent={uploadRatio} />
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

interface DownloadModalProps {
    fsId: string;
    fileId: string;
    fileName: string;
    onCancel: () => void;
}

const DownloadModal = (props: DownloadModalProps) => {
    const [downRatio, setDownRatio] = useState(0);


    const runDownload = async (trackId: string) => {
        const sessionId = await get_session();
        const res = await download_file(sessionId, props.fsId, props.fileId, trackId);
        if (res.exist_in_local) {
            shell_open(res.local_dir);
        }
        props.onCancel();
    };

    useEffect(() => {
        const trackId = uniqId();
        const unListenFn = listen('downloadFile_' + trackId, (ev) => {
            const payload = ev.payload as FsProgressEvent;
            if (payload.total_step <= 0) {
                payload.total_step = 1;
            }
            setDownRatio(Math.floor(payload.cur_step * 100 / payload.total_step));
        });
        runDownload(trackId);
        return () => {
            unListenFn.then((unListen) => unListen());
        };
    }, []);

    return (
        <Modal open title="下载服务配置" footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Descriptions column={1}>
                <Descriptions.Item label="下载进度">
                    <Progress percent={downRatio} />
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

const ServiceNode = (props: NodeProps) => {
    const store = useStores();

    const [upDirPath, setUpDirPath] = useState("");
    const [showDownload, setShowDownload] = useState(false);

    const uploadFile = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
        const selected = await open_dialog({
            title: "上传docker compose配置文件",
            filters: [{
                name: 'yml',
                extensions: ['yml', 'yaml']
            }]
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        const sessionId = await get_session();
        const upRes = await write_file(sessionId, store.paramStore.fsId, selected, "");
        await set_file_owner({
            session_id: sessionId,
            fs_id: store.paramStore.fsId,
            file_id: upRes.file_id,
            owner_type: FILE_OWNER_TYPE_PIPE_LINE,
            owner_id: store.pipeLineStore.pipeLine.pipe_line_id,
        });

        const fileName = await get_file_name(selected);
        const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
        for (const tmpJob of tmpJobList) {
            if (tmpJob.job_id == props.id) {
                tmpJob.job.ServiceJob!.docker_compose_file_id = upRes.file_id;
                tmpJob.job.ServiceJob!.docker_compose_file_name = fileName;
            }
        }
        store.pipeLineStore.pipeLine = {
            ...(store.pipeLineStore.pipeLine),
            exec_job_list: tmpJobList,
        };
        store.pipeLineStore.hasChange = true;
    };

    const preUploadDir = async () => {
        if (store.pipeLineStore.pipeLine == null) {
            return;
        }
        const selected = await open_dialog({
            title: "上传docker compose目录",
            directory: true,
        });
        if (selected == null || Array.isArray(selected)) {
            return;
        }
        const osName = await get_platform();
        const filePath = osName == "win32" ? `${selected}\\docker-compose.yml` : `${selected}/docker-compose.yml`;
        if (!await exists(filePath)) {
            message.error("目录中不存在docker-compose.yml");
        }
        setUpDirPath(selected);
    };


    return (
        <Card style={{ width: "320px" }} title={
            <EditText editable={store.paramStore.canUpdate} content={store.pipeLineStore.getExecJob(props.id)?.job_name ?? ""}
                onChange={async value => {
                    if (value.trim() == "") {
                        return false;
                    }
                    if (store.pipeLineStore.pipeLine != null) {
                        const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                        for (const tmpJob of tmpJobList) {
                            if (tmpJob.job_id == props.id) {
                                tmpJob.job_name = value.trim();
                            }
                        }
                        store.pipeLineStore.pipeLine = {
                            ...(store.pipeLineStore.pipeLine),
                            exec_job_list: tmpJobList,
                        };
                        store.pipeLineStore.hasChange = true;
                    }
                    return true;
                }} showEditIcon={true} />
        } extra={
            <>
                {store.paramStore.canUpdate && (
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        store.pipeLineStore.removeExecJob(props.id);
                        store.pipeLineStore.hasChange = true;
                        store.pipeLineStore.incInitVersion();
                    }} />
                )}
            </>
        }>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <Form>
                <Form.Item label="服务配置" help={<ul>
                    <li>支持docker-compose.yml文件</li>
                    <li>包含docker-compose.yml的目录</li>
                </ul>}>
                    {store.pipeLineStore.getExecJob(props.id)?.job.ServiceJob?.docker_compose_file_id !== "" && (
                        <Space size="small">
                            {store.pipeLineStore.getExecJob(props.id)?.job.ServiceJob?.docker_compose_file_name ?? ""}
                            <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowDownload(true);
                            }}>查看</Button>
                        </Space>
                    )}
                    {store.paramStore.canUpdate && (
                        <Space size="small">
                            <Button type="link" icon={<UploadOutlined />} style={{ minWidth: 0, padding: "0px 0px" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    uploadFile();
                                }}>上传文件</Button>
                            <Button type="link" icon={<UploadOutlined />} style={{ minWidth: 0, padding: "0px 0px" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    preUploadDir();
                                }}>上传目录</Button>
                        </Space>
                    )}
                </Form.Item>
            </Form>
            <RunOnParam jobId={props.id} />
            <EnvList jobId={props.id} />
            <Form>
                <Form.Item label="运行超时" help="0表示不限制运行时间">
                    <InputNumber controls={false} value={store.pipeLineStore.getExecJob(props.id)?.timeout ?? 300} min={0} max={3600} addonAfter="秒" precision={0} onChange={value => {
                        if (value != null && store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.timeout = value;
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} disabled={!store.paramStore.canUpdate} />
                </Form.Item>
            </Form>
            {upDirPath != "" && (
                <UploadDirModal dirPath={upDirPath} onCancel={() => setUpDirPath("")}
                    onOk={fileId => {
                        if (upDirPath == "") { //上传被取消触发
                            return;
                        }
                        setUpDirPath("");
                        if (store.pipeLineStore.pipeLine != null) {
                            const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                            for (const tmpJob of tmpJobList) {
                                if (tmpJob.job_id == props.id) {
                                    tmpJob.job.ServiceJob!.docker_compose_file_id = fileId;
                                    tmpJob.job.ServiceJob!.docker_compose_file_name = "compose.zip";
                                }
                            }
                            store.pipeLineStore.pipeLine = {
                                ...(store.pipeLineStore.pipeLine),
                                exec_job_list: tmpJobList,
                            };
                            store.pipeLineStore.hasChange = true;
                        }
                    }} />
            )}
            {showDownload == true && (
                <DownloadModal fsId={store.paramStore.fsId} fileId={store.pipeLineStore.getExecJob(props.id)?.job.ServiceJob?.docker_compose_file_id ?? ""}
                    fileName={store.pipeLineStore.getExecJob(props.id)?.job.ServiceJob?.docker_compose_file_name ?? ""} onCancel={() => setShowDownload(false)} />
            )}
        </Card>
    );
};

export default observer(ServiceNode);