"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Carousel } from 'antd';

function PlaylistContent() {
    const searchParams = useSearchParams();
    const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        // Fetch and parse the playlist data from the query params
        const playlistParam = searchParams.get("playlists");
        if (playlistParam) {
            try {
                const data = JSON.parse(decodeURIComponent(playlistParam));
                setPlaylistData(data);
            } catch (error) {
                console.error("Error parsing playlists:", error);
            }
        }
    }, [searchParams]);

    // Add a loading state or return a loading indicator
    if (!playlistData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2>No playlist data found. Please try again.</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-6">Your Emotion-Based Playlist</h1>
            <div className="w-full max-w-4xl">
                <Carousel
                    dots={true}
                    autoplay
                    autoplaySpeed={2000}
                    arrows
                    pauseOnHover
                >
                    {playlistData.map((track, index) => (
                        <div key={index} className="bg-gray-700 p-4 shadow-lg rounded-lg transition-transform duration-300">
                            <h3 className="font-semibold text-lg text-blue-400">{track.name}</h3>
                            <p className="text-gray-300">Artist: {track.artist}</p>
                            <a
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 mt-2 inline-block hover:underline transition duration-200"
                            >
                                Listen on Spotify
                            </a>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default function PlaylistPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlaylistContent />
        </Suspense>
    );
}
