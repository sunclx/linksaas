import type { TableCellMenuComponentProps } from '@remirror/extension-react-tables';
import React, { useState } from 'react';
import { ComponentsTheme } from '@remirror/theme';
import { Menu, Modal, Popover } from 'antd';
import { useCommands } from '@remirror/react';
import { PhotoshopPicker } from 'react-color';
import { MenuOutlined } from '@ant-design/icons';


const TableCellMenuButton: React.FC<TableCellMenuComponentProps> = ({ setPopupOpen }) => {
    return (
        <button
            onClick={() => {
                setPopupOpen(true);
            }}
            onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
            }}
            style={{
                position: 'relative',
                right: '10px',
                top: '0px',
                height: '16px',
                width: '16px',
                fontSize: '10px',
                lineHeight: '10px',
                cursor: 'pointer',
            }}
            className={ComponentsTheme.BUTTON}
        >
            <MenuOutlined />
        </button>
    );
};

const TableCellMenu: React.FC<TableCellMenuComponentProps> = (props) => {
    const commands = useCommands();

    const [showColorModal, setShowColorModal] = useState(false);
    const [curColor, setCurColor] = useState<string | undefined>(undefined);

    return (
        <>
            <Popover open={props.popupOpen} placement='right' content={
                <Menu mode="vertical" style={{ listStyle: "none" }} items={[
                    {
                        key: "rowOps",
                        label: "表格行",
                        children: [
                            {
                                key: "addRowBefore",
                                label: "在上方插入一行",
                                onClick: () => {
                                    commands.addTableRowBefore();
                                    props.setPopupOpen(false);
                                },
                            },
                            {
                                key: "addRowAfter",
                                label: "在下方插入一行",
                                onClick: () => {
                                    commands.addTableRowAfter();
                                    props.setPopupOpen(false);
                                },
                            },
                            {
                                key: "removeRow",
                                label: "删除当前行",
                                danger: true,
                                onClick: () => {
                                    commands.deleteTableRow();
                                    props.setPopupOpen(false);
                                },
                            },
                        ],
                    },
                    {
                        key: "colOps",
                        label: "表格列",
                        children: [
                            {
                                key: "addColBefore",
                                label: "在前方插入一列",
                                onClick: () => {
                                    commands.addTableColumnBefore();
                                    props.setPopupOpen(false);
                                },
                            },
                            {
                                key: "addColAfter",
                                label: "在后方插入一列",
                                onClick: () => {
                                    commands.addTableColumnAfter();
                                    props.setPopupOpen(false);
                                },
                            },
                            {
                                key: "removeCol",
                                label: "删除当前列",
                                danger: true,
                                onClick: () => {
                                    commands.deleteTableColumn();
                                    props.setPopupOpen(false);
                                },
                            }
                        ],
                    },
                    {
                        key: "mergeSplit",
                        label: "合并拆分",
                        children: [
                            {
                                key: "merge",
                                label: "合并单元格",
                                disabled: !commands.mergeTableCells.enabled(),
                                onClick: () => {
                                    commands.mergeTableCells();
                                    props.setPopupOpen(false);
                                },
                            },
                            {
                                key: "split",
                                label: "拆分单元格",
                                disabled: !commands.splitTableCell.enabled(),
                                onClick: () => {
                                    commands.splitTableCell();
                                    props.setPopupOpen(false);
                                },
                            },
                        ],
                    },
                    {
                        key: "bgColor",
                        label: "背景色",
                        children: [
                            {
                                key: "setBgColor",
                                label: "设置背景色",
                                onClick: () => {
                                    props.setPopupOpen(false);
                                    setShowColorModal(true);
                                },
                            },
                            {
                                key: "cancelBgColor",
                                label: "清除背景色",
                                onClick: () => {
                                    commands.setTableCellBackground(null);
                                    props.setPopupOpen(false);
                                },
                            },
                        ],
                    },
                    {
                        key: "deleteTable",
                        label: "删除表格",
                        danger: true,
                        onClick: () => {
                            commands.deleteTable();
                            props.setPopupOpen(false);
                        },
                    }
                ]} />
            }>
                <TableCellMenuButton {...props} />
            </Popover>
            {showColorModal == true && (
                <Modal closable={false} open footer={null} bodyStyle={{ padding: "0px 0px" }} width={500}>
                    <PhotoshopPicker header='选择背景色'
                        color={curColor}
                        onChange={color => setCurColor(color.hex)}
                        onCancel={() => setShowColorModal(false)}
                        onAccept={() => {
                            commands.setTableCellBackground(curColor ?? null);
                            setShowColorModal(false);
                        }}
                    />
                </Modal>
            )}
        </>
    );
};

export default TableCellMenu;