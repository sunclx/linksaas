import { fetch, Body } from '@tauri-apps/api/http';

export enum AI_CAP_TYPE {
    AI_CAP_CODE_COMPLETE,
    AI_CAP_CODE_CONVERT,
    AI_CAP_CODE_EXPLAIN,
    AI_CAP_CODE_FIX_ERROR,
    AI_CAP_CODE_GEN_TEXT,
}

export interface CodingCap {
    completeLangList: string[];
    convertLangList: string[];
    explainLangList: string[];
    fixErrorLangList: string[];
    genTestLangList: string[];
}

export interface AiCap {
    coding: CodingCap;
}

//获取AI能力
export async function getAiCap(apiAddr: string, token: string): Promise<AiCap> {
    const res = await fetch(`${apiAddr}/api/dev/cap`, {
        method: "POST",
        headers: {
            "X-AuthToken": token,
        },
        body: Body.form({}),
    });
    if (res.ok) {
        return res.data as AiCap;
    } else {
        throw res.data;
    }
}

//补全代码
export async function genCode(apiAddr: string, token: string, lang: string, srcCode: string): Promise<string[]> {
    const res = await fetch(`${apiAddr}/api/coding/complete/${lang}`, {
        method:"POST",
        headers: {
            "X-AuthToken": token,
        },
        body:Body.text(srcCode),
    });
    if (res.ok) {
        return res.data as string[];
    }else {
        throw res.data;
    }
}