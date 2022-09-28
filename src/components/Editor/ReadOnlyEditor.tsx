import React, { useCallback } from 'react';
import { Remirror, useRemirror } from '@remirror/react';
import type { RemirrorContentType } from '@remirror/core';
import { getExtensions } from './extensions';
import type { InvalidContentHandler } from 'remirror';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { ThemeProvider } from '@remirror/react';

export type ReadOnlyEditorProps = {
  content: RemirrorContentType;
  collapse?: boolean;
};

export const ReadOnlyEditor: React.FC<ReadOnlyEditorProps> = (props) => {
  let content = props.content;
  const collapse = props.collapse || false;
  if (typeof content == 'string') {
    if (content.startsWith('{')) {
      try {
        content = JSON.parse(content);
      } catch (err) {}
    }
  }

  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    // Automatically remove all invalid nodes and marks.
    return transformers.remove(json, invalidContent);
  }, []);

  const { manager, state } = useRemirror({
    extensions: getExtensions({ collapse }),
    content: content,
    stringHandler: 'html',
    onError: onError,
  });
  return (
    <div className="remirror-readonly">
      <ThemeProvider>
        <AllStyledComponent>
          <Remirror manager={manager} initialContent={state} editable={false} />
        </AllStyledComponent>
      </ThemeProvider>
    </div>
  );
};
