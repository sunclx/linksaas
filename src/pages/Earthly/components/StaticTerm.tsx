import React, { useEffect, useRef, useState } from "react";
import type { LinkEarthlyExecState } from "@/stores/linkAux";
import { observer } from 'mobx-react';
import { XTerm } from 'xterm-for-react'
import { useStores } from "@/hooks";
import type { ExecData } from '@/api/robot_earthly';
import { list_exec_data } from '@/api/robot_earthly';
import s from './Term.module.less';
import { request } from '@/utils/request';
import Button from "@/components/Button";

const StaticTerm: React.FC<LinkEarthlyExecState> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [execDataList, setExecDataList] = useState<ExecData[]>([]);

    const termRef = useRef<XTerm | null>(null);

    const loadExecData = async () => {
        const res = await request(list_exec_data({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            repo_id: props.repoId,
            action_id: props.actionId,
            exec_id: props.execId,
            from_data_index: 0,
            to_data_index: 999999999,
        }));
        if (res) {
            setExecDataList(res.data_list);
            setTimeout(() => {
                res.data_list.forEach(data => {
                    termRef.current?.terminal.write(Uint8Array.from(data.data));
                });
            }, 200);
        }
    };

    const sleep = (t: number) => {
        return new Promise((resolve) => setTimeout(resolve, t));
    }

    const replay = async () => {
        termRef.current?.terminal.clear();
        let lastTimeOffset = 0;
        for (const execData of execDataList) {
            await sleep(execData.time_offset - lastTimeOffset);
            lastTimeOffset = execData.time_offset;
            termRef.current?.terminal.write(Uint8Array.from(execData.data));
        }
    };

    useEffect(() => {
        loadExecData();
    }, []);

    return (
        <div>
            <div className={s.head}>
                <h2 className={s.sub_title}>运行结果</h2>
                <div className={s.play_btn}>
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        replay();
                    }}>重放执行过程</Button>
                </div>
            </div>
            <XTerm className={s.term} ref={termRef} options={{ cols: 80, rows: 24 }} />
        </div>
    );
}

export default observer(StaticTerm);