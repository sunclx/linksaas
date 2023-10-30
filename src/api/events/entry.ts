import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo, LinkSpritInfo, LinkDocInfo } from '@/stores/linkAux';
import { ENTRY_TYPE_BOARD, ENTRY_TYPE_DOC, ENTRY_TYPE_PAGES, ENTRY_TYPE_SPRIT } from '../project_entry';


function gen_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    action_name: string,
    entry_id: string,
    entry_type: number,
    entry_title: string,
): LinkInfo[] {
    let typeName = "";
    if (entry_type == ENTRY_TYPE_SPRIT) {
        typeName = "工作计划";
    } else if (entry_type == ENTRY_TYPE_DOC) {
        typeName = "文档";
    } else if (entry_type == ENTRY_TYPE_PAGES) {
        typeName = "静态网页";
    } else if (entry_type == ENTRY_TYPE_BOARD) {
        typeName = "白板";
    }
    const retList = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} ${action_name} ${typeName}`),
    ];
    if (entry_type == ENTRY_TYPE_SPRIT) {
        retList.push(new LinkSpritInfo(entry_title, ev.project_id, entry_id));
    } else if (entry_type == ENTRY_TYPE_DOC) {
        retList.push(new LinkDocInfo(entry_title, ev.project_id, entry_id));
    }
    return retList;
}
export type CreateEvent = {
    entry_id: string;
    entry_type: number;
    entry_title: string;
};

function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    return gen_simple_content(ev, skip_prj_name, "创建",
        inner.entry_id, inner.entry_type, inner.entry_title);
}

export type OpenEvent = {
    entry_id: string;
    entry_type: number;
    entry_title: string;
};

function get_open_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    return gen_simple_content(ev, skip_prj_name, "打开",
        inner.entry_id, inner.entry_type, inner.entry_title);

}

export type CloseEvent = {
    entry_id: string;
    entry_type: number;
    entry_title: string;
};

function get_close_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    return gen_simple_content(ev, skip_prj_name, "关闭",
        inner.entry_id, inner.entry_type, inner.entry_title);

}

export type RemoveEvent = {
    entry_id: string;
    entry_type: number;
    entry_title: string;
};

function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateEvent,
): LinkInfo[] {
    return gen_simple_content(ev, skip_prj_name, "删除",
        inner.entry_id, inner.entry_type, inner.entry_title);

}

export class AllEntryEvent {
    CreateEvent?: CreateEvent;
    OpenEvent?: OpenEvent;
    CloseEvent?: CloseEvent;
    RemoveEvent?: RemoveEvent;
}

export function get_entry_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllEntryEvent,
): LinkInfo[] {
    if (inner.CreateEvent !== undefined) {
        return get_create_simple_content(ev, skip_prj_name, inner.CreateEvent);
    } else if (inner.OpenEvent !== undefined) {
        return get_open_simple_content(ev, skip_prj_name, inner.OpenEvent);
    } else if (inner.CloseEvent !== undefined) {
        return get_close_simple_content(ev, skip_prj_name, inner.CloseEvent);
    } else if (inner.RemoveEvent !== undefined) {
        return get_remove_simple_content(ev, skip_prj_name, inner.RemoveEvent);
    } 
    return [new LinkNoneInfo('未知事件')];
}