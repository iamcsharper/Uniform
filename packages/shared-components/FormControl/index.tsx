import { CSSObject } from '@emotion/react';
import deepmerge from 'deepmerge';
import { Ref, forwardRef, useMemo } from 'react';

import { useThemeCSSPart } from '@common/theme';

import {
    FormControlProps,
    FormControlSize,
    FormControlTheme,
    FormControlThemeState,
    FormControlVariant,
} from './types';

export * from './types';

const EMPTY_OBJECT: any = {};

const FormControl = (
    {
        block = false,
        theme,
        size = 'md',
        variant = 'primary',
        className,
        labelCSS = EMPTY_OBJECT,
        fieldCSS = EMPTY_OBJECT,
        leftAddonsCSS = EMPTY_OBJECT,
        rightAddonsCSS = EMPTY_OBJECT,
        wrapperCSS = EMPTY_OBJECT,
        disabled,
        readOnly,
        focused,
        filled,
        error,
        hint,
        label,
        leftAddons,
        rightAddons,
        bottomAddons,
        children,
        htmlFor,
        labelWrap = false,
        labelProps = EMPTY_OBJECT,
        showError = true,
        ...restProps
    }: FormControlProps,
    ref: Ref<HTMLDivElement>
) => {
    // eslint-disable-next-line no-nested-ternary
    const errorMessage = showError ? (typeof error === 'boolean' ? '' : error) : '';

    const hasError = !!error;

    const hasLeftAddons = !!leftAddons;
    const hasRightAddons = !!rightAddons || !!error;

    const state = useMemo<Omit<FormControlThemeState, 'theme'>>(
        () => ({
            block,
            disabled,
            filled,
            focused,
            hasError,
            readOnly,
            size,
            hasLeftAddons,
            hasRightAddons,
            labelWrap,
            variant,
        }),
        [block, disabled, filled, focused, hasError, readOnly, size, hasLeftAddons, hasRightAddons, labelWrap, variant]
    );

    const getCSS = useThemeCSSPart(theme, state);

    const totalWrapperCSS = useMemo(
        () => deepmerge.all<CSSObject>([getCSS('wrapper'), wrapperCSS!]),
        [wrapperCSS, getCSS]
    );

    const innerCSS = useMemo(() => deepmerge.all<CSSObject>([getCSS('inner'), fieldCSS!]), [fieldCSS, getCSS]);

    return (
        <div className={className} css={totalWrapperCSS}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    css={{
                        ...(getCSS('label') as CSSObject),
                        ...labelCSS,
                    }}
                    {...(!labelWrap &&
                        typeof label === 'string' && {
                            title: label,
                        })}
                    {...labelProps}
                >
                    {label}
                </label>
            )}
            <div {...restProps} css={innerCSS} ref={ref}>
                {leftAddons && (
                    <div css={deepmerge.all<CSSObject>([getCSS('addons', { isLeft: true }), leftAddonsCSS])}>
                        {leftAddons}
                    </div>
                )}

                <div
                    css={{
                        flexGrow: 1,
                        ...(!labelWrap && {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }),
                        '.control': getCSS('controlWrapper') as CSSObject,
                    }}
                >
                    {children}
                </div>
                {rightAddons && (
                    <div css={deepmerge.all<CSSObject>([getCSS('addons', { isLeft: false }), rightAddonsCSS])}>
                        {rightAddons}
                    </div>
                )}
            </div>

            {bottomAddons}

            {errorMessage && (
                <span css={getCSS('sub') as CSSObject} role="alert">
                    {errorMessage}
                </span>
            )}

            {hint && !errorMessage && <span css={getCSS('sub') as CSSObject}>{hint}</span>}
        </div>
    );
};

const FormControlRef = forwardRef(FormControl);

export const createFormControlWithTheme = (
    defaultTheme: FormControlTheme,
    defaultVariant: FormControlVariant,
    defaultSize: FormControlSize
) => {
    type Return = ReturnType<typeof FormControlRef>;

    const ThemedFormControl = ((
        { theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props },
        ref
    ) => <FormControlRef ref={ref} theme={theme} variant={variant} size={size} {...props} />) as (
        // eslint-disable-next-line no-use-before-define
        props: Omit<FormControlProps, 'theme'> & { theme?: FormControlTheme },
        ref: Ref<HTMLDivElement>
    ) => Return;

    (ThemedFormControl as any).displayName = 'FormControl';

    return forwardRef(ThemedFormControl);
};

export default FormControlRef;
