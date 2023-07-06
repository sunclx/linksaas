import React, { useEffect, useRef, useState } from "react";
import * as dataAnnoTaskApi from "@/api/data_anno_task";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { Button, Card, Space } from "antd";
import type { ANNO_TYPE } from "@/api/data_anno_project";
import { isAnnoText, isAnnoAudio, isAnnoImage } from "@/api/data_anno_project";


export interface AnnoPanelProps {
    projectId: string;
    annoProjectId: string;
    annoType: ANNO_TYPE;
    config: string;
    fsId: string;
    memberUserId?: string;
    done: boolean;
    onChange: () => void;
}

const AnnoPanel = (props: AnnoPanelProps) => {
    const [taskList, setTaskList] = useState<dataAnnoTaskApi.TaskInfo[]>([]);
    const [taskIndex, setTaskIndex] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_taskResult, setTaskResult] = useState("");
    const editorRef = useRef<HTMLDivElement>(null);
    const [instance, setInstance] = useState<any>(null);
    const [hasChange, sethasChange] = useState(false);

    const loadTaskList = async () => {
        const sessionId = await get_session();
        const res = await request(dataAnnoTaskApi.list_task({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            member_user_id: props.memberUserId ?? "",
            filter_by_done: true,
            done: props.done,
        }));
        setTaskList(res.info_list);
        if ((res.info_list.length > 0) && (taskIndex > (res.info_list.length - 1))) {
            setTaskIndex(res.info_list.length - 1);
        }
    };

    const saveResult = async (result: string) => {
        const sessionId = await get_session();
        setTaskResult(result);
        await request(dataAnnoTaskApi.set_result({
            session_id: sessionId,
            project_id: props.projectId,
            result: {
                anno_project_id: props.annoProjectId,
                member_user_id: props.memberUserId ?? "",
                resource_id: taskList[taskIndex % taskList.length].resource_id,
                result: result,
            },
        }));
        sethasChange(false);
    };

    const setDone = async (done: boolean) => {
        if (taskList.length == 0) {
            return;
        }
        const sessionId = await get_session();
        const resourceId = taskList[taskIndex % taskList.length].resource_id;
        await request(dataAnnoTaskApi.set_result_state({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            member_user_id: props.memberUserId ?? "",
            resource_id: resourceId,
            done: done,
        }));
        const tmpList = taskList.filter(item => item.resource_id != resourceId);
        if (tmpList.length > 0 && taskIndex >= tmpList.length) {
            setTaskIndex(tmpList.length - 1);
        }
        setTaskList(tmpList);
        props.onChange();
    };

    const initEditor = async (task: any) => {
        //加载已标注结果
        const sessionId = await get_session();
        const res = await request(dataAnnoTaskApi.get_result({
            session_id: sessionId,
            project_id: props.projectId,
            anno_project_id: props.annoProjectId,
            member_user_id: props.memberUserId ?? "",
            resource_id: taskList[taskIndex % taskList.length].resource_id,
        }));
        try {
            task.annotations = JSON.parse(res.result.result).map((item: any) => {
                item.readonly = props.done;
                return item;
            });
        } catch (e) {
            console.log(e);
        }
        setTaskResult(res.result.result);
        setInstance((oldValue: any) => {
            if (oldValue != null) {
                return oldValue;
            }
            // @ts-ignore
            return new LabelStudio(editorRef.current, {
                config: props.config,
                interfaces: [
                    "panel",
                    "update",
                    "submit",
                    "controls",
                    "side-column",
                    "annotations:menu",
                    "annotations:add-new",
                    "annotations:delete",
                    "predictions:menu",
                ],

                task,
                onLabelStudioLoad: function (LS: any) {
                    const c = LS.annotationStore.addAnnotation({
                        userGenerate: true
                    });
                    LS.annotationStore.selectAnnotation(c.id);
                    console.log(LS);
                },
                onSubmitAnnotation: function (_: any, annotation: any) {
                    const resultList = annotation.serializeAnnotation();
                    saveResult(JSON.stringify([{ "result": resultList }]));
                },
                onEntityCreate: function () {
                    sethasChange(true);
                },
                onEntityDelete: function () {
                    sethasChange(true);
                },
                onSubmitDraft: function () {
                    sethasChange(true);
                }
            });
        });
    };

    const getUrl = () => {
        const isOsWindows = navigator.userAgent.toLowerCase().indexOf("windows") > -1;
        if (isOsWindows) {
            return `https://fs.localhost/${props.fsId}/${taskList[(taskIndex) % taskList.length].content}/resource`;
        } else {
            return `fs://localhost/${props.fsId}/${taskList[(taskIndex) % taskList.length].content}/resource`;
        }
    }

    useEffect(() => {
        loadTaskList();
    }, [])

    useEffect(() => {
        if (editorRef.current == null || taskList.length == 0) {
            return;
        }
        initEditor({
            annotations: [],
            predictions: [],
            data: {
                image: isAnnoImage(props.annoType) ? getUrl() : "",
                audio: isAnnoAudio(props.annoType) ? getUrl() : "",
                text: isAnnoText(props.annoType) ? taskList[(taskIndex) % taskList.length].content : "",
            }
        });
        return () => {
            setInstance((oldValue: any) => {
                if (oldValue !== null) {
                    oldValue.destroy();
                }
                return null;
            });
        };
    }, [editorRef.current, taskList, taskIndex]);



    return (
        <Card bordered={false} extra={
            <Space size="middle">
                <span>{taskIndex + 1}/{taskList.length}</span>
                <Button type="link" disabled={(taskIndex <= 0) || hasChange} style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTaskResult("");
                        setTaskIndex(oldValue => {
                            if (oldValue > 0) {
                                return oldValue - 1;
                            }
                            return 0;
                        });
                    }}>上一个</Button>
                <Button type="link" disabled={(taskIndex >= (taskList.length - 1)) || hasChange} style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTaskIndex(oldValue => {
                            return (oldValue + 1) % taskList.length;
                        });
                    }}>下一个</Button>
                {props.done == false && (
                    <>
                        <Button disabled={!hasChange} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (instance != null) {
                                instance.destroy();
                                setInstance(null);
                            }
                            initEditor({
                                annotations: [],
                                predictions: [],
                                data: {
                                    image: isAnnoImage(props.annoType) ? getUrl() : "",
                                    audio: isAnnoAudio(props.annoType) ? getUrl() : "",
                                    text: isAnnoText(props.annoType) ? taskList[(taskIndex) % taskList.length].content : "",
                                }
                            });
                            sethasChange(false);
                        }}>取消</Button>
                        <Button type="primary" disabled={!hasChange} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (instance !== null) {
                                instance.store.submitAnnotation();
                            }
                        }}>保存</Button>
                    </>
                )}

                {props.done == false && (
                    <Button type="primary" disabled={hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDone(true);
                    }}>标记成完成</Button>
                )}
                {props.done == true && (
                    <Button type="primary" disabled={hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDone(false);
                    }}>标记成未完成</Button>
                )}
            </Space>
        }>
            <div ref={editorRef} style={{ height: "100px" }} />
        </Card>
    )
};

export default AnnoPanel;