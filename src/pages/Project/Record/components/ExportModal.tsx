import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { DatePicker, Form, Modal, Progress, message } from "antd";
import { list_project_event } from "@/api/events";
import MemberSelect from "@/components/MemberSelect";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { get_simple_content } from "@/api/event_type";
import { save } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';


interface ExecModalProps {
    memberUserId: string | null;
    fromTime: number;
    toTime: number;
    onError: () => void;
    onSucc: () => void;
}

const ExecModal: React.FC<ExecModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [totalCount, setTotalCount] = useState(0);
    const [curCount, setCurCount] = useState(0);

    const runExport = async () => {
        const lineList: string[] = [];
        while (true) {
            try {
                const res = await request(list_project_event({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    filter_by_member_user_id: props.memberUserId !== null,
                    member_user_id: props.memberUserId ?? "",
                    from_time: props.fromTime,
                    to_time: props.toTime,
                    offset: lineList.length,
                    limit: 100,
                }));
                if (res.event_list.length == 0) {
                    break;
                }
                setTotalCount(res.total_count);
                for (const ev of res.event_list) {
                    const desc = get_simple_content(ev, false).map(info => info.linkContent).join(" ");
                    lineList.push(JSON.stringify({
                        desc: desc,
                        event: ev,
                    }))
                }
                setCurCount(lineList.length);
            } catch (e) {
                message.error(`${e}`);
                props.onError();
                return;
            }
        }
        //保存到文件
        const filePath = await save({
            title: "导出研发事件",
            filters: [
                {
                    name: "jsonl",
                    extensions: ["jsonl"]
                }
            ]
        });
        if (filePath == null) {
            message.warn("取消保存");
            props.onError();
            return;
        }
        try {
            await writeTextFile(filePath, lineList.join("\n"));
            message.info("导出成功");
            props.onSucc();
        } catch (e) {
            message.error(`${e}`);
            props.onError();
        }

    };

    useEffect(() => {
        runExport();
    }, []);

    return (
        <Modal open title="导出中" footer={null} onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            message.warn("取消导出");
            props.onError();
        }}>
            <Progress percent={totalCount == 0 ? 0 : curCount * 100 / totalCount} showInfo={false} />
        </Modal>
    );
};

interface ExportModalProps {
    onCancel: () => void;
}

const ExportModal: React.FC<ExportModalProps> = (props) => {

    const [inExec, setInExec] = useState(false);
    const [memberUserId, setMemberUserId] = useState<string | null>(null);
    const [fromTime, setFromTime] = useState<number | null>(null);
    const [toTime, setToTime] = useState<number | null>(null);

    return (
        <Modal open title="导出事件"
            style={{ display: inExec ? "none" : undefined }}
            okText="导出" okButtonProps={{ disabled: fromTime == null || toTime == null }}
            width={"430px"}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                if (fromTime != null && toTime != null && fromTime < toTime) {
                    setInExec(true);
                }
            }}>
            <Form layout="inline">
                <Form.Item >
                    <DatePicker.RangePicker popupStyle={{ zIndex: 4000 }}
                        onChange={ts => {
                            if (Array.isArray(ts) && ts.length == 2) {
                                setFromTime(ts[0]?.startOf("day").valueOf() ?? null);
                                setToTime(ts[1]?.endOf("day").valueOf() ?? null);
                            }
                        }} />
                </Form.Item>
                <Form.Item>
                    <MemberSelect value={memberUserId} onChange={value => setMemberUserId(value ?? null)} allowClear placeholder="项目成员:" />
                </Form.Item>
            </Form>
            {inExec && (
                <ExecModal memberUserId={memberUserId} fromTime={fromTime!} toTime={toTime!} onError={() => setInExec(false)}
                    onSucc={() => {
                        props.onCancel();
                    }} />
            )}
        </Modal>
    );
}

export default observer(ExportModal);