import { Card, Descriptions } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { JOB_TYPE_DOCKER, type JOB_TYPE, JOB_TYPE_SHELL, JOB_TYPE_SERVICE } from "@/api/project_cicd";
import { useStores } from "./stores";
import { EXEC_STATE_RUNNING, EXEC_STATE_SKIP, EXEC_STATE_STOP, EXEC_STATE_UN_START, type JobExecState } from "@/api/cicd_runner";
import moment from "moment";
import JobTerm from "./JobTerm";

export interface JobExecPanelProps {
    jobId: string;
    jobName: string;
    jobType?: JOB_TYPE;
}

const JobExecPanel = (props: JobExecPanelProps) => {
    const store = useStores();

    const [jobState, setJobState] = useState<JobExecState | null>(null);

    const getTitle = (): string => {
        if (props.jobType == undefined) {
            return props.jobName;
        } else {
            if (props.jobType == JOB_TYPE_DOCKER) {
                return `${props.jobName}(Docker任务)`;
            } else if (props.jobType == JOB_TYPE_SHELL) {
                return `${props.jobName}(脚本任务)`;
            } else if (props.jobType == JOB_TYPE_SERVICE) {
                return `${props.jobName}(服务任务)`;
            }
        }
        return "";
    };

    useEffect(() => {
        if (store.resultStore.execState == null) {
            setJobState(null);
        }
        for (const tmpState of store.resultStore.execState?.job_exec_state_list ?? []) {
            if (tmpState.job_id == props.jobId) {
                setJobState(tmpState);
                return;
            }
        }
        setJobState(null);
    }, [store.resultStore.execState])

    return (
        <Card
            style={{ marginTop: "10px" }}
            title={getTitle()} extra={<>
                {jobState != null && (
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {jobState.exec_state == EXEC_STATE_UN_START && "未开始运行"}
                        {jobState.exec_state == EXEC_STATE_RUNNING && "运行中"}
                        {jobState.exec_state == EXEC_STATE_STOP && "已结束运行"}
                        {jobState.exec_state == EXEC_STATE_SKIP && "忽略运行"}
                    </div>
                )}
            </>}>
            {jobState != null && (
                <Descriptions bordered column={3} style={{ marginBottom: "10px" }}>
                    <Descriptions.Item label="开始时间">
                        {[EXEC_STATE_RUNNING, EXEC_STATE_STOP].includes(jobState.exec_state) && (
                            moment(jobState.start_time).format("YYYY-MM-DD HH:mm:ss")
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        {EXEC_STATE_STOP == jobState.exec_state && (
                            moment(jobState.stop_time).format("YYYY-MM-DD HH:mm:ss")
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="运行结果">
                        {EXEC_STATE_STOP == jobState.exec_state && jobState.success ? "成功" : "失败"}
                    </Descriptions.Item>
                </Descriptions>
            )}
            {jobState != null && [EXEC_STATE_RUNNING, EXEC_STATE_STOP].includes(jobState.exec_state) && (
                <JobTerm jobId={props.jobId} />
            )}
        </Card>
    )
};

export default observer(JobExecPanel);