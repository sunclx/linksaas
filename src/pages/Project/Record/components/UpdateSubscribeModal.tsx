import React, { useState } from "react";
import type { SubscribeInfo } from '@/api/events_subscribe';
import { update as update_subscribe } from '@/api/events_subscribe';
import { Checkbox, Form, Input, Modal } from "antd";
import { useStores } from "@/hooks";
import { bookShelfEvOptionList, calcBookShelfEvCfg, calcCodeEvCfg, calcDataAnnoEvCfg, calcDocEvCfg, calcEarthlyEvCfg, calcExtEvCfg, calcGiteeEvCfg, calcGitlabEvCfg, calcIdeaEvCfg, calcIssueEvCfg, calcProjectEvCfg, calcRequirementEvCfg, calcRobotEvCfg, calcScriptEvCfg, calcSpritEvCfg, calcTestCaseEvCfg, codeEvOptionList, dataAnnoEvOptionList, docEvOptionList, earthlyEvOptionList, extEvOptionList, genBookShelfEvCfgValues, genCodeEvCfgValues, genDataAnnoEvCfgValues, genDocEvCfgValues, genEarthlyEvCfgValues, genExtEvCfgValues, genGiteeEvCfgValues, genGitlabEvCfgValues, genIdeaEvCfgValues, genIssueEvCfgValues, genProjectEvCfgValues, genRequirementEvCfgValues, genRobotEvCfgValues, genScriptEvCfgValues, genSpritEvCfgValues, genTestCaseEvCfgValues, giteeEvOptionList, gitlabEvOptionList, ideaEvOptionList, issueEvOptionList, projectEvOptionList, requirementEvOptionList, robotEvOptionList, scriptEvOptionList, spritEvOptionList, testCaseEvOptionList } from "./constants";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";


interface UpdateSubscribeModalProps {
    subscribe: SubscribeInfo;
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    chatBotName: string | undefined;
    bookShelfEvCfg: string[] | undefined;
    docEvCfg: string[] | undefined;
    earthlyEvCfg: string[] | undefined;
    extEvCfg: string[] | undefined;
    giteeEvCfg: string[] | undefined;
    gitlabEvCfg: string[] | undefined;
    issueEvCfg: string[] | undefined;
    projectEvCfg: string[] | undefined;
    robotEvCfg: string[] | undefined;
    spritEvCfg: string[] | undefined;
    testCaseEvCfg: string[] | undefined;
    scriptEvCfg: string[] | undefined;
    requirementEvCfg: string[] | undefined;
    codeEvCfg: string[] | undefined;
    ideaEvCfg: string[] | undefined;
    dataAnnoEvCfg: string[] | undefined;
}

const UpdateSubscribeModal: React.FC<UpdateSubscribeModalProps> = (props) => {
    const userStore = useStores('userStore');

    const [form] = Form.useForm();

    const projectEvCfgValues = genProjectEvCfgValues(props.subscribe.event_cfg.project_ev_cfg);
    const [projectEvCfgCheckAll, setProjectEvCfgCheckAll] = useState(projectEvCfgValues.length == projectEvOptionList.length);
    const [projectEvCfgIndeterminate, setProjectEvCfgIndeterminate] = useState(projectEvCfgValues.length > 0 && projectEvCfgValues.length < projectEvOptionList.length);

    const bookShelfEvCfgValues = genBookShelfEvCfgValues(props.subscribe.event_cfg.book_shelf_ev_cfg);
    const [bookShelfEvCfgCheckAll, setBookShelfEvCfgCheckAll] = useState(bookShelfEvCfgValues.length == bookShelfEvOptionList.length);
    const [bookShelfEvCfgIndeterminate, setBookShelfEvCfgIndeterminate] = useState(bookShelfEvCfgValues.length > 0 && bookShelfEvCfgValues.length < bookShelfEvOptionList.length);

    const docEvCfgValues = genDocEvCfgValues(props.subscribe.event_cfg.doc_ev_cfg);
    const [docEvCfgCheckAll, setDocEvCfgCheckAll] = useState(docEvCfgValues.length == docEvOptionList.length);
    const [docEvCfgIndeterminate, setDocEvCfgIndeterminate] = useState(docEvCfgValues.length > 0 && docEvCfgValues.length < docEvOptionList.length);

    const earthlyEvCfgValues = genEarthlyEvCfgValues(props.subscribe.event_cfg.earthly_ev_cfg);
    const [earthlyEvCfgCheckAll, setEarthlyEvCfgCheckAll] = useState(earthlyEvCfgValues.length == earthlyEvOptionList.length);
    const [earthlyEvCfgIndeterminate, setEarthlyEvCfgIndeterminate] = useState(earthlyEvCfgValues.length > 0 && earthlyEvCfgValues.length < earthlyEvOptionList.length);

    const scriptEvCfgValues = genScriptEvCfgValues(props.subscribe.event_cfg.script_ev_cfg);
    const [scriptEvCfgCheckAll, setScriptEvCfgCheckAll] = useState(scriptEvCfgValues.length == scriptEvOptionList.length);
    const [scriptEvCfgIndeterminate, setScriptEvCfgIndeterminate] = useState(scriptEvCfgValues.length > 0 && scriptEvCfgValues.length < scriptEvOptionList.length);

    const extEvCfgValues = genExtEvCfgValues(props.subscribe.event_cfg.ext_ev_cfg);
    const [extEvCfgCheckAll, setExtEvCfgCheckAll] = useState(extEvCfgValues.length == extEvOptionList.length);
    const [extEvCfgIndeterminate, setExtEvCfgIndeterminate] = useState(extEvCfgValues.length > 0 && extEvCfgValues.length < extEvOptionList.length);

    const giteeEvCfgValues = genGiteeEvCfgValues(props.subscribe.event_cfg.gitee_ev_cfg);
    const [giteeEvCfgCheckAll, setGiteeEvCfgCheckAll] = useState(giteeEvCfgValues.length == giteeEvOptionList.length);
    const [giteeEvCfgIndeterminate, setGiteeEvCfgIndeterminate] = useState(giteeEvCfgValues.length > 0 && giteeEvCfgValues.length < giteeEvOptionList.length);

    const gitlabEvCfgValues = genGitlabEvCfgValues(props.subscribe.event_cfg.gitlab_ev_cfg);
    const [gitlabEvCfgCheckAll, setGitlabEvCfgCheckAll] = useState(gitlabEvCfgValues.length == gitlabEvOptionList.length);
    const [gitlabEvCfgIndeterminate, setGitlabEvCfgIndeterminate] = useState(gitlabEvCfgValues.length > 0 && gitlabEvCfgValues.length < gitlabEvOptionList.length);

    const issueEvCfgValues = genIssueEvCfgValues(props.subscribe.event_cfg.issue_ev_cfg);
    const [issueEvCfgCheckAll, setIssueEvCfgCheckAll] = useState(issueEvCfgValues.length == issueEvOptionList.length);
    const [issueEvCfgIndeterminate, setIssueEvCfgIndeterminate] = useState(issueEvCfgValues.length > 0 && issueEvCfgValues.length < issueEvOptionList.length);

    const robotEvCfgValues = genRobotEvCfgValues(props.subscribe.event_cfg.robot_ev_cfg);
    const [robotEvCfgCheckAll, setRobotEvCfgCheckAll] = useState(robotEvCfgValues.length == robotEvOptionList.length);
    const [robotEvCfgIndeterminate, setRobotEvCfgIndeterminate] = useState(robotEvCfgValues.length > 0 && robotEvCfgValues.length < robotEvOptionList.length);

    const spritEvCfgValues = genSpritEvCfgValues(props.subscribe.event_cfg.sprit_ev_cfg);
    const [spritEvCfgCheckAll, setSpritEvCfgCheckAll] = useState(spritEvCfgValues.length == spritEvOptionList.length);
    const [spritEvCfgIndeterminate, setSpritEvCfgIndeterminate] = useState(spritEvCfgValues.length > 0 && spritEvCfgValues.length < spritEvOptionList.length);

    const testCaseEvCfgValues = genTestCaseEvCfgValues(props.subscribe.event_cfg.test_case_ev_cfg);
    const [testCaseEvCfgCheckAll, setTestCaseEvCfgCheckAll] = useState(testCaseEvCfgValues.length == testCaseEvOptionList.length);
    const [testCaseEvCfgIndeterminate, setTestCaseEvCfgIndeterminate] = useState(testCaseEvCfgValues.length > 0 && testCaseEvCfgValues.length < testCaseEvOptionList.length);

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
                book_shelf_ev_cfg: calcBookShelfEvCfg(formValue.bookShelfEvCfg),
                doc_ev_cfg: calcDocEvCfg(formValue.docEvCfg),
                earthly_ev_cfg: calcEarthlyEvCfg(formValue.earthlyEvCfg),
                ext_ev_cfg: calcExtEvCfg(formValue.extEvCfg),
                gitee_ev_cfg: calcGiteeEvCfg(formValue.giteeEvCfg),
                gitlab_ev_cfg: calcGitlabEvCfg(formValue.gitlabEvCfg),
                issue_ev_cfg: calcIssueEvCfg(formValue.issueEvCfg),
                robot_ev_cfg: calcRobotEvCfg(formValue.robotEvCfg),
                sprit_ev_cfg: calcSpritEvCfg(formValue.spritEvCfg),
                test_case_ev_cfg: calcTestCaseEvCfg(formValue.testCaseEvCfg),
                script_ev_cfg: calcScriptEvCfg(formValue.scriptEvCfg),
                requirement_ev_cfg: calcRequirementEvCfg(formValue.requirementEvCfg),
                code_ev_cfg: calcCodeEvCfg(formValue.codeEvCfg),
                idea_ev_cfg: calcIdeaEvCfg(formValue.ideaEvCfg),
                data_anno_ev_cfg: calcDataAnnoEvCfg(formValue.dataAnnoEvCfg),
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
                    "bookShelfEvCfg": bookShelfEvCfgValues,
                    "docEvCfg": docEvCfgValues,
                    "earthlyEvCfg": earthlyEvCfgValues,
                    "scriptEvCfg": scriptEvCfgValues,
                    "extEvCfg": extEvCfgValues,
                    "giteeEvCfg": giteeEvCfgValues,
                    "gitlabEvCfg": gitlabEvCfgValues,
                    "issueEvCfg": issueEvCfgValues,
                    "robotEvCfg": robotEvCfgValues,
                    "spritEvCfg": spritEvCfgValues,
                    "testCaseEvCfg": testCaseEvCfgValues,
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
                    <Form.Item label={<Checkbox indeterminate={bookShelfEvCfgIndeterminate} checked={bookShelfEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setBookShelfEvCfgIndeterminate(false);
                        if (bookShelfEvCfgCheckAll) {
                            setBookShelfEvCfgCheckAll(false);
                            form.setFieldValue("bookShelfEvCfg", []);
                        } else {
                            setBookShelfEvCfgCheckAll(true);
                            form.setFieldValue("bookShelfEvCfg", bookShelfEvOptionList.map(item => item.value));
                        }
                    }}>电子书事件</Checkbox>} name="bookShelfEvCfg">
                        <Checkbox.Group options={bookShelfEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setBookShelfEvCfgCheckAll(false);
                                setBookShelfEvCfgIndeterminate(false);
                            } else if (values.length == bookShelfEvOptionList.length) {
                                setBookShelfEvCfgCheckAll(true);
                                setBookShelfEvCfgIndeterminate(false);
                            } else {
                                setBookShelfEvCfgCheckAll(false);
                                setBookShelfEvCfgIndeterminate(true);
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
                    <Form.Item label={<Checkbox indeterminate={earthlyEvCfgIndeterminate} checked={earthlyEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEarthlyEvCfgIndeterminate(false);
                        if (earthlyEvCfgCheckAll) {
                            setEarthlyEvCfgCheckAll(false);
                            form.setFieldValue("earthlyEvCfg", []);
                        } else {
                            setEarthlyEvCfgCheckAll(true);
                            form.setFieldValue("earthlyEvCfg", earthlyEvOptionList.map(item => item.value));
                        }
                    }}>自动化事件</Checkbox>} name="earthlyEvCfg">
                        <Checkbox.Group options={earthlyEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setEarthlyEvCfgCheckAll(false);
                                setEarthlyEvCfgIndeterminate(false);
                            } else if (values.length == earthlyEvOptionList.length) {
                                setEarthlyEvCfgCheckAll(true);
                                setEarthlyEvCfgIndeterminate(false);
                            } else {
                                setEarthlyEvCfgCheckAll(false);
                                setEarthlyEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label={<Checkbox indeterminate={scriptEvCfgIndeterminate} checked={scriptEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setScriptEvCfgIndeterminate(false);
                        if (scriptEvCfgCheckAll) {
                            setScriptEvCfgCheckAll(false);
                            form.setFieldValue("scriptEvCfg", []);
                        } else {
                            setScriptEvCfgCheckAll(true);
                            form.setFieldValue("scriptEvCfg", scriptEvOptionList.map(item => item.value));
                        }
                    }}>服务端脚本事件</Checkbox>} name="scriptEvCfg">
                        <Checkbox.Group options={scriptEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setScriptEvCfgCheckAll(false);
                                setScriptEvCfgIndeterminate(false);
                            } else if (values.length == scriptEvOptionList.length) {
                                setScriptEvCfgCheckAll(true);
                                setScriptEvCfgIndeterminate(false);
                            } else {
                                setScriptEvCfgCheckAll(false);
                                setScriptEvCfgIndeterminate(true);
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
                    <Form.Item label={<Checkbox indeterminate={robotEvCfgIndeterminate} checked={robotEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRobotEvCfgIndeterminate(false);
                        if (robotEvCfgCheckAll) {
                            setRobotEvCfgCheckAll(false);
                            form.setFieldValue("robotEvCfg", []);
                        } else {
                            setRobotEvCfgCheckAll(true);
                            form.setFieldValue("robotEvCfg", robotEvOptionList.map(item => item.value));
                        }
                    }}>服务器事件</Checkbox>} name="robotEvCfg">
                        <Checkbox.Group options={robotEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setRobotEvCfgCheckAll(false);
                                setRobotEvCfgIndeterminate(false);
                            } else if (values.length == robotEvOptionList.length) {
                                setRobotEvCfgCheckAll(true);
                                setRobotEvCfgIndeterminate(false);
                            } else {
                                setRobotEvCfgCheckAll(false);
                                setRobotEvCfgIndeterminate(true);
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
                    <Form.Item label={<Checkbox indeterminate={testCaseEvCfgIndeterminate} checked={testCaseEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTestCaseEvCfgIndeterminate(false);
                        if (testCaseEvCfgCheckAll) {
                            setTestCaseEvCfgCheckAll(false);
                            form.setFieldValue("testCaseEvCfg", []);
                        } else {
                            setTestCaseEvCfgCheckAll(true);
                            form.setFieldValue("testCaseEvCfg", testCaseEvOptionList.map(item => item.value));
                        }
                    }}>测试用例事件</Checkbox>} name="testCaseEvCfg">
                        <Checkbox.Group options={testCaseEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setTestCaseEvCfgCheckAll(false);
                                setTestCaseEvCfgIndeterminate(false);
                            } else if (values.length == testCaseEvOptionList.length) {
                                setTestCaseEvCfgCheckAll(true);
                                setTestCaseEvCfgIndeterminate(false);
                            } else {
                                setTestCaseEvCfgCheckAll(false);
                                setTestCaseEvCfgIndeterminate(true);
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

                </Form>
            </div>
        </Modal>
    );
}
export default observer(UpdateSubscribeModal);
