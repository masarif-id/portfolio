'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
    beforeImage: string;
    afterImage: string;
    alt: string;
}

export default function ImageSlider({ beforeImage, afterImage, alt }: ImageSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (clientX: number, rect: DOMRect) => {
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseDown = () => setIsDragging(true);

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        handleMove(e.clientX, rect);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleMove(e.touches[0].clientX, rect);
    };

    return (
        <div
            className='relative w-full aspect-[4/3] select-none overflow-hidden rounded-lg'
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}>
            <div className='relative w-full h-full'>
                <Image src={afterImage} alt={`${alt} - After`} fill className='object-cover' sizes='100vw' />
            </div>

            <div
                className='absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden'
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <Image src={beforeImage} alt={`${alt} - Before`} fill className='object-cover' sizes='100vw' />
            </div>

            <div
                className='absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize'
                style={{ left: `calc(${sliderPosition}% - 1px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-gray-800'>
                        <path d='M18 8L22 12L18 16' />
                        <path d='M6 8L2 12L6 16' />
                    </svg>
                </div>
            </div>

            <div
                className='absolute top-4 left-4 px-3 py-1 bg-black/70 text-white rounded-full text-sm font-medium'
                style={{ opacity: sliderPosition > 20 ? 1 : 0 }}>
                Before
            </div>

            <div
                className='absolute top-4 right-4 px-3 py-1 bg-black/70 text-white rounded-full text-sm font-medium'
                style={{ opacity: sliderPosition < 80 ? 1 : 0 }}>
                After
            </div>
        </div>
    );
}
