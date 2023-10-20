import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Descriptions, List, Modal, Progress, message } from "antd";
import { REQ_ACTION_READ, calc_req_sign } from "@/api/project_cicd";
import type { FsEntry } from "@/api/cicd_runner";
import { list_result_fs, stat_result_file, get_result_file } from "@/api/cicd_runner";
import { get_session } from "@/api/user";
import { useStores } from "./stores";
import { request } from "@/utils/request";
import fileIcon from '@/assets/flow/file.png';
import folderIcon from '@/assets/flow/folder.png';
import { uniqId } from "@/utils/utils";
import { listen } from '@tauri-apps/api/event';
import { open as open_shell } from '@tauri-apps/api/shell';

interface DownloadModalProps {
    projectId: string;
    pipeLineId: string;
    execId: string;
    filePath: string;
    runnerAddr: string;
    onClose: () => void;
}

const DownloadModal = (props: DownloadModalProps) => {
    const [fileSize, setFileSize] = useState(-1);
    const [traceId, setTraceId] = useState("");
    const [downloadRatio, setDownloadRatio] = useState(0);

    const loadFileSize = async () => {
        const sessionId = await get_session();
        const signRes = await request(calc_req_sign({
            session_id: sessionId,
            project_id: props.projectId,
            req_action: REQ_ACTION_READ,
        }));

        const res = await request(stat_result_file(props.runnerAddr, {
            project_id: props.projectId,
            pipe_line_id: props.pipeLineId,
            exec_id: props.execId,
            full_path: props.filePath,
            random_str: signRes.random_str,
            time_stamp: signRes.time_stamp,
            sign: signRes.sign,
        }));
        setFileSize(res.file_size);
    };

    const getFileSizeStr = (): string => {
        if (fileSize < 0) {
            return "";
        } else if (fileSize == 0) {
            return "0B"
        }
        let tmpSize = fileSize;
        if (tmpSize < 1024) {
            return `${tmpSize}B`
        }
        tmpSize = tmpSize / 1024;
        if (tmpSize < 1024) {
            return `${tmpSize.toFixed(1)}K`;
        }
        tmpSize = tmpSize / 1024;
        if (tmpSize < 1024) {
            return `${tmpSize.toFixed(1)}M`;
        }
        tmpSize = tmpSize / 1024;
        return `${tmpSize.toFixed(1)}G`;
    };

    const runDownload = async () => {
        const sessionId = await get_session();
        const signRes = await request(calc_req_sign({
            session_id: sessionId,
            project_id: props.projectId,
            req_action: REQ_ACTION_READ,
        }));

        const res = await get_result_file(props.runnerAddr, traceId, {
            project_id: props.projectId,
            pipe_line_id: props.pipeLineId,
            exec_id: props.execId,
            full_path: props.filePath,
            random_str: signRes.random_str,
            time_stamp: signRes.time_stamp,
            sign: signRes.sign,
        });
        if (res.exist_in_local) {
            open_shell(res.local_dir);
            message.info("下载成功");
            props.onClose();
        } else {
            message.warn("下载失败");
            setDownloadRatio(0);
        }
    };

    useEffect(() => {
        loadFileSize();
        const tmpTraceId = uniqId();
        setTraceId(tmpTraceId);
        const unListenFn = listen<number>(tmpTraceId, (ev) => {
            if (fileSize > 0) {
                const ratio = ev.payload * 100 / fileSize;
                setDownloadRatio(Math.round(ratio));
            }
        });
        return () => { unListenFn.then((unListen) => unListen()); };
    }, []);

    return (
        <Modal open title="下载文件"
            okText="下载" okButtonProps={{ disabled: fileSize <= 0 || downloadRatio > 0 }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                runDownload();
            }}>
            <Descriptions bordered column={1} labelStyle={{ width: "100px" }}>
                <Descriptions.Item label="文件路径">
                    {props.filePath}
                </Descriptions.Item>
                <Descriptions.Item label="文件大小">
                    {getFileSizeStr()}
                </Descriptions.Item>
                {downloadRatio > 0 && (
                    <Descriptions.Item label="下载进度">
                        <Progress percent={downloadRatio} showInfo={false} />
                    </Descriptions.Item>

                )}
            </Descriptions>
        </Modal>
    );
};

const ResultFolder = () => {
    const store = useStores();

    const [curDir, setCurDir] = useState("/");
    const [entryList, setEntryList] = useState<FsEntry[]>([]);
    const [downloadFile, setDownloadFile] = useState("");

    const readFolder = async () => {
        if (store.resultStore.execResult == null) {
            return;
        }
        const servAddr = store.resultStore.execResult.runner_serv_addr;
        const pipeLineId = store.resultStore.execResult.pipe_line_id;
        const execId = store.resultStore.execResult.exec_id;

        const sessionId = await get_session();
        const signRes = await request(calc_req_sign({
            session_id: sessionId,
            project_id: store.paramStore.projectId,
            req_action: REQ_ACTION_READ,
        }));

        const res = await request(list_result_fs(servAddr, {
            project_id: store.paramStore.projectId,
            pipe_line_id: pipeLineId,
            exec_id: execId,
            dir_path: curDir,
            random_str: signRes.random_str,
            time_stamp: signRes.time_stamp,
            sign: signRes.sign,
        }));
        if (curDir != "/") {
            const pos = curDir.lastIndexOf("/")
            if (pos != -1) {
                res.entry_list.unshift({
                    name: "..",
                    dir: true,
                    full_path: pos == 0 ? "/" : curDir.substring(0, pos),
                });
            }
        }
        setEntryList(res.entry_list);
    };

    useEffect(() => {
        readFolder();
    }, [curDir]);
    return (
        <Card title={`结果目录(${curDir})`} bordered={false}>
            <List rowKey="full_path" grid={{ gutter: 16 }}

                dataSource={entryList} renderItem={item => (
                    <List.Item style={{ border: "1px solid #e4e4e8", borderRadius: "10px", cursor: "pointer", padding: "10px 10px" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (item.dir) {
                                setCurDir(item.full_path);
                            } else {
                                setDownloadFile(item.full_path);
                            }
                        }}>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "120px" }}>
                            <div style={{ flex: 1 }}>
                                {item.dir == true && (
                                    <img src={folderIcon} />
                                )}
                                {item.dir == false && (
                                    <img src={fileIcon} />
                                )}
                            </div>
                            <div>{item.name}</div>
                        </div>

                    </List.Item>
                )} />
            {downloadFile != "" && (
                <DownloadModal projectId={store.paramStore.projectId}
                    pipeLineId={store.resultStore.execResult?.pipe_line_id ?? ""}
                    execId={store.resultStore.execResult?.exec_id ?? ""}
                    filePath={downloadFile} runnerAddr={store.resultStore.execResult?.runner_serv_addr ?? ""}
                    onClose={() => setDownloadFile("")} />
            )}
        </Card>
    )
};

export default observer(ResultFolder);