"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [emotionText, setEmotionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const maxTextLength = 500;

  const getPlaylist = async () => {
    if (!emotionText) {
      alert("Please enter some text to analyze!");
      return;
    }

    if (emotionText.length > maxTextLength) {
      setError(`Text is too long! Please limit your input to ${maxTextLength} characters.`);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${api_url}/get-playlist`, { emotionText });
      const playlists = response.data;

      // Check if playlists is valid
      if (Array.isArray(playlists)) {
        router.push(`/recommendations?playlists=${encodeURIComponent(JSON.stringify(playlists))}`);
      } else {
        setError("Received data is not valid.");
      }
    } catch (error) {
      console.error("Error fetching playlist:", error); // Log the actual error
      alert("Error fetching playlist, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">Emotion-Based Playlist Generator</h1>

      <textarea
        className="p-2 border border-gray-600 rounded bg-gray-800 text-gray-200 mb-4 shadow-md w-full max-w-2xl focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
        placeholder="Describe how you're feeling..."
        value={emotionText}
        onChange={(e) => setEmotionText(e.target.value)}
        rows={4}
        maxLength={maxTextLength}
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className={`bg-blue-600 hover:bg-blue-700 transition duration-300 text-white py-2 px-4 rounded shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={getPlaylist}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Playlist'}
      </button>
    </div>
  );
}
