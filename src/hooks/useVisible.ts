import { useState } from 'react';

type ResDataType<T, U> = {
  visible: boolean;
  param?: T;
  query?: U;
};

export type HandleChangType<T, U> = (
  newVisible: boolean,
  newParam?: T,
  newQuery?: U
) => void;

export type UseVisibleResType<T, U> = [
  ResDataType<T, U>,
  HandleChangType<T, U>
];

export default function useVisible<T, U = T>(): UseVisibleResType<T, U> {
  const [visible, setVisible] = useState<boolean>(false);
  const [param, setParam] = useState<T>();
  const [query, setQuery] = useState<U>();
  const handleChang: HandleChangType<T, U> = (
    newVisible,
    newParam,
    newQuery
  ) => {
    setVisible(newVisible);
    setParam(newVisible ? newParam : undefined);
    setQuery(newVisible ? newQuery : undefined);
  };
  return [{ visible, param, query }, handleChang];
}
