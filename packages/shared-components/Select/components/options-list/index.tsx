import { forwardRef, useCallback, useRef } from 'react';
import mergeRefs from 'react-merge-refs';

import { useSelectTheme } from '../../context';
import { GroupShape, OptionShape, OptionsListProps } from '../../types';
import { isGroup, useVisibleOptions } from '../../utils';
import { Optgroup as DefaultOptgroup } from '../optgroup';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const OptionsList = forwardRef(
    (
        {
            className,
            optionGroupClassName,
            Option,
            getOptionProps,
            options = [],
            Optgroup = DefaultOptgroup,
            emptyPlaceholder,
            visibleOptions = 4,
            onScroll,
            open,
            header,
            footer,
        }: OptionsListProps,
        ref
    ) => {
        const renderOption = useCallback(
            (option: OptionShape, index: number) => <Option key={option.key} {...getOptionProps(option, index)} />,
            [Option, getOptionProps]
        );

        const listRef = useRef<HTMLDivElement>(null);
        const counter = createCounter();
        const renderGroup = useCallback(
            (group: GroupShape) => (
                <Optgroup className={optionGroupClassName} label={group.label} key={group.label}>
                    {group.options.map(option => renderOption(option, counter()))}
                </Optgroup>
            ),
            [Optgroup, optionGroupClassName, renderOption, counter]
        );

        useVisibleOptions({
            visibleOptions,
            listRef,
            open,
            invalidate: options,
        });

        const { getCSS } = useSelectTheme();

        if (options.length === 0 && !emptyPlaceholder) {
            return null;
        }

        const renderListItems = () => (
            <>
                {options.map(option => (isGroup(option) ? renderGroup(option) : renderOption(option, counter())))}

                {emptyPlaceholder && options.length === 0 && (
                    <div
                        css={
                            {
                                // TODO: theme
                                // color: colors.grey400,
                                // padding: scale(1),
                            }
                        }
                    >
                        {emptyPlaceholder}
                    </div>
                )}
            </>
        );

        const renderWithNativeScrollbar = () => (
            <ul
                className="option-list"
                css={{
                    overflow: 'auto',
                    width: '100%',
                    ...(getCSS('optionListWrapper') as any),
                }}
                ref={mergeRefs([listRef, ref])}
                onScroll={onScroll}
            >
                {renderListItems()}
            </ul>
        );

        return (
            <div
                className={className}
                css={{
                    width: '100%',
                    outline: 'none',
                    ...(getCSS('optionList') as any),
                }}
            >
                {header}
                {renderWithNativeScrollbar()}
                {footer}
            </div>
        );
    }
);
