import React, { useEffect, useRef, useState } from "react";
import type { LinkEarthlyExecState } from "@/stores/linkAux";
import { observer } from 'mobx-react';
import { XTerm } from 'xterm-for-react'
import { listen } from '@tauri-apps/api/event';
import type * as NoticeType from '@/api/notice_type';
import s from './Term.module.less';

const DynamicTerm: React.FC<LinkEarthlyExecState> = (props) => {

    const [lastDataIndex, setLastDataIndex] = useState(-1);

    const termRef = useRef<XTerm | null>(null);

    const onRecvData = async (notice: NoticeType.earthly.ExecDataNotice | undefined) => {
        if (notice == undefined) {
            return;
        }
        console.log("aaaaaaaaaaaaaaaaaa", notice.data_index);
        termRef.current?.terminal.write(Uint8Array.from(notice.data));
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
            <XTerm className={s.term} ref={termRef} options={{ cols: 120, rows: 40 }} />
        </div>
    );
}

export default observer(DynamicTerm);