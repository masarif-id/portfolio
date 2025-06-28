'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import Card from '../../ui/card';
import Anchor from '../../ui/anchor';
import { toKebabCase } from '@/utils/lib';

import projectImage1 from '@/public/projects/satu.webp';
import projectImage2 from '@/public/projects/dua.webp';
import projectImage3 from '@/public/projects/tiga.webp';

export default function Project() {
    const projectName = 'Gallery';

    const projectImages = [projectImage1, projectImage2, projectImage3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Ganti gambar otomatis setiap 4 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [projectImages.length]);

    return (
        <Card className='group relative aspect-video overflow-hidden bg-red-100'>
            <Image
                key={currentImageIndex}
                src={projectImages[currentImageIndex]}
                alt={toKebabCase(projectName)}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover transition-opacity duration-500 ease-in-out'
                placeholder='blur'
                priority
                draggable='false'
            />

            {/* Slide indicator */}
            <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                {projectImages.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${
                            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>

            {/* Link button */}
            <div className='absolute bottom-3 left-3'>
                <Anchor
                    className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full'
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
