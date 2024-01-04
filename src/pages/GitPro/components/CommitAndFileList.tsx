import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "../stores";
import { Button, Card, Descriptions, Form, Input, List, Modal, Space, message } from "antd";
import moment from "moment";
import type { LocalRepoFileDiffInfo } from "@/api/local_repo";
import { get_commit_change, create_tag } from "@/api/local_repo";
import { CloseOutlined, TagOutlined } from "@ant-design/icons";

const CommitAndFileList = () => {
    const gitProStore = useGitProStores();

    const [fileList, setFileList] = useState<LocalRepoFileDiffInfo[]>([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagMsg, setNewTagMsg] = useState("");

    const loadFileList = async () => {
        if (gitProStore.curCommit == null || gitProStore.repoInfo == null) {
            setFileList([]);
            return;
        }
        let commitId = "";
        if (typeof (gitProStore.curCommit) == "object") {
            commitId = gitProStore.curCommit.hash;
        } else {
            commitId = gitProStore.curCommit;
        }
        const res = await get_commit_change(gitProStore.repoInfo.path, commitId);
        setFileList(res);
    };

    const removeTag = async () => {
        if (gitProStore.curCommit == null || gitProStore.repoInfo == null) {
            return;
        }
        let commitId = "";
        if (typeof (gitProStore.curCommit) == "object") {
            commitId = gitProStore.curCommit.hash;
        } else {
            commitId = gitProStore.curCommit;
        }
        await create_tag(gitProStore.repoInfo.path, newTagName, commitId, newTagMsg);
        setShowTagModal(false);
        gitProStore.incDataVersion();
        message.info("标记成功");
    };

    useEffect(() => {
        loadFileList();
    }, [gitProStore.curCommit]);

    return (
        <div style={{ height: gitProStore.curDiffFile == null ? "100vh" : "50vh", overflowY: "scroll", backgroundColor: "white" }}>
            {gitProStore.curCommit != null && typeof gitProStore.curCommit == "object" && (
                <Card title="提交信息" extra={
                    <Space>
                        <Button type="link" title="设置标记" icon={<TagOutlined />} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setNewTagName("");
                            setNewTagMsg("");
                            setShowTagModal(true);
                        }} />
                        <Button type="link" icon={<CloseOutlined />} style={{ padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            gitProStore.curCommit = null;
                            gitProStore.curDiffFile = null;
                        }} />
                    </Space>
                }>
                    <Descriptions column={1}>
                        <Descriptions.Item label="提交人">
                            {gitProStore.curCommit.committer.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="邮件地址">
                            {gitProStore.curCommit.committer.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            {moment(gitProStore.curCommit.committer.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                        </Descriptions.Item>
                        <Descriptions.Item label="提交标题">
                            {gitProStore.curCommit.subject}
                        </Descriptions.Item>
                        <Descriptions.Item label="提交内容">
                            {gitProStore.curCommit.body}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
            <Card title="修改文件列表" extra={
                <>
                    {gitProStore.mainItem.menuType == "stashList" && (
                        <Button type="link" icon={<CloseOutlined />} style={{ padding: "0px 0px" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            gitProStore.curCommit = null;
                            gitProStore.curDiffFile = null;
                        }} />
                    )}
                </>
            }>
                <List dataSource={fileList} renderItem={item => (
                    <List.Item key={`${item.old_file_name}:${item.new_file_name}`} style={{ cursor: "pointer" }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            gitProStore.curDiffFile = item;
                        }}>
                        <pre style={{
                            whiteSpace: "pre-wrap", wordWrap: "break-word",
                            backgroundColor: `${item.old_file_name}:${item.new_file_name}` == `${gitProStore.curDiffFile?.old_file_name}:${gitProStore.curDiffFile?.new_file_name}` ? "#e4e4e8" : "white",
                            padding: "4px 10px", borderRadius: "10px"
                        }}>
                            {item.old_file_name}=&gt;{item.new_file_name}({item.delta_type})
                        </pre>
                    </List.Item>
                )} />
            </Card>
            {showTagModal == true && (
                <Modal open title="设置标记"
                    okText="设置" okButtonProps={{ disabled: newTagName == "" || newTagMsg == "" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowTagModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeTag();
                    }}>
                    <Form>
                        <Form.Item label="标记">
                            <Input value={newTagName} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNewTagName(e.target.value.trim());
                            }} />
                        </Form.Item>
                        <Form.Item label="备注">
                            <Input value={newTagMsg} onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNewTagMsg(e.target.value.trim());
                            }} />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default observer(CommitAndFileList);