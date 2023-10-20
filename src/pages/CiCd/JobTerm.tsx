import React, { useEffect, useRef, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "./stores";
import { type GetJobLogResponse, get_job_log } from "@/api/cicd_runner";
import { REQ_ACTION_READ, calc_req_sign } from "@/api/project_cicd";
import { listen } from '@tauri-apps/api/event';
import { uniqId } from "@/utils/utils";
import { request } from "@/utils/request";
import { get_session } from "@/api/user";
import { Terminal } from 'xterm';
import "xterm/css/xterm.css";

export interface JobTermProps {
    jobId: string;
}

const JobTerm = (props: JobTermProps) => {
    const store = useStores();

    const termRef = useRef<HTMLDivElement | null>(null);
    const [shellTerm, setShellTerm] = useState<Terminal | null>(null);

    const getJobLog = async (traceId: string) => {
        if (store.resultStore.execResult == null || store.resultStore.execState == null) {
            return;
        }
        const sessionId = await get_session();
        const signRes = await request(calc_req_sign({
            session_id: sessionId,
            project_id: store.paramStore.projectId,
            req_action: REQ_ACTION_READ,
        }));
        await get_job_log(store.resultStore.execResult.runner_serv_addr, traceId, {
            project_id: store.paramStore.projectId,
            pipe_line_id: store.resultStore.execResult.pipe_line_id,
            exec_id: store.resultStore.execResult.exec_id,
            job_id: props.jobId,
            random_str: signRes.random_str,
            time_stamp: signRes.time_stamp,
            sign: signRes.sign,
        });
    };

    const initTerm = () => {
        if (termRef.current == null) {
            return;
        }
        const term = new Terminal({ rows: 24, cols: 80, disableStdin: true });
        term.open(termRef.current);
        termRef.current.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            ev.stopPropagation();
        });
        setShellTerm(term)
    };


    useEffect(() => {
        if (termRef !== null && termRef.current !== null && shellTerm == null) {
            initTerm();
        }
    }, [termRef]);


    useEffect(() => {
        if (store.resultStore.execResult == null || store.resultStore.execState == null) {
            return;
        }
        const traceId = uniqId();
        const unListenFn = listen<GetJobLogResponse>(traceId, (ev) => {
            setShellTerm(oldTerm => {
                if (oldTerm != null && ev.payload.code == 0) {
                    oldTerm.write(Uint8Array.from(ev.payload.log_data.content));
                }
                return oldTerm;
            })
        });
        getJobLog(traceId);
        return () => { unListenFn.then((unListen) => unListen()); };
    }, []);

    return (
        <div>
            <h3>运行日志</h3>
            <div ref={termRef} />
        </div>
    );
};

export default observer(JobTerm);