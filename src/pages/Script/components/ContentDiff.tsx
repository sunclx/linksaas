import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Modal } from "antd";
import s from './ContentHistory.module.less';
import { useStores } from "@/hooks";
import { get_script_suite, get_script_from_history, recover_script_from_history } from "@/api/robot_script";
import { request } from "@/utils/request";
import ReactDiffViewer from 'react-diff-viewer';
import moment from 'moment';


interface ContentDiffProps {
    scriptSuiteId: string;
    diffCreateTime: number;
    onCancel: () => void;
    onRecover: (content: string) => void;
}

const ContentDiff: React.FC<ContentDiffProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [oldData, setOldData] = useState('');
    const [newData, setNewData] = useState('');

    const loadData = async () => {
        const newRes = await request(get_script_suite({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: props.scriptSuiteId,
            use_history_script: false,
            script_time: 0,
        }));
        setNewData(newRes.script_suite_info.script_content);

        const oldRes = await request(get_script_from_history({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: props.scriptSuiteId,
            create_time: props.diffCreateTime,
        }));
        setOldData(oldRes.script_content);
    };

    const recoverContent = async () => {
        await request(recover_script_from_history({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: props.scriptSuiteId,
            create_time: props.diffCreateTime,
        }));
        props.onRecover(oldData);
    };

    useEffect(() => {
        loadData();
    }, [props.scriptSuiteId, props.diffCreateTime]);

    return (
        <Modal
            open
            title="历史版本对比"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            width="80%"
            footer={null}
            wrapClassName={s.diff_wrap}>
            <div className={s.top}>
                <div>当前版本</div>
                <div>
                    历史版本
                    <div className={s.title}>{moment(props.diffCreateTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                    <div
                        className={s.btn}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            recoverContent();
                        }}
                    >
                        恢复
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                <ReactDiffViewer
                    oldValue={newData}
                    newValue={oldData}
                    splitView={true}
                    showDiffOnly={true}
                />
            </div>
        </Modal>
    );
};

export default observer(ContentDiff);