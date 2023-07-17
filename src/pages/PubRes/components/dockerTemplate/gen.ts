import type { FileSchema, VariableSchema } from "./schema";
import ejs from "ejs";
import { exists, readTextFile, createDir, writeTextFile } from '@tauri-apps/api/fs';

function checkEnvMap(envCfgList: VariableSchema[], envMap: Map<string, string | number>) {
    for (const envCfg of envCfgList) {
        if (envMap.has(envCfg.id) == false) {
            throw new Error(`缺少环境参数${envCfg.id}`);
        }
    }
}

function checkFileValMap(fileCfgList: FileSchema[], fileValMap: Map<string, Map<string, string | number>>) {
    for (const fileCfg of fileCfgList) {
        if ((fileCfg._variables ?? []).length == 0) {
            continue;
        }
        const valMap = fileValMap.get(fileCfg.name);
        if (valMap == undefined) {
            throw new Error(`文件${fileCfg.name}缺少参数配置`);
        }
        for (const val of (fileCfg._variables ?? [])) {
            if (valMap.has(val.id) == false) {
                throw new Error(`文件${fileCfg.name}缺少参数${val.id}`);
            }
        }
    }
}

async function genDockerComposeFile(templatePath: string, destPath: string, isOsWindows: boolean, featureMap: Map<string, boolean>) {
    let dockerComposeFile = "";
    for (const fileName of ["docker-compose.yml", "docker-compose.yaml"]) {
        let tmpFile = `${templatePath}/${fileName}`;
        if (isOsWindows) {
            tmpFile = `${templatePath}\\${fileName}`;
        }
        const fileExist = await exists(tmpFile);
        if (fileExist) {
            dockerComposeFile = tmpFile;
            break;
        }
    }
    if (dockerComposeFile == "") {
        throw new Error(`没有找到docker-compose.yml或docker-compose.yaml`);
    }
    const srcContent = await readTextFile(dockerComposeFile);
    const destContent = ejs.render(srcContent, Object.fromEntries(featureMap));

    const destPathExist = await exists(destPath);
    if (!destPathExist) {
        await createDir(destPath, { recursive: true });
    }
    let destFile = `${destPath}/docker-compose.yaml`;
    if (isOsWindows) {
        destFile = `${destPath}\\docker-compose.yaml`;
    }
    await writeTextFile(destFile, destContent);
}

async function genEnvFile(destPath: string, isOsWindows: boolean, envMap: Map<string, string | number>) {
    const lineList: string[] = [];
    envMap.forEach((value, key) => {
        if (typeof value == "number") {
            lineList.push(`${key}=${value}`);
        } else if (typeof value == "string") {
            const tmpValue = value.replaceAll("\"", "\\\"");
            lineList.push(`${key}="${tmpValue}"`);
        }
    });
    let content = "";
    let destFile = "";
    if (isOsWindows) {
        content = lineList.join("\r\n");
        destFile = `${destPath}\\.env`;
    } else {
        content = lineList.join("\n");
        destFile = `${destPath}/.env`;
    }
    await writeTextFile(destFile, content);
}

async function genFile(templatePath: string, destPath: string, isOsWindows: boolean, fileCfg: FileSchema, valMap: Map<string, string | number> | undefined) {
    let srcFile = "";
    if (isOsWindows) {
        srcFile = `${templatePath}\\${fileCfg.name.replaceAll("/", "\\")}`;
    } else {
        srcFile = `${templatePath}/${fileCfg.name}`;
    }
    const srcContent = await readTextFile(srcFile);
    let destContent = "";
    if (valMap === undefined) {
        destContent = srcContent
    } else {
        destContent = ejs.render(srcContent, Object.fromEntries(valMap));
    }
    let destFile = "";
    let destDir = "";
    if (isOsWindows) {
        destFile = `${destPath}\\${fileCfg.name.replaceAll("/", "\\")}`;
        const pos = destFile.lastIndexOf("\\");
        destDir = destFile.substring(0, pos);
    } else {
        destFile = `${destPath}/${fileCfg.name}`;
        const pos = destFile.lastIndexOf("/");
        destDir = destFile.substring(0, pos);
    }
    const destDirExist = await exists(destDir);
    if (!destDirExist) {
        await createDir(destDir, { recursive: true });
    }
    await writeTextFile(destFile, destContent);
}

export async function genResult(templatePath: string, destPath: string, isOsWindows: boolean, featureMap: Map<string, boolean>, envCfgList: VariableSchema[],
    envMap: Map<string, string | number>, fileCfgList: FileSchema[], fileValMap: Map<string, Map<string, string | number>>) {
    //检查env参数是否OK
    checkEnvMap(envCfgList, envMap);
    //检查文件参数是否OK
    checkFileValMap(fileCfgList, fileValMap);
    //生成docker-compose.yml
    await genDockerComposeFile(templatePath, destPath, isOsWindows, featureMap);
    //生成.env
    await genEnvFile(destPath, isOsWindows, envMap)
    //复制配置文件
    for (const fileCfg of fileCfgList) {
        const valMap = fileValMap.get(fileCfg.name);
        await genFile(templatePath, destPath, isOsWindows, fileCfg, valMap)
    }
}