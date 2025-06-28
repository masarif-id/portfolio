'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';

interface CanvasData {
    canvas_url?: string;
    error?: string;
}

interface LyricsData {
    lyrics?: string;
    error?: string;
}

interface TrackInfo {
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpotifyTrackPage() {
    const params = useParams();
    const router = useRouter();
    const trackId = params.trackId as string;
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);

    // Fetch canvas and lyrics data
    const { data: canvasData } = useSWR<CanvasData>(
        trackId ? `/api/spotify-canvas?id=${trackId}` : null,
        fetcher
    );
    
    const { data: lyricsData } = useSWR<LyricsData>(
        trackId ? `/api/spotify-lyrics?id=${trackId}` : null,
        fetcher
    );

    // Get track info from localStorage (set by the widget)
    useEffect(() => {
        const storedTrackInfo = localStorage.getItem('currentTrackInfo');
        if (storedTrackInfo) {
            setTrackInfo(JSON.parse(storedTrackInfo));
        }
    }, []);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    return (
        <Container className="min-h-screen py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-dark-900 shadow-md hover:shadow-lg transition-shadow">
                    <FaArrowLeft />
                    <span>Back</span>
                </button>
                
                {trackInfo && (
                    <div className="text-center">
                        <h1 className="font-pixelify-sans text-2xl md:text-3xl">{trackInfo.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{trackInfo.artist}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Canvas Video Section */}
                <Card className="relative aspect-square overflow-hidden">
                    {canvasData?.canvas_url ? (
                        <div className="relative w-full h-full">
                            <video
                                src={canvasData.canvas_url}
                                autoPlay
                                loop
                                muted={isMuted}
                                className="w-full h-full object-cover"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                            
                            {/* Video Controls */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <button
                                    onClick={handlePlayPause}
                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </button>
                                
                                <button
                                    onClick={handleMuteToggle}
                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            {trackInfo?.albumImageUrl ? (
                                <img
                                    src={trackInfo.albumImageUrl}
                                    alt={trackInfo.album}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>Canvas video not available</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Lyrics Section */}
                <Card className="p-8">
                    <h2 className="font-pixelify-sans text-xl mb-6">Lyrics</h2>
                    <div className="max-h-96 overflow-y-auto">
                        {lyricsData?.lyrics ? (
                            <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
                                {lyricsData.lyrics}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Lyrics not available</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Track Info Card */}
            {trackInfo && (
                <Card className="mt-8 p-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={trackInfo.albumImageUrl}
                            alt={trackInfo.album}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-pixelify-sans text-lg">{trackInfo.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{trackInfo.artist}</p>
                            <p className="text-sm text-gray-500">{trackInfo.album}</p>
                        </div>
                        <a
                            href={trackInfo.songUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-colors">
                            Open in Spotify
                        </a>
                    </div>
                </Card>
            )}
        </Container>
    );
}