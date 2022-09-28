import React from 'react';
import DocMenu from '@/components/DocMenu';
import ProDoc from '@/pages/Doc/ProDoc';
import ContentBlock from '@/pages/Doc/ContentBlock';
import { useStores } from '@/hooks';
import { APP_PROJECT_DOC_PRO_PATH } from '@/utils/constant';
const DocLayout = () => {
  const docStore = useStores('docStore');

  return (
    <div style={{ height: '100%', marginRight: '59px', display: 'flex', background: '#fff' }}>
      <DocMenu currentpath={location.pathname} />
      <div
        style={{
          height: '100%',
          flex: 1,
          width: 'calc(100% - 200px)',
          overflow: 'auto',
          padding: '20px',
        }}
      >
        {location.pathname === APP_PROJECT_DOC_PRO_PATH || docStore.showProDoc ? (
          <ProDoc />
        ) : (
          <ContentBlock />
        )}
      </div>
    </div>
  );
};

export default DocLayout;
