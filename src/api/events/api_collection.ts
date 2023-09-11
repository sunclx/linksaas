import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';

import type { API_COLL_TYPE } from '../api_collection';

export type CreateApiCollectionEvent = {
    api_coll_id: string;
    api_coll_type: API_COLL_TYPE;
    name: string;
  };

  function get_create_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: CreateApiCollectionEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 创建API集合 ${inner.name}`),
    ];
  }

  export type RemoveApiCollectionEvent = {
    api_coll_id: string;
    api_coll_type: API_COLL_TYPE;
    name: string;
  };

  function get_remove_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveApiCollectionEvent,
  ): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除API集合 ${inner.name}`),
    ];
  }

  export class AllApiCollectionEvent {
    CreateApiCollectionEvent?: CreateApiCollectionEvent;
    RemoveApiCollectionEvent?: RemoveApiCollectionEvent;
  }

  export function get_api_collection_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllApiCollectionEvent,
  ) {
    if (inner.CreateApiCollectionEvent !== undefined) {
      return get_create_simple_content(ev, skip_prj_name, inner.CreateApiCollectionEvent);
    } else if (inner.RemoveApiCollectionEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveApiCollectionEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }