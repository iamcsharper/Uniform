import { FC, HTMLProps, forwardRef } from 'react';

import { scale } from '@common/helpers';

import DefaultCloseIcon from '@icons/small/close.svg';

export interface TagProps extends HTMLProps<Omit<HTMLButtonElement, 'type'>> {
    onDelete?: () => void;
    CloseIcon?: FC<any>;
}

const Tag = ({ CloseIcon = DefaultCloseIcon, children, onDelete, onClick, tabIndex = onClick ? 0 : -1, ...props }: TagProps, ref: any) => (
    <button
        {...props}
        tabIndex={tabIndex}
        type="button"
        data-role="tag-button"
        ref={ref}
        onClick={onClick}
        css={{
            cursor: onClick ? 'pointer' : 'default',
            padding: `${scale(1, true)}px ${scale(1)}px`,
            overflow: 'hidden',
            height: scale(3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // TODO: theme
            background: '#FFF',
            border: `1px solid #eee`,
            ':hover': {
                background: 'blue',
            },
            color: '#000',
            // ...typography('bodySm'),
        }}
    >
        {children}
        {onDelete && (
            <span
                role="button"
                tabIndex={0}
                css={{ cursor: 'pointer', display: 'flex', flexShrink: 0, flexGrow: 1, ':hover': { opacity: 0.5 } }}
                title="Удалить"
                onClick={e => {
                    e.stopPropagation();
                    onDelete?.();
                }}
                onKeyDown={event => {
                    if ([' ', 'Enter'].includes(event.key)) {
                        event.stopPropagation();
                        onDelete?.();
                    }
                }}
            >
                <CloseIcon
                    css={{
                        fill: 'currentColor',
                        width: scale(2),
                        height: scale(2),
                        marginLeft: scale(1, true),
                    }}
                />
            </span>
        )}
    </button>
);

export default forwardRef(Tag) as typeof Tag;
