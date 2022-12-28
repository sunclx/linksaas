import React from "react";
import { observer } from 'mobx-react';
import RulePanel from "./RulePanel";
import MetricPanel from "./MetricPanel";
import s from './TcDetail.module.less';
import ContentPanel from "./ContentPanel";
import ResultPanel from "./ResultPanel";

interface TcDetailProps {
    entryId: string;
}

const TcDetail: React.FC<TcDetailProps> = (props) => {
    return (
        <div className={s.panel_wrap}>
            <RulePanel entryId={props.entryId} />
            <MetricPanel entryId={props.entryId} />
            <ContentPanel entryId={props.entryId} />
            <ResultPanel entryId={props.entryId} />
        </div>
    );
};

export default observer(TcDetail);