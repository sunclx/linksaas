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
import { Widget } from './WidgetComponent';
import type { WIDGET_TYPE } from '../widgets';
import { WidgetInitDataMap } from '../widgets';

export interface WidgetOptions {}

@extension<WidgetOptions>({ defaultOptions: { } })
export class WidgetExtension extends NodeExtension<WidgetOptions> {
  get name() {
    return 'widget' as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      inline: false,
      draggable: false,
      selectable: false,
      ...override,
      attrs: {
        ...extra.defaults(),
        widgetType: { default: '' },
        widgetData: { default: {} },
      },
    };
  }

  @command()
  insertWidget(widgetType: WIDGET_TYPE, selection?: PrimitiveSelection): CommandFunction {
    const widgetData = WidgetInitDataMap.get(widgetType);
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create({
        widgetType: widgetType,
        widgetData: widgetData,
      } as WidgetAttributes);
      tr.insertText("\n", from, to);
      tr.replaceRangeWith(from, from, node);
      dispatch?.(tr);
      return true;
    };
  }

  @command()
  deleteWidget(pos: number): CommandFunction {
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
    const attrs = props.node.attrs as unknown as WidgetAttributes;

    return (
      <Widget
        {...props}
        widgetType={attrs.widgetType}
        widgetData={attrs.widgetData}
      />
    );
  };
}

export interface WidgetAttributes {
  widgetType: WIDGET_TYPE;
  widgetData: unknown;
}
