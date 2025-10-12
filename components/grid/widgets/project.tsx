'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import Card from '../../ui/card';
import Anchor from '../../ui/anchor';
import { toKebabCase } from '@/utils/lib';

export default function Project() {
    const projectName = 'Gallery';

    const projectImages = [
        '/projects/gallery/images-1.webp',
        '/projects/dua.webp',
        '/projects/gallery/images-3.webp'
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Ganti gambar otomatis setiap 4 detik dengan smooth transition
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            
            // Delay untuk fade out effect
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
                );
                setIsTransitioning(false);
            }, 300); // 300ms fade out duration
        }, 4000);

        return () => clearInterval(interval);
    }, [projectImages.length]);

    return (
        <Card className='group relative aspect-video overflow-hidden bg-red-100'>
            {/* Background images with crossfade effect */}
            {projectImages.map((image, index) => (
                <Image
                    key={index}
                    src={image}
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className={`object-cover transition-opacity duration-700 ease-in-out ${
                        index === currentImageIndex && !isTransitioning
                            ? 'opacity-100' 
                            : 'opacity-0'
                    }`}
                    unoptimized
                    priority={index === 0}
                    draggable='false'
                />
            ))}

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Slide indicator */}
            <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {projectImages.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-500 ease-in-out ${
                            currentImageIndex === index 
                                ? 'bg-white scale-110' 
                                : 'bg-white/50 scale-100'
                        }`}
                    />
                ))}
            </div>

            {/* Link button */}
            <div className='absolute bottom-3 left-3 z-10'>
                <Anchor
                    className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full backdrop-blur-sm bg-white/90 dark:bg-dark-900/90'
                    href={`/projects/${toKebabCase(projectName)}`}
                    aria-label={projectName}>
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        {projectName}
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </Anchor>
            </div>
        </Card>
    );
}