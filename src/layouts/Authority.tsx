import React from 'react';
import { useHistory } from 'react-router-dom';

//import { useStores } from '@/hooks';

const Authority: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const history = useHistory();
  //const userStore = useStores('userStore');

  if (!sessionStorage.getItem('sessionId')) {
    history.push('/user/login');
  }
  console.log(children);
  return <>{children}</>;
};

export default Authority;
