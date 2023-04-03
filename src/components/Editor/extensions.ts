import { BlockquoteExtension } from '@remirror/extension-blockquote';
import { BoldExtension } from '@remirror/extension-bold';
import { HardBreakExtension } from '@remirror/extension-hard-break';
import { HeadingExtension } from '@remirror/extension-heading';
import { HorizontalRuleExtension } from '@remirror/extension-horizontal-rule';
import { ItalicExtension } from '@remirror/extension-italic';
import { ParagraphExtension } from '@remirror/extension-paragraph';
import type { TocInfo } from './extensions/index';
import {
  LinkExtension,
  ImageUploadExtension,
  FileUploadExtension,
  ReminderUserExtension,
  IframeExtension,
  WidgetExtension,
  CodeExtension,
  KeywordExtension,
  TocExtension,
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
import { MarkdownExtension } from '@remirror/extension-markdown';
import type { FILE_OWNER_TYPE } from '@/api/fs';
import { FILE_OWNER_TYPE_NONE } from '@/api/fs';
import { ReactComponentExtension } from '@remirror/extension-react-component';
import { TableExtension } from '@remirror/extension-react-tables';



export const getExtensions = (param?: {
  setShowRemind?: (value: boolean) => void;
  fsId: string;
  thumbWidth: number;
  thumbHeight: number;
  ownerType: FILE_OWNER_TYPE;
  ownerId: string;
  keywordList?: string[];
  keywordCallback?: (kwList: string[]) => void;
  tocCallback?: (tocList: TocInfo[]) => void;
}) => {
  const retList = [
    // Nodes
    new ParagraphExtension(),
    new HardBreakExtension(),
    new ImageUploadExtension({
      fsId: param?.fsId ?? "",
      thumbWidth: param?.thumbWidth ?? 200,
      thumbHeight: param?.thumbHeight ?? 150,
      ownerType: param?.ownerType ?? FILE_OWNER_TYPE_NONE,
      ownerId: param?.ownerId ?? ""
    }),
    new FileUploadExtension(),
    new HorizontalRuleExtension(),
    new BlockquoteExtension(),
    new BoldExtension({ weight: 20 }),
    new BulletListExtension(),
    new OrderedListExtension(),
    new TaskListExtension(),
    new WidgetExtension(),
    new ReminderUserExtension({ setShow: param?.setShowRemind }),
    new IframeExtension(),
    new CodeExtension(),
    new MarkdownExtension({ copyAsMarkdown: false }),

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

    new KeywordExtension({ keywordList: param?.keywordList ?? [], kwListCb: param?.keywordCallback }),
    new TocExtension({ tocCb: param?.tocCallback }),

    new ReactComponentExtension(), 
    new TableExtension()
  ];

  return () => retList;
};
