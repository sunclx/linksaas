import {
  command,
  extension,
  NodeExtension,
  ExtensionTag,
  omitExtraAttributes,
  getTextSelection,
} from '@remirror/core';
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
import { EditImage, ViewImage } from './ImageUploadComponent';

export interface ImageUploadOptions {}

@extension<ImageUploadOptions>({ defaultOptions: {} })
export class ImageUploadExtension extends NodeExtension<ImageUploadOptions> {
  get name() {
    return 'imageUpload' as const;
  }

  createTags() {
    return [ExtensionTag.InlineNode, ExtensionTag.Media];
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      inline: true,
      draggable: true,
      selectable: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        fileName: { default: '' },
        trackId: { default: null },
        thumbTrackId: { default: null },
        fsId: { default: '' },
        fileId: { default: '' },
        thumbFileId: { default: '' },
      },
      toDOM: (node) => {
        const attrs = omitExtraAttributes(node.attrs, extra);
        return ['img', { ...extra.dom(node), ...attrs }];
      },
    };
  }

  @command()
  insertImageUpload(
    trackId: string,
    thumbTrackId: string,
    fsId: string,
    fileName: string,
    selection?: PrimitiveSelection,
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({
        trackId: trackId,
        thumbTrackId: thumbTrackId,
        fsId: fsId,
        fileName: fileName,
      } as ImageAttributes);
      dispatch?.(tr.replaceRangeWith(from, to, node));
      return true;
    };
  }

  @command()
  deleteImageUpload(pos: number): CommandFunction {
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
    const attrs = props.node.attrs as unknown as ImageAttributes;
    if (props.view.editable) {
      return (
        <EditImage
          {...props}
          trackId={attrs.trackId ?? ''}
          thumbTrackId={attrs.thumbTrackId ?? ''}
          fsId={attrs.fsId}
          fileName={attrs.fileName}
          fileId={attrs.fileId ?? ''}
          thumbFileId={attrs.thumbFileId ?? ''}
        />
      );
    }
    return (
      <ViewImage
        {...props}
        fsId={attrs.fsId}
        fileName={attrs.fileName}
        fileId={attrs.fileId ?? ''}
        thumbFileId={attrs.thumbFileId ?? ''}
      />
    );
  };
}

export interface ImageAttributes {
  fileName: string;
  trackId?: string | null;
  thumbTrackId?: string | null;
  fsId: string;
  fileId?: string;
  thumbFileId?: string;
}
