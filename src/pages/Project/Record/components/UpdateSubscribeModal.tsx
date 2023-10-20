import React, { useState } from "react";
import type { SubscribeInfo } from '@/api/events_subscribe';
import { update as update_subscribe } from '@/api/events_subscribe';
import { Checkbox, Form, Input, Modal } from "antd";
import { useStores } from "@/hooks";
import {
    apiCollectionEvOptionList,
    atomgitEvOptionList,
    calcApiCollectionEvCfg,
    calcAtomgitEvCfg,
    calcCiCdEvCfg,
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
    ciCdEvOptionList,
    codeEvOptionList,
    dataAnnoEvOptionList,
    docEvOptionList,
    extEvOptionList,
    genApiCollectionEvCfgValues,
    genAtomgitEvCfgValues,
    genCiCdEvCfgValues,
    genCodeEvCfgValues,
    genDataAnnoEvCfgValues,
    genDocEvCfgValues,
    genExtEvCfgValues,
    genGiteeEvCfgValues,
    genGitlabEvCfgValues,
    genIdeaEvCfgValues,
    genIssueEvCfgValues,
    genProjectEvCfgValues,
    genRequirementEvCfgValues,
    genSpritEvCfgValues,
    giteeEvOptionList,
    gitlabEvOptionList,
    ideaEvOptionList,
    issueEvOptionList,
    projectEvOptionList,
    requirementEvOptionList,
    spritEvOptionList,
} from "./constants";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";


interface UpdateSubscribeModalProps {
    subscribe: SubscribeInfo;
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    chatBotName: string | undefined;
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

const UpdateSubscribeModal: React.FC<UpdateSubscribeModalProps> = (props) => {
    const userStore = useStores('userStore');

    const [form] = Form.useForm();

    const projectEvCfgValues = genProjectEvCfgValues(props.subscribe.event_cfg.project_ev_cfg);
    const [projectEvCfgCheckAll, setProjectEvCfgCheckAll] = useState(projectEvCfgValues.length == projectEvOptionList.length);
    const [projectEvCfgIndeterminate, setProjectEvCfgIndeterminate] = useState(projectEvCfgValues.length > 0 && projectEvCfgValues.length < projectEvOptionList.length);

    const docEvCfgValues = genDocEvCfgValues(props.subscribe.event_cfg.doc_ev_cfg);
    const [docEvCfgCheckAll, setDocEvCfgCheckAll] = useState(docEvCfgValues.length == docEvOptionList.length);
    const [docEvCfgIndeterminate, setDocEvCfgIndeterminate] = useState(docEvCfgValues.length > 0 && docEvCfgValues.length < docEvOptionList.length);

    const extEvCfgValues = genExtEvCfgValues(props.subscribe.event_cfg.ext_ev_cfg);
    const [extEvCfgCheckAll, setExtEvCfgCheckAll] = useState(extEvCfgValues.length == extEvOptionList.length);
    const [extEvCfgIndeterminate, setExtEvCfgIndeterminate] = useState(extEvCfgValues.length > 0 && extEvCfgValues.length < extEvOptionList.length);

    const ciCdEvCfgValues = genCiCdEvCfgValues(props.subscribe.event_cfg.ci_cd_ev_cfg);
    const [ciCdEvCfgCheckAll, setCiCdEvCfgCheckAll] = useState(ciCdEvCfgValues.length == ciCdEvOptionList.length);
    const [ciCdEvCfgIndeterminate, setCiCdEvCfgIndeterminate] = useState(ciCdEvCfgValues.length > 0 && ciCdEvCfgValues.length < ciCdEvOptionList.length);

    const atomgitEvCfgValues = genAtomgitEvCfgValues(props.subscribe.event_cfg.atomgit_ev_cfg);
    const [atomgitEvCfgCheckAll, setAtomgitEvCfgCheckAll] = useState(atomgitEvCfgValues.length == atomgitEvOptionList.length);
    const [atomgitEvCfgIndeterminate, setAtomgitEvCfgIndeterminate] = useState(atomgitEvCfgValues.length > 0 && atomgitEvCfgValues.length < atomgitEvOptionList.length);

    const giteeEvCfgValues = genGiteeEvCfgValues(props.subscribe.event_cfg.gitee_ev_cfg);
    const [giteeEvCfgCheckAll, setGiteeEvCfgCheckAll] = useState(giteeEvCfgValues.length == giteeEvOptionList.length);
    const [giteeEvCfgIndeterminate, setGiteeEvCfgIndeterminate] = useState(giteeEvCfgValues.length > 0 && giteeEvCfgValues.length < giteeEvOptionList.length);

    const gitlabEvCfgValues = genGitlabEvCfgValues(props.subscribe.event_cfg.gitlab_ev_cfg);
    const [gitlabEvCfgCheckAll, setGitlabEvCfgCheckAll] = useState(gitlabEvCfgValues.length == gitlabEvOptionList.length);
    const [gitlabEvCfgIndeterminate, setGitlabEvCfgIndeterminate] = useState(gitlabEvCfgValues.length > 0 && gitlabEvCfgValues.length < gitlabEvOptionList.length);

    const issueEvCfgValues = genIssueEvCfgValues(props.subscribe.event_cfg.issue_ev_cfg);
    const [issueEvCfgCheckAll, setIssueEvCfgCheckAll] = useState(issueEvCfgValues.length == issueEvOptionList.length);
    const [issueEvCfgIndeterminate, setIssueEvCfgIndeterminate] = useState(issueEvCfgValues.length > 0 && issueEvCfgValues.length < issueEvOptionList.length);

    const spritEvCfgValues = genSpritEvCfgValues(props.subscribe.event_cfg.sprit_ev_cfg);
    const [spritEvCfgCheckAll, setSpritEvCfgCheckAll] = useState(spritEvCfgValues.length == spritEvOptionList.length);
    const [spritEvCfgIndeterminate, setSpritEvCfgIndeterminate] = useState(spritEvCfgValues.length > 0 && spritEvCfgValues.length < spritEvOptionList.length);

    const requirementEvCfgValues = genRequirementEvCfgValues(props.subscribe.event_cfg.requirement_ev_cfg);
    const [requirementEvCfgCheckAll, setRequirementEvCfgCheckAll] = useState(requirementEvCfgValues.length == requirementEvOptionList.length);
    const [requirementEvCfgIndeterminate, setRequirementEvCfgIndeterminate] = useState(requirementEvCfgValues.length > 0 && requirementEvCfgValues.length < requirementEvOptionList.length);

    const codeEvCfgValues = genCodeEvCfgValues(props.subscribe.event_cfg.code_ev_cfg);
    const [codeEvCfgCheckAll, setCodeEvCfgCheckAll] = useState(codeEvCfgValues.length == codeEvOptionList.length);
    const [codeEvCfgIndeterminate, setCodeEvCfgIndeterminate] = useState(codeEvCfgValues.length > 0 && codeEvCfgValues.length < codeEvOptionList.length);

    const ideaEvCfgValues = genIdeaEvCfgValues(props.subscribe.event_cfg.idea_ev_cfg);
    const [ideaEvCfgCheckAll, setIdeaEvCfgCheckAll] = useState(ideaEvCfgValues.length == ideaEvOptionList.length);
    const [ideaEvCfgIndeterminate, setIdeaEvCfgIndeterminate] = useState(ideaEvCfgValues.length > 0 && ideaEvCfgValues.length < ideaEvOptionList.length);

    const dataAnnoEvCfgValues = genDataAnnoEvCfgValues(props.subscribe.event_cfg.data_anno_ev_cfg);
    const [dataAnnoEvCfgCheckAll, setDataAnnoEvCfgCheckAll] = useState(dataAnnoEvCfgValues.length == dataAnnoEvOptionList.length);
    const [dataAnnoEvCfgIndeterminate, setDataAnnoEvCfgIndeterminate] = useState(dataAnnoEvCfgValues.length > 0 && dataAnnoEvCfgValues.length < dataAnnoEvOptionList.length);

    const apiCollectionEvCfgValues = genApiCollectionEvCfgValues(props.subscribe.event_cfg.api_collection_ev_cfg);
    const [apiCollectionEvCfgCheckAll, setApiCollectionEvCfgCheckAll] = useState(apiCollectionEvCfgValues.length == apiCollectionEvOptionList.length);
    const [apiCollectionEvCfgIndeterminate, setApiCollectionEvCfgIndeterminate] = useState(apiCollectionEvCfgValues.length > 0 && apiCollectionEvCfgValues.length < apiCollectionEvOptionList.length);

    const updateSubscribe = async () => {
        const formValue: FormValue = form.getFieldsValue() as FormValue;
        if (formValue.chatBotName == undefined || formValue.chatBotName == "") {
            formValue.chatBotName = props.subscribe.chat_bot_name;
        }
        await request(update_subscribe({
            session_id: userStore.sessionId,
            project_id: props.subscribe.project_id,
            subscribe_id: props.subscribe.subscribe_id,
            chat_bot_name: formValue.chatBotName,
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
                ci_cd_ev_cfg: calcCiCdEvCfg(formValue.ciCdEvCfg),
            },
        }));
        props.onOk();
    };

    return (
        <Modal open title="修改研发事件订阅" onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            props.onCancel();
        }} onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            updateSubscribe();
        }}>
            <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                <Form form={form} labelCol={{ span: 7 }} initialValues={{
                    "projectEvCfg": projectEvCfgValues,
                    "docEvCfg": docEvCfgValues,
                    "extEvCfg": extEvCfgValues,
                    "atomgitEvcfg": atomgitEvCfgValues,
                    "giteeEvCfg": giteeEvCfgValues,
                    "gitlabEvCfg": gitlabEvCfgValues,
                    "issueEvCfg": issueEvCfgValues,
                    "spritEvCfg": spritEvCfgValues,
                    "requirementEvCfg": requirementEvCfgValues,
                    "codeEvCfg": codeEvCfgValues,
                    "ideaEvCfg": ideaEvCfgValues,
                }}>
                    <Form.Item label="订阅名称" name="chatBotName" rules={[{ required: true }]}>
                        <Input defaultValue={props.subscribe.chat_bot_name} />
                    </Form.Item>
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
export default observer(UpdateSubscribeModal);
