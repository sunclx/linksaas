import type { PluginEvent } from '../events';
import { LinkCodeCommentInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';

export type AddCommentEvent = {
    comment_id: string;
    thread_id: string;
    content_type: number;
    content: string;
};

function get_add_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddCommentEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 增加`),
        new LinkCodeCommentInfo("代码评论", ev.project_id, inner.thread_id, inner.comment_id),
    ];
}

export type UpdateCommentEvent = {
    comment_id: string;
    thread_id: string;
    old_content_type: number;
    new_content_type: number;
    old_content: string;
    new_content: string;
};

function get_update_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UpdateCommentEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 修改`),
        new LinkCodeCommentInfo("代码评论", ev.project_id, inner.thread_id, inner.comment_id),
    ];
}

export type RemoveCommentEvent = {
    comment_id: string;
    thread_id: string;
    content_type: number;
    content: string;
};

function get_remove_comment_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveCommentEvent,
): LinkInfo[] {
    console.log(ev, skip_prj_name, inner);
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除`),
        new LinkCodeCommentInfo("代码评论", ev.project_id, inner.thread_id, inner.comment_id),
    ];
}

export class AllCodeEvent {
    AddCommentEvent?: AddCommentEvent;
    UpdateCommentEvent?: UpdateCommentEvent;
    RemoveCommentEvent?: RemoveCommentEvent;
}

export function get_code_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllCodeEvent,
): LinkInfo[] {
    if (inner.AddCommentEvent !== undefined) {
        return get_add_comment_simple_content(ev, skip_prj_name, inner.AddCommentEvent);
    } else if (inner.UpdateCommentEvent !== undefined) {
        return get_update_comment_simple_content(ev, skip_prj_name, inner.UpdateCommentEvent);
    } else if (inner.RemoveCommentEvent !== undefined) {
        return get_remove_comment_simple_content(ev, skip_prj_name, inner.RemoveCommentEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}