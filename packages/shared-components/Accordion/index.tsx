import { EnumLike, useThemeCSSPart } from '@common/theme';
import { FC, useMemo } from 'react';
import { Accordion as ReactAccordion } from 'react-accessible-accordion';

import AccordionButton, { AccordionButtonProps } from './Button';
import AccordionHeading, { AccordionHeadingProps } from './Heading';
import AccordionItem, { AccordionItemProps } from './Item';
import AccordionPanel, { AccordionPanelProps } from './Panel';
import { AccordionProps, AccordionTheme, AccordionThemeState } from './types';
import { AccordionContext } from './useAccordion';

export interface AccordionCompositionProps {
    Item: FC<AccordionItemProps>;
    Heading: FC<AccordionHeadingProps>;
    Panel: FC<AccordionPanelProps>;
    Button: FC<AccordionButtonProps>;
}

export const BaseAccordion = <V extends EnumLike, S extends EnumLike>({
    children,
    allowMultipleExpanded = true,
    allowZeroExpanded = true,
    preExpanded,
    onChange,
    Icon,
    isIconVertical = true,
    animationType,
    transitionTimeout = 300,
    transitionTimeoutExit = transitionTimeout,
    theme,
    variant,
    size,
    panelNoPadding = true,
    bordered = false,
    onEnter,
    onEntering,
    onExit,
    ...props
}: AccordionProps<V, S> & Partial<AccordionCompositionProps>) => {
    if (!theme) {
        throw new Error('[Accordion] theme is required');
    }

    const contextValue = useMemo(
        () => ({
            bordered,
            panelNoPadding,
            theme,
            size,
            variant,
            Icon,
            isIconVertical,
            animationType,
            transitionTimeout,
            transitionTimeoutExit,
            onEnter,
            onEntering,
            onExit,
        }),
        [
            bordered,
            Icon,
            animationType,
            isIconVertical,
            onEnter,
            onEntering,
            onExit,
            panelNoPadding,
            size,
            theme,
            transitionTimeout,
            transitionTimeoutExit,
            variant,
        ]
    );

    const state = useMemo<AccordionThemeState<V, S>>(
        () => ({
            isIconVertical,
            size: size!,
            variant: variant!,
            bordered,
        }),
        [isIconVertical, size, variant, bordered]
    );

    const getCSS = useThemeCSSPart(theme, state);
    const rootCSS = useMemo(() => getCSS('root'), [getCSS]);

    return (
        <AccordionContext.Provider value={contextValue}>
            <ReactAccordion
                allowMultipleExpanded={allowMultipleExpanded}
                allowZeroExpanded={allowZeroExpanded}
                preExpanded={preExpanded}
                onChange={onChange}
                css={rootCSS}
                {...props}
            >
                {children}
            </ReactAccordion>
        </AccordionContext.Provider>
    );
};

BaseAccordion.Item = AccordionItem;
BaseAccordion.Heading = AccordionHeading;
BaseAccordion.Button = AccordionButton;
BaseAccordion.Panel = AccordionPanel;

export const createAccordionWithTheme = <V extends EnumLike, S extends EnumLike>(
    defaultTheme: AccordionTheme<V, S>,
    defaultVariant: V | keyof V,
    defaultSize: S | keyof S
) => {
    type ButtonReturn = ReturnType<typeof BaseAccordion>;

    const ThemedAccordion = (({ theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props }) => (
        <BaseAccordion theme={theme} variant={variant} size={size} {...props} />
    )) as (props: AccordionProps<V, S>) => ButtonReturn;

    (ThemedAccordion as any).displayName = 'Accordion';

    return ThemedAccordion;
};

export default BaseAccordion;
