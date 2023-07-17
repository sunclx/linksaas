import type { FileSchema, VariableSchema } from "./schema";

export async function genResult(destPath: string, featureMap: Map<string, boolean>, envCfgList: VariableSchema[],
    envMap: Map<string, string | number>, fileCfgList: FileSchema[], fileValMap: Map<string, Map<string, string | number>>) {
    //TODO 生成docker-compose.yml
    //TODO 生成.env
    //TODO 复制配置文件
}