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
    const { data: canvasData, error: canvasError, isLoading: canvasLoading } = useSWR<CanvasData>(
        trackId ? `/api/spotify-canvas?id=${trackId}` : null,
        fetcher
    );
    
    const { data: lyricsData, error: lyricsError, isLoading: lyricsLoading } = useSWR<LyricsData>(
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

    // Debug logging
    useEffect(() => {
        console.log('Track ID:', trackId);
        console.log('Canvas data:', canvasData);
        console.log('Canvas error:', canvasError);
        console.log('Lyrics data:', lyricsData);
        console.log('Lyrics error:', lyricsError);
        console.log('Track info:', trackInfo);
    }, [trackId, canvasData, canvasError, lyricsData, lyricsError, trackInfo]);

    const handlePlayPause = () => {
        const video = document.querySelector('video') as HTMLVideoElement;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = () => {
        const video = document.querySelector('video') as HTMLVideoElement;
        if (video) {
            video.muted = !isMuted;
            setIsMuted(!isMuted);
        }
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

            {/* Debug Info */}
            <Card className="mb-8 p-4 bg-gray-100 dark:bg-dark-800">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <p>Track ID: {trackId}</p>
                <p>Canvas Loading: {canvasLoading ? 'Yes' : 'No'}</p>
                <p>Canvas URL: {canvasData?.canvas_url || 'Not available'}</p>
                <p>Canvas Error: {canvasData?.error || 'None'}</p>
                <p>Lyrics Loading: {lyricsLoading ? 'Yes' : 'No'}</p>
                <p>Lyrics Available: {lyricsData?.lyrics ? 'Yes' : 'No'}</p>
                <p>Lyrics Error: {lyricsData?.error || 'None'}</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Canvas Video Section */}
                <Card className="relative aspect-square overflow-hidden">
                    {canvasLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : canvasData?.canvas_url ? (
                        <div className="relative w-full h-full">
                            <video
                                src={canvasData.canvas_url}
                                autoPlay
                                loop
                                muted={isMuted}
                                className="w-full h-full object-cover"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onError={(e) => console.error('Video error:', e)}
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
                                    {isMuted ? <FaVolumeUp /> : <FaVolumeMute />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            {trackInfo?.albumImageUrl ? (
                                <img
                                    src={trackInfo.albumImageUrl}
                                    alt={trackInfo.album}
                                    className="w-48 h-48 object-cover rounded-lg mb-4"
                                />
                            ) : null}
                            <p className="text-gray-500 mb-2">Canvas video not available</p>
                            {canvasData?.error && (
                                <p className="text-red-500 text-sm">{canvasData.error}</p>
                            )}
                        </div>
                    )}
                </Card>

                {/* Lyrics Section */}
                <Card className="p-8">
                    <h2 className="font-pixelify-sans text-xl mb-6">Lyrics</h2>
                    <div className="max-h-96 overflow-y-auto">
                        {lyricsLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : lyricsData?.lyrics ? (
                            <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
                                {lyricsData.lyrics}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Lyrics not available</p>
                                {lyricsData?.error && (
                                    <p className="text-red-500 text-sm mt-2">{lyricsData.error}</p>
                                )}
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