import { siteConfig } from '@/config/site';
import { museoSans } from '@/utils/fonts';
import { cn } from '@/utils/lib';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
import Footer from '@/components/ui/footer';

import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.title,
        template: `%s — ${siteConfig.author}`,
    },
    description: siteConfig.description,
    keywords: [
        'photographer',
        'photography',
        'Central Java',
        'Indonesia',
        'visual storyteller',
        'Arif',
        'masarif.id',
        'portrait photography',
        'landscape photography',
        'lightroom presets',
        'video luts'
    ],
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.title,
        description: siteConfig.description,
        siteName: siteConfig.title,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.title,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: '@masarifid',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Ganti dengan kode verifikasi Google Search Console
    },
    alternates: {
        canonical: siteConfig.url,
    },
    category: 'photography',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.author,
        url: siteConfig.url,
        image: siteConfig.ogImage,
        description: siteConfig.description,
        jobTitle: 'Photographer',
        worksFor: {
            '@type': 'Organization',
            name: 'masarif.id',
        },
        address: {
            '@type': 'PostalAddress',
            addressRegion: 'Central Java',
            addressCountry: 'Indonesia',
        },
        sameAs: [
            'https://instagram.com/masarif.id',
            'https://github.com/homearif6',
            'https://www.linkedin.com/in/homearif6',
            'https://www.youtube.com/@masarifid',
        ],
    };

    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <meta name='theme-color' content='#ffffff' />
                <meta name='msapplication-TileColor' content='#ffffff' />
                <link rel='canonical' href={siteConfig.url} />
            </head>
            <body className={cn(museoSans.className, museoSans.variable, 'dark:bg-dark-950 bg-gray-100 antialiased')}>
                <ThemeProvider attribute='class' enableSystem={false}>
                    <div className='min-h-screen flex flex-col'>
                        <div className='flex-1'>
                            {children}
                        </div>
                        <Footer />
                    </div>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}