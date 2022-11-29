import React from "react";


export interface ToolbarGroupProps {
    items: JSX.Element[];
    separator: boolean;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = (props) => {
    return (<>
        <div role="group" className="remirror-role remirror-group">
            {props.items.map(item => item)}
        </div>
        {props.separator == true && <hr role="separator" aria-orientation="vertical" className="remirror-role remirror-separator" />}
    </>);
};

export default ToolbarGroup;