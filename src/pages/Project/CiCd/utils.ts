import { WebviewWindow, appWindow } from '@tauri-apps/api/window';

export async function OpenPipeLineWindow(pipeLineName: string, projectId: string, fsId: string, pipeLineId: string, canUpdate: boolean, canExec: boolean, execId: string = "") {
    const label = `pipeLine:${pipeLineId}`;
    const view = WebviewWindow.getByLabel(label);
    if (view != null) {
        await view.close();
    }

    const pos = await appWindow.innerPosition();

    new WebviewWindow(label, {
        url: `/cicd.html?projectId=${projectId}&fsId=${fsId}&pipeLineId=${pipeLineId}&execId=${execId}&canUpdate=${canUpdate}&canExec=${canExec}`,
        width: 800,
        minWidth: 800,
        height: 600,
        minHeight: 600,
        center: true,
        title: `流水线 ${pipeLineName}${execId == "" ? "" : "(运行结果)"}`,
        resizable: true,
        x: pos.x + Math.floor(Math.random() * 200),
        y: pos.y + Math.floor(Math.random() * 200),
        fileDropEnabled: false,
    });
}