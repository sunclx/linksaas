import React, { useEffect, useRef } from "react";
import type { LinkEarthlyExecState } from "@/stores/linkAux";
import { observer } from 'mobx-react';
import { XTerm } from 'xterm-for-react'
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';
import s from './Term.module.less';
import { request } from "@/utils/request";
import { list_exec_data } from '@/api/robot_earthly';
import { useStores } from "@/hooks";

const DynamicTerm: React.FC<LinkEarthlyExecState> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    let lastDataIndex = -1;

    const termRef = useRef<XTerm | null>(null);

    const onRecvData = async (notice: NoticeType.earthly.ExecDataNotice | undefined) => {
        if (notice == undefined) {
            return;
        }
        if (notice.data_index - 1 > lastDataIndex) {
            const res = await request(list_exec_data({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                repo_id: props.repoId,
                action_id: props.actionId,
                exec_id: props.execId,
                from_data_index: lastDataIndex + 1,
                to_data_index: notice.data_index,
            }));
            if (res) {
                res.data_list.forEach(item => {
                    termRef.current?.terminal.write(Uint8Array.from(item.data));
                })
            }
        }
        termRef.current?.terminal.write(Uint8Array.from(notice.data));
        lastDataIndex = notice.data_index;
    }

    useEffect(() => {

        const unlisten = listen<NoticeType.AllNotice>(`exec_data_${props.execId}`, (e) => {
            onRecvData(e.payload.EarthlyNotice?.ExecDataNotice);
        })
        return () => {
            unlisten.then(f => f());
        };
    }, [props]);

    return (
        <div>
            <h2 className={s.sub_title}>运行结果</h2>
            <XTerm className={s.term} ref={termRef} options={{ cols: 80, rows: 24 }} />
        </div>
    );
}

export default observer(DynamicTerm);