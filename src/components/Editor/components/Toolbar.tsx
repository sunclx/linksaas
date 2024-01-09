import React from "react";


export interface ToolbarProps {
    items: JSX.Element[];
};

const Toolbar: React.FC<ToolbarProps> = (props) => {
    return (
        <div role="toolbar" aria-label="Top Toolbar" className="remirror-role remirror-toolbar">
            {props.items.map(item => item)}
        </div>);
}

export default Toolbar;