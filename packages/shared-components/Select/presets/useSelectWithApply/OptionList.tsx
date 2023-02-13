/* eslint-disable import/no-cycle */
import { FC, RefAttributes, forwardRef, useCallback, useEffect, useRef } from 'react';

import { OptionsList as DefaultOptionsList } from '../../components';
import { OptionShape, OptionsListProps } from '../../types';
import { SELECT_ALL_VALUE } from './index';

type OptionsListWithApplyProps = OptionsListProps & {
    showClear?: boolean;
    onClose?: () => void;
    selectedDraft?: OptionShape[];
    OptionsList?: FC<OptionsListProps & RefAttributes<unknown>>;
    SubmitButton: FC<{ onClick: () => void }>;
    CancelButton: FC<{ onClick: () => void }>;
};

export const OptionsListWithApply = forwardRef(
    (
        {
            toggleMenu,
            OptionsList = DefaultOptionsList,
            getOptionProps: defaultGetOptionProps,
            showClear = true,
            selectedDraft = [],
            flatOptions = [],
            onApply = () => null,
            onClear = () => null,
            onClose = () => null,
            SubmitButton,
            CancelButton,
            visibleOptions = 5,
            ...restProps
        }: OptionsListWithApplyProps,
        ref
    ) => {
        const footerRef = useRef<HTMLDivElement>(null);

        const getOptionProps = useCallback(
            (option: OptionShape, index: number) => {
                const optionProps = defaultGetOptionProps(option, index);

                const selected =
                    option.key === SELECT_ALL_VALUE
                        ? selectedDraft.length === flatOptions.length - 1
                        : selectedDraft.includes(option);

                return {
                    ...optionProps,
                    selected,
                };
            },
            [defaultGetOptionProps, flatOptions.length, selectedDraft]
        );

        const handleApply = useCallback(() => {
            onApply();

            toggleMenu();
        }, [onApply, toggleMenu]);

        const handleClear = useCallback(() => {
            onClear();

            toggleMenu();
        }, [onClear, toggleMenu]);

        useEffect(() => {
            const activeElement = document.activeElement as HTMLElement;

            setTimeout(() => {
                if (footerRef.current) {
                    footerRef.current.focus();
                }
            }, 0);

            return () => {
                onClose();
                if (activeElement) {
                    activeElement.focus();
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <OptionsList
                {...restProps}
                ref={ref}
                visibleOptions={visibleOptions}
                toggleMenu={toggleMenu}
                flatOptions={flatOptions}
                getOptionProps={getOptionProps}
                onApply={handleApply}
                onClear={handleClear}
                footer={
                    <div
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex={0}
                        ref={footerRef}
                    >
                        <SubmitButton onClick={handleApply} />

                        {showClear && <CancelButton onClick={handleClear} />}
                    </div>
                }
            />
        );
    }
);

OptionsListWithApply.displayName = 'OptionsListWithApply';
