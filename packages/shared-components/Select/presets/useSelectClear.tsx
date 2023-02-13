import { FC, useCallback, useRef } from 'react';
import mergeRefs from 'react-merge-refs';

import { scale } from '@common/helpers';

import { Field as DefaultField } from '../components/field';
import { FieldProps } from '../types';

export interface useSelectClearProps {
    CrossIcon: FC<any>;
    Field?: FC<FieldProps>;
    closeOnClear?: boolean;
}

export const useSelectClear = ({ CrossIcon, Field = DefaultField, closeOnClear = false }: useSelectClearProps) => {
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const renderField = useCallback(
        (props: FieldProps) => (
            <Field
                {...props}
                innerProps={{
                    ...props.innerProps,
                    ref: mergeRefs([props.innerProps.ref!, fieldRef]),
                }}
                rightAddonsCSS={{
                    ...props.rightAddonsCSS,
                    // TODO: themes
                    gap: scale(1, true),
                }}
                rightAddons={
                    <>
                        {props.multiple && !!props.selectedMultiple?.length && (
                            <>
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        props.setSelectedItems([]);

                                        setTimeout(() => {
                                            fieldRef.current?.focus();
                                        }, 0);

                                        if (closeOnClear && props.open) {
                                            setTimeout(() => {
                                                props.toggleMenu();
                                            }, 0);
                                        }
                                    }}
                                    css={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        ':hover': {
                                            opacity: 0.5,
                                        },
                                    }}
                                >
                                    <CrossIcon />
                                </button>
                                <span
                                    css={{
                                        display: 'inline-block',
                                        width: 1,
                                        height: scale(2),
                                        borderWidth: 0,
                                        // TODO: themes
                                        // background: colors.grey600,
                                    }}
                                />
                            </>
                        )}
                        {props.rightAddons}
                    </>
                }
            />
        ),
        [Field, closeOnClear, CrossIcon]
    );

    return {
        Field: renderField,
    };
};

export default useSelectClear;
