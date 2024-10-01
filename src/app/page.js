"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [emotion, setEmotion] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post('http://127.0.0.1:5000/get-playlist', { emotion: emotion });
      setPlaylists(response.data);
    } catch (error) {
      alert("Error fetching playlist, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">Emotion-Based Playlist Generator</h1>

      <select
        className="p-2 border border-white rounded bg-white text-gray-800 mb-4 shadow-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
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

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {playlists.map((track, index) => (
          <div key={index} className="bg-white p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105 duration-300">
            <h3 className="font-semibold text-lg text-blue-600">{track.name}</h3>
            <p className="text-gray-600">Artist: {track.artist}</p>
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
      </div>
    </div>
  );
}
