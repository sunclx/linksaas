import { ENTRY_TYPE_SPRIT, type ENTRY_TYPE, ENTRY_TYPE_DOC, ENTRY_TYPE_PAGES, ENTRY_TYPE_BOARD, ENTRY_TYPE_FILE } from "@/api/project_entry";

export const getEntryTypeStr = (entryType: ENTRY_TYPE): string => {
    if (entryType == ENTRY_TYPE_SPRIT) {
        return "工作计划";
    } else if (entryType == ENTRY_TYPE_DOC) {
        return "文档";
    } else if (entryType == ENTRY_TYPE_PAGES) {
        return "静态网页";
    } else if (entryType == ENTRY_TYPE_BOARD) {
        return "信息面板";
    } else if (entryType == ENTRY_TYPE_FILE) {
        return "文件";
    }
    return "";
};