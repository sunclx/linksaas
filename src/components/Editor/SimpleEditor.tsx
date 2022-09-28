import React, { useRef } from 'react';
import { Remirror, useRemirror, EditorComponent } from '@remirror/react';
import type { EditorRef } from './common';
import { ImperativeHandle } from './common';
import { ThemeProvider } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';


export const useSimpleEditor = (placeholder: string) => {
    const { manager, state } = useRemirror({
        extensions: () => [],
        content: '',
        stringHandler: "html",
    });

    const editorRef = useRef<EditorRef | null>(null);

    const editor = (
        <ThemeProvider>
            <AllStyledComponent>
                <Remirror manager={manager} initialContent={state} placeholder={placeholder}>
                    <ImperativeHandle ref={editorRef} />
                    <EditorComponent />
                </Remirror>
            </AllStyledComponent>
        </ThemeProvider>
    );
    return {
        editor,
        editorRef,
    };
}; 