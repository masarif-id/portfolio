import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics dashboard for masarif.id',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}