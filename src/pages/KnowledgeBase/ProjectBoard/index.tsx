import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import BoardEditor from './BoardEditor';

const ProjectBoard = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <BoardEditor />
        </DndProvider>
    );
};


export default ProjectBoard;

