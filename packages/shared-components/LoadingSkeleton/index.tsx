import { PropsWithChildren, useMemo } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { EnumLike } from '@common/theme';

import type { LoadingSkeletonProps, LoadingSkeletonStateFull, LoadingSkeletonTheme, Styles } from './types';

const Wrapper = ({ children }: PropsWithChildren<unknown>) => (
    <div
        css={{
            display: 'flex',
            padding: 0,
            margin: 0,
        }}
    >
        {children}
    </div>
);

const BaseLoadingSkeleton = <V extends EnumLike, S extends EnumLike>({
    variant,
    size,
    theme,
    ...props
}: LoadingSkeletonProps<V, S>) => {
    if (!theme) {
        throw new Error('[LoadingSkeleton] theme is required');
    }

    const state = useMemo<LoadingSkeletonStateFull<V, S>>(
        () => ({
            variant,
            size,
        }),
        [size, variant]
    );

    let colors: Styles;

    if (typeof theme === 'function') {
        colors = theme(state);
    } else {
        colors = theme;
    }

    return (
        <SkeletonTheme baseColor={colors?.baseColor} highlightColor={colors?.highlightColor}>
            <Skeleton wrapper={Wrapper} {...props} />
        </SkeletonTheme>
    );
};

export const createLoadingSkeletonWithTheme = <V extends EnumLike, S extends EnumLike>(
    defaultTheme: LoadingSkeletonTheme<V, S>,
    defaultVariant: V | keyof V,
    defaultSize: S | keyof S
) => {
    type ButtonReturn = ReturnType<typeof BaseLoadingSkeleton>;

    const Themed = (({ theme = defaultTheme, variant = defaultVariant, size = defaultSize, ...props }) => (
        <BaseLoadingSkeleton theme={theme} variant={variant} size={size} {...props} />
    )) as (props: LoadingSkeletonProps<V, S>) => ButtonReturn;

    (Themed as any).displayName = 'Skeleton';

    return Themed;
};

export default BaseLoadingSkeleton;
