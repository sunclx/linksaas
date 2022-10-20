import React, { useState } from 'react';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import RemoveModal from './RemoveModal';


const RemoveDocBtn = () => {
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
                    onOk={() => {
                        //TODO
                    }}
                />
            )}
        </>
    );
};

export default RemoveDocBtn;
