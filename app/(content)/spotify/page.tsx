'use client';

import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import { FaX } from 'react-icons/fa6';

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpotifyPage() {
    const { data, isLoading, error } = useSWR<Spotify>('/api/now-playing', fetcher);

    if (error) return <ErrorDisplay />;
    if (isLoading) return <Loading />;

    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container className='py-8'>
                    <div className='mx-auto max-w-md'>
                        {/* Album Cover */}
                        <div 
                            className='aspect-square w-full rounded-3xl bg-cover bg-center shadow-2xl'
                            style={{
                                backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                            }}
                        />
                        
                        {/* Song Info */}
                        <div className='mt-8 text-center'>
                            <h1 className='font-pixelify-sans text-3xl leading-relaxed mb-2'>
                                {data?.title}
                            </h1>
                            <p className='text-xl text-gray-600 dark:text-gray-400 mb-1'>
                                {data?.artist}
                            </p>
                            <p className='text-lg text-gray-500 dark:text-gray-500 mb-6'>
                                {data?.album}
                            </p>
                            
                            {/* Playing Status with Green Animation */}
                            <div className='flex items-center justify-center gap-3 mb-6'>
                                {data?.isPlaying && (
                                    <div className='inline-flex items-center justify-center gap-1'>
                                        <div className='w-1 h-4 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_0.62s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_0.49s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                                    </div>
                                )}
                                <p className='text-lg font-medium text-[#1DB954]'>
                                    {data?.isPlaying ? 'Now Playing' : 'Last Played'}
                                </p>
                            </div>
                            
                            {/* Open in Spotify Button */}
                            <a
                                href={data?.songUrl ?? '#'}
                                target='_blank'
                                rel='nofollow noopener noreferrer'
                                className='inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1DB954] text-white rounded-full font-medium hover:bg-[#1ed760] transition-colors duration-300'>
                                Open in Spotify
                            </a>
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}

function Loading() {
    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container className='py-8'>
                    <div className='mx-auto max-w-md'>
                        <div className='aspect-square w-full rounded-3xl bg-gray-300 animate-pulse' />
                        <div className='mt-8 text-center space-y-4'>
                            <div className='h-8 bg-gray-300 animate-pulse rounded-md mx-auto w-3/4' />
                            <div className='h-6 bg-gray-300 animate-pulse rounded-md mx-auto w-1/2' />
                            <div className='h-5 bg-gray-300 animate-pulse rounded-md mx-auto w-2/3' />
                            <div className='h-12 bg-gray-300 animate-pulse rounded-full mx-auto w-48 mt-8' />
                        </div>
                    </div>
                </Container>
            </main>
        </>
    );
}

function ErrorDisplay() {
    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container className='py-8'>
                    <div className='mx-auto max-w-md text-center'>
                        <h1 className='font-pixelify-sans text-3xl mb-4'>Failed to load</h1>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Unable to fetch Spotify data at the moment.
                        </p>
                    </div>
                </Container>
            </main>
        </>
    );
}