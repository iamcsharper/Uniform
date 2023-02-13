import { BaseThemeState, EnumLike, StyleDefinition } from '@common/theme';

type Color = string;

export interface LoadingSkeletonState {}

export interface Styles {
    baseColor: Color;
    highlightColor: Color;
}

export type LoadingSkeletonStateFull<V extends EnumLike, S extends EnumLike> = BaseThemeState<V, S> &
    LoadingSkeletonState;

export type LoadingSkeletonTheme<V extends EnumLike, S extends EnumLike> = StyleDefinition<
    LoadingSkeletonStateFull<V, S>,
    {
        baseColor: Color;
        highlightColor: Color;
    }
>;

export interface LoadingSkeletonProps<V extends EnumLike, S extends EnumLike>
    extends Partial<BaseThemeState<V, S, LoadingSkeletonTheme<V, S>>>,
        Partial<LoadingSkeletonState> {
    height?: number;
    width?: number;
    count?: number;
    duration?: number;
    circle?: boolean;
    className?: string;
}

export default LoadingSkeletonProps;
