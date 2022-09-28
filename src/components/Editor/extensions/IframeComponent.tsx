import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useCommands } from '@remirror/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';

export type EditIframeProps = NodeViewComponentProps & {
  src: string;
  height: number;
};

export const EditIframe: React.FC<EditIframeProps> = (props) => {
  const { deleteIframe } = useCommands();
  const removeNode = () => {
    deleteIframe((props.getPosition as () => number)());
  };

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => removeNode()}>
        <div>网页</div>
        <iframe height={props.height} src={props.src} style={{ width: '100%' }} />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export type ViewIframeProps = NodeViewComponentProps & {
  src: string;
  height: number;
};

export const ViewIframe: React.FC<ViewIframeProps> = (props) => {
  return (
    <ErrorBoundary>
      <EditorWrap>
        <iframe height={props.height} src={props.src} style={{ width: '100%' }} />
      </EditorWrap>
    </ErrorBoundary>
  );
};
