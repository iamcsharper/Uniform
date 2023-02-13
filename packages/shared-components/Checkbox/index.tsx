import { Ref, forwardRef, useEffect, useMemo, useRef } from 'react';

import { EnumLike, useThemeCSS } from '@common/theme';

import BaseCheckboxProps, { CheckboxStateFull, CheckboxTheme } from './types';

export const BaseCheckbox = <V extends EnumLike, S extends EnumLike>(
    {
        name,
        variant,
        size,
        theme,
        field,
        fieldState,
        value,
        isIndeterminate = false,
        all = false,
        children,
        className,
        checked: checkedFromProps,
        disabled,
        CheckIcon,
        labelCSS,
        iconCSS,
        knobCSS,
        ...props
    }: BaseCheckboxProps<V, S>,
    ref: Ref<HTMLInputElement>
) => {
    if (!theme) {
        throw new Error('[Checkbox] theme is required');
    }

    const innerRef = useRef<HTMLInputElement>(null);
    const actualRef = ref || innerRef;

    const id = `${name || field?.name}-${value}`;

    useEffect(() => {
        if (!isIndeterminate) return;
        if (typeof actualRef === 'function') return;
        if (actualRef.current) {
            actualRef.current.indeterminate = isIndeterminate;
            actualRef.current.checked = all;
        }
    }, [actualRef, all, isIndeterminate]);

    let checked: boolean | undefined = checkedFromProps;
    if (field) {
        if (typeof value === 'string' && Array.isArray(field?.value)) {
            checked = field?.value?.includes(value);
        } else if (typeof field?.value === 'boolean') {
            checked = field.value;
        }
    }

    const invalid = !!fieldState?.error?.message;
    const hasChildren = !!children;

    const state = useMemo<CheckboxStateFull<V, S>>(
        () => ({
            disabled,
            hasChildren,
            size,
            variant,
            invalid,
        }),
        [disabled, hasChildren, invalid, size, variant]
    );

    const {
        icon: iconThemeCSS,
        label: labelThemeCSS,
        wrapper: wrapperCSS,
        knob: knobThemeCSS,
    } = useThemeCSS(theme!, state);

    // const labelCSS = useMemo<CSSObject>(
    //     () => ({
    //         minHeight: scale(2),
    //         position: 'relative',
    //         display: 'inline-block',
    //         textAlign: 'left',
    //         cursor: 'pointer',
    //         transition: 'color ease 300ms',
    //         '.knob': {
    //             content: '""',
    //             position: 'absolute',
    //             top: 0,
    //             left: 0,
    //             transition: 'background-color ease-out 60ms',
    //             borderStyle: 'solid',
    //             borderWidth: 0,
    //             borderRadius: scale(1, true),
    //             width: scale(3),
    //             height: scale(3),
    //             backgroundColor: colors.grey100,
    //             'input:focus + &': {
    //                 outline: '2px solid',
    //                 outlineOffset: 2,
    //             },
    //             ':active': {
    //                 outline: 0,
    //             },
    //             'input:checked + &': {
    //                 backgroundColor: colors.link,
    //             },
    //             'input:disabled + &': {
    //                 borderWidth: 2,
    //                 borderColor: colors.grey300,
    //                 backgroundColor: 'transparent',
    //                 cursor: 'not-allowed',
    //             },
    //             'input:checked:disabled + &': {
    //                 backgroundColor: colors.grey300,
    //             },
    //         },
    //         paddingLeft: scale(4),
    //         '&.invalid': {
    //             '&:before': {
    //                 background: colors?.error,
    //             },
    //         },

    //         'input:disabled + &': {
    //             color: colors.grey600,
    //         },
    //     }),
    //     []
    // );

    // const iconCSS = useMemo<CSSObject>(
    //     () => ({
    //         transform: 'translate(-50%, -50%) scale(0)',
    //         position: 'absolute',
    //         top: `calc(${scale(3)}px / 2)`,
    //         left: `calc(${scale(3)}px / 2)`,
    //         transition: 'transform ease-out 300ms',

    //         fill: colors.white,
    //         'input:checked + label &': {
    //             transform: 'translate(-50%, -50%) scale(1)',
    //         },
    //         'input:disabled + label &': {
    //             fill: colors.grey600,
    //             opacity: 0.6,
    //             cursor: 'not-allowed',
    //         },
    //         'input:checked:disabled + label &': {
    //             transform: 'translate(-50%, -50%) scale(1)',
    //         },
    //     }),
    //     []
    // );

    return (
        <div className={className} css={wrapperCSS}>
            <input
                {...props}
                disabled={disabled}
                ref={ref}
                name={name}
                id={id}
                type="checkbox"
                value={value}
                checked={checked}
                css={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
            />
            <label
                htmlFor={id}
                css={{
                    ...labelThemeCSS,
                    ...labelCSS,
                }}
            >
                <span
                    css={{
                        ...knobThemeCSS,
                        ...knobCSS,
                    }}
                />
                <CheckIcon
                    css={{
                        ...iconThemeCSS,
                        ...iconCSS,
                    }}
                />
                {children}
            </label>
        </div>
    );
};

const CheckboxRef = forwardRef(BaseCheckbox) as typeof BaseCheckbox;

export const createCheckboxWithTheme = <V extends EnumLike, S extends EnumLike>(
    defaultTheme: CheckboxTheme<V, S>,
    defaultVariant: V | keyof V,
    defaultSize: S | keyof S
) => {
    type Return = ReturnType<typeof CheckboxRef>;

    const ThemedCheckbox = (({ theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props }, ref) => (
        <CheckboxRef ref={ref} theme={theme} variant={variant} size={size} {...props} />
    )) as (
        // eslint-disable-next-line no-use-before-define
        props: BaseCheckboxProps<V, S>,
        ref: Ref<HTMLInputElement>
    ) => Return;

    (ThemedCheckbox as any).displayName = 'Checkbox';

    return ThemedCheckbox;
};

BaseCheckbox.displayName = 'Checkbox';

export default BaseCheckbox;
