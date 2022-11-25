import type { RemirrorContentType, RemirrorJSON } from '@remirror/core';
import React, { forwardRef, useImperativeHandle } from 'react';
import type { Ref } from 'react';
import { useRemirrorContext, useHelpers, useCommands } from '@remirror/react';
import type { CommandsFromExtensions, Extension } from 'remirror';

export interface EditorRef {
  clearContent: () => void;
  getContent: () => RemirrorJSON;
  setContent: (val: RemirrorContentType) => void;
  getCommands: () => CommandsFromExtensions<Extension>;
}

export const ImperativeHandle = forwardRef((_: unknown, ref: Ref<EditorRef>) => {
  const { clearContent, getState, setContent } = useRemirrorContext({
    autoUpdate: true,
  });
  const commands = useCommands();

  const { getJSON } = useHelpers();
  // Expose content handling to outside
  useImperativeHandle(ref, () => ({
    clearContent,
    getContent: () => {
      return getJSON(getState());
    },
    setContent: (val: RemirrorContentType) => {
      let content = val;
      if (typeof content == 'string') {
        try {
          content = JSON.parse(content);
        } catch (err) { }
      }
      setContent(content);
    },
    getCommands: () => {
      return commands;
    },
  }));
  return <></>;
});
