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
import { uniqId } from '@/utils/utils';
import type { FILE_OWNER_TYPE } from '@/api/fs';
import { FILE_OWNER_TYPE_NONE } from '@/api/fs';


const IMG_DATA_SRC_PATTERN = /^data:image\/([a-zA-Z0-9]+);base64,(.*)$/;

export interface ImageUploadOptions {
  fsId: string;
  thumbWidth: number;
  thumbHeight: number;
  ownerType: FILE_OWNER_TYPE;
  ownerId: string;
}

@extension<ImageUploadOptions>({ defaultOptions: { fsId: "", thumbWidth: 200, thumbHeight: 150, ownerType: FILE_OWNER_TYPE_NONE, ownerId: "" } })
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
        imageSrc: { default: undefined },
        thumbWidth: { default: undefined },
        thumbHeight: { default: undefined },
        ownerType: { default: undefined },
        ownerId: { default: undefined },
      },
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs: (el) => {
            if (this.options.fsId == "") {
              return false;
            }
            if (typeof (el) == "string") {
              return false;
            }
            const imgSrc = el.getAttribute("src");
            if (imgSrc == null) {
              return false;
            }
            if (imgSrc.startsWith("data:image/")) {
              const match = imgSrc.match(IMG_DATA_SRC_PATTERN);
              if (match == null) {
                return false;
              }
              const trackId = uniqId();
              const thumbTrackId = uniqId();
              const fileName = `upload.${match[1]}`

              const attr: ImageAttributes = {
                fileName: fileName,
                trackId: trackId,
                thumbTrackId: thumbTrackId,
                fsId: this.options.fsId,
                imageSrc: match[2],
                thumbWidth: this.options.thumbWidth,
                thumbHeight: this.options.thumbHeight,
                ownerType: this.options.ownerType,
                ownerId: this.options.ownerId,
              };
              return attr;
            }
            //TODO process http or https

            return false;
          },
          ...(override.parseDOM ?? []),
        },
      ],
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
          imageSrc={attrs.imageSrc}
          thumbWidth={attrs.thumbWidth}
          thumbHeight={attrs.thumbHeight}
          ownerType={attrs.ownerType}
          ownerId={attrs.ownerId}
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
  //下面属性是直接处理复制图片使用
  imageSrc?: string;
  thumbWidth?: number;
  thumbHeight?: number;
  ownerType?: FILE_OWNER_TYPE;
  ownerId?: string;
}
