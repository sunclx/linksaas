import { Command } from '@tauri-apps/api/shell';


export type SidecarShellResult = {
    ok: boolean;
    data: unknown;
}

export async function exec_sidecar_shell(args: string[]): Promise<SidecarShellResult> {
    const command = Command.sidecar("bin/shell", ["--output-mode", "json", ...args]);
    const output = await command.execute();
    if (output.stderr != "") {
        return {
            ok: false,
            data: output.stderr,
        }
    }
    try {
        return JSON.parse(output.stdout) as SidecarShellResult;
    } catch (e) {
        return {
            ok: false,
            data: "parse result fail",
        };
    }
}