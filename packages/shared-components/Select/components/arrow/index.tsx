// eslint-disable-next-line import/named
import ArrowIcon from '@icons/small/chevronDown.svg';

import { useSelectTheme } from '../../context';
import { ArrowProps } from '../../types';

export const Arrow = ({ disabled, className }: ArrowProps) => {
    const {
        getCSS,
        state: { isOpen },
    } = useSelectTheme();

    return (
        <span css={getCSS('arrowButton') as any}>
            <ArrowIcon
                className={className}
                css={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'transform ease 300ms',
                    ...(!isOpen && { transform: 'rotate(180deg)' }),
                    ':hover': {
                        opacity: 0.5,
                    },
                }}
            />
        </span>
    );
};
