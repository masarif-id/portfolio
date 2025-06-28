'use client';

import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import GridLayout from '@/components/grid/layout';
import { FaX, FaSpotify, FaArrowRight } from 'react-icons/fa6';
import { spotifyLayouts } from '@/config/grid';

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
                    <h1 className='font-pixelify-sans text-3xl leading-relaxed mb-4'>Now Playing</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium mb-4'>
                                {data?.isPlaying ? 'Currently listening to' : 'Last played track'} on Spotify
                            </p>
                            <div className='space-y-3'>
                                <div>
                                    <h2 className='font-pixelify-sans text-2xl'>{data?.title}</h2>
                                    <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>{data?.artist}</p>
                                    <p className='text-gray-600 dark:text-gray-400'>{data?.album}</p>
                                </div>
                                
                                {/* Playing Status */}
                                <div className='flex items-center gap-3 py-4'>
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
                                    <p className='text-[#1DB954] font-medium'>
                                        {data?.isPlaying ? 'Now Playing' : 'Offline'}
                                    </p>
                                </div>

                                {/* Spotify Link */}
                                <div className='flex flex-wrap items-center gap-3 pt-4'>
                                    <a
                                        href={data?.songUrl ?? '#'}
                                        target='_blank'
                                        rel='noreferrer nofollow noopener'
                                        className='group inline-flex items-center justify-center gap-3 px-5 py-3 text-sm bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-all duration-300'>
                                        <FaSpotify />
                                        Open in Spotify
                                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                This shows my current or most recently played track from Spotify. 
                                The data is fetched in real-time from the Spotify API and updates automatically.
                            </p>
                            <p>
                                You can click the button above to open the track directly in your Spotify app 
                                and continue listening from where you left off.
                            </p>
                        </div>
                    </div>
                </Container>
                
                {/* Grid Layout for Spotify Views */}
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    
                    {/* Album Cover Large */}
                    <div key="spotify-1">
                        <Card 
                            className='relative'
                            style={{
                                backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                        </Card>
                    </div>

                    {/* Song Info Card */}
                    <div key="spotify-2">
                        <Card className='flex flex-col justify-center p-6'>
                            <div className='space-y-3'>
                                <h3 className='font-pixelify-sans text-lg line-clamp-2'>{data?.title}</h3>
                                <p className='font-medium text-gray-800 dark:text-gray-200 line-clamp-1'>{data?.artist}</p>
                                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>{data?.album}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Spotify Action */}
                    <div key="spotify-3">
                        <Card className='flex flex-col items-center justify-center p-6 bg-[#1DB954] text-white'>
                            <FaSpotify size='2rem' className='mb-3' />
                            <p className='text-sm font-medium text-center'>Listen on Spotify</p>
                        </Card>
                    </div>

                    {/* Playing Status */}
                    <div key="spotify-4">
                        <Card className='flex flex-col items-center justify-center p-6'>
                            <div className='flex items-center gap-3 mb-3'>
                                {data?.isPlaying && (
                                    <div className='inline-flex items-center justify-center gap-1'>
                                        <div className='w-1 h-4 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_0.62s_ease_infinite] rounded-full bg-[#1DB954]' />
                                        <div className='w-1 h-4 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                                    </div>
                                )}
                            </div>
                            <p className='text-sm font-medium text-center text-[#1DB954]'>
                                {data?.isPlaying ? 'Now Playing' : 'Last Played'}
                            </p>
                        </Card>
                    </div>

                    {/* Album Cover Small */}
                    <div key="spotify-5">
                        <Card 
                            className='relative'
                            style={{
                                backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                        </Card>
                    </div>

                </GridLayout>
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
                <Container as='article' className='py-8'>
                    <div className='h-6 bg-gray-300 animate-pulse rounded-md w-32 mb-4' />
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div className='space-y-4'>
                            <div className='h-6 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-8 bg-gray-300 animate-pulse rounded-md w-3/4' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-1/2' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-2/3' />
                        </div>
                        <div className='space-y-3'>
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-full' />
                            <div className='h-4 bg-gray-300 animate-pulse rounded-md w-3/4' />
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`spotify-${i}`}>
                            <Card className='bg-gray-300 animate-pulse' />
                        </div>
                    ))}
                </GridLayout>
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
                <Container as='article' className='py-8'>
                    <h1 className='font-pixelify-sans text-3xl leading-relaxed mb-4'>Spotify</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium text-red-600 dark:text-red-400'>
                                Failed to load Spotify data
                            </p>
                            <p className='text-gray-600 dark:text-gray-400 mt-2'>
                                Unable to fetch current playing track. Please try again later.
                            </p>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                There was an error connecting to the Spotify API. 
                                This could be due to network issues or API limitations.
                            </p>
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`spotify-${i}`}>
                            <Card className='flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/20'>
                                <p className='text-red-600 dark:text-red-400 text-sm'>Failed to load</p>
                            </Card>
                        </div>
                    ))}
                </GridLayout>
            </main>
        </>
    );
}