import type { ModalProps } from 'antd';
import { Modal } from 'antd';
import type { FC } from 'react';
import React from 'react';
import Button from '../Button';
import s from './index.module.less';

type ActionModalProps = ModalProps & {
  onOK?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
};

const ActionModal: FC<ActionModalProps> = ({
  title,
  open,
  footer,
  onOK,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  style,
  ...props
}) => {
  return (
    <Modal
      wrapClassName={s.modal_wrap}
      open={open}
      title={false}
      footer={false}
      {...props}
      onCancel={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onCancel?.();
      }}
    >
      <h1 className={s.title}>{title}</h1>
      <div className={s.content_wrap} style={{ ...style }}>
        {props.children}
      </div>
      {onOK && (
        <div className={s.btn_wrap}>
          <Button
            ghost
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onCancel?.();
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onOK();
            }}
          >
            {okText}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ActionModal;
