import { forwardRef } from 'react';

import { useMediaQuery } from '@common/hooks/useMediaQuery';

import Modal from './Component';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import type { ModalResponsiveProps, View } from './types';

const ModalResponsiveComponent = forwardRef<HTMLDivElement, ModalResponsiveProps>(
    ({ children, breakpoint = 1024, ...restProps }, ref) => {
        const [view] = useMediaQuery<View>(
            [
                ['mobile', `(max-width: ${breakpoint - 1}px)`],
                ['desktop', `(min-width: ${breakpoint}px)`],
            ],
            'desktop'
        );

        return (
            <Modal ref={ref} {...restProps} view={view} size={view === 'mobile' ? 'fullscreen' : restProps.size}>
                {children}
            </Modal>
        );
    }
);

const Popup = Object.assign(ModalResponsiveComponent, {
    Header,
    Content,
    Footer,
});

export default Popup;
