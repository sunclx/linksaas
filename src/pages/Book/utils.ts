import type { NavItem } from 'epubjs';
import { get_session } from "@/api/user";
import { get_book as get_project_book } from "@/api/project_book_shelf";
import { get_book as get_user_book } from "@/api/user_book_shelf";
import { WebviewWindow } from '@tauri-apps/api/window';
import { request } from '@/utils/request';

export interface Chapter {
    title: string;
    value: string;
    children: Chapter[];
}

export function convertToChapterList(items: NavItem[]): Chapter[] {
    const retList: Chapter[] = [];
    processConvertToChapter(retList, items);
    return retList;
}

function processConvertToChapter(retList: Chapter[], items: NavItem[]) {
    for (const item of items) {
        const chapter = {
            title: item.label.trim(),
            value: item.id,
            children: [],
        };
        if (item.subitems != undefined && item.subitems != null && item.subitems.length > 0) {
            processConvertToChapter(chapter.children, item.subitems);
        }
        retList.push(chapter);
    }
}

export function getTocId(href: string, items: NavItem[]): string {
    for (const item of items) {
        if (item.subitems != undefined && item.subitems != null && item.subitems.length > 0) {
            const id = getTocId(href, item.subitems);
            if (id != "") {
                return id;
            }
        }
        if (item.href == href) {
            return item.id;
        }
    }
    return "";
}

export function getTocHref(id: string, items: NavItem[]): string {
    for (const item of items) {
        if (item.subitems != undefined && item.subitems != null && item.subitems.length > 0) {
            const href = getTocHref(id, item.subitems);
            if (href != "") {
                return href;
            }
        }
        if (item.id == id) {
            return item.href;
        }
    }
    return "";
}

export async function openBook(userId: string, projectId: string, bookId: string, markId: string, pubFsId: string, privFsId: string, canShare: boolean) {
    let fsId = "";
    let fileLocId = "";
    let bookTitle = "";

    const sessionId = await get_session();

    if (projectId == "") {
        const res = await request(get_user_book({
            session_id: sessionId,
            book_id: bookId,
        }));
        bookTitle = res.info.book_title;
        fileLocId = res.info.file_loc_id
        if (res.info.in_store) {
            fsId = pubFsId;
        } else {
            fsId = privFsId;
        }
    } else {
        const res = await request(get_project_book({
            session_id: sessionId,
            project_id: projectId,
            book_id: bookId,
        }));
        bookTitle = res.info.book_title;
        fileLocId = res.info.file_loc_id
        if (res.info.in_store) {
            fsId = pubFsId;
        } else {
            fsId = privFsId;
        }
    }

    const url = `book.html?projectId=${projectId}&userId=${userId}&bookId=${bookId}&markId=${markId}&fsId=${fsId}&fileLocId=${fileLocId}&bookTitle=${encodeURIComponent(bookTitle)}&canShare=${canShare ? "1" : ""}`;
    new WebviewWindow(`book:${bookId}`, {
        url: url,
        title: bookTitle,
    });
}