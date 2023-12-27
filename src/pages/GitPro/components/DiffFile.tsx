import React from "react";
import { observer } from 'mobx-react';
import ReactDiffViewer from 'react-diff-viewer';
import { useGitProStores } from "../stores";
import { Button, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const DiffFile = () => {
    const gitProStore = useGitProStores();

    return (
        <Card title={`文件对比(${gitProStore.curDiffFile?.old_file_name}=>${gitProStore.curDiffFile?.new_file_name})`} bodyStyle={{ height: "calc(50vh - 45px)", overflowY: "scroll" }}
            extra={
                <Button type="link" icon={<CloseOutlined />} style={{ padding: "0px 0px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    gitProStore.curDiffFile = null;
                }} />
            }>
            <ReactDiffViewer
                oldValue={gitProStore.curDiffFile?.old_content ?? ""}
                newValue={gitProStore.curDiffFile?.new_content ?? ""}
                splitView={true}
                showDiffOnly={true}
            />
        </Card>
    );
};

export default observer(DiffFile);