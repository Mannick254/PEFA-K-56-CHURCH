import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pefak56_songs';

const INITIAL_SONGS = [
  { 
    id: 1, 
    title: 'Amazing Grace', 
    key: 'G',
    content: `[V1]
Amazing grace! How sweet the sound
That saved a wretch like me.
I once was lost, but now am found;
Was blind, but now I see.

[C]
Grace that will pardon and cleanse within;
Grace that is greater than all our sin!

[V2]
'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed!` 
  },
  { 
    id: 2, 
    title: 'How Great Thou Art', 
    key: 'A',
    content: `[V1]
O Lord my God, when I in awesome wonder
Consider all the worlds Thy hands have made;
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

[C]
Then sings my soul, My Saviour God, to Thee,
How great Thou art, How great Thou art!
Then sings my soul, My Saviour God, to Thee,
How great Thou art, How great Thou art!` 
  }
];

export function useSongManagement() {
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  
  // Single cohesive state object for song editing
  const [formData, setFormData] = useState({
    title: '',
    key: 'C',
    content: ''
  });

  // Helper to persist to localStorage safely
  const persistSongs = useCallback((newSongs) => {
    setSongs(newSongs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSongs));
    } catch (error) {
      console.error('Failed to save songs to localStorage:', error);
    }
  }, []);

  // Initialize songs from local storage or defaults
  useEffect(() => {
    try {
      const storedSongs = localStorage.getItem(STORAGE_KEY);
      if (storedSongs) {
        setSongs(JSON.parse(storedSongs));
      } else {
        persistSongs(INITIAL_SONGS);
      }
    } catch (error) {
      console.error('Failed to parse songs from localStorage:', error);
      persistSongs(INITIAL_SONGS);
    }
  }, [persistSongs]);

  // Select song for editing
  const handleSelectSong = useCallback((song) => {
    if (!song) {
      setSelectedSongId(null);
      setFormData({ title: '', key: 'C', content: '' });
      return;
    }
    
    setSelectedSongId(song.id);
    setFormData({
      title: song.title ?? '',
      key: song.key ?? 'C',
      content: song.content ?? ''
    });
  }, []);

  // Generic form change handler
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Save changes to current song & optional setlist state
  const saveChanges = useCallback((setlist = [], setSetlist = null) => {
    if (!selectedSongId) return;

    const updatedSong = {
      id: selectedSongId,
      title: formData.title,
      key: formData.key,
      content: formData.content
    };

    const updatedSongs = songs.map(s => s.id === selectedSongId ? updatedSong : s);
    persistSongs(updatedSongs);

    // Update external setlist state if provided
    if (typeof setSetlist === 'function') {
      setSetlist(setlist.map(s => s.id === selectedSongId ? updatedSong : s));
    }

    setSelectedSongId(null);
  }, [selectedSongId, formData, songs, persistSongs]);

  // Create a new song template
  const addSong = useCallback(() => {
    const newSong = {
      id: Date.now(),
      title: 'New Worship Song',
      key: 'C',
      content: `[V1]
Enter verse lyrics here...\n\n[C]\nEnter chorus lyrics here...`
    };

    const updatedSongs = [...songs, newSong];
    persistSongs(updatedSongs);
    handleSelectSong(newSong);
  }, [songs, persistSongs, handleSelectSong]);

  // Delete a song
  const deleteSong = useCallback((id, setlist = [], setSetlist = null) => {
    const updatedSongs = songs.filter(s => s.id !== id);
    persistSongs(updatedSongs);

    if (typeof setSetlist === 'function') {
      setSetlist(setlist.filter(s => s.id !== id));
    }

    if (selectedSongId === id) {
      handleSelectSong(null);
    }
  }, [songs, persistSongs, selectedSongId, handleSelectSong]);

  return {
    songs,
    selectedSongId,
    setSelectedSongId, // Expose setter
    editedTitle: formData.title,
    editedKey: formData.key,
    editedContent: formData.content,
    formData,
    
    // Actions
    setEditedTitle: (val) => handleFormChange('title', val),
    setEditedKey: (val) => handleFormChange('key', val),
    setEditedContent: (val) => handleFormChange('content', val),
    handleFormChange,
    handleSelectSong,
    saveChanges,
    addSong,
    deleteSong
  };
}