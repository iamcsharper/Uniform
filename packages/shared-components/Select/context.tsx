import { FC, ReactNode, createContext, useContext, useMemo } from 'react';

import { FormControlTheme } from '@root/FormControl';

import { BaseThemeState, useThemeCSSPart } from '@common/theme';

import { SelectSize, SelectState, SelectTheme, SelectThemeState, SelectVariant } from './types';

const useFoo = () => useThemeCSSPart<Omit<SelectThemeState, 'theme'>, SelectTheme>(...([] as never as [any, any]));

type Context = Required<BaseThemeState<typeof SelectVariant, typeof SelectSize, SelectTheme>> & {
    state: SelectState;
    getCSS: ReturnType<typeof useFoo>;
    formControlTheme: FormControlTheme;
};

type ContextProps = Required<BaseThemeState<typeof SelectVariant, typeof SelectSize, SelectTheme>> &
    Pick<Context, 'state' | 'formControlTheme'>;

const SelectThemeContext = createContext<Context | null>(null);
SelectThemeContext.displayName = 'SelectThemeContext';

export const SelectThemeProvider: FC<{ children: ReactNode } & ContextProps> = ({
    children,
    size,
    theme,
    variant,
    state,
    formControlTheme,
}) => {
    const getCSS = useThemeCSSPart(theme, {
        ...state,
        size,
        variant,
    });

    const value = useMemo<Context>(
        () => ({
            getCSS,
            state,
            size,
            theme,
            variant,
            formControlTheme,
        }),
        [getCSS, size, state, theme, variant, formControlTheme]
    );

    return <SelectThemeContext.Provider value={value}>{children}</SelectThemeContext.Provider>;
};

export const useSelectTheme = () => {
    const context = useContext(SelectThemeContext);

    if (!context) {
        throw new Error(`Hook useSelectTheme must be used within SelectThemeProvider`);
    }

    return context;
};
