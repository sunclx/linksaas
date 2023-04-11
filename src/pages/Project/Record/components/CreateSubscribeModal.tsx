import { Form, Modal, Checkbox, Select, Input, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { bookMarkEvOptionList, bookShelfEvOptionList, calcBookMarkEvCfg, calcBookShelfEvCfg, calcCodeEvCfg, calcDocEvCfg, calcEarthlyEvCfg, calcExtEvCfg, calcGiteeEvCfg, calcGitlabEvCfg, calcIdeaEvCfg, calcIssueEvCfg, calcProjectEvCfg, calcRequirementEvCfg, calcRobotEvCfg, calcScriptEvCfg, calcSpritEvCfg, calcTestCaseEvCfg, codeEvOptionList, docEvOptionList, earthlyEvOptionList, extEvOptionList, giteeEvOptionList, gitlabEvOptionList, ideaEvOptionList, issueEvOptionList, projectEvOptionList, requirementEvOptionList, robotEvOptionList, scriptEvOptionList, spritEvOptionList, testCaseEvOptionList } from "./constants";
import { CHAT_BOT_QYWX, CHAT_BOT_DING, CHAT_BOT_FS, create as create_subscribe } from '@/api/events_subscribe';
import type { CHAT_BOT_TYPE } from '@/api/events_subscribe';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";

interface CreateSubscribeModalProps {
    onCancel: () => void;
    onOk: () => void;
}

interface FormValue {
    chatBotName: string | undefined;
    chatBotAddr: string | undefined;
    chatBotSignCode: string | undefined;
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
    bookMarkEvCfg: string[] | undefined;
}


const CreateSubscribeModal: React.FC<CreateSubscribeModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [form] = Form.useForm();

    const [chatBotType, setChatBotType] = useState<CHAT_BOT_TYPE>(CHAT_BOT_QYWX);

    const [projectEvCfgCheckAll, setProjectEvCfgCheckAll] = useState(false);
    const [projectEvCfgIndeterminate, setProjectEvCfgIndeterminate] = useState(false);

    const [bookShelfEvCfgCheckAll, setBookShelfEvCfgCheckAll] = useState(false);
    const [bookShelfEvCfgIndeterminate, setBookShelfEvCfgIndeterminate] = useState(false);

    const [docEvCfgCheckAll, setDocEvCfgCheckAll] = useState(false);
    const [docEvCfgIndeterminate, setDocEvCfgIndeterminate] = useState(false);

    const [earthlyEvCfgCheckAll, setEarthlyEvCfgCheckAll] = useState(false);
    const [earthlyEvCfgIndeterminate, setEarthlyEvCfgIndeterminate] = useState(false);

    const [scriptEvCfgCheckAll, setScriptEvCfgCheckAll] = useState(false);
    const [scriptEvCfgIndeterminate, setScriptEvCfgIndeterminate] = useState(false);

    const [extEvCfgCheckAll, setExtEvCfgCheckAll] = useState(false);
    const [extEvCfgIndeterminate, setExtEvCfgIndeterminate] = useState(false);

    const [giteeEvCfgCheckAll, setGiteeEvCfgCheckAll] = useState(false);
    const [giteeEvCfgIndeterminate, setGiteeEvCfgIndeterminate] = useState(false);

    const [gitlabEvCfgCheckAll, setGitlabEvCfgCheckAll] = useState(false);
    const [gitlabEvCfgIndeterminate, setGitlabEvCfgIndeterminate] = useState(false);

    const [issueEvCfgCheckAll, setIssueEvCfgCheckAll] = useState(false);
    const [issueEvCfgIndeterminate, setIssueEvCfgIndeterminate] = useState(false);

    const [robotEvCfgCheckAll, setRobotEvCfgCheckAll] = useState(false);
    const [robotEvCfgIndeterminate, setRobotEvCfgIndeterminate] = useState(false);

    const [spritEvCfgCheckAll, setSpritEvCfgCheckAll] = useState(false);
    const [spritEvCfgIndeterminate, setSpritEvCfgIndeterminate] = useState(false);

    const [testCaseEvCfgCheckAll, setTestCaseEvCfgCheckAll] = useState(false);
    const [testCaseEvCfgIndeterminate, setTestCaseEvCfgIndeterminate] = useState(false);

    const [requirementEvCfgCheckAll, setRequirementEvCfgCheckAll] = useState(false);
    const [requirementEvCfgIndeterminate, setRequirementEvCfgIndeterminate] = useState(false);

    const [codeEvCfgCheckAll, setCodeEvCfgCheckAll] = useState(false);
    const [codeEvCfgIndeterminate, setCodeEvCfgIndeterminate] = useState(false);

    const [ideaEvCfgCheckAll, setIdeaEvCfgCheckAll] = useState(false);
    const [ideaEvCfgIndeterminate, setIdeaEvCfgIndeterminate] = useState(false);

    const [bookMarkEvCfgCheckAll, setBookMarkEvCfgCheckAll] = useState(false);
    const [bookMarkEvCfgIndeterminate, setBookMarkEvCfgIndeterminate] = useState(false);

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
                book_mark_ev_cfg: calcBookMarkEvCfg(formValue.bookMarkEvCfg),
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
                    <Form.Item label="订阅目标" rules={[{ required: true }]}>
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
                    }}>迭代事件</Checkbox>} name="spritEvCfg">
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

                    <Form.Item label={<Checkbox indeterminate={bookMarkEvCfgIndeterminate} checked={bookMarkEvCfgCheckAll} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setBookMarkEvCfgIndeterminate(false);
                        if (bookMarkEvCfgCheckAll) {
                            setBookMarkEvCfgCheckAll(false);
                            form.setFieldValue("bookMarkEvCfg", []);
                        } else {
                            setBookMarkEvCfgCheckAll(true);
                            form.setFieldValue("bookMarkEvCfg", bookMarkEvOptionList.map(item => item.value));
                        }
                    }}>书签事件</Checkbox>} name="bookMarkEvCfg">
                        <Checkbox.Group options={bookMarkEvOptionList} onChange={values => {
                            if (values.length == 0) {
                                setBookMarkEvCfgCheckAll(false);
                                setBookMarkEvCfgIndeterminate(false);
                            } else if (values.length == bookMarkEvOptionList.length) {
                                setBookMarkEvCfgCheckAll(true);
                                setBookMarkEvCfgIndeterminate(false);
                            } else {
                                setBookMarkEvCfgCheckAll(false);
                                setBookMarkEvCfgIndeterminate(true);
                            }
                        }} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default observer(CreateSubscribeModal);
