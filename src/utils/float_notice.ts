import { WebviewWindow } from '@tauri-apps/api/window';

export interface FloatNoticeDetailEvent {
    projectId: string,
    channelId: string,
    msgId: string,
}

export function sendFloatNoticeDetailEvent(ev: FloatNoticeDetailEvent) {
    const mainWin = WebviewWindow.getByLabel("main");
    mainWin?.emit("floatNoticeDetail", ev);
}