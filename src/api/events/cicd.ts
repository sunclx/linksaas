import type { PluginEvent } from '../events';
import { LinkPipeLineInfo } from '@/stores/linkAux';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';

export type CreatePipeLineEvent = {
    pipe_line_id: string;
    pipe_line_name: string;
};

function get_create_pipe_line_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreatePipeLineEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建流水线`),
        new LinkPipeLineInfo(inner.pipe_line_name, ev.project_id, inner.pipe_line_id),
    ];
}

export type RemovePipeLineEvent = {
    pipe_line_id: string;
    pipe_line_name: string;
};

function get_remove_pipe_line_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemovePipeLineEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除流水线 ${inner.pipe_line_name}`),
    ];
}

export class AllCiCdEvent {
    CreatePipeLineEvent?: CreatePipeLineEvent;
    RemovePipeLineEvent?: RemovePipeLineEvent;
}

export function get_cicd_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllCiCdEvent,
): LinkInfo[] {
    if (inner.CreatePipeLineEvent !== undefined) {
        return get_create_pipe_line_simple_content(ev, skip_prj_name, inner.CreatePipeLineEvent);
    } else if (inner.RemovePipeLineEvent !== undefined) {
        return get_remove_pipe_line_simple_content(ev, skip_prj_name, inner.RemovePipeLineEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}