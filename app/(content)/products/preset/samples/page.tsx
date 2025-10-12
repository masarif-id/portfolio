import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import ImageSlider from '@/components/ui/image-slider';
import { FaX, FaArrowLeft } from 'react-icons/fa6';

export const metadata = {
    title: 'Preset Samples — Lightroom Preset',
    description: 'See before and after examples of our professional Lightroom presets. Compare the transformations and find your perfect style.',
};

export default function PresetSamplesPage() {
    const samples = [
        {
            id: 1,
            name: 'Cinematic Mood',
            before: '/projects/gallery/images-1.webp',
            after: '/projects/gallery/images-2.webp',
            description: 'Dramatic film-inspired tones with rich contrast'
        },
        {
            id: 2,
            name: 'Portrait Warmth',
            before: '/projects/gallery/images-3.webp',
            after: '/projects/gallery/images-4.webp',
            description: 'Natural skin tones with warm, inviting colors'
        },
        {
            id: 3,
            name: 'Landscape Vibrance',
            before: '/projects/gallery/images-5.webp',
            after: '/projects/gallery/images-1.webp',
            description: 'Enhanced nature colors with balanced saturation'
        },
        {
            id: 4,
            name: 'Urban Grit',
            before: '/projects/gallery/images-2.webp',
            after: '/projects/gallery/images-3.webp',
            description: 'Moody street photography with deep shadows'
        },
        {
            id: 5,
            name: 'Golden Hour',
            before: '/projects/gallery/images-4.webp',
            after: '/projects/gallery/images-5.webp',
            description: 'Warm sunset tones with soft highlights'
        },
        {
            id: 6,
            name: 'Vintage Film',
            before: '/projects/gallery/images-1.webp',
            after: '/projects/gallery/images-3.webp',
            description: 'Classic film look with faded colors'
        }
    ];

    return (
        <>
            <header className='flex items-center justify-between pt-10 px-6'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/products/preset'>
                    <FaArrowLeft />
                    <div className='sr-only'>Back</div>
                </Anchor>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container className='py-16'>
                    <div className='text-center mb-16'>
                        <h1 className='font-pixelify-sans text-5xl leading-tight mb-6 max-md:text-4xl'>
                            Preset Samples
                        </h1>
                        <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                            Drag the slider to compare before and after. See the magic of professional color grading.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {samples.map((sample) => (
                            <div key={sample.id} className='space-y-4'>
                                <ImageSlider
                                    beforeImage={sample.before}
                                    afterImage={sample.after}
                                    alt={sample.name}
                                />
                                <div className='text-center'>
                                    <h2 className='font-pixelify-sans text-xl mb-1'>{sample.name}</h2>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{sample.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='text-center mt-16'>
                        <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                            Ready to transform your photos with these presets?
                        </p>
                        <div className='flex flex-wrap justify-center gap-4'>
                            <a
                                href='https://store.masarif.id/preset'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105'>
                                Get Presets Now
                            </a>
                            <a
                                href='https://tes.masarif.id'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium text-lg transition-all duration-300 hover:border-black dark:hover:border-white'>
                                Test Presets First
                            </a>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}
