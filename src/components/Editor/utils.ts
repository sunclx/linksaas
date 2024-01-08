import type { RemirrorJSON } from '@remirror/core';
import { request } from '@/utils/request';
import type { FileAttributes } from './extensions/FileUploadExtension';
import type { ImageAttributes } from './extensions/ImageUploadExtension';
import { copy_file as fs_copy_file, set_file_owner } from '@/api/fs';
import type { FILE_OWNER_TYPE } from '@/api/fs';


export interface FileInfo {
    fs_id: string;
    file_id: string;
}

export type SetFileOwnerRequest = {
    session_id: string;
    fs_id: string;
    file_id: string;
    owner_type: FILE_OWNER_TYPE;
    owner_id: string;
};

async function copy_file(sessionId: string, fromFsId: string, fromFileId: string, toFsId: string, ownerType: FILE_OWNER_TYPE, ownerId: string): Promise<string> {
    const res = await request(fs_copy_file({
        session_id: sessionId,
        from_fs_id: fromFsId,
        from_file_id: fromFileId,
        to_fs_id: toFsId,
    }));
    await request(set_file_owner({
        session_id: sessionId,
        fs_id: toFsId,
        file_id: res.to_file_id,
        owner_type: ownerType,
        owner_id: ownerId,
    }));
    return res.to_file_id;
}


export async function change_file_fs(state: RemirrorJSON, destFsId: string, sessionId: string, ownerType: FILE_OWNER_TYPE, ownerId: string) {
    for (const child of state.content ?? []) {
        if (child.type == "imageUpload") {
            if (child.attrs !== undefined) {
                const attrs = child.attrs as unknown as ImageAttributes;
                if (attrs.fsId != destFsId) {
                    const toFildId = await copy_file(sessionId, attrs.fsId, attrs.fileId ?? "", destFsId, ownerType, ownerId);
                    const toThumbFileId = await copy_file(sessionId, attrs.fsId, attrs.thumbFileId ?? "", destFsId, ownerType, ownerId);
                    attrs.fsId = destFsId;
                    attrs.fileId = toFildId;
                    attrs.thumbFileId = toThumbFileId;
                }
            }
        } else if (child.type == "fileUpload") {
            if (child.attrs !== undefined) {
                const attrs = child.attrs as unknown as FileAttributes;
                if (attrs.fsId != destFsId) {
                    const toFildId = await copy_file(sessionId, attrs.fsId, attrs.fileId ?? "", destFsId, ownerType, ownerId);
                    attrs.fsId = destFsId;
                    attrs.fileId = toFildId;
                }
            }
        } else if (child.content !== undefined) {
            await change_file_fs(child, destFsId, sessionId, ownerType, ownerId);
        }
    }
}

export async function change_file_owner(state: RemirrorJSON, sessionId: string, ownerType: FILE_OWNER_TYPE, ownerId: string) {
    for (const child of state.content ?? []) {
        if (child.type == "imageUpload") {
            if (child.attrs !== undefined) {
                const attrs = child.attrs as unknown as ImageAttributes;
                await request(set_file_owner({
                    session_id: sessionId,
                    fs_id: attrs.fsId,
                    file_id: attrs.fileId ?? "",
                    owner_type: ownerType,
                    owner_id: ownerId,
                }));
            }
        } else if (child.type == "fileUpload") {
            if (child.attrs !== undefined) {
                const attrs = child.attrs as unknown as FileAttributes;
                await request(set_file_owner({
                    session_id: sessionId,
                    fs_id: attrs.fsId,
                    file_id: attrs.fileId ?? "",
                    owner_type: ownerType,
                    owner_id: ownerId,
                }));
            }
        } else if (child.content !== undefined) {
            await change_file_owner(child, sessionId, ownerType, ownerId);
        }
    }
}

export function adjust_image_src(state: RemirrorJSON) {
    for (const child of state.content ?? []) {
        if (child.type == "imageUpload") {
            if (child.attrs !== undefined) {
                const attrs = child.attrs as unknown as ImageAttributes;
                delete attrs.imageSrc;
            }
        } else if (child.content !== undefined) {
            adjust_image_src(child);
        }
    }
}


function calc_doc_state(textList: string[], extensionList: string[], state: RemirrorJSON) {
    for (const child of state.content ?? []) {
        if (["code", "excaliDraw", "fileUpload", "iframe", "imageUpload", "link", "reminderUser", "widget", "dashboard", "katex"].includes(child.type)) {
            extensionList.push(child.type);
        } else if (child.type == "text") {
            textList.push(child.text!)
        } else if (child.content !== undefined) {
            calc_doc_state(textList, extensionList, child);
        }
    }
}

export function is_empty_doc(state: RemirrorJSON): boolean {
    const textList: string[] = [];
    const extensionList: string[] = [];
    calc_doc_state(textList, extensionList, state);
    if (extensionList.length > 0) {
        return false;
    }
    const text = textList.join().replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
    if (text.length > 0) {
        return false;
    }
    return true;
}

export interface ContentState {
    charCount: number;
    extensionCount: number;
}


export function get_content_state(state: RemirrorJSON): ContentState {
    const textList: string[] = [];
    const extensionList: string[] = [];
    calc_doc_state(textList, extensionList, state);
    let charCount = 0;
    for (const text of textList) {
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            if (c >= "a" && c <= "z") {
                charCount += 0.2;
            } else if (c >= "A" && c <= "Z") {
                charCount += 0.2;
            } else if (c >= "0" && c <= "9") {
                charCount += 0.2;
            } else if (/[\u4e00-\u9fa5]/.test(c)) {
                charCount += 1;
            }
        }
    }
    return {
        charCount: Math.ceil(charCount),
        extensionCount: extensionList.length,
    };
}

export function get_content_text(state: RemirrorJSON | string): string {
    let tmpState = state;
    if (typeof state == "string") {
        tmpState = JSON.parse(state);
    }
    const textList: string[] = [];
    const extensionList: string[] = [];
    calc_doc_state(textList, extensionList, tmpState as RemirrorJSON);
    return textList.join(" ");
}