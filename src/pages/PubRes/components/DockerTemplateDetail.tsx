import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { AppWithTemplateInfo, AppComment } from '@/api/docker_template';
import { get_app_with_template, add_comment, remove_comment, list_comment } from "@/api/docker_template";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { Button, Card, Image, Input, List, Modal, Space, message } from "antd";
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import { open as open_shell } from '@tauri-apps/api/shell';
import AsyncImage from "@/components/AsyncImage";
import { download_file } from "@/api/fs";
import { check_unpark, unpack_template } from "@/api/docker_template";
import DockerTemplateModal from "./DockerTemplateModal";
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from "moment";

const PAGE_SIZE = 10;


const DockerTemplateDetail = () => {
    const userStore = useStores('userStore');
    const appStore = useStores("appStore");
    const pubResStore = useStores('pubResStore');

    const [awtInfo, setAwtInfo] = useState<AppWithTemplateInfo | null>(null);

    const [commentContent, setCommentContent] = useState("");
    const [commentList, setCommentList] = useState<AppComment[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const [removeCommentInfo, setRemoveCommentInfo] = useState<AppComment | null>(null);
    const [templatePath, setTemplatePath] = useState("");

    const loadAwtInfo = async () => {
        if (pubResStore.dockerAppId == "") {
            return;
        }
        const res = await request(get_app_with_template({
            app_id: pubResStore.dockerAppId,
        }));
        setAwtInfo(res.info);
    };

    const getImageUrl = (fileId: string) => {
        if (appStore.isOsWindows) {
            return `https://fs.localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/image.png`;
        } else {
            return `fs://localhost/${appStore.clientCfg?.docker_template_fs_id ?? ""}/${fileId}/image.png`;
        }
    };

    const prepareTemplate = async (fileId: string) => {
        const downloadRes = await download_file(userStore.sessionId, appStore.clientCfg?.docker_template_fs_id ?? "", fileId, "", "template.zip");
        const checkRes = await check_unpark(appStore.clientCfg?.docker_template_fs_id ?? "", fileId);
        if (!checkRes) {
            await unpack_template(appStore.clientCfg?.docker_template_fs_id ?? "", fileId);
        }
        if (appStore.isOsWindows) {
            setTemplatePath(`${downloadRes.local_dir}\\template`);
        } else {
            setTemplatePath(`${downloadRes.local_dir}/template`);
        }
    };

    const loadCommentList = async () => {
        const res = await request(list_comment({
            app_id: pubResStore.dockerAppId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));

        setTotalCount(res.total_count);
        setCommentList(res.comment_list);
    };

    const addComment = async () => {
        if (commentContent.trim() == "") {
            return;
        }
        await request(add_comment({
            session_id: userStore.sessionId,
            app_id: pubResStore.dockerAppId,
            comment: commentContent,
        }));
        message.info("增加评论成功");
        setCommentContent("");
        if (curPage == 0) {
            await loadCommentList();
        } else {
            setCurPage(0);
        }
    };

    const removeComment = async () => {
        if (removeCommentInfo == null) {
            return;
        }
        await request(remove_comment({
            session_id: userStore.sessionId,
            app_id: pubResStore.dockerAppId,
            comment_id: removeCommentInfo.comment_id,
        }));
        message.info("删除评论成功");
        setRemoveCommentInfo(null);
        if (curPage == 0) {
            await loadCommentList();
        } else {
            setCurPage(0);
        }
    };

    useEffect(() => {
        loadAwtInfo();
        loadCommentList();
    }, [pubResStore.dockerAppId]);

    return (
        <Card title={
            <Space>
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        pubResStore.dockerAppId = "";
                    }}><LeftOutlined style={{ fontSize: "16px" }} /></Button>
                <h2>{awtInfo?.app_info.name ?? ""}</h2>
            </Space>
        } bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Space size="middle">
                    {(awtInfo?.app_info.official_url ?? "") != "" && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            open_shell(awtInfo?.app_info.official_url ?? "");
                        }}>官网</a>
                    )}
                    {(awtInfo?.app_info.doc_url ?? "") != "" && (
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            open_shell(awtInfo?.app_info.doc_url ?? "");
                        }}>文档</a>
                    )}
                </Space>
            }>
            <h2 style={{ fontSize: "16px", fontWeight: 600 }}>模板版本</h2>
            <Space>
                {awtInfo?.template_info_list.map(template => (
                    <Button key={template.version} type="primary" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        prepareTemplate(template.file_id);
                    }}>{template.version}&nbsp;<DownloadOutlined /></Button>
                ))}
            </Space>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>模板描述</h2>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{awtInfo?.app_info.desc ?? ""}</pre>
            {(awtInfo?.app_info.image_list ?? []).length > 0 && (
                <>
                    <h2 style={{ fontSize: "18px", fontWeight: 600 }}>相关截图</h2>
                    <Image.PreviewGroup>
                        <List rowKey="thumb_file_id" dataSource={awtInfo?.app_info.image_list ?? []} grid={{ gutter: 16 }}
                            renderItem={imageItem => (
                                <List.Item>
                                    <AsyncImage src={getImageUrl(imageItem.thumb_file_id)}
                                        preview={{ src: getImageUrl(imageItem.raw_file_id) }} width={200} height={150} useRawImg={false} />
                                </List.Item>
                            )} />
                    </Image.PreviewGroup>

                </>
            )}
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginTop: "10px" }}>评论列表</h2>
            <div>
                <Input.TextArea
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    value={commentContent}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCommentContent(e.target.value);
                    }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" style={{ margin: "10px 10px" }} disabled={commentContent.trim() == ""}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        addComment();
                    }}>发送</Button>
            </div>
            <List rowKey="comment_id" dataSource={commentList} renderItem={item => (
                <List.Item>
                    <Card style={{ width: "100%" }} bordered={false} title={
                        <Space>
                            <UserPhoto logoUri={item.create_logo_uri} style={{ width: "20px", borderRadius: "10px" }} />
                            <span>{item.create_display_name}</span>
                            <span>{moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>
                        </Space>
                    } extra={
                        <>
                            {item.create_user_id == userStore.userInfo.userId && (
                                <Button type="link" danger onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setRemoveCommentInfo(item);
                                }}>删除</Button>
                            )}
                        </>
                    }>
                        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{item.comment}</pre>
                    </Card>
                </List.Item>
            )} pagination={{ current: curPage + 1, pageSize: PAGE_SIZE, total: totalCount, onChange: page => setCurPage(page - 1), hideOnSinglePage: true }} />

            {templatePath !== "" && (
                <DockerTemplateModal templatePath={templatePath} onCancel={() => setTemplatePath("")} />
            )}

            {removeCommentInfo != null && (
                <Modal open title="删除评论"
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRemoveCommentInfo(null);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeComment();
                    }}>
                    是否删除评论？
                </Modal>
            )}
        </Card>
    );
};

export default observer(DockerTemplateDetail);