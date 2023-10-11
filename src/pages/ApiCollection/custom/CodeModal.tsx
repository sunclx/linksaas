import { Button, Card, Modal, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import type { HttpVerb } from '@tauri-apps/api/http';
import type { Body, HTTP_BODY_TYPE } from '@/api/http_custom';
import { HTTP_BODY_TEXT, HTTP_BODY_URL_ENCODE, HTTP_BODY_MULTI_PART } from '@/api/http_custom';
import * as curlconverter from 'curlconverter';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CodeEditor from '@uiw/react-textarea-code-editor';
import s from "./CodeModal.module.less";
import { writeText } from '@tauri-apps/api/clipboard';


export interface CodeModalProps {
    method: HttpVerb;
    url: string;
    headers: Record<string, any>;
    bodyType: HTTP_BODY_TYPE;
    body: Body;
    onClose: () => void;
}

const CodeModal = (props: CodeModalProps) => {
    const [curlPartList, setCurlPartList] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState("python");

    const genCurlCode = () => {
        const tmpList: string[] = ["curl"];
        tmpList.push("-X");
        tmpList.push(props.method);
        for (const [k, v] of Object.entries(props.headers)) {
            tmpList.push("-H");
            tmpList.push(`${k}: ${v}`);
        }
        if (props.bodyType == HTTP_BODY_TEXT) {
            tmpList.push("-d");
            tmpList.push(`${(props.body.TextBody ?? "")}`);
        } else if (props.bodyType == HTTP_BODY_URL_ENCODE) {
            tmpList.push("-d");
            const partList = [];
            for (const param of props.body.UrlEncodeBody?.param_list ?? []) {
                if (param.key != "") {
                    partList.push(`${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`);
                }
            }
            tmpList.push(`"${(partList.join("&")).replaceAll("\"", "\\\"")}"`);
        } else if (props.bodyType == HTTP_BODY_MULTI_PART) {
            for (const part of props.body.MultiPartBody?.part_list ?? []) {
                if (part.key != "") {
                    tmpList.push("-F");
                    tmpList.push(`${encodeURIComponent(part.key)}=${part.is_file ? "@" + part.value : part.value}`);
                }
            }
        }
        tmpList.push(`${props.url}`);
        setCurlPartList(tmpList);
    };

    useEffect(() => {
        genCurlCode();
    }, []);

    return (
        <Modal open title="生成代码" footer={null}
            width="600px"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Tabs activeKey={activeKey} onChange={value => setActiveKey(value)}
                type="card"
                popupClassName={s.popup}
                items={[
                    {
                        key: "python",
                        label: "python",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "python" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toPython(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toPython(curlPartList)}
                                                language="python"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "java",
                        label: "java",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "java" && (
                                        <>
                                            <Card title="HttpClient" extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJava(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJava(curlPartList)}
                                                    language="java"
                                                />
                                            </Card>
                                            <Card title="HttpURLConnection" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJavaHttpUrlConnection(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJavaHttpUrlConnection(curlPartList)}
                                                    language="java"
                                                />
                                            </Card>
                                            <Card title="Jsoup" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJavaJsoup(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJavaJsoup(curlPartList)}
                                                    language="java"
                                                />
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "javascript",
                        label: "javascript",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "javascript" && (
                                        <>
                                            <Card title="fetch" extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJavaScript(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJavaScript(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="Jquery" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJavaScriptJquery(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJavaScriptJquery(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="XHR" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toJavaScriptXHR(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toJavaScriptXHR(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "node",
                        label: "node",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "node" && (
                                        <>
                                            <Card title="fetch" extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNode(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNode(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="Axios" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNodeAxios(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNodeAxios(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="Http" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNodeHttp(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNodeHttp(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="Ky" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNodeKy(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNodeKy(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="SuperAgent" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNodeSuperAgent(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNodeSuperAgent(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                            <Card title="Request" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toNodeRequest(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toNodeRequest(curlPartList)}
                                                    language="javascript"
                                                />
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "go",
                        label: "go",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "go" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toGo(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toGo(curlPartList)}
                                                language="go"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "php",
                        label: "php",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "php" && (
                                        <>
                                            <Card extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toPhp(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toPhp(curlPartList)}
                                                    language="php"
                                                />
                                            </Card>
                                            <Card title="Guzzle" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toPhpGuzzle(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toPhpGuzzle(curlPartList)}
                                                    language="php"
                                                />
                                            </Card>
                                            <Card title="Requests" style={{ marginTop: "10px" }} extra={
                                                <Button type="primary" onClick={e => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    writeText(curlconverter.toPhpRequests(curlPartList));
                                                    message.info("复制成功");
                                                }}>复制代码</Button>
                                            }>
                                                <CodeEditor
                                                    value={curlconverter.toPhpRequests(curlPartList)}
                                                    language="php"
                                                />
                                            </Card>
                                        </>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "dart",
                        label: "dart",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "dart" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toDart(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toDart(curlPartList)}
                                                language="dart"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "csharp",
                        label: "csharp",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "csharp" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toCSharp(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toCSharp(curlPartList)}
                                                language="csharp"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "kotlin",
                        label: "kotlin",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "kotlin" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toKotlin(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toKotlin(curlPartList)}
                                                language="kotlin"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "ruby",
                        label: "ruby",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "ruby" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toRuby(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toRuby(curlPartList)}
                                                language="ruby"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "rust",
                        label: "rust",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "rust" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toRust(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toRust(curlPartList)}
                                                language="rust"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "swift",
                        label: "swift",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "swift" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toSwift(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toSwift(curlPartList)}
                                                language="swift"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "clojure",
                        label: "clojure",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "clojure" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toClojure(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toClojure(curlPartList)}
                                                language="clojure"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "elixir",
                        label: "elixir",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "elixir" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toElixir(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toElixir(curlPartList)}
                                                language="elixir"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                    {
                        key: "ocml",
                        label: "ocml",
                        children: (
                            <ErrorBoundary>
                                <div style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}>
                                    {curlPartList.length > 0 && activeKey == "ocml" && (
                                        <Card extra={
                                            <Button type="primary" onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                writeText(curlconverter.toOCaml(curlPartList));
                                                message.info("复制成功");
                                            }}>复制代码</Button>
                                        }>
                                            <CodeEditor
                                                value={curlconverter.toOCaml(curlPartList)}
                                                language="ocml"
                                            />
                                        </Card>
                                    )}
                                </div>
                            </ErrorBoundary>
                        ),
                    },
                ]} />
        </Modal>
    );
};

export default CodeModal;