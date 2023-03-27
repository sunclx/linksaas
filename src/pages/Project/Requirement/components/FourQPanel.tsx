import React from "react";
import { observer } from 'mobx-react';

interface FourQPanelProps {
    requirementId: string;
    onUpdate: () => void;
}

const FourQPanel: React.FC<FourQPanelProps> = (props) => {
    return (
        <div>xx</div>
    );
};

export default observer(FourQPanel);
