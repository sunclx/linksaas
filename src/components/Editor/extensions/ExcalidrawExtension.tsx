import { command, extension, NodeExtension, ExtensionTag, getTextSelection } from '@remirror/core';
import type {
  ApplySchemaAttributes,
  NodeSpecOverride,
  NodeExtensionSpec,
  CommandFunction,
  PrimitiveSelection,
} from '@remirror/core';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import React from 'react';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { EditExcalidraw, ViewExcalidraw } from './ExcalidrawComponent';

export interface ExcalidrawOptions {
  collapse?: boolean;
}

@extension<ExcalidrawOptions>({ defaultOptions: { collapse: false } })
export class ExcalidrawExtension extends NodeExtension<ExcalidrawOptions> {
  get name() {
    return 'excaliDraw' as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      inline: false,
      selectable: false,
      draggable: false,
      atom: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        elements: { default: null },
        appState: { default: null },
        files: { default: undefined },
      },
    };
  }

  @command()
  insertExcaliDraw(selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({});
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  @command()
  deleteExcaliDraw(pos: number): CommandFunction {
    return ({ tr, state, dispatch }) => {
      const node = state.doc.nodeAt(pos);

      if (node && node.type === this.type) {
        tr.delete(pos, pos + 1).scrollIntoView();
        dispatch?.(tr);
        return true;
      }

      return false;
    };
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    const attrs = props.node.attrs as ExcalidrawAttributes;
    if (props.view.editable) {
      return (
        <EditExcalidraw
          {...props}
          elements={attrs.elements}
          appState={attrs.appState}
          files={attrs.files}
        />
      );
    }
    return (
      <ViewExcalidraw
        {...props}
        elements={attrs.elements}
        appState={attrs.appState}
        files={attrs.files}
        collapse={this.options.collapse}
      />
    );
  };
}

export interface ExcalidrawAttributes {
  elements?: readonly ExcalidrawElement[];
  appState?: AppState;
  files?: BinaryFiles;
}
