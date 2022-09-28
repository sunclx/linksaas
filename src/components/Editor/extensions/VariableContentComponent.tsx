import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useCommands } from '@remirror/react';
import { useStores } from '@/hooks';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export type EditVariableContentProps = NodeViewComponentProps & {
  projectId: string;
  blockCollId: string;
  blockId: string;
};

export const EditVariableContent: React.FC<EditVariableContentProps> = (props) => {
  const appStore = useStores('appStore');

  const { deleteVariableContent } = useCommands();
  const removeNode = () => {
    deleteVariableContent((props.getPosition as () => number)());
  };

  const url = `/vc.html?projectId=${props.projectId}&blockCollId=${props.blockCollId}&blockId=${props.blockId}&osWin=${appStore.isOsWindows}`;

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => removeNode()}>
        <iframe src={url} />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export type ViewVariableContentProps = NodeViewComponentProps & {
  projectId: string;
  blockCollId: string;
  blockId: string;
};

export const ViewVariableContent: React.FC<ViewVariableContentProps> = (props) => {
  const appStore = useStores('appStore');

  const url = `/vc.html?projectId=${props.projectId}&blockCollId=${props.blockCollId}&blockId=${props.blockId}&osWin=${appStore.isOsWindows}`;

  return (
    <ErrorBoundary>
      <EditorWrap>
        <iframe src={url} />
      </EditorWrap>
    </ErrorBoundary>
  );
};
