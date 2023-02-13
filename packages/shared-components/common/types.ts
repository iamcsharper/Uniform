import { ComponentPropsWithRef, ElementType, FC, SVGProps } from 'react';

export type SVGRIcon = FC<
    SVGProps<SVGSVGElement> & {
        /** Alternative text in title tag. */
        title?: string;
    }
>;

export type MergeElementProps<T extends ElementType, P extends object = {}> = Omit<ComponentPropsWithRef<T>, keyof P> &
    P;
