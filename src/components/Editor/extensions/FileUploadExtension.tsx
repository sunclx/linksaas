import {
    command,
    extension,
    NodeExtension,
    ExtensionTag,
    omitExtraAttributes,
    getTextSelection
} from '@remirror/core';
import type { ApplySchemaAttributes, NodeSpecOverride, NodeExtensionSpec, CommandFunction, PrimitiveSelection } from '@remirror/core';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import React from 'react';
import { EditFile, ViewFile } from './FileUploadComponent';


export interface FileUploadOptions { }

@extension<FileUploadOptions>({ defaultOptions: {} })
export class FileUploadExtension extends NodeExtension<FileUploadOptions> {
    get name() {
        return 'fileUpload' as const;
    }

    createTags() {
        return [ExtensionTag.InlineNode, ExtensionTag.Media];
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            inline: true,
            draggable: true,
            selectable: false,
            atom: true,
            ...override,
            attrs: {
                ...extra.defaults(),
                fileName: { default: '' },
                trackId: { default: null },
                fsId: { default: '' },
                fileId: { default: '' },
                fileSize: { default: 0 },
            },
            toDOM: (node) => {
                const attrs = omitExtraAttributes(node.attrs, extra);
                return ['div', { ...extra.dom(node), ...attrs }];
            },
        };
    }

    @command()
    insertFileUpload(trackId: string, fsId: string, fileName: string, selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
            const node = this.type.create({
                trackId: trackId,
                fsId: fsId,
                fileName: fileName,
            } as FileAttributes);
            dispatch?.(tr.replaceRangeWith(from, to, node));
            return true;
        }
    }

    @command()
    deleteFileUpload(pos: number): CommandFunction {
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
        const attrs = props.node.attrs as unknown as FileAttributes;
        if (props.view.editable) {
            return (<EditFile {...props} trackId={attrs.trackId ?? ""} fsId={attrs.fsId} fileName={attrs.fileName} fileId={attrs.fileId ?? ""} fileSize={attrs.fileSize ?? 0} />)
        }
        return (<ViewFile {...props} fileId={attrs.fileId ?? ""} fsId={attrs.fsId} fileName={attrs.fileName} fileSize={attrs.fileSize ?? 0} />);
    };
}


export interface FileAttributes {
    fileName: string;
    trackId?: string | null;
    fsId: string;
    fileId?: string;
    fileSize?: number;
}