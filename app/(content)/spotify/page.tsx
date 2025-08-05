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
    const { data, error, isLoading } = useSWR<Spotify>('/api/spotify', fetcher, {
        refreshInterval: 5000,
        revalidateOnFocus: false,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorDisplay />;

    return (
        <main className='relative h-screen overflow-hidden'>
            {/* Background Image with Blur */}
            <div 
                className='absolute inset-0 bg-cover bg-center blur-sm scale-110'
                style={{
                    backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                }}
            />
            
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80' />
            
            {/* Close Button */}
            <div className='absolute top-6 left-1/2 transform -translate-x-1/2 z-10 md:top-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </div>
            
            {/* Content */}
            <div className='relative h-full flex items-center justify-center px-4 md:px-8'>
                <div className='max-w-4xl w-full text-center text-white'>
                    {/* Album Cover */}
                    <div className='relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 mx-auto mb-6 md:mb-8 rounded-2xl overflow-hidden shadow-2xl'>
                        <img 
                            src={data?.albumImageUrl ?? ''} 
                            alt={data?.album ?? 'Album cover'}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-black/20' />
                        {data?.isPlaying && (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                                    <FaPlay className='text-white text-lg md:text-xl ml-1' />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className='flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6'>
                        <FaSpotify className='text-[#1DB954] text-xl md:text-2xl' />
                        <span className='text-xs md:text-sm font-medium uppercase tracking-wider opacity-90'>
                            {data?.isPlaying ? 'Now Playing' : 'Recently Played'}
                        </span>
                    </div>
                    
                    {/* Song Title */}
                    <h1 className='font-pixelify-sans text-2xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 md:mb-4 leading-tight px-4'>
                        {data?.title}
                    </h1>
                    
                    {/* Artist */}
                    <p className='text-lg md:text-xl lg:text-2xl text-gray-200 mb-2 md:mb-3 px-4'>
                        {data?.artist}
                    </p>
                    
                    {/* Album & Year */}
                    <p className='text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 px-4'>
                        {data?.album} • {data?.releaseDate ? new Date(data.releaseDate).getFullYear() : 'N/A'}
                    </p>
                    
                    {/* Progress Bar for Currently Playing */}
                    {data?.isPlaying && data?.progress && data?.duration && (
                        <div className='max-w-md mx-auto mb-6 md:mb-8 px-4'>
                            <div className='flex items-center gap-3 text-xs md:text-sm text-gray-300 mb-2'>
                                <span>{formatDuration(data.progress)}</span>
                                <div className='flex-1 h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden'>
                                    <div 
                                        className='h-full bg-white rounded-full transition-all duration-300'
                                        style={{ width: `${(data.progress / data.duration) * 100}%` }}
                                    />
                                </div>
                                <span>{formatDuration(data.duration)}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4'>
                        <a
                            href={data?.songUrl ?? '#'}
                            target='_blank'
                            rel='noreferrer nofollow noopener'
                            className='group inline-flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full font-medium text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto'>
                            <FaSpotify />
                            Open in Spotify
                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                        </a>
                        
                        {data?.artistInfo && (
                            <a
                                href={data.artistInfo.url}
                                target='_blank'
                                rel='noreferrer nofollow noopener'
                                className='group inline-flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto'>
                                <FaMusic />
                                View Artist
                                <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                            </a>
                        )}
                    </div>
                    
                    {/* Additional Info */}
                    {data?.artistInfo && (
                        <div className='mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4'>
                            <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium'>
                                {formatFollowers(data.artistInfo.followers)} followers
                            </span>
                            {data.artistInfo.genres.slice(0, 2).map((genre) => (
                                <span 
                                    key={genre}
                                    className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium capitalize'>
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
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