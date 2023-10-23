import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {
  LinkNoneInfo,
  LinkSpritInfo, LinkDocInfo,
} from '@/stores/linkAux';

export type LinkDocEvent = {
  sprit_id: string;
  sprit_title: string;
  doc_id: string;
  doc_title: string;
};

function get_link_doc_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: LinkDocEvent,
): LinkInfo[] {
  return [
    new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 关联工作计划`),
    new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
    new LinkNoneInfo("和文档"),
    new LinkDocInfo(inner.doc_title, ev.project_id, inner.doc_id),
  ];
}

export type CancelLinkDocEvent = {
  sprit_id: string;
  sprit_title: string;
  doc_id: string;
  doc_title: string;
}

function get_cancel_link_doc_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: CancelLinkDocEvent,
): LinkInfo[] {
  return [
    new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 取消工作计划`),
    new LinkSpritInfo(inner.sprit_title, ev.project_id, inner.sprit_id),
    new LinkNoneInfo("和文档"),
    new LinkDocInfo(inner.doc_title, ev.project_id, inner.doc_id),
    new LinkNoneInfo("关联"),
  ];
}

export type AllSpritEvent = {
  LinkDocEvent?: LinkDocEvent;
  CancelLinkDocEvent?: CancelLinkDocEvent;
};

export function get_sprit_simple_content(
  ev: PluginEvent,
  skip_prj_name: boolean,
  inner: AllSpritEvent,
): LinkInfo[] {
  if (inner.LinkDocEvent !== undefined) {
    return get_link_doc_simple_content(ev, skip_prj_name, inner.LinkDocEvent)
  } else if (inner.CancelLinkDocEvent !== undefined) {
    return get_cancel_link_doc_simple_content(ev, skip_prj_name, inner.CancelLinkDocEvent);
  }
  return [new LinkNoneInfo('未知事件')];
}