import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaX, FaCamera, FaArrowRight, FaDownload, FaStar, FaCheck } from 'react-icons/fa6';
import Image from 'next/image';

export const metadata = {
    title: 'Lightroom Preset — Products',
    description: 'Professional Lightroom presets by Arif for stunning photography edits. Transform your photos with cinematic color grading.',
};

export default function PresetPage() {
    const features = [
        'Professional color grading',
        'Film-inspired tones',
        'Easy one-click application',
        'Compatible with Lightroom CC & Classic',
        'Mobile & Desktop versions included',
        'Lifetime updates'
    ];

    const presetPacks = [
        {
            name: 'Cinematic Pack',
            description: 'Film-inspired presets for dramatic storytelling',
            price: '$29',
            presets: 12
        },
        {
            name: 'Portrait Pack',
            description: 'Perfect skin tones and natural beauty enhancement',
            price: '$24',
            presets: 10
        },
        {
            name: 'Landscape Pack',
            description: 'Enhance nature photography with vibrant colors',
            price: '$27',
            presets: 15
        }
    ];

    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                {/* Hero Section */}
                <Container className='py-16 text-center'>
                    <div className='mx-auto max-w-4xl'>
                        <div className='mb-8 flex justify-center'>
                            <div className='rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-6'>
                                <FaCamera size='4rem' className='text-white' />
                            </div>
                        </div>
                        <h1 className='font-pixelify-sans text-5xl leading-tight mb-6 max-md:text-4xl'>
                            Professional Lightroom Presets
                        </h1>
                        <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
                            Transform your photography with professionally crafted Lightroom presets. 
                            Achieve cinematic color grading and stunning visual aesthetics with just one click.
                        </p>
                        <div className='flex flex-wrap justify-center gap-4'>
                            <a
                                href='https://store.masarif.id/preset'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                <FaDownload />
                                Get Presets Now
                                <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                            </a>
                            <button className='inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-lg transition-all duration-300 hover:border-purple-500 dark:hover:border-purple-400'>
                                View Samples
                            </button>
                        </div>
                    </div>
                </Container>

                {/* Features Section */}
                <Container className='py-16'>
                    <div className='text-center mb-12'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>What's Included</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Each preset pack comes with everything you need to elevate your photography
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {features.map((feature, index) => (
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

                {/* Preset Packs Section */}
                <Container className='py-16'>
                    <div className='text-center mb-12'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>Preset Collections</h2>
                        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Choose from our carefully curated preset collections, each designed for specific photography styles
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {presetPacks.map((pack, index) => (
                            <Card key={index} className='p-8 text-center hover:shadow-xl transition-shadow duration-300'>
                                <div className='mb-6'>
                                    <div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mb-4'>
                                        <FaCamera className='text-white text-2xl' />
                                    </div>
                                    <h3 className='font-pixelify-sans text-xl mb-2'>{pack.name}</h3>
                                    <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>{pack.description}</p>
                                    <div className='flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                        <FaStar className='text-yellow-500' />
                                        <span>{pack.presets} presets included</span>
                                    </div>
                                </div>
                                <div className='mb-6'>
                                    <span className='text-3xl font-bold text-purple-600 dark:text-purple-400'>{pack.price}</span>
                                </div>
                                <a
                                    href='https://store.masarif.id/preset'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='group inline-flex items-center justify-center gap-3 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                    Get This Pack
                                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                </a>
                            </Card>
                        ))}
                    </div>
                </Container>

                {/* CTA Section */}
                <Container className='py-16'>
                    <Card className='p-12 text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white'>
                        <h2 className='font-pixelify-sans text-3xl mb-4'>Ready to Transform Your Photos?</h2>
                        <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
                            Join thousands of photographers who have elevated their work with our professional presets. 
                            Start creating stunning images today.
                        </p>
                        <a
                            href='https://store.masarif.id/preset'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
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