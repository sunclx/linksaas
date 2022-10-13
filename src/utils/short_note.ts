
import type { IssueInfo } from '@/api/project_issue';
import type { Doc } from '@/api/project_doc';
import { WebviewWindow } from '@tauri-apps/api/window';


export enum SHORT_NOTE_TYPE {
    SHORT_NOTE_TASK = "task",
    SHORT_NOTE_BUG = "bug",
    SHORT_NOTE_DOC = "doc",
}

export type ShortNoteData = {
    shortNoteType: SHORT_NOTE_TYPE;
    data: IssueInfo | Doc;
};

export interface ShortNoteEvent {
    projectId: string;
    shortNoteType: string;
    targetId: string;
}

export async function showShortNote(data: ShortNoteData, projectName: string) {
    let id = "";
    let projectId = "";
    let title = "";
    if (data.shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_TASK || data.shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_BUG) {
        const issue = data.data as IssueInfo;
        id = issue.issue_id;
        projectId = issue.project_id;
        title = issue.basic_info.title;
    } else if (data.shortNoteType == SHORT_NOTE_TYPE.SHORT_NOTE_DOC) {
        const doc = data.data as Doc;
        id = doc.doc_id;
        projectId = doc.project_id;
        title = doc.base_info.title;
    }
    const label = `shortNote-${id}`;
    const view = WebviewWindow.getByLabel(label);
    if(view != null){
        await view.close();
    }
    new WebviewWindow(label, {
        url: `short_note.html?type=${data.shortNoteType}&projectId=${projectId}&id=${id}&title=${encodeURIComponent(title)}&projectName=${encodeURIComponent(projectName)}`,
        width: 250,
        minWidth: 200,
        height: 150,
        minHeight: 100,
        decorations: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        fileDropEnabled: false,
    });
}