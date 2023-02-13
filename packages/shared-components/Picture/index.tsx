import { CSSObject } from '@emotion/react';
// import Head from 'next/head';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import getImageBlurSvg from './getImageBlurSvg';
import handleLoading from './handleLoading';
import { ImgElementWithDataProp, PictureProps } from './types';

const DEFAULT_GRAYSCALE_IMAGE =
    'data:image/webp;base64,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';

function getInt(x: unknown): number | undefined {
    if (typeof x === 'number' || typeof x === 'undefined') {
        return x;
    }
    if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
    }
    return NaN;
}

export const Picture = ({
    sources,
    placeholder = 'empty',
    fadeCompleteCSS = {},
    fadeCSS = {},
    blurDataURL = placeholder === 'empty' ? undefined : DEFAULT_GRAYSCALE_IMAGE,
    preload = false,
    style: imgStyle = {},
    width,
    height,
    onLoad,
    onError,
    onLoadingComplete,
    ...restProps
}: PictureProps) => {
    const widthInt = getInt(width);
    const heightInt = getInt(height);

    const onLoadRef = useRef(onLoad);
    useEffect(() => {
        onLoadRef.current = onLoad;
    }, [onLoad]);

    const onLoadingCompleteRef = useRef(onLoadingComplete);
    useEffect(() => {
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [onLoadingComplete]);

    const [blurComplete, setBlurComplete] = useState(false);
    const [fadeComplete, setFadeComplete] = useState(false);

    const fadeStyle: CSSObject =
        placeholder === 'fade'
            ? {
                  opacity: 0,
                  willChange: 'opacity',
                  transition: 'opacity 0.2s ease-in-out',
                  ...fadeCSS,
                  ...(fadeComplete && {
                      opacity: 1,
                      ...fadeCompleteCSS,
                  }),
              }
            : {};

    const blurStyle: CSSObject =
        placeholder === 'blur' && blurDataURL && !blurComplete
            ? {
                  backgroundSize: imgStyle.objectFit || 'cover',
                  backgroundPosition: imgStyle.objectPosition || '50% 50%',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,${getImageBlurSvg({
                      widthInt,
                      heightInt,
                      blurWidth: widthInt,
                      blurHeight: heightInt,
                      blurDataURL,
                  })}")`,
              }
            : {};

    const srcSet = useMemo(() => sources.map(e => e.image), [sources]);
    const [showAltText, setShowAltText] = useState(false);

    return (
        <>
            {
                preload &&
                    // <Head>{
                    sources.map(source => <link key={source.media} rel="preload" as="image" href={source.image} />)
                // }</Head>
            }
            <picture>
                {sources.map(source => (
                    <source key={source.media} srcSet={source.image} media={source.media} />
                ))}
                <img
                    {...restProps}
                    alt={restProps.alt}
                    src={sources[0].image}
                    decoding="async"
                    css={{
                        ...imgStyle,
                        ...blurStyle,
                        ...fadeStyle,
                        ...(!showAltText && { color: 'transparent' }),
                    }}
                    width={width}
                    height={height}
                    ref={useCallback(
                        (img: ImgElementWithDataProp | null) => {
                            if (!img) {
                                return;
                            }
                            if (onError) {
                                // If the image has an error before react hydrates, then the error is lost.
                                // The workaround is to wait until the image is mounted which is after hydration,
                                // then we set the src again to trigger the error handler (if there was an error).
                                // eslint-disable-next-line no-self-assign
                                img.src = img.src;
                            }
                            if (process.env.NODE_ENV !== 'production') {
                                if (img.getAttribute('alt') === null) {
                                    console.error(
                                        `Picture is missing required "alt" property. Please add Alternative Text to describe the image for screen readers and search engines.`
                                    );
                                }
                            }

                            if (img.complete) {
                                handleLoading(
                                    img,
                                    srcSet,
                                    placeholder,
                                    onLoadRef,
                                    onLoadingCompleteRef,
                                    setBlurComplete,
                                    setFadeComplete
                                );
                            }
                        },
                        [srcSet, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, onError]
                    )}
                    onLoad={event => {
                        const img = event.currentTarget as ImgElementWithDataProp;
                        handleLoading(
                            img,
                            srcSet,
                            placeholder,
                            onLoadRef,
                            onLoadingCompleteRef,
                            setBlurComplete,
                            setFadeComplete
                        );
                    }}
                    onError={event => {
                        // if the real image fails to load, this will ensure "alt" is visible
                        setShowAltText(true);
                        if (placeholder === 'blur') {
                            // If the real image fails to load, this will still remove the placeholder.
                            setBlurComplete(true);
                        }
                        if (onError) {
                            onError(event);
                        }
                    }}
                />
            </picture>
        </>
    );
};

export default Picture;
