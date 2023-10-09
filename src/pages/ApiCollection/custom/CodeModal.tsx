import { Modal, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import type { HttpVerb } from '@tauri-apps/api/http';
import type { Body, HTTP_BODY_TYPE } from '@/api/http_custom';
import { HTTP_BODY_TEXT, HTTP_BODY_URL_ENCODE, HTTP_BODY_MULTI_PART } from '@/api/http_custom';
import * as curlconverter from 'curlconverter';
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
                    tmpList.push(`${encodeURIComponent(part.key)}=${part.is_file ? "@" : ""}${encodeURIComponent(part.value)}`);
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
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}>
            <Tabs items={[
                {
                    key: "curl",
                    label: "curl",
                    children: curlPartList.join(" "),
                },
                {
                    key: "python",
                    label: "python",
                    children: (
                        <ErrorBoundary>
                            <pre>
                                {curlPartList.length > 0 && curlconverter.toPythonWarn(curlPartList)}
                            </pre>
                        </ErrorBoundary>
                    ),
                }
            ]} />
        </Modal>
    );
};

export default CodeModal;