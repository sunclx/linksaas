import React, { useCallback, useRef, useState } from 'react';
import { Remirror, useRemirror, EditorComponent } from '@remirror/react';
import { ThemeProvider } from '@remirror/react';
import Toolbar from './components/Toolbar';
import FloatToolBar from './components/FloatToolbar';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { TableComponents } from '@remirror/extension-react-tables';
import {
  historyItem,
  clipboardItem,
  headItem,
  listItem,
  newCommItem,
  contentWidgetItem,
} from './components/ToolbarItem';
import { Reminder } from './components/index';

import type { EditorRef } from './common';
import { ImperativeHandle } from './common';
import type { RemirrorContentType } from '@remirror/core';

import type { FILE_OWNER_TYPE } from '@/api/fs';
import { getExtensions } from './extensions';
import type { InvalidContentHandler, RemirrorJSON } from 'remirror';
import type { TocInfo } from './extensions/index';
import TableCellMenu from './components/TableCellMenu';
import type { EventsOptions } from '@remirror/extension-events';


export interface UseCommonEditorAttrs {
  content: RemirrorContentType;
  fsId: string;
  ownerType: FILE_OWNER_TYPE;
  ownerId: string;
  projectId: string;
  historyInToolbar: boolean;
  clipboardInToolbar: boolean;
  commonInToolbar: boolean;
  enableLink?: boolean;
  widgetInToolbar: boolean;
  showReminder: boolean;
  tocCallback?: (tocList: TocInfo[]) => void;
  eventsOption?: EventsOptions;
  placeholder?: string;
}

export const useCommonEditor = (attrs: UseCommonEditorAttrs) => {
  const [showReminder, setShowReminder] = useState(false);

  let newContent = attrs.content;
  if (typeof newContent == 'string') {
    try {
      newContent = JSON.parse(newContent) as RemirrorJSON;
      if (newContent.type == undefined) {
        newContent.type = "doc";
      }
    } catch (err) { }
  }
  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    return transformers.remove(json, invalidContent);
  }, []);

  const { manager, state } = useRemirror({
    extensions: getExtensions({
      setShowRemind: (value: boolean) => {
        setShowReminder(value);
      },
      fsId: attrs.fsId,
      thumbWidth: 200,
      thumbHeight: 150,
      ownerType: attrs.ownerType,
      ownerId: attrs.ownerId,
      tocCallback: attrs.tocCallback,
      eventsOption: attrs.eventsOption,
    }),
    content: newContent,
    stringHandler: 'html',
    onError: onError,
  });

  const editorRef = useRef<EditorRef | null>(null);
  const toolbarItems = [];
  if (attrs.historyInToolbar) {
    toolbarItems.push(historyItem);
  }
  if (attrs.clipboardInToolbar) {
    toolbarItems.push(clipboardItem);
  }
  toolbarItems.push(
    ...[
      headItem,
      listItem,
    ],
  );
  if (attrs.commonInToolbar) {
    toolbarItems.push(newCommItem({
      fsId: attrs.fsId,
      thumbWidth: 200,
      thumbHeight: 150,
      ownerType: attrs.ownerType,
      ownerId: attrs.ownerId,
    }));
  }
  if (attrs.widgetInToolbar) {
    toolbarItems.push(contentWidgetItem(attrs.projectId));
  }
  const editor = (
    <ThemeProvider>
      <AllStyledComponent>
        <Remirror manager={manager} initialContent={state} placeholder={attrs?.placeholder ?? "请输入......"}>
          <Toolbar items={toolbarItems} />
          <FloatToolBar enableLink={attrs.enableLink == true || attrs.commonInToolbar} />
          {attrs.showReminder && (
            <Reminder enabled={showReminder} />
          )}
          <ImperativeHandle ref={editorRef} />
          <EditorComponent />
          <TableComponents tableCellMenuProps={{ Component: TableCellMenu }} />
        </Remirror>
      </AllStyledComponent>
    </ThemeProvider>
  );
  return {
    editor,
    editorRef,
  };
};
