import { Form, Modal, Checkbox } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import { bookShelfEvOptionList, docEvOptionList, earthlyEvOptionList, extEvOptionList, giteeEvOptionList, gitlabEvOptionList, issueEvOptionList, projectEvOptionList, robotEvOptionList, spritEvOptionList, testCaseEvOptionList } from "./constants";

interface CreateSubscribeModalProps {
    onCancel: () => void;
    onOk: () => void;
}


const CreateSubscribeModal: React.FC<CreateSubscribeModalProps> = (props) => {

    const [form] = Form.useForm();

    const [projectEvCfgCheckAll, setProjectEvCfgCheckAll] = useState(false);
    const [projectEvCfgIndeterminate, setProjectEvCfgIndeterminate] = useState(false);

    const [bookShelfEvCfgCheckAll, setBookShelfEvCfgCheckAll] = useState(false);
    const [bookShelfEvCfgIndeterminate, setBookShelfEvCfgIndeterminate] = useState(false);

    const [docEvCfgCheckAll, setDocEvCfgCheckAll] = useState(false);
    const [docEvCfgIndeterminate, setDocEvCfgIndeterminate] = useState(false);

    const [earthlyEvCfgCheckAll, setEarthlyEvCfgCheckAll] = useState(false);
    const [earthlyEvCfgIndeterminate, setEarthlyEvCfgIndeterminate] = useState(false);

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

    return (
        <Modal open title="新增研发事件订阅" onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            props.onCancel();
        }}>
            <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                <Form form={form} labelCol={{ span: 7 }}>
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
                    <Form.Item label={<Checkbox  indeterminate={spritEvCfgIndeterminate} checked={spritEvCfgCheckAll} onChange={e => {
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
                        <Checkbox.Group options={spritEvOptionList}  onChange={values => {
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
                        }}/>
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
                        }}/>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default observer(CreateSubscribeModal);
