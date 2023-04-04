import React, { useCallback, useRef } from 'react';
import { Remirror, useRemirror, EditorComponent } from '@remirror/react';
import type { EditorRef } from './common';
import { ImperativeHandle } from './common';
import { ThemeProvider } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import { LinkExtension } from './extensions/index';
import type { InvalidContentHandler, RemirrorJSON } from 'remirror';
import type { RemirrorContentType } from '@remirror/core';
import { TableComponents } from '@remirror/extension-react-tables';
import TableCellMenu from './components/TableCellMenu';


export const useSimpleEditor = (placeholder: string, content: RemirrorContentType = "") => {
    const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
        return transformers.remove(json, invalidContent);
    }, []);

    let newContent = content;
    if (typeof newContent == 'string') {
        try {
            newContent = JSON.parse(newContent) as RemirrorJSON;
            if (newContent.type == undefined) {
                newContent.type = "doc";
            }
        } catch (err) { }
    }

    const { manager, state } = useRemirror({
        extensions: () => [new LinkExtension()],
        content: newContent,
        stringHandler: "html",
        onError: onError,
    });

    const editorRef = useRef<EditorRef | null>(null);

    const editor = (
        <ThemeProvider>
            <AllStyledComponent>
                <Remirror manager={manager} initialContent={state} placeholder={placeholder}>
                    <ImperativeHandle ref={editorRef} />
                    <EditorComponent />
                    <TableComponents tableCellMenuProps={{ Component: TableCellMenu }} />
                </Remirror>
            </AllStyledComponent>
        </ThemeProvider>
    );
    return {
        editor,
        editorRef,
    };
}; 