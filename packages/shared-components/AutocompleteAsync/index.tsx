import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { scale } from '@common/helpers';

import { Autocomplete } from '../Autocomplete';
import { useLazyLoading } from '../Select/presets/useLazyLoading';
import { OptionProps, OptionShape } from '../Select/types';
import { SimpleSelectWithTags } from '../SelectWithTags';
import { AutocompleteAsyncProps } from './types';

const DEBOUNCE_TIMEOUT = 300;

export const AutocompleteAsync = forwardRef<
    HTMLInputElement,
    AutocompleteAsyncProps & {
        field?: { value: any };
        meta?: any;
        helpers?: { setValue: (value: any) => void };
    }
>(
    (
        {
            multiple = false,
            clearOnSelect = true,
            meta,
            field,
            helpers,
            onOpen,
            onChange,
            onInput,
            asyncOptionsByValuesFn,
            asyncSearchFn,
            fieldProps = {},
            CloseIcon,
            PreloaderIcon,
            ...props
        },
        ref
    ) => {
        const [valuesMap, setValuesMap] = useState(new Map<any, string>());

        const selectedValues = useMemo(() => {
            if (Array.isArray(field?.value)) return field?.value as any[];

            return field?.value !== null && field?.value !== undefined ? [field?.value] : [];
        }, [field?.value]);

        const [isFetchingValues, setFetchingValues] = useState(false);

        const {
            setValue,
            reset,
            isLoading,
            isNotFound,
            optionsProps: { optionsListProps, ...lazyProps },
        } = useLazyLoading({
            optionsFetcher: async (offset, limit, queryString) => {
                if (!asyncSearchFn || !queryString) {
                    return {
                        options: [],
                        hasMore: false,
                    };
                }

                return asyncSearchFn(offset, limit, queryString);
            },
            initialOffset: 0,
            limit: 15,
            isValuesLoading: isFetchingValues,
            clearOnClose: multiple,
        });

        const abortFetchingSelectedOptionsRef = useRef<() => void>();

        const fetchOptionsByValuesRef = useRef<typeof asyncOptionsByValuesFn>();
        fetchOptionsByValuesRef.current = asyncOptionsByValuesFn;

        const valuesMapRef = useRef(valuesMap);
        valuesMapRef.current = valuesMap;

        const fetchUnknownValues = useCallback(() => {
            const unknownValues = selectedValues.filter(e => !valuesMapRef.current.has(e));
            if (!unknownValues.length) return;

            setFetchingValues(true);
            new Promise<OptionShape[]>((resolve, reject) => {
                abortFetchingSelectedOptionsRef.current?.();
                abortFetchingSelectedOptionsRef.current = reject;
                fetchOptionsByValuesRef.current?.(unknownValues).then(res => {
                    resolve(res);
                });
            })
                .then(res => {
                    abortFetchingSelectedOptionsRef.current = undefined;

                    res.forEach(e => {
                        valuesMapRef.current.set(e.value, e.key);
                    });

                    setValuesMap(new Map(valuesMapRef.current));

                    setFetchingValues(false);
                })
                .catch(() => {});
        }, [selectedValues]);

        const fetchRef = useRef<() => void>();

        useEffect(() => {
            fetchRef.current = fetchUnknownValues;
        }, [fetchUnknownValues]);

        const fetchTimerRef = useRef<ReturnType<typeof setTimeout>>();

        useEffect(() => {
            abortFetchingSelectedOptionsRef.current?.();

            /* Дебаунсим изменения, чтобы не отправлять запрос на каждый чих */
            if (fetchTimerRef.current) {
                clearTimeout(fetchTimerRef.current);
            }

            fetchTimerRef.current = setTimeout(() => {
                /*
                 * После дебаунса необходимо вызвать функцию-загрузчик
                 */
                fetchRef.current?.();
            }, DEBOUNCE_TIMEOUT);

            fetchUnknownValues();
        }, [fetchUnknownValues]);

        const selectedOptions = useMemo(() => {
            const valuesWithKnownKey = selectedValues.filter(e => valuesMap.has(e));
            const valuesWithUnKnownKey = selectedValues.filter(e => !valuesMap.has(e));

            const knownTags = valuesWithKnownKey.map<OptionShape>(e => ({
                key: valuesMap.get(e)!,
                value: e,
            }));

            const loadingTags = valuesWithUnKnownKey.map<OptionShape>(e => ({
                key: `${e}`,
                isPreloader: true,
                value: e,
            }));

            return [...knownTags, ...loadingTags];
        }, [selectedValues, valuesMap]);

        const [isSingleValueSet, setSingleValueSet] = useState(false);

        useEffect(() => {
            if (isSingleValueSet) return;
            if (multiple) return;
            if (!selectedValues.length) return;

            if (selectedOptions.length && !selectedOptions[0].isPreloader) {
                setValue(selectedOptions[0].key);
                setSingleValueSet(true);
            }
        }, [isSingleValueSet, multiple, selectedOptions, selectedValues.length, setValue]);

        if (!multiple) {
            return (
                <Autocomplete
                    ref={ref}
                    onInput={e => {
                        optionsListProps.inputProps.onChange(e, { value: e.target.value });
                        onInput?.(e);

                        if (!e.target.value) {
                            reset();

                            if (helpers) {
                                helpers.setValue(null);
                            }
                        }
                    }}
                    value={optionsListProps.inputProps.value}
                    selected={selectedOptions}
                    onChange={payload => {
                        onChange?.(payload);

                        setValue(payload.selectedMultiple[0].key, false);

                        payload.selectedMultiple.forEach(e => {
                            if (typeof e === 'string') return;
                            valuesMapRef.current.set(e.value, e.key);
                        });

                        setValuesMap(new Map(valuesMapRef.current));

                        if (!helpers) return;
                        helpers.setValue(payload.selectedMultiple.map(e => (typeof e === 'string' ? e : e.value))[0]);
                    }}
                    error={meta?.error}
                    fieldProps={{
                        ...fieldProps,
                        inputProps: {
                            ...fieldProps.inputProps,
                            ...(!isLoading && {
                                placeholder: props.placeholder,
                            }),
                        },
                        rightAddons: (
                            <>
                                {!!selectedValues.length && !isLoading && (
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.stopPropagation();

                                            helpers?.setValue(null);
                                            reset();
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
                                        <CloseIcon />
                                    </button>
                                )}
                                {isLoading ? <PreloaderIcon css={{ width: scale(2) }} /> : null}
                            </>
                        ),
                    }}
                    optionsListProps={{
                        ...optionsListProps,
                        emptyPlaceholder: (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {isNotFound ? 'Ничего не найдено' : null}
                                {isLoading ? 'Поиск...' : null}
                                {!isLoading && !isNotFound ? 'Начинайте вводить' : null}
                            </div>
                        ),
                    }}
                    {...lazyProps}
                    showEmptyOptionsList
                    multiple={false}
                    onOpen={payload => {
                        onOpen?.(payload);
                        lazyProps.onOpen(payload);

                        if (!payload.open && selectedOptions.length) {
                            setValue(selectedOptions[0].key);
                        }
                    }}
                    Option={(optionProps: OptionProps) =>
                        lazyProps.Option({
                            ...optionProps,
                            selected: selectedValues.includes(optionProps.option.value),
                        })
                    }
                    {...props}
                />
            );
        }

        return (
            <SimpleSelectWithTags
                ref={ref}
                onInput={e => {
                    optionsListProps.inputProps.onChange(e, { value: e.target.value });
                    onInput?.(e);
                }}
                value={optionsListProps.inputProps.value}
                selected={selectedOptions}
                onChange={payload => {
                    onChange?.(payload);

                    payload.selectedMultiple.forEach(e => {
                        if (typeof e === 'string') return;
                        valuesMapRef.current.set(e.value, e.key);
                    });

                    setValuesMap(new Map(valuesMapRef.current));

                    if (clearOnSelect) reset();

                    if (!helpers) return;

                    helpers.setValue(payload.selectedMultiple.map(e => (typeof e === 'string' ? e : e.value)));
                }}
                resetOnChange={false}
                resetOnClose={false}
                error={meta.error}
                fieldProps={{
                    ...fieldProps,
                    ...(isLoading && {
                        rightAddons: <PreloaderIcon css={{ width: scale(2) }} />,
                    }),
                }}
                optionsListProps={{
                    ...optionsListProps,
                    emptyPlaceholder: (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {isNotFound ? 'Ничего не найдено' : null}
                            {isLoading ? 'Поиск...' : null}
                            {!isLoading && !isNotFound ? 'Начинайте вводить' : null}
                        </div>
                    ),
                }}
                isLoading={isFetchingValues}
                {...lazyProps}
                {...props}
            />
        );
    }
);

AutocompleteAsync.displayName = 'AutocompleteAsync';

export default AutocompleteAsync;
