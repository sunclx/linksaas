
import type { IssueInfo } from '@/api/project_issue';
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';
import type { SHORT_NOTE_TYPE, SHORT_NOTE_MODE_TYPE } from '@/api/short_note';
import { SHORT_NOTE_TASK, SHORT_NOTE_BUG, add, list_my } from '@/api/short_note';
import { request } from '@/utils/request';

export type ShortNoteData = {
    shortNoteType: SHORT_NOTE_TYPE;
    data: IssueInfo;
};

export interface ShortNoteEvent {
    projectId: string;
    shortNoteModeType: SHORT_NOTE_MODE_TYPE;
    shortNoteType: SHORT_NOTE_TYPE;
    targetId: string;
    extraTargetValue: string;
}

function getShortNoteTypeStr(shortNoteType: SHORT_NOTE_TYPE): string {
    if (shortNoteType == SHORT_NOTE_TASK) {
        return "task";
    } else if (shortNoteType == SHORT_NOTE_BUG) {
        return "bug";
    }
    return "";
}

export async function showShortNote(sessionId: string, data: ShortNoteData, projectName: string) {
    let id = "";
    let title = "";
    let projectId = "";
    if (data.shortNoteType == SHORT_NOTE_TASK || data.shortNoteType == SHORT_NOTE_BUG) {
        const issue = data.data as IssueInfo;
        id = issue.issue_id;
        title = issue.basic_info.title;
        projectId = issue.project_id;
    } else {
        return;
    }
    const label = `shortNote-${id}`;
    const view = WebviewWindow.getByLabel(label);
    if (view != null) {
        await view.close();
    }
    const pos = await appWindow.innerPosition();
    const shortNoteTypeStr = getShortNoteTypeStr(data.shortNoteType);
    const webview = new WebviewWindow(label, {
        url: `short_note.html?type=${shortNoteTypeStr}&projectId=${projectId}&id=${id}&title=${encodeURIComponent(title)}&projectName=${encodeURIComponent(projectName)}`,
        x: pos.x + Math.floor(Math.random() * 500),
        y: pos.y + Math.floor(Math.random() * 200),
        width: 250,
        minWidth: 200,
        height: 150,
        minHeight: 100,
        decorations: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        fileDropEnabled: false,
        transparent: true,
    });
    webview.once('tauri://created', async () => {
        await request(add({
            session_id: sessionId,
            project_id: projectId,
            short_note_type: data.shortNoteType,
            target_id: id,
        }));
    });
}

export async function showMyShortNote(sessionId: string) {
    const res = await request(list_my({ session_id: sessionId }));

    if (res) {
        for (const item of res.short_note_list) {
            const label = `shortNote-${item.target_id}`;
            const shortNoteTypeStr = getShortNoteTypeStr(item.short_note_type);
            new WebviewWindow(label, {
                url: `short_note.html?type=${shortNoteTypeStr}&projectId=${item.project_id}&id=${item.target_id}&title=${encodeURIComponent(item.title)}&projectName=${encodeURIComponent(item.project_name)}`,
                width: 250,
                minWidth: 200,
                height: 150,
                minHeight: 100,
                decorations: false,
                alwaysOnTop: true,
                skipTaskbar: true,
                fileDropEnabled: false,
                transparent: true,
            });
        }
    }
}
