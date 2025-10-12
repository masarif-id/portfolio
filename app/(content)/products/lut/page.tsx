import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaX, FaVideo, FaArrowRight, FaDownload, FaStar, FaCheck, FaPlay } from 'react-icons/fa6';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Video LUTs — Products',
    description: 'Professional video LUTs by Arif for cinematic color grading. Transform your videos with Hollywood-style color correction.'
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getProductData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.lut&select=*`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product data');
    }

    const data = await response.json();
    return data[0];
}

export default async function LutPage() {
    const product = await getProductData();

    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container className='py-16 text-center'>
                    <div className='mx-auto max-w-4xl'>
                        <div className='mb-8 flex justify-center'>
                            <FaVideo size='4rem' />
                        </div>
                        <h1 className='font-pixelify-sans text-5xl leading-tight mb-6 max-md:text-4xl'>
                            {product.title}
                        </h1>
                        <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
                            {product.subtitle}
                        </p>
                        <div className='flex flex-wrap justify-center gap-4'>
                            <a
                                href={product.store_url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                <FaDownload />
                                Get LUTs Now
                                <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                            </a>
                            {product.secondary_url_label && (
                                <button className='inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-lg transition-all duration-300 hover:border-black dark:hover:border-white'>
                                    <FaPlay />
                                    {product.secondary_url_label}
                                </button>
                            )}
                        </div>
                    </div>
                </Container>

                <Container className='py-16'>
                    <div className='text-center mb-12'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>What You Get</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Professional-grade LUTs designed for filmmakers and content creators
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {product.features.map((feature: string, index: number) => (
                            <Card key={index} className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                                        <FaCheck className='text-green-600 dark:text-green-400' />
                                    </div>
                                    <p className='font-medium'>{feature}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>

                <Container className='py-16'>
                    <div className='text-center mb-12'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>LUT Collections</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Choose from our professionally crafted LUT collections for different moods and styles
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {product.packages.map((pkg: any, index: number) => (
                            <Card key={index} className='p-8 text-center hover:shadow-xl transition-shadow duration-300'>
                                <div className='mb-6'>
                                    <div className='mb-4'>
                                        <FaVideo className='text-2xl mx-auto' />
                                    </div>
                                    <h3 className='font-pixelify-sans text-xl mb-2'>{pkg.name}</h3>
                                    <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>{pkg.description}</p>
                                    <div className='flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                        <FaStar className='text-yellow-500' />
                                        <span>
                                            {pkg.count} {pkg.countLabel} included
                                        </span>
                                    </div>
                                </div>
                                <div className='mb-6'>
                                    <span className='text-3xl font-bold'>{pkg.price}</span>
                                </div>
                                <a
                                    href={product.store_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group inline-flex items-center justify-center gap-3 w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                    Get This Pack
                                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                </a>
                            </Card>
                        ))}
                    </div>
                </Container>

                {product.extra_section_title && product.extra_section_items.length > 0 && (
                    <Container className='py-16'>
                        <div className='text-center mb-12'>
                            <h2 className='font-pixelify-sans text-3xl mb-4'>{product.extra_section_title}</h2>
                            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                                {product.extra_section_description}
                            </p>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                            {product.extra_section_items.map((item: string, index: number) => (
                                <Card key={index} className='p-4 text-center'>
                                    <p className='font-medium text-sm'>{item}</p>
                                </Card>
                            ))}
                        </div>
                    </Container>
                )}

                <Container className='py-16'>
                    <Card className='p-12 text-center'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>{product.cta_title}</h2>
                        <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>{product.cta_description}</p>
                        <a
                            href={product.store_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
                            <FaDownload />
                            Shop All LUTs
                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                        </a>
                    </Card>
                </Container>
            </main>
        </>
    );
}
