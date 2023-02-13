import { CSSObject } from '@emotion/react';
import { FC, HTMLProps } from 'react';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import { BaseThemeState, EnumLike, StyleDefinition } from '@common/theme';

export interface CheckboxState {
    checked?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    hasChildren?: boolean;
}

export type CheckboxStateFull<V extends EnumLike, S extends EnumLike> = BaseThemeState<V, S> & CheckboxState;

export interface CheckboxTheme<V extends EnumLike, S extends EnumLike> {
    wrapper: StyleDefinition<CheckboxStateFull<V, S>>;
    label: StyleDefinition<CheckboxStateFull<V, S>>;
    icon: StyleDefinition<CheckboxStateFull<V, S>>;
    knob: StyleDefinition<CheckboxStateFull<V, S>>;
}

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export interface BaseCheckboxProps<V extends EnumLike, S extends EnumLike>
    extends Partial<BaseThemeState<V, S, CheckboxTheme<V, S>>>,
        Partial<CheckboxState>,
        Omit<HTMLProps<HTMLInputElement>, 'size'>,
        Omit<PartialRecord<`${keyof CheckboxTheme<V, S>}CSS`, CSSObject>, 'wrapperCSS'> {
    /** Active state indeterminate */
    isIndeterminate?: boolean;
    /** Are all values selected for indeterminate state */
    all?: boolean;
    /** Additional class for label */
    labelClass?: string;
    /** Additional class */
    className?: string;
    /** Additional classes from form (inner) */
    inputClasses?: string;
    /** Show error flag */
    showError?: boolean;

    /** Icon component */
    CheckIcon: FC<any>;

    field?: ControllerRenderProps;
    fieldState?: ControllerFieldState;
}

export default BaseCheckboxProps;
