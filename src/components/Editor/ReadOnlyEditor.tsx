import React, { useCallback, useEffect, useRef } from 'react';
import { Remirror, useRemirror, EditorComponent } from '@remirror/react';
import type { RemirrorContentType } from '@remirror/core';
import { getExtensions } from './extensions';
import type { InvalidContentHandler, RemirrorJSON } from 'remirror';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { ThemeProvider } from '@remirror/react';
import { observer } from 'mobx-react';
import { FILE_OWNER_TYPE_NONE } from '@/api/fs';
import type { EditorRef } from './common';
import { ImperativeHandle } from './common';
import type { TocInfo } from './extensions/index';

export type ReadOnlyEditorProps = {
  content: RemirrorContentType;
  collapse?: boolean;
  keywordList?: string[];
  keywordCallback?: (kwList: string[]) => void;
  tocCallback?: (tocList: TocInfo[]) => void;
};

export const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = observer((props) => {
  let content = props.content;
  const collapse = props.collapse || false;
  if (typeof content == 'string') {
    if (content.startsWith('{')) {
      try {
        content = JSON.parse(content) as RemirrorJSON;
        if (content.type == undefined) {
          content.type = "doc";
        }
      } catch (err) {
      }
    }
  }

  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    // Automatically remove all invalid nodes and marks.
    return transformers.remove(json, invalidContent);
  }, []);

  const extensions = getExtensions({
    collapse, fsId: "",
    thumbWidth: 200,
    thumbHeight: 150,
    ownerType: FILE_OWNER_TYPE_NONE,
    ownerId: "",
    keywordList: props.keywordList,
    keywordCallback: props.keywordCallback,
    tocCallback: props.tocCallback,
  });

  const { manager, state } = useRemirror({
    extensions: extensions,
    stringHandler: 'html',
    onError: onError,
  });

  const editorRef = useRef<EditorRef | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (editorRef != null) {
        clearInterval(timer);
        editorRef.current?.setContent(content);
      }
    }, 50);
    return () => {
      clearInterval(timer);
    };
  }, [props.content]);

  return (
    <div className="remirror-readonly">
      <ThemeProvider>
        <AllStyledComponent>
          <Remirror manager={manager} initialContent={state} editable={false} >
            <ImperativeHandle ref={editorRef} />
            <EditorComponent />
          </Remirror>
        </AllStyledComponent>
      </ThemeProvider>
    </div>
  );
});
