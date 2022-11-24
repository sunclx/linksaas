import type { NavItem } from 'epubjs';

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