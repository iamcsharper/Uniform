import { CSSObject } from '@emotion/react';
import { HTMLProps, ReactEventHandler } from 'react';

export interface PictureSource {
    media: string;
    image: string;
}

type SafeNumber = number | `${number}`;

export type ImgElementWithDataProp = HTMLImageElement & {
    'data-loaded-src': string | undefined;
};
export type PlaceholderValue = 'blur' | 'empty' | 'fade';

export type OnLoad = ReactEventHandler<HTMLImageElement> | undefined;
export type OnLoadingComplete = (img: HTMLImageElement) => void;

const VALID_LOADING_VALUES = ['lazy', 'eager', undefined] as const;
type LoadingValue = typeof VALID_LOADING_VALUES[number];

export type PlaceholderProps =
    | {
          placeholder: 'blur';
          blurDataURL: string;
          fadeCSS?: never;
          fadeCompleteCSS?: never;
      }
    | {
          placeholder?: 'empty';
          blurDataURL?: never;
          fadeCSS?: never;
          fadeCompleteCSS?: never;
      }
    | {
          placeholder?: 'fade';
          blurDataURL?: never;
          fadeCSS?: CSSObject;
          fadeCompleteCSS?: CSSObject;
      };

export type PictureProps = Omit<
    HTMLProps<HTMLPictureElement>,
    'src' | 'srcSet' | 'ref' | 'alt' | 'width' | 'height' | 'loading' | 'style' | 'crossOrigin' | 'preload'
> & {
    crossOrigin?: '' | 'anonymous' | 'use-credentials';
    sources: PictureSource[];
    className?: string;

    // disable not to allow css={{}}, need data to calculate blur
    css?: never;

    /**
     * Вставить ли в <head> тег <link rel="preload"
     */
    preload?: boolean;
    loading?: LoadingValue;

    alt: string;
    width: SafeNumber;
    height: SafeNumber;

    style?: CSSObject;
    onLoadingComplete?: OnLoadingComplete;
} & PlaceholderProps;
