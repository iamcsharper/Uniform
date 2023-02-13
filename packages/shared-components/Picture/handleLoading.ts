import { MutableRefObject } from 'react';

import { ImgElementWithDataProp, OnLoad, OnLoadingComplete, PlaceholderValue } from './types';

let isWarned = false;

// handler instead of the img's onLoad attribute.
function handleLoading(
    img: ImgElementWithDataProp,
    srcSet: string[],
    placeholder: PlaceholderValue,
    onLoadRef: MutableRefObject<OnLoad | undefined>,
    onLoadingCompleteRef: MutableRefObject<OnLoadingComplete | undefined>,
    setBlurComplete: (b: boolean) => void,
    setFadeComplete: (b: boolean) => void
) {
    if (!img || img['data-loaded-src'] === srcSet.join(' ')) {
        return;
    }
    img['data-loaded-src'] = srcSet.join(' ');
    const p = 'decode' in img ? img.decode() : Promise.resolve();
    p.catch(() => {}).then(() => {
        if (!img.parentNode) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        if (placeholder === 'blur') {
            setBlurComplete(true);
        }
        setFadeComplete(true);
        if (onLoadRef?.current) {
            // Since we don't have the SyntheticEvent here,
            // we must create one with the same shape.
            // See https://reactjs.org/docs/events.html
            const event = new Event('load');
            Object.defineProperty(event, 'target', { writable: false, value: img });
            let prevented = false;
            let stopped = false;
            onLoadRef.current({
                ...event,
                nativeEvent: event,
                currentTarget: img,
                target: img,
                isDefaultPrevented: () => prevented,
                isPropagationStopped: () => stopped,
                persist: () => {},
                preventDefault: () => {
                    prevented = true;
                    event.preventDefault();
                },
                stopPropagation: () => {
                    stopped = true;
                    event.stopPropagation();
                },
            });
        }
        if (onLoadingCompleteRef?.current) {
            onLoadingCompleteRef.current(img);
        }
        if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
            const heightModified = img.height.toString() !== img.getAttribute('height');
            const widthModified = img.width.toString() !== img.getAttribute('width');
            if ((heightModified && !widthModified) || (!heightModified && widthModified)) {
                if (isWarned) return;
                isWarned = true;
                console.warn(
                    `Picture with src "${srcSet}" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles 'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.`
                );
            }
        }
    });
}

export default handleLoading;
