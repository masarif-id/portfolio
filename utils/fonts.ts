import localFont from 'next/font/local';

export const museoSans = localFont({
    src: [
        {
            path: './museo-sans-500.woff',
            weight: '500',
            style: 'normal',
        },
        {
            path: './museo-sans-700.woff',
            weight: '700',
            style: 'normal',
        },
        ],
    variable: '--font-museo-sans',
    display: 'swap',
});
