import type { PluginEvent } from '../events';
import type { LinkInfo } from '@/stores/linkAux';
import {LinkNoneInfo} from '@/stores/linkAux';


export type AddBookEvent = {
    book_id: string;
    book_title: string;
  };

  function get_add_simple_content(ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AddBookEvent): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 增加书本 ${inner.book_title}`),
    ];
  }


  export type RemoveBookEvent = {
    book_id: string;
    book_title: string;
  };

  function get_remove_simple_content(ev: PluginEvent,
    skip_prj_name: boolean,
    inner: RemoveBookEvent): LinkInfo[] {
    return [
      new LinkNoneInfo(`${skip_prj_name ? '' : ev.project_name} 删除书本 ${inner.book_title}`),
    ];
  }

  export class AllBookShelfEvent {
    AddBookEvent?: AddBookEvent;
    RemoveBookEvent?: RemoveBookEvent;
  }

  export function get_book_shelf_simple_content(
    ev: PluginEvent,
    skip_prj_name: boolean,
    inner: AllBookShelfEvent,
  ): LinkInfo[] {
    if (inner.AddBookEvent !== undefined) {
      return get_add_simple_content(ev, skip_prj_name, inner.AddBookEvent);
    } else if (inner.RemoveBookEvent !== undefined) {
      return get_remove_simple_content(ev, skip_prj_name, inner.RemoveBookEvent);
    } else {
      return [new LinkNoneInfo('未知事件')];
    }
  }