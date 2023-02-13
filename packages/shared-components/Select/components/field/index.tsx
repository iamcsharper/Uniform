import { useCallback, useRef, useState } from 'react';

import FormControl, { FormControlSize, FormControlVariant } from '@root/FormControl';

import { EnumLike } from '@common/theme';

// eslint-disable-next-line import/named
import { useSelectTheme } from '../../context';
import { FieldProps as BaseFieldProps } from '../../types';
import { joinOptions } from '../../utils';

const getSameEnumValue = <S extends EnumLike, D extends EnumLike>(
    val: keyof S | S,
    dest: D,
    fallback: D | undefined = undefined
) => {
    if (Object.keys(dest).includes(val.toString())) {
        return dest[val.toString()] as D[keyof D];
    }

    return fallback;
};

export const Field = ({
    open,
    hint,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autocomplete,
    error,
    className,
    disabled,
    label,
    labelProps,
    placeholder,
    selectedMultiple = [],
    selected,
    valueRenderer = joinOptions,
    Arrow,
    innerProps,
    wrap = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedItems,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleMenu,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    multiple,
    rightAddons,
    ...restProps
}: BaseFieldProps) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const value = valueRenderer({ selected, selectedMultiple });

    const filled = Boolean(value);
    const showLabel = !!label;

    const { size, variant, getCSS, formControlTheme } = useSelectTheme();

    const controlSize = getSameEnumValue(size, FormControlSize);
    const controlVariant = getSameEnumValue(variant, FormControlVariant);

    return (
        <div
            ref={wrapperRef}
            css={{
                width: '100%',
                outline: 'none!important',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <FormControl
                block
                theme={formControlTheme}
                className={className}
                size={controlSize}
                variant={controlVariant}
                focused={open || focused}
                disabled={disabled}
                filled={filled}
                label={showLabel && label}
                error={error}
                hint={hint}
                labelProps={labelProps}
                rightAddons={
                    (Arrow || rightAddons) && (
                        <>
                            {rightAddons}
                            {/* TODO: стоит переделать, но это будет мажорка */}
                            {Arrow}
                        </>
                    )
                }
                {...restProps}
                {...innerProps}
            >
                <div className="control" css={getCSS('field') as any}>
                    {placeholder && !filled && (
                        <span
                            css={{
                                // TODO: themes
                                color: '#666',
                            }}
                        >
                            {placeholder}
                        </span>
                    )}
                    {filled && (
                        <div
                            css={{
                                ...(!wrap && {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }),
                                textAlign: 'left',
                            }}
                        >
                            {value}
                        </div>
                    )}
                </div>
            </FormControl>
        </div>
    );
};
