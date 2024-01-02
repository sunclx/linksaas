import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useGitProStores } from "./stores";
import { Button, Card, Divider, Form, Input, Modal, Select, Space, Transfer } from "antd";
import { get_repo_status, add_to_index, remove_from_index, run_commit, save_stash } from "@/api/local_repo";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { uniqId } from "@/utils/utils";

type FileStatus = {
    key: string;
    title: string;
    status: string;
    path: string;
};

type FootItem = {
    id: string;
    key: string;
    value: string;
};

interface StashModalProps {
    onClose: () => void;
}

const StashModal = observer((props: StashModalProps) => {
    const gitProStore = useGitProStores();

    const [msg, setMsg] = useState("");

    const saveStash = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        await save_stash(gitProStore.repoInfo.path, msg);
        props.onClose();
        gitProStore.incDataVersion();
    };

    return (
        <Modal open title="暂存文件"
            okButtonProps={{ disabled: msg == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                saveStash();
            }}>
            <p>说明:未提交的所有文件都会被暂存！</p>
            <Form>
                <Form.Item label="暂存说明">
                    <Input value={msg} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMsg(e.target.value.trim());
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});


const ProcessCommitPanel = () => {
    const gitProStore = useGitProStores();

    const [fileStatusList, setFileStatusList] = useState<FileStatus[]>([]);
    const [commitType, setCommitType] = useState("feat");
    const [commitScope, setCommitScope] = useState("");
    const [commitSubject, setCommitSubject] = useState("");
    const [commitBody, setCommitBody] = useState("");
    const [footItemList, setFootItemList] = useState<FootItem[]>([]);
    const [showCommitModal, setShowCommitModal] = useState(false);
    const [commitMsg, setCommitMsg] = useState("");
    const [showStashModal, setShowStashModal] = useState(false);

    const loadFileStatus = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const res = await get_repo_status(gitProStore.repoInfo.path);
        const tmpList: FileStatus[] = [];
        for (const pathInfo of res.path_list) {
            for (const status of pathInfo.status) {
                tmpList.push({
                    key: `${status}:${pathInfo.path}`,
                    title: `${pathInfo.path}(${status})`,
                    path: pathInfo.path,
                    status: status,
                });
            }
        }
        setFileStatusList(tmpList);
    };

    const addToIndex = async (keyList: string[]) => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const pathList = fileStatusList.filter(item => keyList.includes(item.key)).map(item => item.path);
        await add_to_index(gitProStore.repoInfo.path, pathList);
        await loadFileStatus();
    };

    const removeFromIndex = async (keyList: string[]) => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        const pathList = fileStatusList.filter(item => keyList.includes(item.key)).map(item => item.path);
        await remove_from_index(gitProStore.repoInfo.path, pathList);
        await loadFileStatus();
    };

    const calcCommitMsg = () => {
        const scope = commitScope == "" ? "" : `(${commitScope})`;
        const footerList: string[] = [];
        for (const item of footItemList) {
            if (item.key == "" || item.value == "") {
                continue;
            }
            footerList.push(`${item.key}: ${item.value}`);
        }
        return `${commitType}${scope}: ${commitSubject}

${commitBody}

${footerList.join("\n")}`;
    };

    const runCommit = async () => {
        if (gitProStore.repoInfo == null) {
            return;
        }
        await run_commit(gitProStore.repoInfo.path, commitMsg);
        setCommitMsg("");
        setShowCommitModal(false);
        gitProStore.incDataVersion();
    };

    useEffect(() => {
        loadFileStatus();
    }, []);

    return (
        <Card title="未提交文件" bodyStyle={{ height: "calc(100vh - 50px)", overflowY: "scroll" }} extra={
            <Space>
                <Button disabled={fileStatusList.filter(item => item.status.startsWith("INDEX_")).length != 0}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowStashModal(true);
                    }}>暂存文件</Button>
                <Button type="primary" disabled={fileStatusList.filter(item => item.status.startsWith("INDEX_")).length == 0 || commitSubject == ""}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowCommitModal(true);
                        setCommitMsg(calcCommitMsg());
                    }}>提交</Button>
            </Space>
        }>
            <Transfer dataSource={fileStatusList} targetKeys={fileStatusList.filter(item => item.status.startsWith("INDEX_")).map(item => item.key)}
                titles={["工作目录", "待提交"]} showSelectAll
                render={item => item.title}
                oneWay
                listStyle={{ width: "calc(50vw - 130px)", height: "200px" }}
                onChange={(_, direction, moveKeys) => {
                    if (direction == "right") {
                        addToIndex(moveKeys);
                    } else if (direction == "left") {
                        removeFromIndex(moveKeys);
                    }
                }} />
            <Divider orientation="left">提交消息</Divider>
            <Form layout="inline" disabled={fileStatusList.filter(item => item.status.startsWith("INDEX_")).length == 0}>
                <Form.Item label="类型">
                    <Select style={{ width: "100px" }} value={commitType} onChange={(value) => setCommitType(value)}>
                        <Select.Option value="feat">feat(特性)</Select.Option>
                        <Select.Option value="fix">fix(修复)</Select.Option>
                        <Select.Option value="docs">docs(文档)</Select.Option>
                        <Select.Option value="style">style(样式)</Select.Option>
                        <Select.Option value="refactor">refactor(重构)</Select.Option>
                        <Select.Option value="perf">perf(性能优化)</Select.Option>
                        <Select.Option value="test">test(测试)</Select.Option>
                        <Select.Option value="chore">chore(辅助工具)</Select.Option>
                        <Select.Option value="revert">revert(回滚版本)</Select.Option>
                        <Select.Option value="merge">merge(合并)</Select.Option>
                        <Select.Option value="sync">sync(同步)</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="范围">
                    <Input style={{ width: "100px" }} value={commitScope} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommitScope(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="标题">
                    <Input value={commitSubject} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommitSubject(e.target.value.trim());
                    }} style={{ width: "calc(100vw - 620px)" }} />
                </Form.Item>
            </Form>
            <Card title="正文(可选)" bordered={false}>
                <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} disabled={fileStatusList.filter(item => item.status.startsWith("INDEX_")).length == 0}
                    value={commitBody} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommitBody(e.target.value);
                    }} />
            </Card>

            <Card title="注脚(可选)" bordered={false} extra={
                <Button icon={<PlusCircleOutlined />} type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setFootItemList([...footItemList, {
                        id: uniqId(),
                        key: "",
                        value: "",
                    }]);
                }} disabled={fileStatusList.filter(item => item.status.startsWith("INDEX_")).length == 0} />
            }>
                {footItemList.map(footItem => (
                    <Form key={footItem.id} layout="inline" style={{ marginTop: "4px" }}>
                        <Form.Item label="字段名">
                            <Input value={footItem.key} onChange={e => {
                                const tmpList = footItemList.slice();
                                const index = tmpList.findIndex(item => item.id == footItem.id);
                                if (index != -1) {
                                    tmpList[index].key = e.target.value.trim();
                                    setFootItemList(tmpList);
                                }
                            }} />
                        </Form.Item>
                        <Form.Item label="字段值">
                            <Input value={footItem.value} onChange={e => {
                                const tmpList = footItemList.slice();
                                const index = tmpList.findIndex(item => item.id == footItem.id);
                                if (index != -1) {
                                    tmpList[index].value = e.target.value.trim();
                                    setFootItemList(tmpList);
                                }
                            }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="link" icon={<MinusCircleOutlined />} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                const tmpList = footItemList.filter(item => item.id != footItem.id);
                                setFootItemList(tmpList);
                            }} />
                        </Form.Item>
                    </Form>
                ))}
            </Card>
            {showCommitModal == true && (
                <Modal open title="提交预览"
                    okText="提交" okButtonProps={{ disabled: commitMsg == "" }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommitMsg("");
                        setShowCommitModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        runCommit();
                    }}>
                    <Input.TextArea value={calcCommitMsg()} autoSize={{ minRows: 8, maxRows: 8 }} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommitMsg(e.target.value);
                    }} />
                </Modal>
            )}
            {showStashModal == true && (<StashModal onClose={() => setShowStashModal(false)} />)}
        </Card>
    );
};

export default observer(ProcessCommitPanel);