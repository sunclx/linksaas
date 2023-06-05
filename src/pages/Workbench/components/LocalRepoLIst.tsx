import { Button, Card, Collapse, Empty, Form, List, Popover, Select, Space, Table, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import type { LocalRepoInfo, LocalRepoStatusInfo, LocalRepoBranchInfo, LocalRepoTagInfo, LocalRepoCommitInfo } from "@/api/local_repo";
import { list_repo, remove_repo, get_repo_status, list_repo_branch, list_repo_tag, list_repo_commit } from "@/api/local_repo";
import { open as open_dir } from '@tauri-apps/api/shell';
import { BranchesOutlined, EditOutlined, MoreOutlined, NodeIndexOutlined, TagOutlined } from "@ant-design/icons";
import SetLocalRepoModal from "./SetLocalRepoModal";
import moment from "moment";
import type { ColumnsType } from 'antd/lib/table';

interface LocalRepoPanelProps {
    repoVersion: number;
    repo: LocalRepoInfo;
}

const LocalRepoPanel: React.FC<LocalRepoPanelProps> = (props) => {
    const [status, setStatus] = useState<LocalRepoStatusInfo | null>(null);
    const [branchList, setBranchList] = useState<LocalRepoBranchInfo[]>([]);
    const [tagList, setTagList] = useState<LocalRepoTagInfo[]>([]);
    const [commitList, setCommitList] = useState<LocalRepoCommitInfo[]>([]);
    const [filterCommiter, setFilterCommiter] = useState("");
    const [filterBranch, setFilterBranch] = useState("");
    const [commiterList, setCommiterList] = useState<string[]>([]);

    const loadCommitList = async (branch: string) => {
        const commitRes = await list_repo_commit(props.repo.path, branch);
        setCommitList(commitRes);
        const tmpList: string[] = [];
        for (const commit of commitRes) {
            if (!tmpList.includes(commit.commiter)) {
                tmpList.push(commit.commiter);
            }
        }
        setCommiterList(tmpList);
    };

    const loadRepoInfo = async () => {
        try {
            const statusRes = await get_repo_status(props.repo.path);
            setStatus(statusRes);
            const branchRes = await list_repo_branch(props.repo.path);
            setBranchList(branchRes);
            const tagRes = await list_repo_tag(props.repo.path);
            setTagList(tagRes);
            if (branchRes.length == 0) {
                return;
            }
            const branch = branchRes.map(item => item.name).includes(statusRes.head) ? statusRes.head : branchRes[0].name;
            setFilterBranch(branch);
            await loadCommitList(branch);
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const reloadStatus = async () => {
        const statusRes = await get_repo_status(props.repo.path);
        setStatus(statusRes);
    };

    const columns: ColumnsType<LocalRepoCommitInfo> = [
        {
            title: "id",
            width: 60,
            render: (_, row: LocalRepoCommitInfo) => (
                <span title={row.id}>{row.id.substring(0, 8)}</span>
            ),
        },
        {
            title: "提交备注",
            dataIndex: "summary",
            width: 200,
        },
        {
            title: "提交时间",
            width: 100,
            render: (_, row: LocalRepoCommitInfo) => `${moment(row.time_stamp).format("YYYY-MM-DD HH:mm")}`,
        },
        {
            title: "提交者",
            width: 100,
            render: (_, row: LocalRepoCommitInfo) => `${row.commiter}(${row.email})`,
        }
    ];

    useEffect(() => {
        loadRepoInfo();
    }, [props.repo.path, props.repoVersion]);

    return (
        <Tabs type="card" tabPosition="left" key={props.repo.id} onChange={key => {
            if (key == "status") {
                reloadStatus();
            }
        }}>
            <Tabs.TabPane tab="提交列表" key="commitList">
                <Card bordered={false} bodyStyle={{ height: "calc(100vh - 440px)", overflow: "scroll" }} extra={
                    <Form layout="inline">
                        <Form.Item label="分支">
                            <Select value={filterBranch} onChange={value => {
                                setFilterBranch(value);
                                loadCommitList(value);
                            }} style={{ width: "150px" }}>
                                {branchList.map(branch => (
                                    <Select.Option key={branch.name} value={branch.name}>{branch.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="提交用户">
                            <Select value={filterCommiter} onChange={value => setFilterCommiter(value)} style={{ width: "100px" }}>
                                <Select.Option value="">全部</Select.Option>
                                {commiterList.map(commiter => (
                                    <Select.Option key={commiter} value={commiter}>{commiter}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                }>
                    <Table rowKey="id" dataSource={commitList.filter(commit => {
                        if (filterCommiter == "") {
                            return true;
                        } else {
                            return commit.commiter == filterCommiter;
                        }
                    })} columns={columns} pagination={{ pageSize: 10, showSizeChanger: false }} />
                </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="分支列表" key="branchList" style={{ height: "calc(100vh - 400px)", overflow: "scroll" }}>
                <List rowKey="name" dataSource={branchList} renderItem={item => (
                    <List.Item style={{ display: "block" }}>
                        <Space size="small">
                            <BranchesOutlined /> {moment(item.commit_time).format("YYYY-MM-DD HH:mm")} {item.name}
                        </Space>
                        <br />
                        <Space size="small">
                            <NodeIndexOutlined /> {item.commit_id.substring(0, 8)} {item.commit_summary}
                        </Space>
                    </List.Item>
                )} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="标记列表" key="tagList" style={{ height: "calc(100vh - 400px)", overflow: "scroll" }}>
                <List rowKey="name" dataSource={tagList} renderItem={item => (
                    <List.Item style={{ display: "block" }}>
                        <Space size="small">
                            <TagOutlined /> {moment(item.commit_time).format("YYYY-MM-DD HH:mm")} {item.name}
                        </Space>
                        <br />
                        <Space size="small">
                            <NodeIndexOutlined /> {item.commit_id.substring(0, 8)} {item.commit_summary}
                        </Space>
                    </List.Item>
                )} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="未提交文件" key="status" style={{ height: "calc(100vh - 400px)", overflow: "scroll" }}>
                <List rowKey="path" dataSource={status?.path_list ?? []} renderItem={item => (
                    <List.Item >
                        <div style={{ display: "flex", width: "100%" }}>
                            <div style={{ flex: 1 }}>
                                {item.path}
                            </div>
                            <div style={{ flex: 1 }}>
                                {item.status}
                            </div>
                        </div>
                    </List.Item>
                )} />
            </Tabs.TabPane>
        </Tabs>
    );
};

interface LocalRepoListProps {
    repoVersion: number;
    onChange: () => void;
}

const LocalRepoList: React.FC<LocalRepoListProps> = (props) => {
    const [repoList, setRepoList] = useState<LocalRepoInfo[]>([]);
    const [activeKey, setActiveKey] = useState("");
    const [editRepo, setEditRepo] = useState<LocalRepoInfo | null>(null);

    const loadRepoList = async () => {
        try {
            const res = await list_repo();
            setRepoList(res);
            console.log(res);
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const removeRepo = async (id: string) => {
        try {
            await remove_repo(id);
            props.onChange();
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    useEffect(() => {
        loadRepoList();
    }, [props.repoVersion]);
    return (
        <>
            {repoList.length == 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {repoList.length > 0 && (
                <Collapse accordion activeKey={activeKey} onChange={key => {
                    if (!Array.isArray(key)) {
                        setActiveKey(key);
                    }
                }}>
                    {repoList.map(repo => (
                        <Collapse.Panel key={repo.id} header={
                            <span>
                                {repo.name}({repo.path})
                                <a style={{ padding: "10px 20px" }} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setEditRepo(repo);
                                }}><EditOutlined /></a>
                            </span>}
                            extra={
                                <Space size="middle">
                                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            open_dir(repo.path);
                                        }}>打开目录</Button>
                                    <div onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}>
                                        <Popover trigger="click" placement="bottom" content={
                                            <div style={{ padding: "10px 10px" }}>
                                                <Space direction="vertical">
                                                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }} onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        props.onChange();
                                                    }}>
                                                        刷新
                                                    </Button>
                                                    <Button type="link" style={{ minWidth: "0px", padding: "0px 0px" }}
                                                        danger
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            removeRepo(repo.id);
                                                        }}>删除</Button>
                                                </Space>
                                            </div>
                                        }>
                                            <MoreOutlined />
                                        </Popover>
                                    </div>
                                </Space>
                            }>
                            {activeKey == repo.id && (
                                <LocalRepoPanel repoVersion={props.repoVersion} repo={repo} key={repo.id} />
                            )}
                        </Collapse.Panel>
                    ))}
                </Collapse>
            )}
            {editRepo != null && (
                <SetLocalRepoModal repo={editRepo} onCancel={() => setEditRepo(null)} onOk={() => {
                    setEditRepo(null);
                    props.onChange();
                }} />
            )}
        </>
    );
};

export default LocalRepoList;