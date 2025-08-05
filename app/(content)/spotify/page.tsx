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

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function SpotifyPage() {
    const { data, isLoading, error } = useSWR<Spotify>('/api/now-playing', fetcher);

    if (error) return <ErrorDisplay />;
    if (isLoading) return <Loading />;

    const pageTitle = data?.isPlaying ? 'Now Playing' : 'Recently Played';
    const description = data?.isPlaying 
        ? 'Arif is currently listening to on Spotify' 
        : 'Arif recently played on Spotify';

    return (
        <>
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                {/* Hero Section with Album Art */}
                <div className='relative h-96 mb-8 overflow-hidden'>
                    <div 
                        className='absolute inset-0 bg-cover bg-center blur-sm scale-110'
                        style={{
                            backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                        }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80' />
                    <Container className='relative h-full flex items-end'>
                        <div className='flex items-end gap-6 text-white'>
                            <div className='relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl'>
                                <img 
                                    src={data?.albumImageUrl ?? ''} 
                                    alt={data?.album ?? 'Album cover'}
                                    className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-black/20' />
                                {data?.isPlaying && (
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                                            <FaPlay className='text-white text-xl ml-1' />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='flex-1 pb-4'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <FaSpotify className='text-[#1DB954] text-2xl' />
                                    <span className='text-sm font-medium uppercase tracking-wider'>
                                        {data?.isPlaying ? 'Now Playing' : 'Recently Played'}
                                    </span>
                                </div>
                                <h1 className='font-pixelify-sans text-4xl md:text-5xl mb-2 leading-tight'>
                                    {data?.title}
                                </h1>
                                <p className='text-xl text-gray-200 mb-1'>{data?.artist}</p>
                                <p className='text-gray-300'>{data?.album} • {data?.releaseDate ? new Date(data.releaseDate).getFullYear() : 'N/A'}</p>
                                
                                {/* Progress Bar for Currently Playing */}
                                {data?.isPlaying && data?.progress && data?.duration && (
                                    <div className='mt-4 max-w-md'>
                                        <div className='flex items-center gap-3 text-sm text-gray-300 mb-2'>
                                            <span>{formatDuration(data.progress)}</span>
                                            <div className='flex-1 h-1 bg-white/20 rounded-full overflow-hidden'>
                                                <div 
                                                    className='h-full bg-white rounded-full transition-all duration-300'
                                                    style={{ width: `${(data.progress / data.duration) * 100}%` }}
                                                />
                                            </div>
                                            <span>{formatDuration(data.duration)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
                <Container as='article' className='py-8'>
                    <h1 className='font-pixelify-sans text-3xl leading-relaxed'>{pageTitle}</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium'>{description}</p>
                            <div className='flex flex-wrap items-center gap-3 pt-4'>
                                <a
                                    href={data?.songUrl ?? '#'}
                                    target='_blank'
                                    rel='noreferrer nofollow noopener'
                                    className='inline-flex px-5 py-3 text-sm'>
                                    Open in Spotify
                                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                </a>
                                {data?.artistInfo && (
                                    <a
                                        href={data.artistInfo.url}
                                        target='_blank'
                                        rel='noreferrer nofollow noopener'
                                        className='inline-flex px-5 py-3 text-sm'>
                                        View Artist
                                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <p>
                                {data?.isPlaying 
                                    ? `Currently listening to "${data.title}" by ${data.artist} from the album "${data.album}".`
                                    : `Recently played "${data?.title}" by ${data?.artist} from the album "${data?.album}".`
                                }
                            </p>
                            {data?.artistInfo && (
                                <p>
                                    {data.artistInfo.name} has {formatFollowers(data.artistInfo.followers)} followers on Spotify
                                    {data.artistInfo.genres.length > 0 && ` and is known for ${data.artistInfo.genres.slice(0, 2).join(' and ')} music`}.
                                </p>
                            )}
                        </div>
                    </div>
                </Container>
                
                <GridLayout layouts={spotifyLayouts} className='-mt-8 pb-16'>
                    <div key="spotify-1">
                        <Card 
                            className='relative group overflow-hidden'
                            style={{
                                backgroundImage: `url(${data?.albumImageUrl ?? ''})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                            <div className='absolute bottom-4 left-4 text-white'>
                                <p className='text-sm opacity-80'>Album Cover</p>
                                <p className='font-pixelify-sans text-lg'>{data?.album}</p>
                            </div>
                            <div className='absolute top-4 right-4'>
                                {data?.isPlaying && (
                                    <div className='w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center'>
                                        <FaPlay className='text-white ml-1' />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div key="spotify-2">
                        <Card className='flex flex-col justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'>
                            {data?.artistInfo ? (
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        {data.artistInfo.images && data.artistInfo.images[0] ? (
                                            <img 
                                                src={data.artistInfo.images[0].url} 
                                                alt={data.artistInfo.name}
                                                className='w-16 h-16 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700'
                                            />
                                        ) : (
                                            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
                                                <FaMusic className='text-white text-xl' />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className='font-pixelify-sans text-xl line-clamp-1'>{data.artistInfo.name}</h3>
                                            <p className='text-sm text-purple-600 dark:text-purple-400 font-medium'>
                                                {formatFollowers(data.artistInfo.followers)} followers
                                            </p>
                                        </div>
                                    </div>
                                    {data.artistInfo.genres.length > 0 && (
                                        <div className='flex flex-wrap gap-1'>
                                            {data.artistInfo.genres.slice(0, 3).map((genre) => (
                                                <span 
                                                    key={genre}
                                                    className='px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium'>
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <FaSpotify className='text-[#1DB954]' size='3rem' />
                                        <div>
                                            <h3 className='font-pixelify-sans text-lg line-clamp-2'>{data?.artist}</h3>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>Artist information unavailable</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div key="spotify-3">
                        <Card className='flex flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center'>
                                        <FaMusic className='text-white' />
                                    </div>
                                    <div>
                                        <h3 className='font-pixelify-sans text-lg line-clamp-2'>{data?.album}</h3>
                                        <p className='text-sm text-blue-600 dark:text-blue-400'>Album</p>
                                    </div>
                                </div>
                                <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-blue-600 dark:text-blue-400'>Tracks:</span>
                                        <span className='font-bold'>{data?.totalTracks}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-blue-600 dark:text-blue-400'>Released:</span>
                                        <span className='font-bold'>{data?.releaseDate ? new Date(data.releaseDate).getFullYear() : 'N/A'}</span>
                                    </div>
                                    {data?.artistInfo && (
                                        <div className='flex justify-between'>
                                            <span className='text-blue-600 dark:text-blue-400'>Popularity:</span>
                                            <span className='font-bold'>{data.artistInfo.popularity}/100</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div key="spotify-4">
                        <Card className='flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'>
                            {data?.progress && data?.duration ? (
                                <>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#1DB954] to-green-600 flex items-center justify-center mb-4'>
                                        <FaPlay className='text-white text-xl ml-1' />
                                    </div>
                                    <div className='w-full bg-green-200 dark:bg-green-800 rounded-full h-3 mb-3 overflow-hidden'>
                                        <div 
                                            className='bg-gradient-to-r from-[#1DB954] to-green-400 h-full rounded-full transition-all duration-300'
                                            style={{ width: `${(data.progress / data.duration) * 100}%` }}
                                        />
                                    </div>
                                    <p className='text-sm font-bold text-center text-green-700 dark:text-green-300'>
                                        {formatDuration(data.progress)} / {formatDuration(data.duration)}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#1DB954] to-green-600 flex items-center justify-center mb-4'>
                                        {data?.isPlaying && (
                                            <div className='inline-flex items-center justify-center gap-1'>
                                                <div className='w-1 h-3 animate-[playing_0.85s_ease_infinite] rounded-full bg-white' />
                                                <div className='w-1 h-4 animate-[playing_0.62s_ease_infinite] rounded-full bg-white' />
                                                <div className='w-1 h-3 animate-[playing_1.26s_ease_infinite] rounded-full bg-white' />
                                            </div>
                                        ) || (
                                            <FaPause className='text-white text-xl' />
                                        )}
                                    </div>
                                    <p className='text-sm font-bold text-center text-green-700 dark:text-green-300'>
                                        {data?.isPlaying ? 'Now Playing' : 'Recently Played'}
                                    </p>
                                </>
                            )}
                        </Card>
                    </div>

                    <div key="spotify-5">
                        <Card className='flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'>
                            {data?.device ? (
                                <>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4'>
                                        <FaHeadphones className='text-white text-xl' />
                                    </div>
                                    <div className='text-center'>
                                        <p className='font-pixelify-sans text-lg mb-1 line-clamp-1'>{data.device.name}</p>
                                        <p className='text-sm text-orange-600 dark:text-orange-400 mb-3 capitalize font-medium'>{data.device.type}</p>
                                        <div className='flex items-center justify-center gap-2'>
                                            <FaVolumeHigh className='text-orange-500 text-sm' />
                                            <div className='w-16 bg-orange-200 dark:bg-orange-800 rounded-full h-2'>
                                                <div 
                                                    className='bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full'
                                                    style={{ width: `${data.device.volume}%` }}
                                                />
                                            </div>
                                            <span className='text-xs font-bold text-orange-600 dark:text-orange-400'>{data.device.volume}%</span>
                                        </div>
                                    </div>
                                </>
                            ) : data?.artistInfo ? (
                                <>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4'>
                                        <FaUsers className='text-white text-xl' />
                                    </div>
                                    <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{formatFollowers(data.artistInfo.followers)}</p>
                                    <p className='text-sm text-blue-500 dark:text-blue-300 text-center font-medium'>Followers</p>
                                </>
                            ) : (
                                <>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mb-4'>
                                        <FaSpotify className='text-white text-xl' />
                                    </div>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 text-center font-medium'>No additional data</p>
                                </>
                            )}
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