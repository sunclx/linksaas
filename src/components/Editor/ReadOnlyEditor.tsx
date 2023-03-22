import React, { useCallback, useEffect, useRef } from 'react';
import { Remirror, useRemirror, EditorComponent } from '@remirror/react';
import type { RemirrorContentType } from '@remirror/core';
import { getExtensions } from './extensions';
import type { InvalidContentHandler } from 'remirror';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { ThemeProvider } from '@remirror/react';
import { observer } from 'mobx-react';
import { ImperativeHandle } from './common';
import type { EditorRef } from './common';
import { FILE_OWNER_TYPE_NONE } from '@/api/fs';

export type ReadOnlyEditorProps = {
  content: RemirrorContentType;
  collapse?: boolean;
  keywordList?: string[];
  keywordCallback?: (kwList: string[]) => void;
};

export const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = observer((props) => {
  let content = props.content;
  const collapse = props.collapse || false;
  if (typeof content == 'string') {
    if (content.startsWith('{')) {
      try {
        content = JSON.parse(content);
      } catch (err) { }
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
  });

  const { manager, state } = useRemirror({
    extensions: extensions,
    content: content,
    stringHandler: 'html',
    onError: onError,
  });
  const editorRef = useRef<EditorRef | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (editorRef != null) {
        editorRef.current?.setContent(content);
      }
    }, 200);
  }, [content]);

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
