import React, { useState } from 'react';
import { FloatingWrapper, useActive, useAttrs } from '@remirror/react';
import Toolbar from './Toolbar';
import { useCommands, useHelpers, useRemirrorContext } from '@remirror/react';
import { LinkSelect } from '.';
import type { LinkInfo } from '@/stores/linkAux';
import { Select, Tooltip, Popover } from 'antd';
import { CompactPicker } from 'react-color';
import type { TextColorAttributes } from '@remirror/extension-text-color';
import type { TextHighlightAttributes } from '@remirror/extension-text-highlight';
import s from './FloatToolbar.module.less';
import { ReactComponent as Bgsvg } from '@/assets/svg/bg.svg';
import ToolbarGroup from './ToolbarGroup';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';

const LinkBtn = observer(() => {
  const projectStore = useStores('projectStore');

  const [showModal, setShowModal] = useState(false);
  const commands = useCommands();

  const insertLink = (link: LinkInfo) => {
    commands.insertLink(link, true);
  };
  return (
    <>
      <Tooltip title="链接">
        <div
          tabIndex={0}
          className="link-btn"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
          }}
        />
      </Tooltip>
      {showModal && (
        <LinkSelect
          title="设置链接"
          showChannel={projectStore.curProjectId != ""}
          showRequirement={projectStore.curProjectId != ""}
          showTask={projectStore.curProjectId != ""}
          showBug={projectStore.curProjectId != ""}
          showDoc={projectStore.curProjectId != ""}
          showScript={projectStore.curProjectId != ""}
          showExterne={true}
          onOk={(link) => {
            setShowModal(false);
            insertLink(link);
          }}
          onCancel={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
});

const headAndLinkItem = (
  <ToolbarGroup
    key="headAndLink"
    items={[<LinkBtn key="link" />]}
    separator={true}
  />
);

const FontSize = () => {
  const commands = useCommands();
  const helpers = useHelpers();
  const { view } = useRemirrorContext({ autoUpdate: true });
  let [[fontSize]] = helpers.getFontSizeForSelection(view.state.selection);
  if (fontSize < 12) {
    fontSize = 12;
  }
  return (
    <Select
      defaultValue={fontSize}
      onChange={(value) => {
        commands.setFontSize(value);
      }}
      className={s.select}
    >
      {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40].map((item) => (
        <Select.Option value={item} key={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
};

const FontColor = () => {
  const attrs = useAttrs();
  const colorAttr = attrs.textColor();
  let defaultColor = 'black';
  if (colorAttr != null) {
    defaultColor = (colorAttr as TextColorAttributes).color!;
  }
  const [color, setColor] = useState(defaultColor);
  const [visible, setVisible] = useState(false);
  const commands = useCommands();

  return (
    <Popover
      content={
        <CompactPicker
          color={color}
          onChange={(c) => setColor(c.hex)}
          onChangeComplete={(c) => {
            commands.removeTextHighlight();
            commands.setTextColor(c.hex);
            setVisible(false);
          }}
        />
      }
      visible={visible}
    >
      <Tooltip title="字体颜色">
        <span
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setVisible(true);
          }}
          className={s.fontColor}
          style={{
            lineHeight: '22px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          A
          <div
            style={{
              height: '2px',
              margin: 'auto',
              width: '13px',
              background: color,
              borderRadius: ' 2px',
              marginTop: '-4px',
            }}
          />
        </span>
      </Tooltip>
    </Popover>
  );
};

const FontHightLight = () => {
  const attrs = useAttrs();
  const colorAttr = attrs.textHighlight();
  let defaultColor = '#005ed1' || 'white';
  if (colorAttr != null) {
    defaultColor = (colorAttr as TextHighlightAttributes).highlight!;
  }
  const [color, setColor] = useState(defaultColor);
  const [visible, setVisible] = useState(false);
  const commands = useCommands();

  return (
    <Popover
      content={
        <CompactPicker
          color={color}
          onChange={(c) => setColor(c.hex)}
          onChangeComplete={(c) => {
            commands.removeTextColor();
            commands.setTextHighlight(c.hex);
            commands.setVisible(false);
          }}
        />
      }
      visible={visible}
    >
      <Tooltip title="背景颜色">
        <span
          tabIndex={0}
          style={{
            // background: color,
            margin: '0 10px 5px',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '5px',
            paddingTop: '5px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setVisible(true);
          }}
        >
          <Bgsvg />
          <div
            style={{
              height: '2px',
              width: '13px',
              background: color,
              borderRadius: ' 2px',
              marginTop: '-1px',
            }}
          />
        </span>
      </Tooltip>
    </Popover>
  );
};

const fontItem = (
  <ToolbarGroup
    key="font"
    items={[<FontSize key="fontSize" />, <FontColor key="fontColor" />, <FontHightLight key="fontHightLight" />]}
    separator={true}
  />
);

const BoldBtn = () => {
  const { toggleBold } = useCommands();
  const active = useActive();

  const bold = active.bold();

  return (
    <Tooltip title="粗体">
      <div
        tabIndex={0}
        className={bold ? 'bold-active-btn' : 'bold-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleBold();
        }}
      />
    </Tooltip>
  );
};

const ItalicBtn = () => {
  const { toggleItalic } = useCommands();
  const active = useActive();

  const italic = active.italic();

  return (
    <Tooltip title="斜体">
      <div
        tabIndex={0}
        className={italic ? 'italic-active-btn' : 'italic-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleItalic();
        }}
      />
    </Tooltip>
  );
};

const UnderlineBtn = () => {
  const { toggleUnderline } = useCommands();
  const active = useActive();

  const underline = active.underline();

  return (
    <Tooltip title="下划线">
      <div
        tabIndex={0}
        className={underline ? 'underline-active-btn' : 'underline-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleUnderline();
        }}
      />
    </Tooltip>
  );
};

const StrikeBtn = () => {
  const { toggleStrike } = useCommands();
  const active = useActive();

  const strike = active.strike();

  return (
    <Tooltip title="删除线">
      <div
        tabIndex={0}
        className={strike ? 'strike-active-btn' : 'strike-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleStrike();
        }}
      />
    </Tooltip>
  );
};

const SubscriptBtn = () => {
  const { toggleSubscript } = useCommands();
  const active = useActive();

  const sub = active.sub();

  return (
    <Tooltip title="下标">
      <div
        tabIndex={0}
        className={sub ? 'sub-active-btn' : 'sub-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleSubscript();
        }}
      />
    </Tooltip>
  );
};

const Superscript = () => {
  const { toggleSuperscript } = useCommands();
  const active = useActive();

  const sup = active.sup();

  return (
    <Tooltip title="上标">
      <div
        tabIndex={0}
        className={sup ? 'sup-active-btn' : 'sup-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleSuperscript();
        }}
      />
    </Tooltip>
  );
};

const formatItem = (
  <ToolbarGroup
    key="format"
    items={[
      <BoldBtn key="bold" />,
      <ItalicBtn key="italic" />,
      <UnderlineBtn key="underline" />,
      <StrikeBtn key="strike" />,
      <SubscriptBtn key="sub" />,
      <Superscript key="sup" />
    ]}
    separator={false}
  />);


const FloatToolBar = () => {
  return (
    <FloatingWrapper displayArrow={true} positioner="selection" placement="top" renderOutsideEditor={true}>
      <Toolbar items={[headAndLinkItem, fontItem, formatItem]} />
    </FloatingWrapper>
  );
};

export default FloatToolBar;