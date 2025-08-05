import { NextResponse } from 'next/server';

interface SpotifyTrack {
    name: string;
    duration_ms: number;
    track_number: number;
    explicit: boolean;
    preview_url?: string;
    album: {
        name: string;
        release_date: string;
        total_tracks: number;
        artists: Array<{ name: string }>;
        images: Array<{ url: string }>;
    };
    external_urls: {
        spotify: string;
    };
    artists: Array<{
        id: string;
        name: string;
        external_urls: {
            spotify: string;
        };
    }>;
}

interface SpotifyApi {
    is_playing: boolean;
    progress_ms?: number;
    device?: {
        name: string;
        type: string;
        volume_percent: number;
    };
    shuffle_state?: boolean;
    repeat_state?: string;
    currently_playing_type?: string;
    item?: SpotifyTrack;
    items?: Array<{ 
        track: SpotifyTrack;
        played_at: string;
        context?: {
            type: string;
            href: string;
        };
    }>;
}

interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    images: Array<{ url: string }>;
    followers: {
        total: number;
    };
    external_urls: {
        spotify: string;
    };
    popularity: number;
}

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN ?? '';

// Check if required environment variables are present
// if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
//     console.error('Missing required Spotify environment variables');
// }

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const getBasicToken = () => Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

const getAccessToken = async (): Promise<string> => {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${getBasicToken()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: SPOTIFY_REFRESH_TOKEN,
        }).toString(),
    });

    const data = await response.json();
    return data.access_token;
};

const fetchSpotifyData = async (url: string, accessToken: string): Promise<SpotifyApi> => {
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
};

const getArtistInfo = async (artistId: string, accessToken: string): Promise<SpotifyArtist | null> => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        return null;
    }
};

const formatResponse = async (data: SpotifyApi, accessToken: string) => {
    const isCurrentlyPlaying = !!data.item;
    const track = data.item ?? data.items?.[0]?.track;
    const playedAt = data.items?.[0]?.played_at;
    const context = data.items?.[0]?.context;
    
    if (!track) {
        throw new Error('No track data available');
    }

    // Get artist ID from the first artist
    const firstArtist = track.artists?.[0];
    let artistInfo = null;

    if (firstArtist) {
        const artistId = firstArtist.id;
        if (artistId) {
            artistInfo = await getArtistInfo(artistId, accessToken);
        }
    }

    return {
        isPlaying: data.is_playing || false,
        title: track.name,
        album: track.album.name,
        artist: track.album.artists.map((artist) => artist.name).join(', '),
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
        // Additional track data
        duration: track.duration_ms,
        trackNumber: track.track_number,
        explicit: track.explicit,
        previewUrl: track.preview_url,
        releaseDate: track.album.release_date,
        totalTracks: track.album.total_tracks,
        // Playback data
        progress: data.progress_ms,
        device: data.device ? {
            name: data.device.name,
            type: data.device.type,
            volume: data.device.volume_percent,
        } : null,
        shuffleState: data.shuffle_state,
        repeatState: data.repeat_state,
        // Recently played data
        playedAt: playedAt,
        context: context ? {
            type: context.type,
            href: context.href,
        } : null,
        artistInfo: artistInfo ? {
            name: artistInfo.name,
            genres: artistInfo.genres,
            followers: artistInfo.followers.total,
            url: artistInfo.external_urls.spotify,
            popularity: artistInfo.popularity,
            images: artistInfo.images,
        } : null,
    };
};

export async function GET() {
    try {
        const accessToken = await getAccessToken();
        let data = await fetchSpotifyData(SPOTIFY_NOW_PLAYING_URL, accessToken);

        if (!data.is_playing || data.currently_playing_type !== 'track') {
            data = await fetchSpotifyData(SPOTIFY_RECENTLY_PLAYED_URL, accessToken);
        }

        return NextResponse.json(await formatResponse(data, accessToken));
    } catch (error) {
        console.error('Spotify API error:', error);
        
        try {
            const accessToken = await getAccessToken();
            const data = await fetchSpotifyData(SPOTIFY_RECENTLY_PLAYED_URL, accessToken);
            return NextResponse.json(await formatResponse(data, accessToken));
        } catch (fallbackError) {
            console.error('Spotify fallback error:', fallbackError);
            
            return NextResponse.json({
                error: 'Failed to fetch Spotify data',
            });
        }
    }
}