import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Form, List, Select,message } from "antd";
import s from "./AiCodeComplete.module.less"
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useStores } from "@/hooks";
import { gen_ai_token } from "@/api/project";
import { request } from "@/utils/request";
import { genCode } from "@/api/ai";
import Button from "@/components/Button";

const pythonDemoCode = `# sum from 1 to n

def sum(n):
`;

const cDemoCode = `//sum from 1 to n

#include <stdio.h>
#include <stdlib.h>
int sum(int n)
{
`;

const javaDemoCode = `//sum from 1 to n

public class Sum {
`;

const rDemoCode = `# sum from 1 to n

sum <- function(n) {
`;

const rustDemoCode = `//sum from 1 to n

fn sum(n: usize) -> usize {
`;

const cplusplusDemoCode = `//sum from 1 to n

#include <iostream>
using namespace std;
int sum_of_numbers(int n) {
`;

const csharpDemoCode = `//sum from 1 to n

private int sum(int n) {
`;

const jsDemoCode = `//sum from 1 to n

function sum(n) {
`;

const goDemoCode = `//sum from 1 to n

func sum(n int) int {
`;

const AiCodeComplete = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [lang, setLang] = useState("");
    const [content, setContent] = useState("");
    const [promptList, setPromptList] = useState<string[]>([]);
    const [token, setToken] = useState("");

    const changeLang = (value: string) => {
        setLang(value);
        if (value == "python") {
            setContent(pythonDemoCode);
        } else if (value == "c") {
            setContent(cDemoCode);
        } else if (value == "java") {
            setContent(javaDemoCode);
        } else if (value == "r") {
            setContent(rDemoCode);
        } else if (value == "rust") {
            setContent(rustDemoCode);
        } else if (value == "cplusplus") {
            setContent(cplusplusDemoCode);
        } else if (value == "csharp") {
            setContent(csharpDemoCode);
        } else if (value == "javascript") {
            setContent(jsDemoCode);
        } else if (value == "go") {
            setContent(goDemoCode);
        }
    }

    const genToken = async () => {
        const res = await request(gen_ai_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setToken(res.token);
    };

    const callGenCode = async () => {
        try {
            const res = await genCode(projectStore.curProject?.ai_gateway_addr ?? "", token, lang, content);
            if (res.length > 1) {
                setPromptList(res);
            } else if (res.length == 1) {
                setContent(oldContent => oldContent + res[0]);
            }
        } catch (e) {
            message.error(JSON.stringify(e));
        }
    };

    useEffect(() => {
        if (projectStore.projectAiCap != null && projectStore.projectAiCap.coding.completeLangList.length > 0) {
            changeLang(projectStore.projectAiCap.coding.completeLangList[0]);
        }
    }, [projectStore.projectAiCap]);

    useEffect(() => {
        genToken();
    }, [projectStore.curProjectId, projectStore.projectAiCap]);

    return (
        <Card title="代码补全" bordered={false} extra={
            <Form layout="inline">
                <Form.Item label="编程语言">
                    <Select style={{ width: "100px" }} value={lang} onChange={value => changeLang(value)}>
                        {projectStore.projectAiCap?.coding.completeLangList.map(item => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        callGenCode();
                    }}>生成代码</Button>
                </Form.Item>
            </Form>
        }>
            <div className={s.content_wrap}>
                <CodeEditor
                    value={content}
                    language={lang}
                    placeholder="请输入代码"
                    autoFocus={true}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setContent(e.target.value)
                    }}
                    className={s.content}
                />
                {promptList.length > 1 && (
                    <div className={s.prompt_list}>
                        <List dataSource={promptList} renderItem={(item, index) => (
                            <List.Item key={index} className={s.prompt} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setContent(oldContent => oldContent + item);
                                setPromptList([]);
                            }}>
                                <CodeEditor value={item} readOnly language={lang} style={{ width: "100%", borderRadius: "20px", fontSize: "14px" }} />
                            </List.Item>
                        )} />
                    </div>
                )}

            </div>
        </Card>
    );
};

export default observer(AiCodeComplete);