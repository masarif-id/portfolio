'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Card from '../../ui/card';

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Extract Spotify track ID from URL
const extractTrackId = (url: string): string | null => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
};

export default function Spotify() {
    const { data, isLoading, error } = useSWR<Spotify>('/api/now-playing', fetcher);
    const router = useRouter();

    const handleClick = () => {
        if (data?.songUrl) {
            const trackId = extractTrackId(data.songUrl);
            if (trackId) {
                // Store track info in localStorage for the detail page
                localStorage.setItem('currentTrackInfo', JSON.stringify({
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    albumImageUrl: data.albumImageUrl,
                    songUrl: data.songUrl
                }));
                
                router.push(`/spotify/${trackId}`);
            }
        }
    };

    if (error) return <ErrorDisplay />;
    if (isLoading) return <Loading />;

    return (
        <Card
            onClick={handleClick}
            style={{
                backgroundImage: `
                    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1)),
                    url(${data?.albumImageUrl ?? ''})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className='flex h-full flex-col justify-end gap-3 bg-cover cursor-pointer hover:scale-[1.02] transition-transform duration-200'>
            <div className='text-dark-50 px-8'>
                <h2
                    className='font-pixelify-sans line-clamp-2 text-2xl md:line-clamp-1 lg:line-clamp-2'
                    title={data?.title}>
                    <span className='cancel-drag'>
                        {data?.title}
                    </span>
                </h2>
                <p className='truncate font-medium' title={data?.artist}>
                    {data?.artist}
                </p>
            </div>
            <CardFooter isPlaying={data?.isPlaying} />
        </Card>
    );
}

function LoadingText({ className }: Readonly<{ className?: string }>) {
    return (
        <div className={`${className} h-4 animate-pulse rounded-md bg-gray-300`}>
            <span className='invisible'>Placeholder</span>
        </div>
    );
}

function CardFooter({ isPlaying }: Readonly<{ isPlaying?: boolean }>) {
    return (
        <div className='border-dark-50 text-dark-400 dark:border-dark-800 dark:bg-dark-900 flex items-center gap-3 border-t bg-white px-8 py-2'>
            {isPlaying && (
                <div className='inline-flex items-center justify-center gap-1'>
                    <div className='w-1 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                    <div className='w-1 animate-[playing_0.62s_ease_infinite] rounded-full bg-[#1DB954]' />
                    <div className='w-1 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                    <div className='w-1 animate-[playing_0.85s_ease_infinite] rounded-full bg-[#1DB954]' />
                    <div className='w-1 animate-[playing_0.49s_ease_infinite] rounded-full bg-[#1DB954]' />
                    <div className='w-1 animate-[playing_1.26s_ease_infinite] rounded-full bg-[#1DB954]' />
                </div>
            )}
            <p className='text-sm'>{isPlaying ? 'Now Playing' : 'Offline. Last Played'}</p>
        </div>
    );
}

function Loading() {
    return (
        <Card className='flex h-full flex-col justify-end gap-2'>
            <div className='flex flex-col gap-3 px-8'>
                <LoadingText className='h-6' />
                <LoadingText />
            </div>
            <CardFooter />
        </Card>
    );
}

function ErrorDisplay() {
    return (
        <Card className='flex h-full flex-col justify-end gap-3'>
            <div className='flex flex-col gap-3 px-8'>
                <h2 className='font-pixelify-sans text-2xl'>Failed to load</h2>
                <p className='font-medium'>Failed to load</p>
            </div>
            <CardFooter />
        </Card>
    );
}