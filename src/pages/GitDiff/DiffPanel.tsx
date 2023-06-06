import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { LocalRepoFileDiffInfo } from "@/api/local_repo";
import { get_commit_change } from "@/api/local_repo";
import { Card, Collapse, Select, message } from "antd";
import ReactDiffViewer from 'react-diff-viewer';


const DiffPanel = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const path = urlParams.get("path") ?? "";
    const commitId = urlParams.get("commitId") ?? "";
    const summary = urlParams.get("summary") ?? "";
    const commiter = urlParams.get("commiter") ?? "";

    const [diffList, setDiffList] = useState<LocalRepoFileDiffInfo[] | null>(null);
    const [darkMode, setDarMode] = useState(false);

    const loadDiffList = async () => {
        if (diffList !== null) {
            return;
        }
        try {
            const res = await get_commit_change(path, commitId);
            setDiffList(res);
            console.log(res);
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    useEffect(() => {
        if (path !== "" && commitId !== "") {
            loadDiffList();
        }
    }, [path, commitId]);

    return (
        <Card title={`${commiter}: ${summary}`} bodyStyle={{ overflowY: "auto", height: "calc(100vh - 30px)" }} bordered={false}
            extra={
                <Select value={darkMode} style={{ width: 100 }} onChange={value => setDarMode(value)}>
                    <Select.Option value={false}>浅色模式</Select.Option>
                    <Select.Option value={true}>深色模式</Select.Option>
                </Select>
            }>
            {diffList !== null && (
                <Collapse accordion defaultActiveKey={diffList.length > 0 ? diffList[0].new_file_name : ""}>
                    {diffList.map(diffItem => (
                        <Collapse.Panel
                            header={diffItem.old_file_name == diffItem.new_file_name ? diffItem.new_file_name : `${diffItem.old_file_name} => ${diffItem.new_file_name}`}
                            key={diffItem.new_file_name}>
                            {diffItem.new_content == "" && diffItem.old_content == "" && (
                                "二进制文件"
                            )}
                            {(diffItem.new_content !== "" || diffItem.old_content !== "") && (
                                <ReactDiffViewer
                                    oldValue={diffItem.old_content}
                                    newValue={diffItem.new_content}
                                    splitView={false}
                                    disableWordDiff={true}
                                    useDarkTheme={darkMode}
                                    showDiffOnly={true} />
                            )}
                        </Collapse.Panel>
                    ))}
                </Collapse>
            )}

        </Card>
    );
};

export default DiffPanel;