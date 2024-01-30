import React, { useState, useEffect } from 'react';


const AudioPlayer = () => {
  const [audio] = useState(new Audio());
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Load playlist from localStorage
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(storedPlaylist);

    // Load last playing track and position from localStorage
    const lastPlaying = JSON.parse(localStorage.getItem('lastPlaying')) || {};
    if (lastPlaying.trackIndex !== undefined) {
      setCurrentTrackIndex(lastPlaying.trackIndex);
    }
  }, []);

  useEffect(() => {
    // Play the audio when the current track changes
    if (playlist.length > 0) {
      const track = playlist[currentTrackIndex];
      audio.src = URL.createObjectURL(track);
      audio.play();
      localStorage.setItem('lastPlaying', JSON.stringify({ trackIndex: currentTrackIndex }));
    }
  }, [currentTrackIndex, audio, playlist]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const newPlaylist = [...playlist, file];
      setPlaylist(newPlaylist);
      localStorage.setItem('playlist', JSON.stringify(newPlaylist));
    }
  };

  const handlePlayPause = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleNext = () => {
    // Play the next track when the user clicks Next
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      // If it's the last track, loop back to the first track
      setCurrentTrackIndex(0);
    }
  };

  const handlePrevious = () => {
    // Play the previous track when the user clicks Previous
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      // If it's the first track, loop to the last track
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
      <button onClick={handlePlayPause}>{audio.paused ? 'Play' : 'Pause'}</button>
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <audio
        controls
        onEnded={handleNext}
        src={playlist.length > 0 ? URL.createObjectURL(playlist[currentTrackIndex]) : ''}
      >
        Your browser does not support the audio element.
      </audio>
      <Playlist
        playlist={playlist}
        currentTrackIndex={currentTrackIndex}
        onPlay={handlePlayPause}
        onTrackEnd={handleNext}
      />
    </div>
  );
};

export default AudioPlayer;
