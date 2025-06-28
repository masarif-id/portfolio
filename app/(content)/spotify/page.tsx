'use client';

import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaX, FaSpotify } from 'react-icons/fa6';

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
                <Container as='article' className='py-8'>
                    <div className='grid grid-cols-1 gap-8 max-w-2xl mx-auto'>
                        
                        {/* Album Cover Card */}
                        <Card className='p-8'>
                            <div className='flex flex-col items-center gap-6'>
                                <div 
                                    className='relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl bg-cover bg-center'
                                    style={{
                                        backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                    }}>
                                </div>
                                
                                {/* Playing Status with Green Animation */}
                                <div className='flex items-center justify-center gap-3'>
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
                            </div>
                        </Card>

                        {/* Song Info Card */}
                        <Card className='p-8'>
                            <div className='text-center space-y-4'>
                                <h1 className='font-pixelify-sans text-3xl leading-relaxed'>
                                    {data?.title}
                                </h1>
                                <div className='space-y-2'>
                                    <p className='text-xl font-medium text-gray-800 dark:text-gray-200'>
                                        {data?.artist}
                                    </p>
                                    <p className='text-lg text-gray-600 dark:text-gray-400'>
                                        {data?.album}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Spotify Action Card */}
                        <Card className='p-8'>
                            <div className='text-center space-y-6'>
                                <div className='flex justify-center'>
                                    <div className='p-4 bg-[#1DB954] rounded-full'>
                                        <FaSpotify size='2rem' color='white' />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='font-pixelify-sans text-xl mb-2'>Listen on Spotify</h2>
                                    <p className='text-gray-600 dark:text-gray-400 mb-6'>
                                        Open this track in your Spotify app to continue listening.
                                    </p>
                                </div>
                                <a
                                    href={data?.songUrl ?? '#'}
                                    target='_blank'
                                    rel='nofollow noopener noreferrer'
                                    className='inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1DB954] text-white rounded-full font-medium hover:bg-[#1ed760] transition-colors duration-300 hover:scale-105 transform'>
                                    <FaSpotify />
                                    Open in Spotify
                                </a>
                            </div>
                        </Card>

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
                    <div className='grid grid-cols-1 gap-8 max-w-2xl mx-auto'>
                        
                        {/* Album Cover Card Loading */}
                        <Card className='p-8'>
                            <div className='flex flex-col items-center gap-6'>
                                <div className='w-64 h-64 rounded-2xl bg-gray-300 animate-pulse' />
                                <div className='h-6 bg-gray-300 animate-pulse rounded-md w-32' />
                            </div>
                        </Card>

                        {/* Song Info Card Loading */}
                        <Card className='p-8'>
                            <div className='text-center space-y-4'>
                                <div className='h-8 bg-gray-300 animate-pulse rounded-md mx-auto w-3/4' />
                                <div className='h-6 bg-gray-300 animate-pulse rounded-md mx-auto w-1/2' />
                                <div className='h-5 bg-gray-300 animate-pulse rounded-md mx-auto w-2/3' />
                            </div>
                        </Card>

                        {/* Action Card Loading */}
                        <Card className='p-8'>
                            <div className='text-center space-y-6'>
                                <div className='w-16 h-16 bg-gray-300 animate-pulse rounded-full mx-auto' />
                                <div className='space-y-2'>
                                    <div className='h-6 bg-gray-300 animate-pulse rounded-md mx-auto w-48' />
                                    <div className='h-4 bg-gray-300 animate-pulse rounded-md mx-auto w-64' />
                                </div>
                                <div className='h-12 bg-gray-300 animate-pulse rounded-full mx-auto w-48' />
                            </div>
                        </Card>

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
                    <div className='grid grid-cols-1 gap-8 max-w-2xl mx-auto'>
                        
                        <Card className='p-8'>
                            <div className='text-center space-y-4'>
                                <div className='p-4 bg-red-100 dark:bg-red-900/20 rounded-full w-fit mx-auto'>
                                    <FaSpotify size='2rem' className='text-red-600 dark:text-red-400' />
                                </div>
                                <h1 className='font-pixelify-sans text-2xl'>Failed to load</h1>
                                <p className='text-gray-600 dark:text-gray-400'>
                                    Unable to fetch Spotify data at the moment. Please try again later.
                                </p>
                            </div>
                        </Card>

                    </div>
                </Container>
            </main>
        </>
    );
}