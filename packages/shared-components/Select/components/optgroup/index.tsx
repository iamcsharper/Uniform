import { OptgroupProps } from '../../types';

// TODO: theme
export const Optgroup = ({ children, className, label }: OptgroupProps) => (
    <>
        <div
            className={className}
            css={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                // padding: scale(1),
                // minHeight: scale(5),
                "& + *[role='option']:before": {
                    display: 'none',
                },
            }}
        >
            <p
                css={
                    {
                        // ...typography('bodySmBold'),
                    }
                }
            >
                {label}
            </p>
        </div>
        {children}
    </>
);
