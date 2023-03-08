import { BlockquoteExtension } from '@remirror/extension-blockquote';
import { BoldExtension } from '@remirror/extension-bold';
import { HardBreakExtension } from '@remirror/extension-hard-break';
import { HeadingExtension } from '@remirror/extension-heading';
import { HorizontalRuleExtension } from '@remirror/extension-horizontal-rule';
import { ItalicExtension } from '@remirror/extension-italic';
import { ParagraphExtension } from '@remirror/extension-paragraph';
import {
  LinkExtension,
  ImageUploadExtension,
  FileUploadExtension,
  ExcalidrawExtension,
  ReminderUserExtension,
  IframeExtension,
  WidgetExtension,
  CodeExtension,
} from './extensions/index';
import {
  BulletListExtension,
  OrderedListExtension,
  TaskListExtension,
} from '@remirror/extension-list';
import { StrikeExtension } from '@remirror/extension-strike';
import { UnderlineExtension } from '@remirror/extension-underline';
import { SubExtension } from '@remirror/extension-sub';
import { SupExtension } from '@remirror/extension-sup';
import { FontSizeExtension } from '@remirror/extension-font-size';
import { TextColorExtension } from '@remirror/extension-text-color';
import { TextHighlightExtension } from '@remirror/extension-text-highlight';
import { MarkdownExtension } from 'remirror/dist-types/extensions';

export const getExtensions = (param?: {
  setShowRemind?: (value: boolean) => void;
  collapse?: boolean;
}) => {
  const retList = [
    // Nodes
    new ParagraphExtension(),
    new HardBreakExtension(),
    new ImageUploadExtension(),
    new FileUploadExtension(),
    new HorizontalRuleExtension(),
    new BlockquoteExtension(),
    new BoldExtension({ weight: 20 }),
    new BulletListExtension(),
    new OrderedListExtension(),
    new TaskListExtension(),
    new ExcalidrawExtension({ collapse: param?.collapse }),
    new WidgetExtension({ collapse: param?.collapse }),
    new ReminderUserExtension({ setShow: param?.setShowRemind }),
    new IframeExtension({ collapse: param?.collapse }),
    new CodeExtension({ collapse: param?.collapse }),
    new MarkdownExtension({copyAsMarkdown: false}),

    // Marks
    new HeadingExtension({ defaultLevel: 3, levels: [1, 2, 3, 4, 5, 6] }),
    new StrikeExtension(),
    new ItalicExtension(),
    new LinkExtension(),
    new UnderlineExtension(),
    new SubExtension(),
    new SupExtension(),
    new FontSizeExtension({ defaultSize: '12', unit: 'px' }),
    new TextColorExtension(),
    new TextHighlightExtension(),
  ];
  return () => retList;
};
