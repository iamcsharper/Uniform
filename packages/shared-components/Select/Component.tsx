import { Ref, forwardRef, useCallback, useMemo, useRef } from 'react';

import { FormControlTheme } from '@root/FormControl';

import { Arrow as DefaultArrow } from './components/arrow';
import { BaseSelect } from './components/base-select';
import { Field as DefaultField } from './components/field';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { Option as DefaultOption } from './components/option';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { BaseSelectChangePayload, BaseSelectProps, OptionShape, SelectSize, SelectTheme, SelectVariant } from './types';

export type SelectProps = BaseSelectProps & {};

export const SimpleSelect = (
    {
        Arrow = DefaultArrow,
        Field = DefaultField,
        OptionsList = DefaultOptionsList,
        Optgroup = DefaultOptgroup,
        Option = DefaultOption,
        ...restProps
    }: SelectProps,
    ref: Ref<HTMLDivElement>
) => {
    const props = useMemo(
        () => ({
            Option,
            Field,
            Optgroup,
            OptionsList,
            Arrow,
            ...restProps,
        }),
        [Arrow, Field, Optgroup, Option, OptionsList, restProps]
    );

    return <BaseSelect ref={ref} {...props} />;
};

const SimpleSelectRef = forwardRef(SimpleSelect);

export const createSimpleSelectWithTheme = ({
    defaultTheme,
    defaultVariant,
    defaultSize,
    formControlTheme: defaultFormControlTheme,
}: {
    defaultTheme: SelectTheme;
    defaultVariant: SelectVariant;
    defaultSize: SelectSize;
    formControlTheme: FormControlTheme;
}) => {
    type Return = ReturnType<typeof SimpleSelectRef>;

    const ThemedSelect = ((
        {
            theme = defaultTheme,
            variant = defaultVariant,
            size = defaultSize,
            formControlTheme = defaultFormControlTheme,
            ...props
        },
        ref
    ) => (
        <SimpleSelectRef
            ref={ref}
            formControlTheme={formControlTheme}
            theme={theme}
            variant={variant}
            size={size}
            {...props}
        />
    )) as (
        // eslint-disable-next-line no-use-before-define
        props: Omit<SelectProps, 'theme' | 'formControlTheme'> & {
            theme?: SelectTheme;
            formControlTheme?: FormControlTheme;
        },
        ref: Ref<HTMLDivElement>
    ) => Return;

    (ThemedSelect as any).displayName = 'FormSelect';

    return forwardRef(ThemedSelect);
};

export type FormSelectProps = Omit<SelectProps, 'onChange'> & {
    value?: any;
    onChange?: (valueOrValues: string | string[]) => void;
};

export const FormSelect = (
    { name, multiple, options, onChange, onBlur, value, ...props }: FormSelectProps,
    ref: Ref<HTMLDivElement>
) => {
    const selectedValues = useMemo(() => {
        if (multiple) return (Array.isArray(value) ? value : []) || [];

        return value === undefined ? [] : [value];
    }, [value, multiple]);

    const selectedOptions = useMemo(
        () =>
            options.filter(e => {
                if ('value' in e) return selectedValues.includes(e.value);
                return false;
            }) as OptionShape[],
        [options, selectedValues]
    );

    const onChangeRef = useRef<typeof onChange>();
    onChangeRef.current = onChange;

    const changeHandler = useCallback((payload: BaseSelectChangePayload) => {
        // TODO: возможно архитектурный косяк. то что Form.Field опускает onChange, не позволит в будущем внутри Form.Field на компонент накинуть onChange.
        // точнее, позволит, но мы туда только value запишем, а могли бы initiator и прочее
        onChangeRef.current?.(payload.selected?.value);
    }, []);

    return (
        <SimpleSelectRef
            ref={ref}
            name={name}
            options={options}
            {...props}
            multiple={multiple}
            selected={selectedOptions}
            onChange={changeHandler}
            onBlur={e => {
                // field?.onBlur(e);
                onBlur?.(e);
            }}
            fieldProps={
                {
                    // meta,
                }
            }
        />
    );
};

FormSelect.displayName = 'FormSelect';

const FormSelectRef = forwardRef(FormSelect);

export const createFormSelectWithTheme = ({
    defaultTheme,
    defaultVariant,
    defaultSize,
    formControlTheme: defaultFormControlTheme,
}: {
    defaultTheme: SelectTheme;
    defaultVariant: SelectVariant;
    defaultSize: SelectSize;
    formControlTheme: FormControlTheme;
}) => {
    type Return = ReturnType<typeof FormSelectRef>;

    const ThemedFormSelect = ((
        {
            theme = defaultTheme,
            variant = defaultVariant,
            size = defaultSize,
            formControlTheme = defaultFormControlTheme,
            ...props
        },
        ref
    ) => (
        <FormSelectRef
            ref={ref}
            formControlTheme={formControlTheme}
            theme={theme}
            variant={variant}
            size={size}
            {...props}
        />
    )) as (
        // eslint-disable-next-line no-use-before-define
        props: Omit<FormSelectProps, 'theme' | 'formControlTheme'> & {
            theme?: SelectTheme;
            formControlTheme?: FormControlTheme;
        },
        ref: Ref<HTMLDivElement>
    ) => Return;

    (ThemedFormSelect as any).displayName = 'FormSelect';

    return forwardRef(ThemedFormSelect);
};

export default FormSelectRef;
