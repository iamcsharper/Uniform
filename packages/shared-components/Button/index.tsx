import { jsx } from '@emotion/react';
import React, { ElementType, Ref, forwardRef, useMemo } from 'react';

import { EnumLike, useThemeCSS } from '@common/theme';
import type { ButtonProps, ButtonStateFull, ButtonTheme } from './types';

/**
 * Button component.
 *
 * Renders <button /> or <a /> (pass `href`) or any custom element (pass `as`).
 *
 * Usage with themes:
 * @example
 * enum Variants {
 *  primary = 'primary',
 * }
 * enum Sizes {
 *  sm = 'sm',
 * }
 * const Button = createButtonWithTheme<typeof Variants, typeof Sizes>();
 * const Test = () => (
 *  <Button
 *   as="a"
 *   href="#"
 *   variant="primary"
 *   theme={{
 *    button: {},
 *    icon: {},
 *   }}
 *  >
 *   Content
 * </Button>
 *);
 */
export const BaseButton = <V extends EnumLike, S extends EnumLike, T extends ElementType = 'button'>(
    {
        children,
        block = false,
        size,
        theme,
        variant,
        Icon,
        iconAfter = false,
        hidden = false,
        type = 'button',
        as,
        external = false,
        disabled = false,
        rounded = true,
        css,
        ...props
    }: ButtonProps<V, S, T>,
    ref: Ref<HTMLButtonElement>
) => {
    const hasChildren = !!children;
    const state = useMemo<ButtonStateFull<V, S>>(
        () => ({
            disabled,
            hasChildren,
            hidden,
            size,
            variant,
            block,
            iconAfter,
            rounded,
        }),
        [block, disabled, hasChildren, hidden, iconAfter, size, variant, rounded]
    );

    if (!theme) {
        throw new Error('[Button] theme is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { button: totalCSS, icon: iconCSS } = useThemeCSS(theme!, state);

    const icon = Icon ? <Icon css={iconCSS} /> : null;

    return jsx(
        as || 'button',
        {
            ref,
            type: !as || as === 'button' ? type : null,
            target: external ? '_blank' : null,
            rel: external ? 'nofollow noopener' : null,
            css: [totalCSS, css],
            disabled,
            ...props,
        },
        <>
            {icon && !iconAfter && icon}
            {hidden ? '' : children}
            {icon && iconAfter && icon}
        </>
    );
};

const ButtonRef = forwardRef(BaseButton) as typeof BaseButton;

export const createButtonWithTheme = <V extends EnumLike, S extends EnumLike>(
    defaultTheme: ButtonTheme<V, S>,
    defaultVariant: V | keyof V,
    defaultSize: S | keyof S
) => {
    type ButtonReturn = ReturnType<typeof ButtonRef>;

    const ThemedButton = (({ theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props }, ref) => (
        <ButtonRef ref={ref} theme={theme} variant={variant} size={size} {...props} />
    )) as <T extends React.ElementType<any> = 'button'>(
        // eslint-disable-next-line no-use-before-define
        props: ButtonProps<V, S, T>,
        ref: Ref<HTMLButtonElement>
    ) => ButtonReturn;

    (ThemedButton as any).displayName = 'Button';

    return forwardRef(ThemedButton) as typeof ThemedButton;
};

export type { ButtonProps, ButtonBaseProps, ButtonState, ButtonTheme } from './types';
