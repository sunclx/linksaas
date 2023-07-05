import React, { useEffect, useRef, useState } from "react";
import * as dataAnnoTaskApi from "@/api/data_anno_task";
import type { AnnoConfig } from "@/api/data_anno_project";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
// @ts-ignore
import LabelStudio from '@heartexlabs/label-studio';
import '@heartexlabs/label-studio/build/static/css/main.css';
import { Button, Card } from "antd";


export interface AnnoPanelProps {
    projectId: string;
    annoProjectId: string;
    annoConfig: AnnoConfig;
    fsId: string;
    memberUserId?: string;
    done: boolean;
}

const AnnoPanel = (props: AnnoPanelProps) => {
    const [taskList, setTaskList] = useState<dataAnnoTaskApi.TaskInfo[]>([]);
    const editorRef = useRef<HTMLDivElement>(null);
    const [instance, setInstance] = useState<any>(null);

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
    };

    const initEditor = (task: any) => {
        setInstance((oldValue: any) => {
            if (oldValue != null) {
                return oldValue;
            }
            return new LabelStudio(editorRef.current, {
                config: `<View style="display: flex;">
                <View style="width: 100%; margin-left: 1em;">
                  <Labels name="label" toName="audio">
                    <Label value="Speaker 1" />
                    <Label value="Speaker 2" />
                  </Labels>
              
                  <Audio name="audio" value="$audio"/>
                  <View style="padding: 10px 20px; margin-top: 2em; box-shadow: 2px 2px 8px #AAA; margin-right: 1em;"
                        visibleWhen="region-selected">
                    <Header value="Provide Transcription" />
                    <TextArea name="transcription" toName="audio"
                              rows="2" editable="true" perRegion="true"
                              required="true" />
                  </View>
                  <View style="padding: 10px 20px; margin-top: 2em; box-shadow: 2px 2px 8px #AAA; margin-right: 1em;"
                        visibleWhen="region-selected">
                    <Header value="Select Gender" />
                    <Choices name="gender" toName="audio"
                             perRegion="true" required="true">
                      <Choice value="Male" />
                      <Choice value="Female" />
                    </Choices>
                  </View>
              
                  <View style="width: 100%; display: block">
                    <Header value="Select region after creation to go next"/>
                  </View>
              
                </View>
              </View>`,
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
                    var c = LS.annotationStore.addAnnotation({
                        userGenerate: true
                    });
                    LS.annotationStore.selectAnnotation(c.id);
                },
                onSubmitAnnotation: function (_: any, annotation: any) {
                    // Retrieve an annotation in JSON format
                    console.log(annotation.serializeAnnotation());
                }
            });
        });
    };

    useEffect(() => {
        loadTaskList();
    }, [])

    useEffect(() => {
        if (editorRef.current != null && taskList.length != 0) {
            initEditor({
                annotations: [],
                predictions: [],
                data: {
                    audio: `https://fs.localhost/${props.fsId}/${taskList[0].content}/resource`,
                }
            });
        }
    }, [editorRef.current, taskList])

    return (
        <Card bordered={false} extra={
            <Button onClick={() => {
                // const task = {
                //     annotations: [],
                //     predictions: [],
                //     data: {
                //         audio: "https://www.linksaas.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.c8d75ca9.png&w=1080&q=75",
                //     }
                // };
                instance.store.submitAnnotation();
                // instance.destroy();
                // setInstance(null);
                // initEditor(task);
                // instance.store.clearHistory();
            }}>xx</Button>
        }>
            <div ref={editorRef} style={{ height: "100px" }} />
        </Card>
    )
};

export default AnnoPanel;