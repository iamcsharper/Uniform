import { CSSObject } from '@emotion/react';
import { FC, useContext, useEffect } from 'react';

import { BaseModalContext } from '../../BaseModal';
import { usePopupContext } from '../PopupContext';
import { FooterProps } from '../types';

export const Footer: FC<FooterProps> = ({ children, className }) => {
    const { footerHighlighted, setHasFooter } = useContext(BaseModalContext);
    const { getCSS } = usePopupContext();

    useEffect(() => {
        setHasFooter(true);
    }, [setHasFooter]);

    return (
        <div className={className} css={getCSS('footer', { highlighted: footerHighlighted }) as CSSObject}>
            {children}
        </div>
    );
};
