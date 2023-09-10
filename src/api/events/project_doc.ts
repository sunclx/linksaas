import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
    LinkNoneInfo,
    LinkDocInfo,
} from '@/stores/linkAux';


export type CreateSpaceEvent = {
    doc_space_id: string;
    title: string;
};

function get_create_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateSpaceEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建 文档空间 ${inner.title}`)
    ];
}

export type UpdateSpaceEvent = {
    doc_space_id: string;
    old_title: string;
    new_title: string;
};

function get_update_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateSpaceEvent,
): LinkInfo[] {
    const ret_lsit = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改 文档空间 ${inner.old_title}`)
    ];
    if (inner.new_title != inner.old_title) {
        ret_lsit.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_lsit;
}

export type RemoveSpaceEvent = {
    doc_space_id: string;
    title: string;
}

function get_remove_space_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveSpaceEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除 文档空间 ${inner.title}`)
    ];
}

export type CreateDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_create_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 创建文档`),
        new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
}


export type UpdateDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    old_title: string;
    new_title: string;
}

function get_update_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateDocEvent,
): LinkInfo[] {
    const ret_list = [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 修改文档`),
        new LinkDocInfo(inner.old_title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
    if (inner.new_title != inner.old_title) {
        ret_list.push(new LinkNoneInfo(`新标题 ${inner.new_title}`));
    }
    return ret_list;
}

export type TagInfo = {
    tag_id: string;
    tag_name: string;
};

export type UpdateTagEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
    old_tag_list: TagInfo[];
    new_tag_list: TagInfo[];
};

function get_update_tag_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateTagEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 修改文档`),
        new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
        new LinkNoneInfo(`新标签 ${inner.new_tag_list.map(tag => tag.tag_name).join(",")} 旧标签 ${inner.old_tag_list.map(tag => tag.tag_name).join(",")}`),
    ];
}

export type MoveDocToRecycleEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_move_doc_to_recycle_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MoveDocToRecycleEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在文档空间 ${inner.doc_space_name} 删除文档 ${inner.title}`),
    ];
}

export type MoveDocEvent = {
    src_doc_space_id: string;
    src_doc_space_name: string;
    dest_doc_space_id: string;
    dest_doc_space_name: string;
    doc_id: string;
    title: string;
};

function get_move_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: MoveDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 移动文档`),
        new LinkDocInfo(inner.title, ev.project_id, "", inner.doc_id),
        new LinkNoneInfo(`从${inner.src_doc_space_name} 到 ${inner.dest_doc_space_name}`)
    ];
}

export type RemoveDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_remove_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 从回收站清除文档 ${inner.title}`),
    ];
}

export type RecoverDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_recover_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RecoverDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 恢复 文档空间 ${inner.doc_space_name} 文档`),
        new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
}

export type WatchDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_watch_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: WatchDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在 文档空间 ${inner.doc_space_name} 关注文档`),
        new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
}

export type UnWatchDocEvent = {
    doc_space_id: string;
    doc_space_name: string;
    doc_id: string;
    title: string;
}

function get_unwatch_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UnWatchDocEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 在 文档空间 ${inner.doc_space_name} 取消关注文档`),
        new LinkDocInfo(inner.title, ev.project_id, inner.doc_space_id, inner.doc_id),
    ];
}

export type AllProjectDocEvent = {
    CreateSpaceEvent?: CreateSpaceEvent;
    UpdateSpaceEvent?: UpdateSpaceEvent;
    RemoveSpaceEvent?: RemoveSpaceEvent;
    CreateDocEvent?: CreateDocEvent;
    UpdateDocEvent?: UpdateDocEvent;
    UpdateTagEvent?: UpdateTagEvent;
    MoveDocToRecycleEvent?: MoveDocToRecycleEvent;
    MoveDocEvent?: MoveDocEvent;
    RemoveDocEvent?: RemoveDocEvent;
    RecoverDocEvent?: RecoverDocEvent;
    WatchDocEvent?: WatchDocEvent;
    UnWatchDocEvent?: UnWatchDocEvent;
};

export function get_project_doc_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllProjectDocEvent): LinkInfo[] {
    if (inner.CreateSpaceEvent !== undefined) {
        return get_create_space_simple_content(ev, skip_prj_name, inner.CreateSpaceEvent);
    } else if (inner.UpdateSpaceEvent !== undefined) {
        return get_update_space_simple_content(ev, skip_prj_name, inner.UpdateSpaceEvent);
    } else if (inner.RemoveSpaceEvent !== undefined) {
        return get_remove_space_simple_content(ev, skip_prj_name, inner.RemoveSpaceEvent);
    } else if (inner.CreateDocEvent !== undefined) {
        return get_create_doc_simple_content(ev, skip_prj_name, inner.CreateDocEvent);
    } else if (inner.UpdateDocEvent !== undefined) {
        return get_update_doc_simple_content(ev, skip_prj_name, inner.UpdateDocEvent);
    } else if (inner.UpdateTagEvent !== undefined) {
        return get_update_tag_simple_content(ev, skip_prj_name, inner.UpdateTagEvent);
    } else if (inner.MoveDocToRecycleEvent !== undefined) {
        return get_move_doc_to_recycle_simple_content(ev, skip_prj_name, inner.MoveDocToRecycleEvent);
    } else if (inner.MoveDocEvent !== undefined) {
        return get_move_doc_simple_content(ev, skip_prj_name, inner.MoveDocEvent);
    } else if (inner.RemoveDocEvent !== undefined) {
        return get_remove_doc_simple_content(ev, skip_prj_name, inner.RemoveDocEvent);
    } else if (inner.RecoverDocEvent !== undefined) {
        return get_recover_doc_simple_content(ev, skip_prj_name, inner.RecoverDocEvent);
    } else if (inner.WatchDocEvent !== undefined) {
        return get_watch_doc_simple_content(ev, skip_prj_name, inner.WatchDocEvent);
    } else if (inner.UnWatchDocEvent !== undefined) {
        return get_unwatch_doc_simple_content(ev, skip_prj_name, inner.UnWatchDocEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}