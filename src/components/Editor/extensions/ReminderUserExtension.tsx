import {
    command,
    extension,
    NodeExtension,
    ExtensionTag,
    pick,
    getTextSelection
} from '@remirror/core';
import type { ApplySchemaAttributes, NodeSpecOverride, NodeExtensionSpec, CommandFunction, PrimitiveSelection } from '@remirror/core';
import {
    DEFAULT_SUGGESTER,
    ChangeReason,
} from '@remirror/pm/suggest';
import type { AcceptUndefined } from 'remirror';
import type { Suggester } from '@remirror/pm/suggest';
import type { ComponentType } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { ReminderUser } from './ReminderUserComponent';
import React from 'react';



const DEFAULT_MATCHER = {
    ...pick(DEFAULT_SUGGESTER, [
        'startOfLine',
        'supportedCharacters',
        'validPrefixCharacters',
        'invalidPrefixCharacters',
    ]),
    appendText: '',
};


export interface ReminderUserOptions {
    setShow?: AcceptUndefined<(how: boolean) => void>;
}

@extension<ReminderUserOptions>({ defaultOptions: { setShow: undefined } })
export class ReminderUserExtension extends NodeExtension<ReminderUserOptions> {
    get name() {
        return 'reminderUser' as const;
    }

    createTags() {
        return [ExtensionTag.InlineNode, ExtensionTag.Behavior];
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            inline: true,
            selectable: false,
            draggable: false,
            atom: true,
            ...override,
            attrs: {
                ...extra.defaults(),
                all: { default: false },
                memberUserId: { default: undefined },
                displayName: { default: undefined },
            }
        };
    }

    @command()
    insertReminderUser(all: boolean, memberUserId: string, displayName: string, selection?: PrimitiveSelection): CommandFunction {
        return ({ tr, dispatch }) => {
            const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
            const attrs: ReminderUserAttributes = { all, memberUserId, displayName }
            const node = this.type.create(attrs);
            dispatch?.(tr.replaceRangeWith(from - 1, to, node));
            return true;
        }
    }

    @command()
    deleteReminderUser(pos: number): CommandFunction {
        return ({ tr, state, dispatch }) => {
            const node = state.doc.nodeAt(pos);

            if (node && node.type === this.type) {
                tr.delete(pos, pos + 1).scrollIntoView();
                dispatch?.(tr);
                return true;
            }

            return false;
        };
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
        const attrs = props.node.attrs as unknown as ReminderUserAttributes;
        return (<ReminderUser {...props} all={attrs.all} memberUserId={attrs.memberUserId} displayName={attrs.displayName} />)
    }

    createSuggesters(): Suggester[] {

        return [{
            ...DEFAULT_MATCHER,
            char: '@',
            name: 'at',
            onChange: (props) => {
                if (props.changeReason !== undefined && props.changeReason == ChangeReason.Start) {
                    if (this.options.setShow !== undefined) {
                        this.options.setShow(true);
                    }
                } else {
                    if (this.options.setShow !== undefined) {
                        this.options.setShow(false);
                    }
                }

            }
        }];
    }
}

export interface ReminderUserAttributes {
    all: boolean;
    memberUserId?: string;
    displayName?: string;
}