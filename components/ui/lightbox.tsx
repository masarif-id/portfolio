'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaX, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface LightboxProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center'>
            <button
                onClick={onClose}
                className='absolute top-6 right-6 text-white hover:scale-110 transition-transform z-10'
                aria-label='Close'>
                <FaX size={24} />
            </button>

            <button
                onClick={handlePrevious}
                className='absolute left-6 text-white hover:scale-110 transition-transform z-10'
                aria-label='Previous'>
                <FaChevronLeft size={40} />
            </button>

            <button
                onClick={handleNext}
                className='absolute right-6 text-white hover:scale-110 transition-transform z-10'
                aria-label='Next'>
                <FaChevronRight size={40} />
            </button>

            <div className='relative w-full h-full max-w-5xl max-h-[90vh] p-12'>
                <Image
                    src={images[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    fill
                    className='object-contain'
                    sizes='100vw'
                    priority
                />
            </div>

            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm'>
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
