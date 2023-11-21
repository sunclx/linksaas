import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';
import { gen_one_time_token } from '@/api/project_member';
import type { RESOURCE_TYPE } from '@/api/k8s_proxy';
import { RESOURCE_TYPE_DEPLOYMENT, RESOURCE_TYPE_NAMESPACE, RESOURCE_TYPE_STATEFULSET, list_resource, list_resource_perm, get_resource } from '@/api/k8s_proxy';
import type { NamespaceList } from "kubernetes-models/v1";
import type { ResourcePerm } from "@/api/k8s_proxy";
import type { DeploymentList, IIoK8sApiAppsV1Deployment, IIoK8sApiAppsV1StatefulSet, StatefulSetList } from "kubernetes-models/apps/v1";

export default class CloudStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    //k8s相关
    private _nameSpaceList: string[] = [];
    private _curNameSpace = "";

    get nameSpaceList(): string[] {
        return this._nameSpaceList;
    }

    get curNameSpace(): string {
        return this._curNameSpace;
    }

    set curNameSpace(val: string) {
        runInAction(() => {
            this._curNameSpace = val;
        });
    }

    async loadNameSpaceList() {
        runInAction(() => {
            this._nameSpaceList = [];
            this._curNameSpace = "";
        });
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        const res = await request(list_resource(servAddr, {
            token: tokenRes.token,
            namespace: "",
            resource_type: RESOURCE_TYPE_NAMESPACE,
            label_selector: "",
        }));
        const nameSpaces = JSON.parse(res.payload) as NamespaceList;
        const tmpList = nameSpaces.items.map(item => item.metadata?.name ?? "");
        runInAction(() => {
            if (tmpList.includes(this._curNameSpace) == false) {
                if (tmpList.length != 0) {
                    this._curNameSpace = tmpList[0];
                }
            }
            this._nameSpaceList = tmpList;
        });
    }


    private _deploymentList: IIoK8sApiAppsV1Deployment[] = [];
    private _deploymentPermList: ResourcePerm[] = [];

    get deploymentList(): IIoK8sApiAppsV1Deployment[] {
        return this._deploymentList;
    }

    get deploymentPermList(): ResourcePerm[] {
        return this._deploymentPermList;
    }

    async loadDeploymentList() {
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        runInAction(() => {
            this._deploymentList = [];
        });
        if (this._curNameSpace == "") {
            return;
        }
        const res = await request(list_resource(servAddr, {
            token: tokenRes.token,
            namespace: this._curNameSpace,
            resource_type: RESOURCE_TYPE_DEPLOYMENT,
            label_selector: "",
        }));
        const deployments = JSON.parse(res.payload) as DeploymentList;
        runInAction(() => {
            this._deploymentList = deployments.items;
        });
    }

    async loadDeploymentPermList() {
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        runInAction(() => {
            this._deploymentPermList = [];
        });
        if (this._curNameSpace == "" || this._deploymentList.length == 0) {
            return;
        }
        const res = await request(list_resource_perm(servAddr, {
            token: tokenRes.token,
            namespace: this._curNameSpace,
            resource_type: RESOURCE_TYPE_DEPLOYMENT,
            name_list: this._deploymentList.map(item => item.metadata?.name ?? ""),
        }));
        runInAction(() => {
            this._deploymentPermList = res.perm_list;
        });
    }

    private _statefulsetList: IIoK8sApiAppsV1StatefulSet[] = [];
    private _statefulsetPermList: ResourcePerm[] = [];

    get statefulsetList(): IIoK8sApiAppsV1StatefulSet[] {
        return this._statefulsetList;
    }

    get statefulsetPermList(): ResourcePerm[] {
        return this._statefulsetPermList;
    }

    async loadStatefulsetList() {
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        runInAction(() => {
            this._statefulsetList = [];
        });
        if (this._curNameSpace == "") {
            return;
        }
        const res = await request(list_resource(servAddr, {
            token: tokenRes.token,
            namespace: this._curNameSpace,
            resource_type: RESOURCE_TYPE_STATEFULSET,
            label_selector: "",
        }));
        const statefulsets = JSON.parse(res.payload) as StatefulSetList;
        runInAction(() => {
            this._statefulsetList = statefulsets.items;
        });
    }

    async loadStatefulsetPermList() {
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        runInAction(() => {
            this._statefulsetPermList = [];
        });
        if (this._curNameSpace == "" || this._statefulsetList.length == 0) {
            return;
        }
        const res = await request(list_resource_perm(servAddr, {
            token: tokenRes.token,
            namespace: this._curNameSpace,
            resource_type: RESOURCE_TYPE_STATEFULSET,
            name_list: this._statefulsetList.map(item => item.metadata?.name ?? ""),
        }));
        runInAction(() => {
            this._statefulsetPermList = res.perm_list;
        });
    }

    async loadResource(resourceType: RESOURCE_TYPE, resourceName: string) {
        const servAddr = this.rootStore.projectStore.curProject?.setting.k8s_proxy_addr ?? "";
        const tokenRes = await request(gen_one_time_token({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
        }));
        if (this._curNameSpace == "") {
            return;
        }
        const res = await request(get_resource(servAddr, {
            token: tokenRes.token,
            namespace: this._curNameSpace,
            resource_type: resourceType,
            resource_name: resourceName,
        }));

        if (resourceType == RESOURCE_TYPE_DEPLOYMENT) {
            const deployment = JSON.parse(res.payload) as IIoK8sApiAppsV1Deployment;
            const tmpList = this._deploymentList.slice();
            const index = tmpList.findIndex(item => item.metadata?.name == resourceName);
            if (index != -1) {
                tmpList[index] = deployment;
                runInAction(() => {
                    this._deploymentList = tmpList;
                });
            }
        } else if (resourceType == RESOURCE_TYPE_STATEFULSET) {
            const statefulset = JSON.parse(res.payload) as IIoK8sApiAppsV1StatefulSet;
            const tmpList = this._statefulsetList.slice();
            const index = tmpList.findIndex(item => item.metadata?.name == resourceName);
            if (index != -1) {
                tmpList[index] = statefulset;
                runInAction(() => {
                    this._statefulsetList = tmpList;
                });
            }
        }
    }
}