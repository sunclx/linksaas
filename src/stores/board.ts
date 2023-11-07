import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';
import { request } from '@/utils/request';
import * as prjBoardApi from "@/api/project_board";
import type { ReactFlowInstance } from 'reactflow';

export default class BoardStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;

    private _nodeList: prjBoardApi.Node[] = [];
    private _edgeList: prjBoardApi.Edge[] = [];
    private _flowInstance: ReactFlowInstance | null = null;

    reset() {
        runInAction(() => {
            this._nodeList = [];
            this._edgeList = [];
            this._flowInstance = null;
        });
    }

    get flowInstance(): ReactFlowInstance | null {
        return this._flowInstance;
    }

    set flowInstance(val: ReactFlowInstance | null) {
        runInAction(() => {
            this._flowInstance = val;
        });
    }

    get nodeList(): prjBoardApi.Node[] {
        return this._nodeList;
    }

    get edgeList(): prjBoardApi.Edge[] {
        return this._edgeList;
    }

    async loadNodeList() {
        runInAction(() => {
            this._nodeList = [];
        });
        const res = await request(prjBoardApi.list_node({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            board_id: this.rootStore.entryStore.curEntry?.entry_id ?? "",
        }));
        runInAction(() => {
            this._nodeList = res.node_list;
        });
    }

    async loadEdgeList() {
        runInAction(() => {
            this._edgeList = [];
        });
        const res = await request(prjBoardApi.list_edge({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            board_id: this.rootStore.entryStore.curEntry?.entry_id ?? "",
        }));
        runInAction(() => {
            this._edgeList = res.edge_list;
        });
    }

    async updateNode(nodeId: string) {
        const tmpList = this._nodeList.filter(item => item.node_id != nodeId);
        const res = await request(prjBoardApi.get_node({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            board_id: this.rootStore.entryStore.curEntry?.entry_id ?? "",
            node_id: nodeId,
        }));
        tmpList.push(res.node);
        runInAction(() => {
            this._nodeList = tmpList;
        });
    }

    async updateEdge(edgeKey: prjBoardApi.EdgeKey) {
        const tmpList = this._edgeList.filter(item => {
            if (item.edge_key.from_node_id == edgeKey.from_node_id && item.edge_key.from_handle_id == edgeKey.from_handle_id
                && item.edge_key.to_node_id == edgeKey.to_node_id && item.edge_key.to_handle_id == edgeKey.to_handle_id) {
                return false;
            }
            return true;
        });
        const res = await request(prjBoardApi.get_edge({
            session_id: this.rootStore.userStore.sessionId,
            project_id: this.rootStore.projectStore.curProjectId,
            board_id: this.rootStore.entryStore.curEntry?.entry_id ?? "",
            edge_key: edgeKey,
        }));
        tmpList.push(res.edge);
        runInAction(() => {
            this._edgeList = tmpList;
        });
    }

    async removeNode(nodeId: string) {
        const tmpNodeList = this._nodeList.filter(item => item.node_id != nodeId);
        const tmpEdgeList = this._edgeList.filter(item => !(item.edge_key.from_node_id == nodeId || item.edge_key.to_node_id == nodeId));
        runInAction(() => {
            this._nodeList = tmpNodeList;
            this._edgeList = tmpEdgeList;
        });
    }

    async removeEdge(edgeKey: prjBoardApi.EdgeKey) {
        const tmpList = this._edgeList.filter(item => {
            if (item.edge_key.from_node_id == edgeKey.from_node_id && item.edge_key.from_handle_id == edgeKey.from_handle_id
                && item.edge_key.to_node_id == edgeKey.to_node_id && item.edge_key.to_handle_id == edgeKey.to_handle_id) {
                return false;
            }
            return true;
        });
        runInAction(() => {
            this._edgeList = tmpList;
        });
    }

    updateNodePosition(nodeId: string, x: number, y: number) {
        const tmpList = this._nodeList.slice();
        const index = tmpList.findIndex(item => item.node_id == nodeId);
        if (index != -1) {
            tmpList[index].x = x;
            tmpList[index].y = y;
            runInAction(() => {
                this._nodeList = tmpList;
            });
        }
    };

    updateNodeSize(nodeId: string, w: number, h: number) {
        const tmpList = this._nodeList.slice();
        const index = tmpList.findIndex(item => item.node_id == nodeId);
        if (index != -1) {
            tmpList[index].w = w;
            tmpList[index].h = h;
            runInAction(() => {
                this._nodeList = tmpList;
            });
        }
    }
}