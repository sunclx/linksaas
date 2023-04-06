import type { ExtensionTagType } from '@remirror/core';

import {
    command,
    extension,
    NodeExtension,
    ExtensionTag,
    getTextSelection,
} from '@remirror/core';

import type {
    ApplySchemaAttributes, NodeSpecOverride, NodeExtensionSpec,
    CommandFunction, PrimitiveSelection
} from '@remirror/core';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import React from 'react';
import { EditKatex, ViewKatex } from './KatexComponent';

export interface KatexOptions { }

@extension<KatexOptions>({ defaultOptions: {} })
export class KatexExtension extends NodeExtension<KatexOptions> {
    get name() {
        return 'katex' as const;
    }

    createTags(): ExtensionTagType[] {
        return [ExtensionTag.Block];
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            ...override,
            inline: false,
            selectable: false,
            draggable: false,
            atom: true,
            attrs: {
                ...extra.defaults(),
                math: { default: "" },
            }
        }
    }

    @command()
    insertKatex(selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const sel = getTextSelection(selection ?? tr.selection, tr.doc);

            const node = this.type.create({});
            dispatch?.(tr.replaceRangeWith(sel.from, sel.to, node));
            return true;
        }
    }

    @command()
    deleteKatex(pos: number): CommandFunction {
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
        const attrs = props.node.attrs as unknown as KatexAttributes;
        if (props.view.editable) {
            return <EditKatex {...props} math={attrs.math} />
        }
        return (<ViewKatex {...props} math={attrs.math} />);
    };

}

export interface KatexAttributes {
    math: string;
}