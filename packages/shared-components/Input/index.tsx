import { CSSObject } from '@emotion/react';
import CloseIcon from '@icons/small/close.svg';
import deepmerge from 'deepmerge';
import {
    AnimationEvent,
    ChangeEvent,
    FocusEvent,
    MouseEvent,
    Ref,
    forwardRef,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import mergeRefs from 'react-merge-refs';

import { scale } from '@common/helpers';

import FormControl, { FormControlSize, FormControlTheme, FormControlVariant } from '../FormControl';
import { InputProps } from './types';

export * from './types';

export const BASE_INPUT_CSS: CSSObject = {
    '@keyframes autofill': {
        '0%': {
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        },
        '100%': {
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.01)',
        },
    },
    width: '100%',
    WebkitAppearance: 'none',
    position: 'relative',
    ':disabled': {
        cursor: 'not-allowed',
    },
    '::placeholder': {
        // TODO: theme
        color: '#666',
        // color: colors.grey400,
    },
    background: 'transparent',
    outline: 'none!important',
    border: 'none!important',
    textOverflow: 'ellipsis',
    '&:-webkit-autofill': {
        WebkitTransition: 'background-color 999999s ease-in-out 0s',
        transition: 'background-color 999999s ease-in-out 0s',
        '&:hover,:&active,&:focus': {
            WebkitTransition: 'background-color 999999s ease-in-out 0s',
            transition: 'background-color 999999s ease-in-out 0s',
        },
        animation: 'autofill 999999s forwards',
    },
    '&:not(:-webkit-autofill)': {
        animation: 'autofill 999999s',
    },
};

const emptyStyle = {};

const Input = (
    {
        type = 'text',
        block = false,
        size,
        variant,
        theme,
        bottomAddons,
        clear = false,
        disabled,
        labelWrap,
        error,
        hint,
        className,
        inputCSS = emptyStyle,
        labelCSS = emptyStyle,
        leftAddonsCSS = emptyStyle,
        rightAddonsCSS = emptyStyle,
        label,
        leftAddons,
        innerLeftAddons,
        onFocus,
        onBlur,
        onChange,
        onClear,
        onClick,
        onMouseDown,
        onMouseUp,
        onAnimationStart,
        rightAddons,
        value,
        defaultValue,
        wrapperRef,
        readOnly,
        placeholder,
        showError = true,
        fieldCSS = emptyStyle,
        wrapperCSS = emptyStyle,
        ...restProps
    }: InputProps,
    ref: Ref<HTMLInputElement>
) => {
    delete restProps.isLegend;

    const uncontrolled = value === undefined;
    const inputRef = useRef<HTMLInputElement>(null);

    const [focused, setFocused] = useState(restProps.autoFocus);
    const [stateValue, setStateValue] = useState(defaultValue || '');

    const filled = Boolean(uncontrolled ? stateValue : value);
    const [autofilled, setAutofilled] = useState(false);

    // отображаем крестик только для заполненного и активного инпута
    const clearButtonVisible = clear && filled && !disabled && !readOnly;

    const handleInputFocus = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            if (!readOnly) {
                setFocused(true);
            }

            if (onFocus) {
                onFocus(event);
            }
        },
        [onFocus, readOnly]
    );

    const handleInputBlur = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            setFocused(false);

            if (onBlur) {
                onBlur(event);
            }
        },
        [onBlur]
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { value: event.target.value });
            }

            if (uncontrolled) {
                setStateValue(event.target.value);
            }
        },
        [onChange, uncontrolled]
    );

    const handleClear = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (!clearButtonVisible) return;

            if (uncontrolled) {
                setStateValue('');
            }

            if (onClear) {
                onClear(event);
            }

            if (inputRef.current && !focused) {
                inputRef.current.focus();
            }
        },
        [clearButtonVisible, focused, onClear, uncontrolled]
    );

    const handleAnimationStart = useCallback(
        (event: AnimationEvent<HTMLInputElement>) => {
            if (onAnimationStart) {
                onAnimationStart(event);
            }

            setAutofilled(event.animationName.includes('start'));
        },
        [onAnimationStart]
    );

    const renderRightAddons = () => {
        const addonsVisible = clearButtonVisible || rightAddons || error;

        return (
            addonsVisible && (
                <>
                    {clearButtonVisible && (
                        <div
                            css={{
                                height: '100%',
                                marginRight: rightAddons ? scale(1) : 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <button
                                type="button"
                                disabled={disabled}
                                aria-label="Очистить"
                                css={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 0,
                                }}
                                onClick={handleClear}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    )}
                    {rightAddons}
                </>
            )
        );
    };

    const css = useMemo(() => deepmerge.all<CSSObject>([BASE_INPUT_CSS, inputCSS]), [inputCSS]);

    // TODO: react 18 useId()
    const htmlFor = restProps.id;

    return (
        <FormControl
            htmlFor={htmlFor}
            ref={wrapperRef}
            className={className}
            css={{ cursor: disabled ? 'not-allowed' : 'text' }}
            labelCSS={labelCSS}
            theme={theme}
            size={size}
            variant={variant}
            block={block}
            disabled={disabled}
            labelWrap={labelWrap}
            readOnly={readOnly}
            filled={filled || autofilled || focused || !!placeholder?.length}
            focused={focused}
            error={error}
            label={label}
            hint={hint}
            leftAddons={leftAddons}
            rightAddons={renderRightAddons()}
            bottomAddons={bottomAddons}
            leftAddonsCSS={leftAddonsCSS}
            rightAddonsCSS={rightAddonsCSS}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            showError={showError}
            fieldCSS={fieldCSS}
            wrapperCSS={wrapperCSS}
        >
            {innerLeftAddons}
            <input
                {...restProps}
                id={htmlFor}
                className="control"
                placeholder={placeholder}
                css={css}
                disabled={disabled}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onAnimationStart={handleAnimationStart}
                ref={mergeRefs([ref, inputRef])}
                type={type}
                value={uncontrolled ? stateValue : value}
                readOnly={readOnly}
                aria-label={typeof label === 'string' ? label : undefined}
            />
        </FormControl>
    );
};

const InputRef = forwardRef(Input);

export const createInputWithTheme = (
    defaultTheme: FormControlTheme,
    defaultVariant: FormControlVariant,
    defaultSize: FormControlSize
) => {
    type Return = ReturnType<typeof InputRef>;

    const ThemedInput = (({ theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props }, ref) => (
        <InputRef ref={ref} theme={theme} variant={variant} size={size} {...props} />
    )) as (
        // eslint-disable-next-line no-use-before-define
        props: Omit<InputProps, 'theme'> & { theme?: FormControlTheme },
        ref: Ref<HTMLInputElement>
    ) => Return;

    (ThemedInput as any).displayName = 'Input';

    return forwardRef(ThemedInput);
};

export default InputRef;
