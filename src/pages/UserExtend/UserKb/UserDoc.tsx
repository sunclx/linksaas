import React from "react";
import { observer } from 'mobx-react';
import { useLocation } from "react-router-dom";
import s from "./UserDoc.module.less";
import WriteDoc from "./components/WriteDoc";
import ReadDoc from "./components/ReadDoc";

export interface UserDocState {
    spaceId: string;
    sshPubKey: string;
    docId: string;
    readMode: boolean;
}

const UserDoc = () => {
    const location = useLocation();
    const state = location.state as UserDocState;

    return (
        <div className={s.content_wrap}>
            {state.readMode == false && (
                <WriteDoc spaceId={state.spaceId} sshPubKey={state.sshPubKey} docId={state.docId}/>
            )}
            {state.readMode == true && (
                <ReadDoc spaceId={state.spaceId} sshPubKey={state.sshPubKey} docId={state.docId} />
            )}
        </div>);
}

export default observer(UserDoc);