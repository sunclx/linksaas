import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useCommands } from '@remirror/react';
import type { Sheet } from '@fortune-sheet/core';
import EditorWrap from '../components/EditorWrap';

export type EditFortuneSheetProps = NodeViewComponentProps & {
  sheetList: Sheet[];
};

export const EditFortuneSheet: React.FC<EditFortuneSheetProps> = (props) => {
  const { deleteFortuneSheet } = useCommands();
  const removeNode = () => {
    deleteFortuneSheet((props.getPosition as () => number)());
  };

  const setting = {
    data: props.sheetList,
    row: 20,
    column: 20,
    lang: 'zh',
    showSheetTabs: false,
    cellContextMenu: ['insert-row', 'insert-column', 'delete-row', 'delete-column'],
    toolbarItems: [
      'undo',
      'redo',
      'format-painter',
      'clear-format',
      '|',
      'format',
      'font-size',
      '|',
      'bold',
      'italic',
      'strike-through',
      'underline',
      '|',
      'font-color',
      'background',
      'border',
      'merge-cell',
      '|',
      'horizontal-align',
      'vertical-align',
      'text-wrap',
      'text-rotation',
      '|',
      'freeze',
      'sort',
      'comment',
    ],
  };
  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => removeNode()}>
        <div style={{ height: 400, overflow: 'hidden' }}>
          <Workbook
            {...setting}
            onChange={(sheetList) => {
              props.updateAttributes({ sheetList: sheetList });
              console.log(sheetList);
            }}
          />
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export type ViewFortuneSheetProps = NodeViewComponentProps & {
  sheetList: Sheet[];
};

export const ViewFortuneSheet: React.FC<ViewFortuneSheetProps> = (props) => {
  const setting = {
    data: props.sheetList,
    lang: 'zh',
    showSheetTabs: false,
    cellContextMenu: [],
    toolbarItems: [],
    showToolbar: false,
    showFormulaBar: false,
    allowEdit: false,
  };
  return (
    <ErrorBoundary>
      <EditorWrap>
        <div style={{ height: 400, overflow: 'hidden' }}>
          <Workbook {...setting} />
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};
