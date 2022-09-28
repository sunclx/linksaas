import {
    command,
    extension,
    NodeExtension,
    ExtensionTag,
    getTextSelection,
    getTextContentFromSlice,
} from '@remirror/core';
import type { ApplySchemaAttributes, NodeSpecOverride, NodeExtensionSpec, CommandFunction, PrimitiveSelection } from '@remirror/core';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import React from 'react';
import type { LinkInfo } from '@/stores/linkAux';
import { LinkNoneInfo } from '@/stores/linkAux';
import { EditLink, ViewLink } from './LinkComponent';

export interface LinkOptions { }

@extension<LinkOptions>({ defaultOptions: {} })
export class LinkExtension extends NodeExtension<LinkOptions> {
    get name() {
        return 'link' as const;
    }
    createTags() {
        return [ExtensionTag.FormattingNode, ExtensionTag.InlineNode];
    }
    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            inline: true,
            selectable: false,
            draggable: false,
            atom: true,
            ...override,
            attrs: {
                ...extra.defaults(),
                link: { default: new LinkNoneInfo("") },
            },
        };
    }

    @command()
    insertLink(linkInfo: LinkInfo, useOrigContent: boolean, selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const sel = getTextSelection(selection ?? tr.selection, tr.doc);
            if (useOrigContent) {
                const contentStr = getTextContentFromSlice(sel.content());
                linkInfo.linkContent = contentStr;
            }
            const node = this.type.create({
                link: linkInfo,
            });
            dispatch?.(tr.replaceRangeWith(sel.from, sel.to, node));
            return true;
        }
    }

    @command()
    deleteLink(pos: number): CommandFunction {
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
        const attrs = props.node.attrs as unknown as LinkAttributes;
        if (props.view.editable) {
            return <EditLink {...props} link={attrs.link} />
        }
        return (<ViewLink {...props} link={attrs.link} />);
    };
}

export interface LinkAttributes {
    link: LinkInfo;
}