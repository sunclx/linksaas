import { Form, Select } from "antd";
import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "../stores";

export interface RunOnParamProps {
    jobId: string;
}

const RunOnParam = (props: RunOnParamProps) => {
    const store = useStores();

    return (
        <Form>
            <Form.Item label="前置参数" help="当这些参数全部存在时，任务才会执行">
                <Select mode="tags" value={store.pipeLineStore.getExecJob(props.jobId)?.run_on_param_list ?? []} onChange={value => {
                    if (store.pipeLineStore.pipeLine !== null) {
                        const tmpJobList = store.pipeLineStore.pipeLine.exec_job_list.slice();
                        for (const tmpJob of tmpJobList) {
                            if (tmpJob.job_id == props.jobId) {
                                tmpJob.run_on_param_list = value;
                            }
                        }
                        store.pipeLineStore.hasChange = true;
                    }
                }} disabled={!store.paramStore.canUpdate} />
            </Form.Item>
        </Form>
    );
};

export default observer(RunOnParam);