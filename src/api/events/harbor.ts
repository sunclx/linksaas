import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';

export type Resource = {
    digest: string;
    tag: string;
    resource_url: string;
};

export type Repository = {
    name: string;
    namespace: string;
    repo_full_name: string;
    repo_type: string;
};

export type EventData = {
    resources: Resource[];
    repository: Repository;
};

export type PushArtifactEvent = {
    occur_at: number;
    operator: string;
    event_data: EventData;
};

function get_push_artifact_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: PushArtifactEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${inner.operator}) 推送工件 ${inner.event_data.repository.repo_full_name}`),
    ];
}

export type DeleteArtifactEvent = {
    occur_at: number;
    operator: string;
    event_data: EventData;
};

function get_delete_artifact_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: DeleteArtifactEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${inner.operator}) 删除工件 ${inner.event_data.repository.repo_full_name}`),
    ];
}

export type UploadChartEvent = {
    occur_at: number;
    operator: string;
    event_data: EventData;
};

function get_upload_chart_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: UploadChartEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${inner.operator}) 上传chart ${inner.event_data.repository.repo_full_name}`),
    ];
}

export type DeleteChartEvent = {
    occur_at: number;
    operator: string;
    event_data: EventData;
};

function get_delete_chart_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: DeleteChartEvent,
): LinkInfo[] {
    return [
        new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 源用户(${inner.operator}) 删除chart ${inner.event_data.repository.repo_full_name}`),
    ];
}

export class AllHarborEvent {
    PushArtifactEvent?: PushArtifactEvent;
    DeleteArtifactEvent?: DeleteArtifactEvent;
    UploadChartEvent?: UploadChartEvent;
    DeleteChartEvent?: DeleteChartEvent;
}

export function get_harbor_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllHarborEvent,
): LinkInfo[] {
    if (inner.PushArtifactEvent !== undefined) {
        return get_push_artifact_simple_content(ev, skip_prj_name, inner.PushArtifactEvent);
    } else if (inner.DeleteArtifactEvent !== undefined) {
        return get_delete_artifact_simple_content(ev, skip_prj_name, inner.DeleteArtifactEvent);
    } else if (inner.UploadChartEvent !== undefined) {
        return get_upload_chart_simple_content(ev, skip_prj_name, inner.UploadChartEvent);
    } else if (inner.DeleteChartEvent !== undefined) {
        return get_delete_chart_simple_content(ev, skip_prj_name, inner.DeleteChartEvent);
    }
    return [new LinkNoneInfo('未知事件')];
}