import React, { useMemo, useCallback } from 'react';
import styles from './LeftColumn.module.css';
import {
  List,
  Music,
  BookOpen,
  Search,
  X,
  Play,
  Edit3,
  Plus,
  GripVertical,
} from 'lucide-react';

function SetlistTab({
  setlist = [],
  removeFromSetlist,
  handleGoLive,
  handleSelectSong
}) {
  if (setlist.length === 0) {
    return (
      <div className={styles.emptyState}>
        <List size={36} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>Setlist is empty</p>
        <span className={styles.emptySub}>Add songs from the Songs tab to build your service.</span>
      </div>
    );
  }

  return (
    <div className={styles.itemList} role="list" aria-label="Current Setlist">
      {setlist.map((item, index) => (
        <div key={item.id || index} className={styles.songCard} role="listitem">
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <GripVertical size={16} className={styles.dragHandle} title="Reorder" />
              <span className={styles.itemIndex}>{index + 1}</span>
              <h3 className={styles.songTitle}>{item.title}</h3>
            </div>
            {item.key && <span className={styles.keyBadge}>{item.key}</span>}
          </div>

          <div className={styles.cardActions}>
            <button
              onClick={() => handleGoLive(item)}
              className={`${styles.btn} ${styles.btnLive}`}
              title="Push Live to Output"
            >
              <Play size={14} fill="currentColor" /> Go Live
            </button>
            <button
              onClick={() => handleSelectSong(item)}
              className={`${styles.btn} ${styles.btnSecondary}`}
              title="Edit Song"
            >
              <Edit3 size={14} /> Edit
            </button>
            <button
              onClick={() => removeFromSetlist(item.id)}
              className={`${styles.btn} ${styles.btnDanger}`}
              title="Remove from Setlist"
              aria-label={`Remove ${item.title}`}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SongsTab({
  searchTerm = '',
  setSearchTerm,
  songs = [],
  addToSetlist,
  selectedSongId,
  handleSelectSong
}) {
  const filteredSongs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return songs;
    return songs.filter(
      (s) =>
        s.title?.toLowerCase().includes(query) ||
        s.content?.toLowerCase().includes(query)
    );
  }, [songs, searchTerm]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search library by title or lyrics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={styles.clearSearchBtn}
            aria-label="Clear Search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.itemList} role="list" aria-label="Song Library">
        {filteredSongs.length === 0 ? (
          <div className={styles.emptyState}>
            <Music size={36} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No songs found</p>
            <span className={styles.emptySub}>Try searching with a different term.</span>
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isSelected = selectedSongId === song.id;
            return (
              <div
                key={song.id}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                className={`${styles.songCard} ${isSelected ? styles.selectedCard : ''}`}
                onClick={() => handleSelectSong(song)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSong(song);
                  }
                }}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.songTitle}>{song.title}</h3>
                  {song.key && <span className={styles.keyBadge}>{song.key}</span>}
                </div>
                
                {song.content && (
                  <p className={styles.snippet}>
                    {song.content.replace(/\[.*?\]/g, '').trim().substring(0, 80)}...
                  </p>
                )}

                <div className={styles.cardActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToSetlist(song);
                    }}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    <Plus size={14} /> Add to Setlist
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BibleTab({
  bibleSearch = '',
  setBibleSearch,
  bibleVerses = [], // Correct prop name
  handleGoLive
}) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search scripture (e.g. John 3:16)"
          value={bibleSearch}
          onChange={(e) => setBibleSearch(e.target.value)}
          className={styles.searchInput}
        />
        {bibleSearch && (
          <button
            onClick={() => setBibleSearch('')}
            className={styles.clearSearchBtn}
            aria-label="Clear Search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.itemList} role="list" aria-label="Bible Verses">
        {bibleVerses.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen size={36} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No passages found</p>
            <span className={styles.emptySub}>Type a reference or keyword above.</span>
          </div>
        ) : (
          bibleVerses.map((verse) => (
            <div key={verse.id} className={styles.songCard} role="listitem">
              <div className={styles.cardHeader}>
                <h3 className={styles.songTitle}>{verse.ref}</h3>
              </div>
              <p className={styles.snippet}>{verse.text}</p>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleGoLive({ ...verse, title: verse.ref, content: verse.text }, 'bible')}
                  className={`${styles.btn} ${styles.btnLive}`}
                >
                  <Play size={14} fill="currentColor" /> Go Live
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function LeftColumn(props) {
  const { activeTab = 'setlist', setActiveTab, setlist = [], songs = [] } = props;

  const handleTabChange = useCallback(
    (tab) => {
      if (setActiveTab) setActiveTab(tab);
    },
    [setActiveTab]
  );

  return (
    <aside className={styles.leftColumn} aria-label="Library Navigation">
      <nav className={styles.tabNavigation} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'setlist'}
          onClick={() => handleTabChange('setlist')}
          className={`${styles.tabBtn} ${activeTab === 'setlist' ? styles.activeTab : ''}`}
        >
          <List size={16} />
          <span>Setlist</span>
          {setlist.length > 0 && <span className={styles.tabBadge}>{setlist.length}</span>}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'songs'}
          onClick={() => handleTabChange('songs')}
          className={`${styles.tabBtn} ${activeTab === 'songs' ? styles.activeTab : ''}`}
        >
          <Music size={16} />
          <span>Songs</span>
          {songs.length > 0 && <span className={styles.tabBadge}>{songs.length}</span>}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'bible'}
          onClick={() => handleTabChange('bible')}
          className={`${styles.tabBtn} ${activeTab === 'bible' ? styles.activeTab : ''}`}
        >
          <BookOpen size={16} />
          <span>Bible</span>
        </button>
      </nav>

      <div className={styles.panelContainer}>
        {activeTab === 'setlist' && <SetlistTab {...props} />}
        {activeTab === 'songs' && <SongsTab {...props} />}
        {activeTab === 'bible' && <BibleTab {...props} />}
      </div>
    </aside>
  );
}
