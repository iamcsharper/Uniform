import { FC, useEffect, useRef } from 'react';
import { useTransition } from 'transition-hook';

import type { BackdropProps } from './types';

export const Backdrop: FC<BackdropProps> = ({
    className,
    open = false,
    invisible = false,
    timeout = 200,
    children,
    onClose,
    dataTestId,
    onDestroy,
    styles = {
        from: {
            backgroundColor: 'transparent',
            transition: `background-color ${timeout}ms ease-in`,
        },
        enter: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            transition: `background-color ${timeout}ms ease-out`,
        },
        leave: {
            backgroundColor: 'transparent',
            transition: `background-color ${timeout}ms ease-out`,
        },
    },
    ...restProps
}) => {
    const { stage, shouldMount } = useTransition(open, timeout);

    const onDestroyRef = useRef(onDestroy);
    onDestroyRef.current = onDestroy;

    useEffect(() => {
        if (!shouldMount) onDestroyRef.current?.();
    }, [shouldMount]);

    if (!shouldMount) return null;

    return (
        <div
            aria-hidden
            onClick={onClose}
            data-test-id={dataTestId}
            className={className}
            css={{
                zIndex: -1,
                position: 'fixed',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                WebkitTapHighlightColor: 'transparent',
                ...(invisible && { opacity: 0 }),
                ...styles[stage],
            }}
            {...restProps}
        >
            {children}
        </div>
    );
};

export default Backdrop;
