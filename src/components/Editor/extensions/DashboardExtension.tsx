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
import { EditDashboard, ViewDashboard } from './DashboardComponent';
import React from 'react';
import type { Layout } from "react-grid-layout";


export type BoardItem = Layout & {
    name: string;
    url: string;
};

export interface DashboardOptions { }

@extension<DashboardOptions>({ defaultOptions: {} })
export class DashboardExtension extends NodeExtension<DashboardOptions> {
    get name() {
        return 'dashboard' as const;
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
                itemList: { default: [] },
            }
        }
    }

    @command()
    insertDashboard(selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const sel = getTextSelection(selection ?? tr.selection, tr.doc);

            const node = this.type.create({});
            dispatch?.(tr.replaceRangeWith(sel.from, sel.to, node));
            return true;
        }
    }

    @command()
    deleteDashboard(pos: number): CommandFunction {
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
        const attrs = props.node.attrs as unknown as DashboardAttributes;
        if (props.view.editable) {
            return <EditDashboard {...props} itemList={attrs.itemList} />
        }
        return (<ViewDashboard {...props} itemList={attrs.itemList} />);
    };
}

export interface DashboardAttributes {
    itemList: BoardItem[];
}