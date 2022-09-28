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
import { EditCode, ViewCode } from './CodeComponent';

export interface CodeOptions {
  collapse?: boolean;
}

@extension<CodeOptions>({ defaultOptions: { collapse: false } })
export class CodeExtension extends NodeExtension<CodeOptions> {
  get name() {
    return 'code' as const;
  }

  createTags() {
    return [ExtensionTag.Block, ExtensionTag.Code];
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      inline: false,
      selectable: false,
      draggable: false,
      atom: true,
      code: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        lang: { default: 'json' },
        code: { default: '' },
      },
    };
  }

  @command()
  insertCode(selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({});
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  @command()
  deleteCode(pos: number): CommandFunction {
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
    const attrs = props.node.attrs as unknown as CodeAttributes;
    if (props.view.editable) {
      return <EditCode {...props} lang={attrs.lang} code={attrs.code} />;
    }
    return <ViewCode {...props} lang={attrs.lang} code={attrs.code} />;
  };
}

export interface CodeAttributes {
  lang: string;
  code: string;
}
