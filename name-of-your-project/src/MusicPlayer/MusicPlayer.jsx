// MusicPlayer.js

import React, { useState, useEffect } from 'react';

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState(() => {
    const storedPlaylist = sessionStorage.getItem('playlist');
    return storedPlaylist ? JSON.parse(storedPlaylist) : [];
  });
  const [currentTrack, setCurrentTrack] = useState(() => {
    const storedTrack = sessionStorage.getItem('currentTrack');
    return storedTrack ? parseInt(storedTrack, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(() => {
    const storedIsPlaying = sessionStorage.getItem('isPlaying');
    return storedIsPlaying ? JSON.parse(storedIsPlaying) : false;
  });
  const audioRef = React.createRef();

  useEffect(() => {
    // Update audio source when the current track changes
    audioRef.current.src = playlist[currentTrack];
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack, playlist, isPlaying]);

  useEffect(() => {
    // Save entire state to sessionStorage whenever it changes
    sessionStorage.setItem('playlist', JSON.stringify(playlist));
    sessionStorage.setItem('currentTrack', currentTrack);
    sessionStorage.setItem('isPlaying', JSON.stringify(isPlaying));
  }, [playlist, currentTrack, isPlaying]);

  const handleFileChange = (e) => {
    const newPlaylist = [...playlist, URL.createObjectURL(e.target.files[0])];
    setPlaylist(newPlaylist);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (newTrack) => {
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
  };

  const handleNext = () => {
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1);
    }
  };

  const handleEnded = () => {
    // Auto play the next track when the current one ends
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <ul>
        {playlist.map((track, index) => (
          <li key={index} onClick={() => handleTrackChange(index)}>
            {index === currentTrack ? <strong>{`Track ${index + 1}`}</strong> : `Track ${index + 1}`}
          </li>
        ))}
      </ul>
      <audio ref={audioRef} onEnded={handleEnded} />
      <div>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default MusicPlayer;
