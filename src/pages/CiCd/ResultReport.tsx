import React, { useEffect } from "react";
import { observer } from 'mobx-react';
import { Card, Descriptions, List } from "antd";
import { useStores } from "./stores";
import moment from "moment";
import { GIT_REF_TYPE_BRANCH, GIT_REF_TYPE_TAG, PLATFORM_TYPE_DARWIN, PLATFORM_TYPE_LINUX, PLATFORM_TYPE_WINDOWS } from "@/api/project_cicd";
import JobExecPanel from "./JobExecPanel";
import ResultFolder from "./ResultFolder";


const ExecSummary = observer(() => {
    const store = useStores();

    useEffect(() => {
        const time = setInterval(() => {
            if (store.resultStore.execResult != null) {
                if (store.resultStore.execResult.exec_stop_time == 0) {
                    store.resultStore.loadExecResult(store.paramStore.projectId,
                        store.pipeLineStore.pipeLine?.pipe_line_id ?? "",
                        store.resultStore.execResult.exec_id).catch(e => console.log(e));
                    store.resultStore.loadExecState(store.paramStore.projectId,
                        store.pipeLineStore.pipeLine?.pipe_line_id ?? "");
                }
            }
        }, 3000);
        return () => {
            clearInterval(time);
        };
    }, []);

    return (
        <Card title="整体运行情况" bordered={false} extra={
            <>
                {store.resultStore.execResult != null && (
                    <>
                        {store.resultStore.execResult.exec_stop_time == 0 && "运行中"}
                        {store.resultStore.execResult.exec_stop_time != 0 && (
                            <div style={{ fontSize: "16px", fontWeight: 600 }}>
                                {store.resultStore.execResult.success == true && <span style={{ color: "green" }}>运行成功</span>}
                                {store.resultStore.execResult.success == false && <span style={{ color: "reg" }}>运行失败</span>}
                            </div>
                        )}
                    </>
                )}
            </>
        }>
            {store.resultStore.execResult != null && (
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="开始时间">
                        {moment(store.resultStore.execResult.exec_start_time).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="结束时间">
                        {store.resultStore.execResult.exec_stop_time == 0 ? "未结束" : moment(store.resultStore.execResult.exec_stop_time).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="运行平台">
                        {store.resultStore.execResult.runner_plat_form == PLATFORM_TYPE_LINUX && "linux"}
                        {store.resultStore.execResult.runner_plat_form == PLATFORM_TYPE_DARWIN && "macos"}
                        {store.resultStore.execResult.runner_plat_form == PLATFORM_TYPE_WINDOWS && "windows"}
                    </Descriptions.Item>
                    <Descriptions.Item label="运行主机">
                        {store.resultStore.execResult.runner_hostname}
                    </Descriptions.Item>
                    <Descriptions.Item label="GIT引用类型">
                        {store.resultStore.execResult.git_ref_type == GIT_REF_TYPE_BRANCH && "分支"}
                        {store.resultStore.execResult.git_ref_type == GIT_REF_TYPE_TAG && "标记"}
                    </Descriptions.Item>
                    <Descriptions.Item label="GIT引用名称">
                        {store.resultStore.execResult.git_ref_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="运行参数">
                        <List dataSource={store.resultStore.execResult.param_list} renderItem={(item, index) => (
                            <List.Item key={`${store.resultStore.execResult?.exec_id ?? ""}_${index}`}>
                                {item.name}={item.value}
                            </List.Item>
                        )} />
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Card>
    );
});

const ResultReport = () => {
    const store = useStores();

    return (
        <div style={{ height: "calc(100vh - 40px)", width: "100vw", overflowY: "scroll" }}>
            {store.pipeLineStore.pipeLine != null && store.resultStore.execResult != null && store.resultStore.execState != null && (
                <>
                    <ExecSummary />
                    {store.resultStore.execResult.exec_stop_time != 0 && (<ResultFolder />)}
                    <JobExecPanel jobId={store.pipeLineStore.pipeLine.gitsource_job.job_id} jobName="GIT CLONE" />
                    {store.pipeLineStore.pipeLine.exec_job_list.map(execJob => (
                        <JobExecPanel key={execJob.job_id} jobId={execJob.job_id} jobName={execJob.job_name} jobType={execJob.job_type} />
                    ))}
                </>
            )}
        </div>
    );
};

export default observer(ResultReport);