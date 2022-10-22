import {
    command,
    extension,
    NodeExtension,
    ExtensionTag,
    getTextSelection
} from '@remirror/core';
import type { ApplySchemaAttributes, NodeSpecOverride, NodeExtensionSpec, CommandFunction, PrimitiveSelection } from '@remirror/core';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import React from 'react';
import { EditFortuneSheet, ViewFortuneSheet } from './FortuneSheetComponent';
import type { Sheet } from "@fortune-sheet/core";



export interface FortuneSheetOptions { }

@extension<FortuneSheetOptions>({ defaultOptions: {} })
export class FortuneSheetExtension extends NodeExtension<FortuneSheetOptions> {
    get name() {
        return 'fortuneSheet' as const;
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
            isolating: true,
            ...override,
            attrs: {
                ...extra.defaults(),
                sheetList: { default: [{ name: "Sheet1", celldata: [{ r: 0, c: 0, v: null }] }] }
            },
        };
    }

    @command()
    insertFortuneSheet(selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
            const node = this.type.create({});
            tr.insertText("\n", from, to);
            tr.replaceRangeWith(from, from, node);
            dispatch?.(tr);
            return true;
        }
    }

    @command()
    deleteFortuneSheet(pos: number): CommandFunction {
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
        const attrs = props.node.attrs as unknown as FortuneSheetAttributes;
        if (props.view.editable) {
            return <EditFortuneSheet {...props} sheetList={attrs.sheetList}/>
        }
        return (<ViewFortuneSheet {...props} sheetList={attrs.sheetList}/>);
    };
}
export interface FortuneSheetAttributes {
    sheetList: Sheet[],
}