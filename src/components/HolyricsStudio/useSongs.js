import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pefak56_songs';

const INITIAL_SONGS = [
  {
    id: 1,
    title: 'Amazing Grace',
    key: 'G',
    content: `[V1]\nAmazing grace! How sweet the sound\nThat saved a wretch like me.\nI once was lost, but now am found;\nWas blind, but now I see.\n\n[C]\nGrace that will pardon and cleanse within;\nGrace that is greater than all our sin!\n\n[V2]\n'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!`,
  },
  {
    id: 2,
    title: 'How Great Thou Art',
    key: 'A',
    content: `[V1]\nO Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.\n\n[C]\nThen sings my soul, My Saviour God, to Thee,\nHow great Thou art, How great Thou art!\nThen sings my soul, My Saviour God, to Thee,\nHow great Thou art, How great Thou art!`,
  },
];

export const useSongs = () => {
  // Lazy state initialization to read from storage on initial render
  const [songs, setSongs] = useState(() => {
    try {
      const storedSongs = localStorage.getItem(STORAGE_KEY);
      if (storedSongs) {
        return JSON.parse(storedSongs);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SONGS));
      return INITIAL_SONGS;
    } catch (error) {
      console.error('Failed to load songs from localStorage:', error);
      return INITIAL_SONGS;
    }
  });

  // Sync state changes back to localStorage safely
  const saveSongs = useCallback((updatedSongs) => {
    setSongs(updatedSongs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Failed to save songs to localStorage:', error);
    }
  }, []);

  // Sync across tabs/windows when localStorage updates externally
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setSongs(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to parse updated songs from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a new song template
  const addSong = useCallback(() => {
    const newSong = {
      id: Date.now(),
      title: 'New Worship Song',
      key: 'C',
      content: `[V1]\nEnter verse lyrics here...\n\n[C]\nEnter chorus lyrics here...`,
    };

    setSongs((prevSongs) => {
      const updated = [...prevSongs, newSong];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save new song:', error);
      }
      return updated;
    });

    return newSong;
  }, []);

  // Update an existing song
  const updateSong = useCallback((updatedSong) => {
    setSongs((prevSongs) => {
      const updated = prevSongs.map((song) =>
        song.id === updatedSong.id ? { ...song, ...updatedSong } : song
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update song:', error);
      }
      return updated;
    });
  }, []);

  // Delete a song by ID
  const deleteSong = useCallback((songId) => {
    setSongs((prevSongs) => {
      const updated = prevSongs.filter((song) => song.id !== songId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to delete song:', error);
      }
      return updated;
    });
  }, []);

  return { songs, addSong, updateSong, deleteSong, saveSongs };
};