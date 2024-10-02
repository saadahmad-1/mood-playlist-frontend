"use client";

import { useState } from 'react';
import axios from 'axios';
import { Carousel } from 'antd';

export default function Home() {
  const [emotion, setEmotion] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const emotions = [
    { label: 'Happy', value: 'happy' },
    { label: 'Sad', value: 'sad' },
    { label: 'Energetic', value: 'energetic' },
    { label: 'Calm', value: 'calm' },
  ];

  const getPlaylist = async () => {
    if (!emotion) {
      alert("Please select an emotion!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(api_url + '/get-playlist', { emotion: emotion });
      setPlaylists(response.data);
    } catch (error) {
      alert("Error fetching playlist, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">Emotion-Based Playlist Generator</h1>

      <select
        className="p-2 border border-gray-600 rounded bg-gray-800 text-gray-200 mb-4 shadow-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
      >
        <option value="">Select your emotion</option>
        {emotions.map((em) => (
          <option key={em.value} value={em.value}>
            {em.label}
          </option>
        ))}
      </select>

      <button
        className={`bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 px-4 rounded shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={getPlaylist}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Playlist'}
      </button>

      <div className="mt-8 w-full max-w-4xl">
        <Carousel
          dots={true}
          autoplay
          autoplaySpeed={2000}
          arrows
          pauseOnHover
        >
          {playlists.map((track, index) => (
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
