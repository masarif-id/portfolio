import Container from '@/components/ui/container';
import GridLayout from '@/components/grid/layout';
import { gridItems, layouts } from '@/config/grid';
import { siteConfig } from '@/config/site';
import GridItem from '@/components/grid/item';
import { getLatestPost } from '@/utils/mdx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.title,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.title,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.title,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
    },
    alternates: {
        canonical: siteConfig.url,
    },
};

export default function Home() {
    const latestPost = getLatestPost();

    return (
        <>
            <Container as='header' className='flex items-center justify-between py-0'>
                <h1 className='hidden'>{siteConfig.title}</h1>
            </Container>
            <main className='py-8'>
                <GridLayout layouts={layouts}>
                    {gridItems.map((item) => (
                        <GridItem 
                            key={item.i} 
                            id={item.i} 
                            component={item.component}
                            data={item.i === 'article' ? latestPost : undefined}
                        />
                    ))}
                </GridLayout>
            </main>
        </>
    );
}