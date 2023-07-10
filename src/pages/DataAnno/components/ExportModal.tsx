import { Button, Checkbox, Form, Input, Modal, Progress, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import * as dataAnnPrjApi from "@/api/data_anno_project";
import * as dataAnnTaskApi from "@/api/data_anno_task";
import { request } from "@/utils/request";
import { FolderOpenOutlined } from "@ant-design/icons";
import { save as save_dialog } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';

export interface ExportModalProps {
    annoProjectId: string;
    onCancel: () => void;
}

const ExportModal = (props: ExportModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const appStore = useStores('appStore');

    const [destPath, setDestPath] = useState("");
    const [exportResource, setExportResource] = useState(false);
    const [exportResult, setExportResult] = useState(false);
    const [exportConfig, setExportConfig] = useState(false);
    const [inExport, setInExport] = useState(false);
    const [resourceRatio, setResourceRatio] = useState(0);
    const [resultRatio, setResultRatio] = useState(0);

    const [annoProjectInfo, setAnnoProjectInfo] = useState<dataAnnPrjApi.AnnoProjectInfo | null>(null);

    const loadAnnoProjectInfo = async () => {
        const res = await request(dataAnnPrjApi.get({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: props.annoProjectId,
        }));
        setAnnoProjectInfo(res.info);
    };

    const choicePath = async () => {
        const path = await save_dialog();
        if (path == null) {
            return;
        }
        setDestPath(path);
    };

    const runExportResource = async () => {
        const res = await request(dataAnnPrjApi.list_resource({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: props.annoProjectId,
            offset: 0,
            limit: 999999,
        }));
        setResourceRatio(0);
        if (res.total_count == 0) {
            return;
        }
        let done = 0;
        for (const resource of res.info_list) {
            await dataAnnPrjApi.export_resource(userStore.sessionId, resource, projectStore.curProject?.data_anno_fs_id ?? "", destPath);
            done += 1;
            setResourceRatio(done * 100 / res.total_count);
        }
        setResourceRatio(100);
    };

    const runExportResult = async () => {
        const memberRes = await request(dataAnnTaskApi.list_member({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            anno_project_id: props.annoProjectId,
        }));
        let totalCount = 0;
        for (const member of memberRes.info_list) {
            totalCount += member.done_count;
        }
        setResultRatio(0);
        if (totalCount == 0) {
            return;
        }
        let done = 0;
        for (const member of memberRes.info_list) {
            if (member.done_count == 0) {
                continue;
            }
            const taskRes = await request(dataAnnTaskApi.list_task({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                anno_project_id: props.annoProjectId,
                member_user_id: member.member_user_id,
                filter_by_done: true,
                done: true,
            }))
            for (const task of taskRes.info_list) {
                if (task.done) {
                    const res = await request(dataAnnTaskApi.get_result({
                        session_id: userStore.sessionId,
                        project_id: projectStore.curProjectId,
                        anno_project_id: props.annoProjectId,
                        member_user_id: member.member_user_id,
                        resource_id: task.resource_id,
                    }));
                    await dataAnnTaskApi.export_result(res.result, destPath);
                    done += 1;
                    setResultRatio(done * 100 / totalCount);
                }
            }
        }
        setResultRatio(100);
    };

    const runExportConfig = async () => {
        let path = destPath + "/config.xml";
        if (appStore.isOsWindows) {
            path = destPath + "\\config.xml";
        }
        await writeTextFile(path, annoProjectInfo?.base_info.config ?? "");
    };

    const runExport = async () => {
        setInExport(true);
        try {
            if (exportResource) {
                await runExportResource();
            }
            if (exportResult) {
                await runExportResult();
            }
            if (exportConfig) {
                await runExportConfig();
            }
            message.info("导出成功");
            props.onCancel();
        } catch (e) {
            console.log(e);
            message.error("导出失败");
        }
        setInExport(false);
    };

    useEffect(() => {
        loadAnnoProjectInfo();
    }, []);

    return (
        <Modal open title="导出数据" okText="导出"
            okButtonProps={{ disabled: destPath == "" || inExport || (!exportResource && !exportResult) }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                runExport();
            }}>
            {annoProjectInfo !== null && (
                <Form labelCol={{ span: 4 }}>
                    <Form.Item label="导出目录">
                        <Input value={destPath} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDestPath(e.target.value);
                        }}
                            addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                choicePath();
                            }} />} />
                    </Form.Item>
                    <Form.Item label="导出资源文件">
                        <Space>
                            <Checkbox checked={exportResource} onChange={e => {
                                e.stopPropagation();
                                setExportResource(e.target.checked);
                            }} disabled={annoProjectInfo.resource_count == 0} />
                            {inExport == true && exportResource == true && (
                                <Progress style={{ width: "380px" }} percent={resourceRatio} showInfo={false} />
                            )}
                        </Space>
                    </Form.Item>
                    <Form.Item label="导出标注结果">
                        <Space>
                            <Checkbox checked={exportResult} onChange={e => {
                                e.stopPropagation();
                                setExportResult(e.target.checked);
                            }} disabled={annoProjectInfo.done_task_count == 0} />
                            {inExport == true && exportResult == true && (
                                <Progress style={{ width: "380px" }} percent={resultRatio} showInfo={false} />
                            )}
                        </Space>
                    </Form.Item>
                    <Form.Item label="导出配置">
                        <Checkbox checked={exportConfig} onChange={e => {
                            e.stopPropagation();
                            setExportConfig(e.target.checked);
                        }} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default observer(ExportModal);