import { Form, Modal, Checkbox, Select, Input, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import {
    apiCollectionEvOptionList,
    calcCodeEvCfg,
    calcDataAnnoEvCfg,
    calcDocEvCfg,
    calcExtEvCfg,
    calcGiteeEvCfg,
    calcGitlabEvCfg,
    calcIdeaEvCfg,
    calcIssueEvCfg,
    calcProjectEvCfg,
    calcRequirementEvCfg,
    calcSpritEvCfg,
    codeEvOptionList,
    dataAnnoEvOptionList,
    docEvOptionList,
    extEvOptionList,
    giteeEvOptionList,
    gitlabEvOptionList,
    ideaEvOptionList,
    issueEvOptionList,
    projectEvOptionList,
    requirementEvOptionList,
    spritEvOptionList,
    calcApiCollectionEvCfg,
    calcAtomgitEvCfg,
    atomgitEvOptionList,
    calcCiCdEvCfg,
    ciCdEvOptionList,
} from "./constants";
import { CHAT_BOT_QYWX, CHAT_BOT_DING, CHAT_BOT_FS, create as create_subscribe } from '@/api/events_subscribe';
import type { CHAT_BOT_TYPE } from '@/api/events_subscribe';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { open as shell_open } from '@tauri-apps/api/shell';

interface CreateSubscribeModalProps {
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    chatBotName: string | undefined;
    chatBotAddr: string | undefined;
    chatBotSignCode: string | undefined;
    docEvCfg: string[] | undefined;
    extEvCfg: string[] | undefined;
    atomgitEvCfg: string[] | undefined;
    giteeEvCfg: string[] | undefined;
    gitlabEvCfg: string[] | undefined;
    issueEvCfg: string[] | undefined;
    projectEvCfg: string[] | undefined;
    spritEvCfg: string[] | undefined;
    requirementEvCfg: string[] | undefined;
    codeEvCfg: string[] | undefined;
    ideaEvCfg: string[] | undefined;
    dataAnnoEvCfg: string[] | undefined;
    apiCollectionEvCfg: string[] | undefined;
    ciCdEvCfg: string[] | undefined;
}


const CreateSubscribeModal: React.FC<CreateSubscribeModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [form] = Form.useForm();

    const [chatBotType, setChatBotType] = useState<CHAT_BOT_TYPE>(CHAT_BOT_QYWX);

    const [projectEvCfgCheckAll, setProjectEvCfgCheckAll] = useState(false);
    const [projectEvCfgIndeterminate, setProjectEvCfgIndeterminate] = useState(false);

    const [docEvCfgCheckAll, setDocEvCfgCheckAll] = useState(false);
    const [docEvCfgIndeterminate, setDocEvCfgIndeterminate] = useState(false);

    const [extEvCfgCheckAll, setExtEvCfgCheckAll] = useState(false);
    const [extEvCfgIndeterminate, setExtEvCfgIndeterminate] = useState(false);

    const [ciCdEvCfgCheckAll, setCiCdEvCfgCheckAll] = useState(false);
    const [ciCdEvCfgIndeterminate, setCiCdEvCfgIndeterminate] = useState(false);

    const [atomgitEvCfgCheckAll, setAtomgitEvCfgCheckAll] = useState(false);
    const [atomgitEvCfgIndeterminate, setAtomgitEvCfgIndeterminate] = useState(false);

    const [giteeEvCfgCheckAll, setGiteeEvCfgCheckAll] = useState(false);
    const [giteeEvCfgIndeterminate, setGiteeEvCfgIndeterminate] = useState(false);

    const [gitlabEvCfgCheckAll, setGitlabEvCfgCheckAll] = useState(false);
    const [gitlabEvCfgIndeterminate, setGitlabEvCfgIndeterminate] = useState(false);

    const [issueEvCfgCheckAll, setIssueEvCfgCheckAll] = useState(false);
    const [issueEvCfgIndeterminate, setIssueEvCfgIndeterminate] = useState(false);

    const [spritEvCfgCheckAll, setSpritEvCfgCheckAll] = useState(false);
    const [spritEvCfgIndeterminate, setSpritEvCfgIndeterminate] = useState(false);

    const [requirementEvCfgCheckAll, setRequirementEvCfgCheckAll] = useState(false);
    const [requirementEvCfgIndeterminate, setRequirementEvCfgIndeterminate] = useState(false);

    const [codeEvCfgCheckAll, setCodeEvCfgCheckAll] = useState(false);
    const [codeEvCfgIndeterminate, setCodeEvCfgIndeterminate] = useState(false);

    const [ideaEvCfgCheckAll, setIdeaEvCfgCheckAll] = useState(false);
    const [ideaEvCfgIndeterminate, setIdeaEvCfgIndeterminate] = useState(false);

    const [dataAnnoEvCfgCheckAll, setDataAnnoEvCfgCheckAll] = useState(false);
    const [dataAnnoEvCfgIndeterminate, setDataAnnoEvCfgIndeterminate] = useState(false);

    const [apiCollectionEvCfgCheckAll, setApiCollectionEvCfgCheckAll] = useState(false);
    const [apiCollectionEvCfgIndeterminate, setApiCollectionEvCfgIndeterminate] = useState(false);

    const createSubscribe = async () => {
        const formValue: FormValue = form.getFieldsValue() as FormValue;
        if (formValue.chatBotName == undefined || formValue.chatBotName == "") {
            message.error("订阅名称不能为空");
            return;
        }
        if (formValue.chatBotAddr == undefined || formValue.chatBotAddr == "") {
            message.error("webhook地址不能为空")
            return;
        }
        if (chatBotType == CHAT_BOT_DING || chatBotType == CHAT_BOT_FS) {
            if (formValue.chatBotSignCode == undefined || formValue.chatBotSignCode == "") {
                message.error("签名密钥不能为空");
            }
        }
        await request(create_subscribe({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            chat_bot_name: formValue.chatBotName,
            chat_bot_type: chatBotType,
            chat_bot_addr: formValue.chatBotAddr,
            chat_bot_sign_code: formValue.chatBotSignCode ?? "",
            event_cfg: {
                project_ev_cfg: calcProjectEvCfg(formValue.projectEvCfg),
                doc_ev_cfg: calcDocEvCfg(formValue.docEvCfg),
                ext_ev_cfg: calcExtEvCfg(formValue.extEvCfg),
                atomgit_ev_cfg: calcAtomgitEvCfg(formValue.atomgitEvCfg),
                gitee_ev_cfg: calcGiteeEvCfg(formValue.giteeEvCfg),
                gitlab_ev_cfg: calcGitlabEvCfg(formValue.gitlabEvCfg),
                issue_ev_cfg: calcIssueEvCfg(formValue.issueEvCfg),
                sprit_ev_cfg: calcSpritEvCfg(formValue.spritEvCfg),
                requirement_ev_cfg: calcRequirementEvCfg(formValue.requirementEvCfg),
                code_ev_cfg: calcCodeEvCfg(formValue.codeEvCfg),
                idea_ev_cfg: calcIdeaEvCfg(formValue.ideaEvCfg),
                data_anno_ev_cfg: calcDataAnnoEvCfg(formValue.dataAnnoEvCfg),
                api_collection_ev_cfg: calcApiCollectionEvCfg(formValue.apiCollectionEvCfg),
                ci_cd_ev_cfg: calcCiCdEvCfg(formValue.ciCdEvCfg)
            },
        }));
        props.onOk();
    };

    return (
        <Modal open title="新增研发事件订阅" onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            props.onCancel();
        }} onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            createSubscribe();
        }}>
            <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                <Form form={form} labelCol={{ span: 7 }}>
                    <Form.Item label="订阅目标" rules={[{ required: true }]} help={
                        <>
                            {chatBotType == CHAT_BOT_QYWX && (
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    shell_open("https://open.work.weixin.qq.com/help2/pc/18401");
                                }}>企业微信webhook接入说明</a>
                            )}
                            {chatBotType == CHAT_BOT_DING && (
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    shell_open("https://open.dingtalk.com/document/isvapp/group-chat-bot-overview");
                                }}>钉钉webhook接入说明</a>
                            )}
                            {chatBotType == CHAT_BOT_FS && (
                                <a onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    shell_open("https://www.feishu.cn/hc/zh-CN/articles/807992406756-webhook-%E8%A7%A6%E5%8F%91%E5%99%A8");
                                }}>飞书webhook接入说明</a>
                            )}
                        </>
                    }>
                        <Select value={chatBotType} onChange={value => setChatBotType(value)}>
                            <Select.Option value={CHAT_BOT_QYWX}>企业微信</Select.Option>
                            <Select.Option value={CHAT_BOT_DING}>钉钉</Select.Option>
                            <Select.Option value={CHAT_BOT_FS}>飞书</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="订阅名称" name="chatBotName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="webhook地址" name="chatBotAddr" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    {(chatBotType == CHAT_BOT_DING || chatBotType == CHAT_BOT_FS) && (
                        <Form.Item label="签名密钥" name="chatBotSignCode" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    )}
                    <Form.Item label={<Checkbox indeterminate={projectEvCfgIndeterminate} checked={projectEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setProjectEvCfgIndeterminate(false);
                        if (projectEvCfgCheckAll) {
                            setProjectEvCfgCheckAll(false);
                            form.setFieldValue("projectEvCfg", []);
                        } else {
                            setProjectEvCfgCheckAll(true);
                            form.setFieldValue("projectEvCfg", projectEvOptionList.map(item => item.value));
                        }
                    }}>项目事件</Checkbox>} name="projectEvCfg">
                        <Checkbox.Group options={projectEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setProjectEvCfgCheckAll(false);
                                setProjectEvCfgIndeterminate(false);
                            } else if (values.length == projectEvOptionList.length) {
                                setProjectEvCfgCheckAll(true);
                                setProjectEvCfgIndeterminate(false);
                            } else {
                                setProjectEvCfgCheckAll(false);
                                setProjectEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={docEvCfgIndeterminate} checked={docEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDocEvCfgIndeterminate(false);
                        if (docEvCfgCheckAll) {
                            setDocEvCfgCheckAll(false);
                            form.setFieldValue("docEvCfg", []);
                        } else {
                            setDocEvCfgCheckAll(true);
                            form.setFieldValue("docEvCfg", docEvOptionList.map(item => item.value));
                        }
                    }}>文档事件</Checkbox>} name="docEvCfg">
                        <Checkbox.Group options={docEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setDocEvCfgCheckAll(false);
                                setDocEvCfgIndeterminate(false);
                            } else if (values.length == docEvOptionList.length) {
                                setDocEvCfgCheckAll(true);
                                setDocEvCfgIndeterminate(false);
                            } else {
                                setDocEvCfgCheckAll(false);
                                setDocEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={extEvCfgIndeterminate} checked={extEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setExtEvCfgIndeterminate(false);
                        if (extEvCfgCheckAll) {
                            setExtEvCfgCheckAll(false);
                            form.setFieldValue("extEvCfg", []);
                        } else {
                            setExtEvCfgCheckAll(true);
                            form.setFieldValue("extEvCfg", extEvOptionList.map(item => item.value));
                        }
                    }}>第三方接入事件</Checkbox>} name="extEvCfg">
                        <Checkbox.Group options={extEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setExtEvCfgCheckAll(false);
                                setExtEvCfgIndeterminate(false);
                            } else if (values.length == extEvOptionList.length) {
                                setExtEvCfgCheckAll(true);
                                setExtEvCfgIndeterminate(false);
                            } else {
                                setExtEvCfgCheckAll(false);
                                setExtEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={ciCdEvCfgIndeterminate} checked={ciCdEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCiCdEvCfgIndeterminate(false);
                        if (ciCdEvCfgCheckAll) {
                            setCiCdEvCfgCheckAll(false);
                            form.setFieldValue("ciCdEvCfg", []);
                        } else {
                            setCiCdEvCfgCheckAll(true);
                            form.setFieldValue("ciCdEvCfg", ciCdEvOptionList.map(item => item.value));
                        }
                    }}>CI/CD事件</Checkbox>} name="ciCdEvCfg">
                        <Checkbox.Group options={ciCdEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setCiCdEvCfgCheckAll(false);
                                setCiCdEvCfgIndeterminate(false);
                            } else if (values.length == ciCdEvOptionList.length) {
                                setCiCdEvCfgCheckAll(true);
                                setCiCdEvCfgIndeterminate(false);
                            } else {
                                setCiCdEvCfgCheckAll(false);
                                setCiCdEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={atomgitEvCfgIndeterminate} checked={atomgitEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAtomgitEvCfgIndeterminate(false);
                        if (atomgitEvCfgCheckAll) {
                            setAtomgitEvCfgCheckAll(false);
                            form.setFieldValue("atomgitEvCfg", []);
                        } else {
                            setAtomgitEvCfgCheckAll(true);
                            form.setFieldValue("atomgitEvCfg", atomgitEvOptionList.map(item => item.value));
                        }
                    }}>atomgit事件</Checkbox>} name="atomgitEvCfg">
                        <Checkbox.Group options={atomgitEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setAtomgitEvCfgCheckAll(false);
                                setAtomgitEvCfgIndeterminate(false);
                            } else if (values.length == atomgitEvOptionList.length) {
                                setAtomgitEvCfgCheckAll(true);
                                setAtomgitEvCfgIndeterminate(false);
                            } else {
                                setAtomgitEvCfgCheckAll(false);
                                setAtomgitEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={giteeEvCfgIndeterminate} checked={giteeEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGiteeEvCfgIndeterminate(false);
                        if (giteeEvCfgCheckAll) {
                            setGiteeEvCfgCheckAll(false);
                            form.setFieldValue("giteeEvCfg", []);
                        } else {
                            setGiteeEvCfgCheckAll(true);
                            form.setFieldValue("giteeEvCfg", giteeEvOptionList.map(item => item.value));
                        }
                    }}>gitee事件</Checkbox>} name="giteeEvCfg">
                        <Checkbox.Group options={giteeEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setGiteeEvCfgCheckAll(false);
                                setGiteeEvCfgIndeterminate(false);
                            } else if (values.length == giteeEvOptionList.length) {
                                setGiteeEvCfgCheckAll(true);
                                setGiteeEvCfgIndeterminate(false);
                            } else {
                                setGiteeEvCfgCheckAll(false);
                                setGiteeEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={gitlabEvCfgIndeterminate} checked={gitlabEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setGitlabEvCfgIndeterminate(false);
                        if (gitlabEvCfgCheckAll) {
                            setGitlabEvCfgCheckAll(false);
                            form.setFieldValue("gitlabEvCfg", []);
                        } else {
                            setGitlabEvCfgCheckAll(true);
                            form.setFieldValue("gitlabEvCfg", gitlabEvOptionList.map(item => item.value));
                        }
                    }}>gitlab事件</Checkbox>} name="gitlabEvCfg">
                        <Checkbox.Group options={gitlabEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setGitlabEvCfgCheckAll(false);
                                setGitlabEvCfgIndeterminate(false);
                            } else if (values.length == gitlabEvOptionList.length) {
                                setGitlabEvCfgCheckAll(true);
                                setGitlabEvCfgIndeterminate(false);
                            } else {
                                setGitlabEvCfgCheckAll(false);
                                setGitlabEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={requirementEvCfgIndeterminate} checked={requirementEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRequirementEvCfgIndeterminate(false);
                        if (requirementEvCfgCheckAll) {
                            setRequirementEvCfgCheckAll(false);
                            form.setFieldValue("requirementEvCfg", []);
                        } else {
                            setRequirementEvCfgCheckAll(true);
                            form.setFieldValue("requirementEvCfg", requirementEvOptionList.map(item => item.value));
                        }
                    }}>需求事件</Checkbox>} name="requirementEvCfg">
                        <Checkbox.Group options={requirementEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setRequirementEvCfgCheckAll(false);
                                setRequirementEvCfgIndeterminate(false);
                            } else if (values.length == requirementEvOptionList.length) {
                                setRequirementEvCfgCheckAll(true);
                                setRequirementEvCfgIndeterminate(false);
                            } else {
                                setRequirementEvCfgCheckAll(false);
                                setRequirementEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={issueEvCfgIndeterminate} checked={issueEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIssueEvCfgIndeterminate(false);
                        if (issueEvCfgCheckAll) {
                            setIssueEvCfgCheckAll(false);
                            form.setFieldValue("issueEvCfg", []);
                        } else {
                            setIssueEvCfgCheckAll(true);
                            form.setFieldValue("issueEvCfg", issueEvOptionList.map(item => item.value));
                        }
                    }}>工单事件</Checkbox>} name="issueEvCfg">
                        <Checkbox.Group options={issueEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setIssueEvCfgCheckAll(false);
                                setIssueEvCfgIndeterminate(false);
                            } else if (values.length == issueEvOptionList.length) {
                                setIssueEvCfgCheckAll(true);
                                setIssueEvCfgIndeterminate(false);
                            } else {
                                setIssueEvCfgCheckAll(false);
                                setIssueEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={spritEvCfgIndeterminate} checked={spritEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSpritEvCfgIndeterminate(false);
                        if (spritEvCfgCheckAll) {
                            setSpritEvCfgCheckAll(false);
                            form.setFieldValue("spritEvCfg", []);
                        } else {
                            setSpritEvCfgCheckAll(true);
                            form.setFieldValue("spritEvCfg", spritEvOptionList.map(item => item.value));
                        }
                    }}>工作计划事件</Checkbox>} name="spritEvCfg">
                        <Checkbox.Group options={spritEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setSpritEvCfgCheckAll(false);
                                setSpritEvCfgIndeterminate(false);
                            } else if (values.length == spritEvOptionList.length) {
                                setSpritEvCfgCheckAll(true);
                                setSpritEvCfgIndeterminate(false);
                            } else {
                                setSpritEvCfgCheckAll(false);
                                setSpritEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={codeEvCfgIndeterminate} checked={codeEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCodeEvCfgIndeterminate(false);
                        if (codeEvCfgCheckAll) {
                            setCodeEvCfgCheckAll(false);
                            form.setFieldValue("codeEvCfg", []);
                        } else {
                            setCodeEvCfgCheckAll(true);
                            form.setFieldValue("codeEvCfg", codeEvOptionList.map(item => item.value));
                        }
                    }}>代码事件</Checkbox>} name="codeEvCfg">
                        <Checkbox.Group options={codeEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setCodeEvCfgCheckAll(false);
                                setCodeEvCfgIndeterminate(false);
                            } else if (values.length == codeEvOptionList.length) {
                                setCodeEvCfgCheckAll(true);
                                setCodeEvCfgIndeterminate(false);
                            } else {
                                setCodeEvCfgCheckAll(false);
                                setCodeEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>

                    <Form.Item label={<Checkbox indeterminate={ideaEvCfgIndeterminate} checked={ideaEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIdeaEvCfgIndeterminate(false);
                        if (ideaEvCfgCheckAll) {
                            setIdeaEvCfgCheckAll(false);
                            form.setFieldValue("ideaEvCfg", []);
                        } else {
                            setIdeaEvCfgCheckAll(true);
                            form.setFieldValue("ideaEvCfg", ideaEvOptionList.map(item => item.value));
                        }
                    }}>知识点事件</Checkbox>} name="ideaEvCfg">
                        <Checkbox.Group options={ideaEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setIdeaEvCfgCheckAll(false);
                                setIdeaEvCfgIndeterminate(false);
                            } else if (values.length == ideaEvOptionList.length) {
                                setIdeaEvCfgCheckAll(true);
                                setIdeaEvCfgIndeterminate(false);
                            } else {
                                setIdeaEvCfgCheckAll(false);
                                setIdeaEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>

                    <Form.Item label={<Checkbox indeterminate={dataAnnoEvCfgIndeterminate} checked={dataAnnoEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDataAnnoEvCfgIndeterminate(false);
                        if (dataAnnoEvCfgCheckAll) {
                            setDataAnnoEvCfgCheckAll(false);
                            form.setFieldValue("dataAnnoEvCfg", []);
                        } else {
                            setDataAnnoEvCfgCheckAll(true);
                            form.setFieldValue("dataAnnoEvCfg", dataAnnoEvOptionList.map(item => item.value));
                        }
                    }}>数据标注事件</Checkbox>} name="dataAnnoEvCfg">
                        <Checkbox.Group options={dataAnnoEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setDataAnnoEvCfgCheckAll(false);
                                setDataAnnoEvCfgIndeterminate(false);
                            } else if (values.length == dataAnnoEvOptionList.length) {
                                setDataAnnoEvCfgCheckAll(true);
                                setDataAnnoEvCfgIndeterminate(false);
                            } else {
                                setDataAnnoEvCfgCheckAll(false);
                                setDataAnnoEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>

                    <Form.Item label={<Checkbox indeterminate={apiCollectionEvCfgIndeterminate} checked={apiCollectionEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setApiCollectionEvCfgIndeterminate(false);
                        if (apiCollectionEvCfgCheckAll) {
                            setApiCollectionEvCfgCheckAll(false);
                            form.setFieldValue("apiCollectionEvCfg", []);
                        } else {
                            setApiCollectionEvCfgCheckAll(true);
                            form.setFieldValue("apiCollectionEvCfg", apiCollectionEvOptionList.map(item => item.value));
                        }
                    }}>接口集合事件</Checkbox>} name="apiCollectionEvCfg">
                        <Checkbox.Group options={apiCollectionEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setApiCollectionEvCfgCheckAll(false);
                                setApiCollectionEvCfgIndeterminate(false);
                            } else if (values.length == apiCollectionEvOptionList.length) {
                                setApiCollectionEvCfgCheckAll(true);
                                setApiCollectionEvCfgIndeterminate(false);
                            } else {
                                setApiCollectionEvCfgCheckAll(false);
                                setApiCollectionEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>

                </Form>
            </div>
        </Modal>
    );
}

export default observer(CreateSubscribeModal);

