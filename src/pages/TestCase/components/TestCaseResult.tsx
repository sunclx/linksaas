import type { Result, RESULT_TYPE } from "@/api/project_test_case";
import { RESULT_TYPE_SUCCESS, RESULT_TYPE_WARN, RESULT_TYPE_FAIL, remove_result } from "@/api/project_test_case";
import FsFile from "@/components/Fs/FsFile";
import FsImage from "@/components/Fs/FsImage";
import { useStores } from "@/hooks";
import { uniqId } from "@/utils/utils";
import { Button, Card, Empty, Popover } from "antd";
import React from "react";
import moment from 'moment';
import { MoreOutlined } from "@ant-design/icons";
import { observer } from 'mobx-react';
import s from './TestCaseResult.module.less';
import { useHistory } from "react-router-dom";
import { request } from "@/utils/request";

interface TestCaseResultProps {
    result: Result;
    showEntry: boolean;
    onRemove: () => void;
}

const getTypeStr = (t: RESULT_TYPE) => {
    if (t == RESULT_TYPE_SUCCESS) {
        return "成功";
    } else if (t == RESULT_TYPE_WARN) {
        return "警告";
    } else if (t == RESULT_TYPE_FAIL) {
        return "失败";
    }
    return "";
};

interface ImageItem {
    itemId: string;
    thumbFileId: string;
    fileId: string;
    fileName: string;
}

interface FileItem {
    itemId: string;
    fileId: string;
    fileName: string;
    FileSize: number;
}

const TestCaseResult: React.FC<TestCaseResultProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const imageList: ImageItem[] = props.result.image_list.map(item => ({
        itemId: uniqId(),
        thumbFileId: item.thumb_file_id,
        fileId: item.file_id,
        fileName: item.file_name,
    }));

    const fileList: FileItem[] = props.result.extra_file_list.map(item => ({
        itemId: uniqId(),
        fileId: item.file_id,
        fileName: item.file_name,
        FileSize: item.file_size,
    }));

    const removeResult = async () => {
        await request(remove_result({
            session_id: userStore.sessionId,
            project_id: props.result.project_id,
            entry_id: props.result.entry_id,
            result_id: props.result.result_id,
        }));
        props.onRemove();
    };

    return (
        <Card title={
            <span>
                {props.showEntry == true && <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    linkAuxStore.goToTestCaseList({ entryId: props.result.entry_id }, history);
                }}>测试用例: {props.result.entry_title}</a>}
                {props.showEntry == true && <span>&nbsp;|&nbsp;</span>}
                {props.result.create_display_name} {moment(props.result.create_time).format("YYYY-MM-DD HH:mm:ss")}
            </span>}
            className={s.content_wrap}
            extra={
                <Popover content={<div>
                    <Button type="link" danger
                        disabled={props.result.user_perm.can_remove == false}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeResult();
                        }}>删除</Button>
                </div>} trigger="click" placement="bottom">
                    <a><MoreOutlined /></a>
                </Popover>
            }>
            <div className={s.info_wrap}>
                <div>结果类型:</div>
                <div className={s.info_value}>{getTypeStr(props.result.result_type)}</div>
            </div>
            <div className={s.info_wrap}>
                <div>结果描述:</div>
                <div className={s.info_value}>{props.result.desc}</div>
            </div>
            <div>
                <h2 className={s.head}>截图列表</h2>
                {imageList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                {imageList.map(item => <FsImage
                    key={item.itemId}
                    itemId={item.itemId}
                    fsId={projectStore.curProject?.test_case_fs_id ?? ""}
                    thumbFileId={item.thumbFileId}
                    fileId={item.fileId}
                    fileName={item.fileName}
                    preview={true} />)}
            </div>
            <div>
                <h2 className={s.head}>文件列表</h2>
                {fileList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                {fileList.map(item => <FsFile
                    key={item.itemId}
                    itemId={item.itemId}
                    fsId={projectStore.curProject?.test_case_fs_id ?? ""}
                    fileId={item.fileId}
                    fileName={item.fileName}
                    fileSize={item.FileSize}
                    download={true} />)}
            </div>
        </Card>
    );
};

export default observer(TestCaseResult);