import type { CreateExtensionPlugin, ProsemirrorNode } from "remirror";
import { PlainExtension, extension } from "remirror";
import { Decoration, DecorationSet } from '@remirror/pm/view';

export interface KeywordOptions {
    keywordList: string[];
    kwListCb?: (kwList: string[]) => void;
}

interface Range {
    from: number;
    to: number;
    keyword: string;
}

@extension<KeywordOptions>({ defaultOptions: { keywordList: [], kwListCb: () => { } } })
export class KeywordExtension extends PlainExtension<KeywordOptions> {
    get name() {
        return 'keyword' as const;
    }

    private _ranges: Range[] = [];

    createPlugin(): CreateExtensionPlugin {
        return {
            state: {
                init() {
                    return DecorationSet.empty;
                },
                apply: (tr) => {
                    const doc = tr.doc;
                    this._ranges = this.gatherFindResults(doc);
                    return this.createDecorationSet(doc);
                },
            },

            props: {
                decorations: (state) => {
                    return this.getPluginState(state);
                },
            },
        };
    }

    private gatherFindResults(doc: ProsemirrorNode): Range[] {
        if (this.options.keywordList.length == 0) {
            return [];
        }

        const ranges: Range[] = [];
        const matchKwList: string[] = [];

        doc.descendants((node, pos) => {
            if (!node.isTextblock) {
                return true;
            }

            const start = pos + 1;

            for (const keyword of this.options.keywordList) {
                let lastIndex: number | undefined = undefined;
                let match = false;
                while (true) {
                    const retIndex = node.textContent.indexOf(keyword, lastIndex);
                    if (retIndex == -1) {
                        break;
                    } else {
                        const from = start + retIndex;
                        const to = from + keyword.length;
                        ranges.push({ from, to, keyword });
                        lastIndex = retIndex + keyword.length;
                        match = true;
                    }
                }
                if (match) {
                    matchKwList.push(keyword);
                }
            }
            return false;
        });
        if (this.options.kwListCb !== undefined) {
            this.options.kwListCb(matchKwList);
        }
        return ranges;
    }

    private createDecorationSet(doc: ProsemirrorNode): DecorationSet {
        const decorations = this._ranges.map((deco) => {
            return Decoration.inline(
                deco.from,
                deco.to,
                {
                    style: "border-bottom: 2px solid orange;",
                },
            );
        });
        return DecorationSet.create(doc, decorations);
    }
}