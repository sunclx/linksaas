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
import { EditIframe, ViewIframe } from './IframeComponent';

export interface IframeOptions {
  collapse?: boolean;
}

@extension<IframeOptions>({ defaultOptions: { collapse: false } })
export class IframeExtension extends NodeExtension<IframeOptions> {
  get name() {
    return 'iframe' as const;
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
        src: { default: '' },
        height: { default: 200 },
      },
    };
  }

  @command()
  insertIframe(srcUrl: string, height: number, selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({
        src: srcUrl,
        height: height,
      });
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  @command()
  deleteIframe(pos: number): CommandFunction {
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
    const attrs = props.node.attrs as unknown as IframeAttributes;
    if (props.view.editable) {
      return <EditIframe {...props} src={attrs.src} height={attrs.height} />;
    }
    return <ViewIframe {...props} src={attrs.src} height={attrs.height} />;
  };
}

export interface IframeAttributes {
  src: string;
  height: number;
}
