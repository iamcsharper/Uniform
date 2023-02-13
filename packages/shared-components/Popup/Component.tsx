import { CSSObject } from '@emotion/react';
import { forwardRef, useMemo, useRef } from 'react';
import mergeRefs from 'react-merge-refs';

import { useThemeCSSPart } from '@common/theme';

import BaseModal from '../BaseModal';
import { PopupContextProvider } from './PopupContext';
import { ModalDesktopProps, PopupState, View } from './types';

const Popup = forwardRef<HTMLDivElement, ModalDesktopProps & { view: View }>(
    (
        {
            theme,
            size = 'md',
            variant = 'primary',
            fixedPosition,
            children,
            className,
            view,
            flex,
            hasCloser,
            stickyFooter,
            stickyHeader,
            align,
            trim,
            innerScroll,
            ...restProps
        },
        ref
    ) => {
        const state = useMemo<PopupState>(
            () => ({
                size,
                view,
                align,
                fixedPosition,
                flex,
                hasCloser,
                stickyFooter,
                stickyHeader,
                trim,
                innerScroll,
            }),
            [align, fixedPosition, flex, hasCloser, size, stickyFooter, stickyHeader, trim, view, innerScroll]
        );

        const modalRef = useRef<HTMLElement>(null);

        const handleEntered = () => {
            if (fixedPosition && modalRef.current) {
                const content = modalRef.current.querySelector<HTMLElement>('[data-role="content"]');

                if (content) {
                    const { marginTop } = window.getComputedStyle(content);

                    content.style.marginTop = marginTop;
                }
            }
        };

        const baseModalProps =
            view === 'desktop'
                ? {
                      ref: mergeRefs([ref, modalRef]),
                      onMount: handleEntered,
                      backdropProps: {
                          invisible: size === 'fullscreen',
                          ...restProps.backdropProps,
                      },
                  }
                : {
                      ref,
                      className,
                  };

        const getCSS = useThemeCSSPart(theme, {
            ...state,
            size,
            variant,
        });

        return (
            <PopupContextProvider size={size} theme={theme} variant={variant} state={state}>
                <BaseModal
                    {...restProps}
                    css={getCSS('component') as CSSObject}
                    wrapperCSS={{
                        ...(getCSS('wrapper') as CSSObject),
                        ...restProps.wrapperCSS,
                    }}
                    {...baseModalProps}
                >
                    {children}
                </BaseModal>
            </PopupContextProvider>
        );
    }
);

export default Popup;
