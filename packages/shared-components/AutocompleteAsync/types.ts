import { FC } from 'react';

import type { useLazyLoadingProps } from '../Select/presets/useLazyLoading';
import type { OptionShape } from '../Select/types';
import type { SelectWithTagsProps } from '../SelectWithTags/types';

export interface AutocompleteAsyncProps extends Omit<SelectWithTagsProps, 'options' | 'selected' | 'value'> {
    asyncSearchFn: useLazyLoadingProps['optionsFetcher'];

    multiple?: boolean;

    /**
     * Фетчер-функция для получения опций из массива уже выбранных значений
     * @param values массив выбранных значений
     */
    asyncOptionsByValuesFn(values: any[]): Promise<OptionShape[]>;

    clearOnSelect?: boolean;

    CloseIcon: FC<any>;
    PreloaderIcon: FC<any>;
}
