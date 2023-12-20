import React, { useEffect, useState } from "react";
import type { CommandResult, ContainerInfo } from "./types";
import { Command } from '@tauri-apps/api/shell';
import { load_simple_dev_info, type SimpleDevInfo } from '@/api/dev_container';
import { sleep } from "@/utils/time";


type FindResult = {
    containerId: string;
    state: string;
    serverPort: number;
    devCfg: string;
    repoPath: string;
};

export interface ResolveContainerProps {
    repoId: string;
    repoPath: string;
    onOk: (info: ContainerInfo) => void;
}

const ResolveContainer = (props: ResolveContainerProps) => {
    const [stage, setStage] = useState("");

    const findContainer = async () => {
        setStage("查找已存在容器");
        const cmd = Command.sidecar("bin/devc", ["container", "find", props.repoId]);
        const output = await cmd.execute();
        const obj = JSON.parse(output.stdout) as CommandResult;
        if (obj.success == true) {
            return obj.data as FindResult;
        } else {
            setStage("获取容器信息失败");
            throw new Error("获取容器信息失败");
        }
    };

    const stopContainer = async (containerId: string) => {
        setStage("停止已启动容器");
        const cmd = Command.sidecar("bin/devc", ["container", "stop", containerId]);
        const output = await cmd.execute();
        const obj = JSON.parse(output.stdout) as CommandResult;
        if (obj.success == true) {
            return;
        } else {
            setStage("停止已启动容器失败");
            throw new Error("停止已启动容器失败");
        }
    };

    const checkListen = async (port: number) => {
        const cmd = Command.sidecar("bin/devc", ["container", "checkListen", `${port}`]);
        const output = await cmd.execute();
        return JSON.parse(output.stdout) as CommandResult;
    };

    const removeContainer = async (containerId: string) => {
        setStage("移除容器中，请等待");
        const cmd = Command.sidecar("bin/devc", ["container", "remove", containerId]);
        const output = await cmd.execute();
        const obj = JSON.parse(output.stdout) as CommandResult;
        if (obj.success == true) {
            return;
        } else {
            setStage("移除容器失败");
            throw new Error("移除容器失败");
        }
    };

    const checkRecreate = async (findResult: FindResult) => {
        setStage("检查是否重建容器");
        const devInfo = await load_simple_dev_info(props.repoPath);
        const cmpDevInfo = JSON.parse(findResult.devCfg) as SimpleDevInfo;
        for (const pkgVer of devInfo.pkg_version_list) {
            let found = false;
            for (const cmpPkgVer of cmpDevInfo.pkg_version_list) {
                if (pkgVer.package == cmpPkgVer.package && pkgVer.version == cmpPkgVer.version) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log(devInfo.pkg_version_list, cmpDevInfo.pkg_version_list);
                return true;
            }
        }
        for (const pf of devInfo.forward_port_list) {
            let found = false;
            for (const cmpPf of cmpDevInfo.forward_port_list) {
                if (pf.container_port == cmpPf.container_port && pf.host_port == cmpPf.host_port && pf.public == cmpPf.public) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log(devInfo.forward_port_list, cmpDevInfo.forward_port_list);
                return true;
            }
        }
        if (findResult.repoPath != props.repoPath) {
            console.log(findResult.repoPath, props.repoPath);
            return true;
        }

        const obj = await checkListen(findResult.serverPort);
        if (obj.success == true) {
            if (obj.data != findResult.serverPort) {
                console.log(obj.data, findResult.serverPort);
                return true;
            }
        } else {
            setStage("检查监听端口失败");
            throw new Error("检查监听端口失败");
        }
        return false;
    };

    const createContainer = async (port: number) => {
        setStage("创建容器");
        const cmd = Command.sidecar("bin/devc", ["container", "create", props.repoId, props.repoPath, `${port}`]);
        const output = await cmd.execute();
        const obj = JSON.parse(output.stdout) as CommandResult;
        if (obj.success == true) {
            return obj.data as string;
        } else {
            setStage("创建容器失败");
            throw new Error("创建容器失败");
        }
    };

    const resolveContainer = async () => {
        const findResult = await findContainer();
        if (findResult.containerId != "") {
            if (findResult.state == "running") {
                await stopContainer(findResult.containerId);
            }
            const needRecreate = await checkRecreate(findResult);
            if (!needRecreate) {
                props.onOk({
                    containerId: findResult.containerId,
                    serverPort: findResult.serverPort,
                });
                return;
            }
            await removeContainer(findResult.containerId);
            await sleep(10 * 1000);
        }
        const listenRes = await checkListen(8080);
        if (listenRes.success == false) {
            setStage("检查监听端口失败");
            throw new Error("检查监听端口失败");
        }
        const containerId = await createContainer(listenRes.data ?? 0);
        props.onOk({
            containerId: containerId,
            serverPort: listenRes.data ?? 0,
        });
    };

    useEffect(() => {
        resolveContainer();
    }, []);

    return (
        <div style={{ marginTop: "20%", textAlign: "center", fontSize: "20px" }}>
            {stage}
        </div>
    );
};

export default ResolveContainer;