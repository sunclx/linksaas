import React, { useState } from 'react';
import type * as docApi from '@/api/project_doc';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import RemoveModal from './RemoveModal';

type RemoveDocBtnProps = {
  docKey: docApi.DocKey;
  recycleBin: boolean;
};

const RemoveDocBtn: React.FC<RemoveDocBtnProps> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Deletesvg
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
        }}
      />
      {showModal && (
        <RemoveModal
          onCancel={() => setShowModal(false)}
          docKey={props.docKey}
          recycleBin={props.recycleBin}
        />
      )}
    </>
  );
};

export default RemoveDocBtn;
