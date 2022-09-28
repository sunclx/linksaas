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
import { EditVariableContent, ViewVariableContent } from './VariableContentComponent';

export interface VariableContentOptions {}

@extension<VariableContentOptions>({ defaultOptions: {} })
export class VariableContentExtension extends NodeExtension<VariableContentOptions> {
  get name() {
    return 'variableContent' as const;
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
        projectId: { default: '' },
        blockCollId: { default: '' },
        blockId: { default: '' },
      },
    };
  }

  @command()
  insertVariableContent(
    projectId: string,
    blockCollId: string,
    blockId: string,
    selection?: PrimitiveSelection,
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({
        projectId: projectId,
        blockCollId: blockCollId,
        blockId: blockId,
      });
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  @command()
  deleteVariableContent(pos: number): CommandFunction {
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
    const attrs = props.node.attrs as unknown as VariableContentAttributes;
    if (props.view.editable) {
      return (
        <EditVariableContent
          {...props}
          projectId={attrs.projectId}
          blockCollId={attrs.blockCollId}
          blockId={attrs.blockId}
        />
      );
    }
    return (
      <ViewVariableContent
        {...props}
        projectId={attrs.projectId}
        blockCollId={attrs.blockCollId}
        blockId={attrs.blockId}
      />
    );
  };
}

export interface VariableContentAttributes {
  projectId: string;
  blockCollId: string;
  blockId: string;
}
