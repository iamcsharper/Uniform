import { HTMLProps, ReactNode, useMemo } from 'react';
import { AccordionItem as ReactAccordionItem } from 'react-accessible-accordion';

import { useThemeCSSPart } from '@common/theme';
import { AccordionThemeState } from './types';
import useAccordion from './useAccordion';

export interface AccordionItemProps extends Omit<HTMLProps<HTMLDivElement>, 'ref'> {
    /** Accordion.Heading and Accordion.Panel */
    children: ReactNode;
    /** Unique panel id */
    uuid?: string;
}

export const AccordionItem = ({ children, uuid, ...props }: AccordionItemProps) => {
    const { isIconVertical, variant, size, theme, bordered } = useAccordion();

    const state = useMemo<AccordionThemeState<any, any>>(
        () => ({
            isIconVertical,
            size: size!,
            variant: variant!,
            bordered: bordered!,
        }),
        [isIconVertical, size, variant, bordered]
    );

    const getCSS = useThemeCSSPart(theme!, state);
    const itemCSS = useMemo(() => getCSS('item'), [getCSS]);

    return (
        <ReactAccordionItem uuid={uuid} css={itemCSS} {...props}>
            {children}
        </ReactAccordionItem>
    );
};

export default AccordionItem;
