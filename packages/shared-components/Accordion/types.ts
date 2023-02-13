import { HTMLProps, ReactNode } from 'react';

import { BaseThemeState, EnumLike, StyleDefinition, ValueOrFunction } from '@common/theme';
import { SVGRIcon } from '../common/types';

export interface AccordionState {
    isIconVertical?: boolean;
    bordered: boolean;
    panelNoPadding?: boolean;
}

export type AccordionThemeState<V extends EnumLike, S extends EnumLike> = BaseThemeState<V, S> & AccordionState;

type AccordionThemePart<V extends EnumLike, S extends EnumLike> = StyleDefinition<AccordionThemeState<V, S>>;

export type AccordionTheme<V extends EnumLike, S extends EnumLike> = ValueOrFunction<
    {
        root: AccordionThemePart<V, S>;
        item: AccordionThemePart<V, S>;
        heading: AccordionThemePart<V, S>;
        button: AccordionThemePart<V, S>;
        panel: AccordionThemePart<V, S>;
    },
    [AccordionThemeState<V, S>]
>;

export interface AccordionContextProps<V extends EnumLike, S extends EnumLike>
    extends Partial<BaseThemeState<V, S, AccordionTheme<V, S>>>,
        Partial<AccordionState> {
    /** CSSTransition handler, triggers after add 'enter' class */
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    /** CSSTransition handler, triggers after add 'enter-active' class */
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    /** CSSTransition handler, triggers after add 'exit' class */
    onExit?: (node: HTMLElement) => void;
    /** CSSTransition timeout */
    transitionTimeout?: number;
    /** CSSTransition timeout on exit (if differs) */
    transitionTimeoutExit?: number;
    /** Type of panel toggle animation */
    animationType?: 'height' | 'fadeIn' | 'custom';
    /** Icon for arrow */
    Icon?: SVGRIcon;
    isIconVertical?: boolean;
    panelNoPadding?: boolean;
    bordered?: boolean;
}

export interface AccordionProps<V extends EnumLike, S extends EnumLike>
    extends AccordionContextProps<V, S>,
        Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'ref' | 'size'> {
    /** List of Accordion.Item components */
    children: ReactNode;
    /** Panel change handler */
    onChange?: (ids: string[]) => void;
    /** Allow to simultaneously open multiple panels */
    allowMultipleExpanded?: boolean;
    /** Allow to simultaneously close all panels */
    allowZeroExpanded?: boolean;
    /** List of expanded panels by default */
    preExpanded?: string[];
}
