'use client';

import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import GridLayout from '@/components/grid/layout';
import { FaX, FaSpotify, FaArrowRight, FaUsers, FaPlay, FaPause, FaMusic, FaHeadphones, FaVolumeHigh, FaShuffle, FaRepeat, FaClock, FaCalendar, FaHeart, FaShare } from 'react-icons/fa6';
import { spotifyLayouts } from '@/config/grid';

interface ArtistInfo {
    name: string;
    genres: string[];
    images: Array<{ url: string }>;
    followers: number;
    url: string;
    popularity: number;
}

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
    duration: number;
    trackNumber: number;
    explicit: boolean;
    previewUrl?: string;
    releaseDate: string;
    totalTracks: number;
    progress?: number;
    device?: {
        name: string;
        type: string;
        volume: number;
    };
    shuffleState?: boolean;
    repeatState?: string;
    playedAt?: string;
    context?: {
        type: string;
        href: string;
    };
    artistInfo?: ArtistInfo | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};

const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function SpotifyPage() {
    const { data, error, isLoading } = useSWR<Spotify>('/api/now-playing', fetcher, {
        refreshInterval: 5000,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorDisplay />;

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
                            <p className='text-xl leading-relaxed font-medium'>
                                {data?.isPlaying ? 'Currently Playing' : 'Recently Played'}
                            </p>
                            <h2 className='font-pixelify-sans text-2xl mt-2'>{data?.title}</h2>
                            <p className='text-gray-600 dark:text-gray-400'>by {data?.artist}</p>
                            <p className='text-gray-600 dark:text-gray-400'>from {data?.album}</p>
                            <div className='flex flex-wrap items-center gap-3 pt-4'>
                                <Anchor
                                    href={data?.songUrl ?? '#'}
                                    target='_blank'
                                    rel='noreferrer nofollow noopener'
                                    className='inline-flex px-5 py-3 text-sm'>
                                    <FaSpotify />
                                    Open in Spotify
                                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                </Anchor>
                            </div>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                This page shows what I&apos;m currently listening to on Spotify, 
                                or the last track I played if nothing is currently playing.
                            </p>
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`spotify-${i}`}>
                            <Card className='flex items-center justify-center p-6'>
                                <p className='text-gray-600 dark:text-gray-400'>Spotify Widget {i}</p>
                            </Card>
                        </div>
                    ))}
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
                            <div className='h-20 bg-gray-300 animate-pulse rounded-lg w-full' />
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
                            <Card className='bg-gray-300 animate-pulse'>
                                <div className='w-full h-full' />
                            </Card>
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