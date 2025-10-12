import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaX, FaCamera, FaArrowRight, FaDownload, FaStar, FaCheck, FaFlask } from 'react-icons/fa6';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getProductData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.preset&select=*`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 60 }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch product data');
    }

    const data = await response.json();
    return data[0];
}

export async function generateMetadata() {
    const product = await getProductData();

    return {
        title: `${product.title} — Products`,
        description: product.meta_description
    };
}

export default async function PresetPage() {
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
                            <FaCamera size='4rem' />
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
                                Get Presets Now
                                <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                            </a>
                            <Link
                                href='/products/preset/samples'
                                className='inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-lg transition-all duration-300 hover:border-black dark:hover:border-white'>
                                View Samples
                            </Link>
                        </div>
                    </div>
                </Container>

                {product.extra_section_title && (
                    <Container className='py-16'>
                        <Card className='p-12 text-center'>
                            <div className='mb-6 flex justify-center'>
                                <FaFlask size='3rem' />
                            </div>
                            <h2 className='font-pixelify-sans text-3xl mb-4'>{product.extra_section_title}</h2>
                            <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
                                {product.extra_section_description}
                            </p>
                            {product.secondary_url && (
                                <a
                                    href={product.secondary_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                    <FaFlask />
                                    {product.secondary_url_label}
                                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                </a>
                            )}
                        </Card>
                    </Container>
                )}

                <Container className='py-16'>
                    <div className='text-center mb-12'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>What&apos;s Included</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Each preset pack comes with everything you need to elevate your photography
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
                        <h2 className='font-pixelify-sans text-3xl mb-4'>Preset Collections</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Choose from our carefully curated preset collections, each designed for specific
                            photography styles
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {product.packages.map((pkg: any, index: number) => (
                            <Card key={index} className='p-8 text-center hover:shadow-xl transition-shadow duration-300'>
                                <div className='mb-6'>
                                    <div className='mb-4'>
                                        <FaCamera className='text-2xl mx-auto' />
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
                            Shop All Presets
                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                        </a>
                    </Card>
                </Container>
            </main>
        </>
    );
}
