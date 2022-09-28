import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useCommands } from '@remirror/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';

export type EditExcalidrawProps = NodeViewComponentProps & {
  elements?: readonly ExcalidrawElement[];
  appState?: AppState;
  files?: BinaryFiles;
};

export const EditExcalidraw: React.FC<EditExcalidrawProps> = (props) => {
  const { deleteExcaliDraw } = useCommands();
  const removeNode = () => {
    deleteExcaliDraw((props.getPosition as () => number)());
  };
  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => removeNode()}>
        <div style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
          <Excalidraw
            onChange={(
              elements: readonly ExcalidrawElement[],
              appState: AppState,
              files: BinaryFiles,
            ) => {
              props.updateAttributes({
                elements: elements,
                appState: appState,
                files: files,
              });
            }}
            initialData={{
              elements: props.elements,
              appState: {
                ...(props.appState ?? {}),
                collaborators: new Map(),
                showHelpDialog: false,
              },
              files: props.files,
              scrollToContent: true,
              libraryItems: [],
            }}
            viewModeEnabled={false}
            zenModeEnabled={false}
            gridModeEnabled={true}
            isCollaborating={false}
            langCode="zh-CN"
            UIOptions={{
              canvasActions: {
                loadScene: false,
                export: false,
                saveToActiveFile: false,
                saveAsImage: false,
                clearCanvas: false,
                changeViewBackgroundColor: false,
              },
            }}
          />
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export type ViewExcalidrawProps = NodeViewComponentProps & {
  elements?: readonly ExcalidrawElement[];
  appState?: AppState;
  files?: BinaryFiles;
  collapse?: boolean;
};

export const ViewExcalidraw: React.FC<ViewExcalidrawProps> = (props) => {
  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <div style={{ height: 400 }}>
          <Excalidraw
            initialData={{
              elements: props.elements,
              appState: {
                ...(props.appState ?? {}),
                collaborators: new Map(),
                showHelpDialog: false,
                scrolledOutside: false,
              },
              files: props.files,
              scrollToContent: true,
              libraryItems: [],
            }}
            viewModeEnabled={true}
            zenModeEnabled={true}
            gridModeEnabled={true}
            isCollaborating={false}
            langCode="zh-CN"
            detectScroll={false}
            handleKeyboardGlobally={false}
            UIOptions={{
              canvasActions: {
                clearCanvas: false,
                loadScene: false,
                export: false,
                saveToActiveFile: false,
                saveAsImage: false,
                theme: false,
                changeViewBackgroundColor: false,
              },
            }}
          />
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};
