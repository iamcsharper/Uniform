import { createContext, useContext } from 'react';

import { EnumLike } from '@common/theme';
import { AccordionContextProps } from './types';

export const AccordionContext = createContext<AccordionContextProps<any, any> | undefined>(undefined);

export const useAccordion = <V extends EnumLike, S extends EnumLike>(): AccordionContextProps<V, S> => {
    const context = useContext(AccordionContext) as AccordionContextProps<V, S> | undefined;

    if (!context) {
        throw new Error('This component must be used within a <Accordion> component');
    }

    return context;
};

export default useAccordion;
