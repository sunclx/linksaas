import { Pagination as PaginationAntd } from 'antd';
import type { FC } from 'react';
import React from 'react';

type PaginationProps = {
  total: number;
  pageSize: number;
  current?: number;
  onChange?: (page: number) => void;
};

const Pagination: FC<PaginationProps> = (props) => {
  const { total, pageSize, onChange, current } = props;
  return (
    <PaginationAntd
      size="small"
      total={total}
      pageSize={pageSize}
      showTotal={() => `共 ${total} 条`}
      current={current || 1}
      onChange={onChange}
      showSizeChanger={false}
      style={{
        // margin: '20px 26px 0 0',
        padding: '12px',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    />
  );
};

export default Pagination;
