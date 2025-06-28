'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaX, FaSpotify, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const spotifyViews = [
    { id: 'cover', title: 'Album Cover' },
    { id: 'info', title: 'Song Info' },
    { id: 'action', title: 'Spotify Action' }
];

export default function SpotifyPage() {
    const { data, isLoading, error } = useSWR<Spotify>('/api/now-playing', fetcher);
    const [currentView, setCurrentView] = useState(0);

    const nextView = () => {
        setCurrentView((prev) => (prev + 1) % spotifyViews.length);
    };

    const prevView = () => {
        setCurrentView((prev) => (prev - 1 + spotifyViews.length) % spotifyViews.length);
    };

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
                    <div className='max-w-2xl mx-auto'>
                        
                        {/* Navigation Header */}
                        <div className='flex items-center justify-between mb-8'>
                            <button
                                onClick={prevView}
                                className='p-3 rounded-full bg-white dark:bg-dark-900 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50'
                                disabled={currentView === 0}>
                                <FaChevronLeft />
                            </button>
                            
                            <div className='text-center'>
                                <h1 className='font-pixelify-sans text-2xl mb-2'>Spotify</h1>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    {spotifyViews[currentView].title} ({currentView + 1} of {spotifyViews.length})
                                </p>
                            </div>
                            
                            <button
                                onClick={nextView}
                                className='p-3 rounded-full bg-white dark:bg-dark-900 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50'
                                disabled={currentView === spotifyViews.length - 1}>
                                <FaChevronRight />
                            </button>
                        </div>

                        {/* View Content */}
                        <div className='relative overflow-hidden'>
                            <div 
                                className='flex transition-transform duration-500 ease-in-out'
                                style={{ transform: `translateX(-${currentView * 100}%)` }}>
                                
                                {/* Album Cover View */}
                                <div className='w-full flex-shrink-0'>
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
                                </div>

                                {/* Song Info View */}
                                <div className='w-full flex-shrink-0'>
                                    <Card className='p-8'>
                                        <div className='text-center space-y-6'>
                                            <div className='space-y-4'>
                                                <h2 className='font-pixelify-sans text-3xl leading-relaxed'>
                                                    {data?.title}
                                                </h2>
                                                <div className='space-y-2'>
                                                    <p className='text-xl font-medium text-gray-800 dark:text-gray-200'>
                                                        {data?.artist}
                                                    </p>
                                                    <p className='text-lg text-gray-600 dark:text-gray-400'>
                                                        {data?.album}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Small album cover */}
                                            <div className='flex justify-center'>
                                                <div 
                                                    className='w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-cover bg-center'
                                                    style={{
                                                        backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                                    }}>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Spotify Action View */}
                                <div className='w-full flex-shrink-0'>
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
                                            
                                            {/* Song info preview */}
                                            <div className='mt-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-xl'>
                                                <p className='text-sm font-medium truncate'>{data?.title}</p>
                                                <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>{data?.artist}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                            </div>
                        </div>

                        {/* Dots indicator */}
                        <div className='flex justify-center gap-2 mt-8'>
                            {spotifyViews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentView(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        currentView === index 
                                            ? 'bg-[#1DB954] scale-125' 
                                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                                />
                            ))}
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
                    <div className='max-w-2xl mx-auto'>
                        
                        {/* Navigation Header Loading */}
                        <div className='flex items-center justify-between mb-8'>
                            <div className='w-12 h-12 bg-gray-300 animate-pulse rounded-full' />
                            <div className='text-center'>
                                <div className='h-6 bg-gray-300 animate-pulse rounded-md w-24 mx-auto mb-2' />
                                <div className='h-4 bg-gray-300 animate-pulse rounded-md w-32 mx-auto' />
                            </div>
                            <div className='w-12 h-12 bg-gray-300 animate-pulse rounded-full' />
                        </div>

                        {/* Content Loading */}
                        <Card className='p-8'>
                            <div className='flex flex-col items-center gap-6'>
                                <div className='w-64 h-64 rounded-2xl bg-gray-300 animate-pulse' />
                                <div className='h-6 bg-gray-300 animate-pulse rounded-md w-32' />
                            </div>
                        </Card>

                        {/* Dots Loading */}
                        <div className='flex justify-center gap-2 mt-8'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='w-3 h-3 bg-gray-300 animate-pulse rounded-full' />
                            ))}
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
                    <div className='max-w-2xl mx-auto'>
                        
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