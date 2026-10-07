import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './HolyricsStudio.module.css';

import { Header } from './components/Header';
import { LeftColumn } from './components/LeftColumn';
import { Editor } from './components/Editor';
import { Presenter } from './components/Presenter';
import DevelopmentWarningModal from './components/DevelopmentWarningModal.jsx';

import { useBroadcastChannel } from './hooks/useBroadcastChannel';
import { useSongManagement } from './hooks/useSongManagement';
import { useLivePresentation } from './hooks/useLivePresentation';

import { kjv } from '../../lib/kjv.js';

const initialDefaultFontSize = Number(localStorage.getItem('holyrics_default_fontSize')) || 48;

const useBibleSearch = (query) => {
  return useMemo(() => {
    if (!query) {
      return [];
    }

    const cleanedQuery = query.trim().toLowerCase();
    const results = [];

    const bookMatch = Object.keys(kjv).find(b => b.toLowerCase() === cleanedQuery);
    if (bookMatch) {
        for (const verse of kjv[bookMatch]) {
            const verseRef = `${bookMatch} ${verse.chapter}:${verse.verse}`;
            results.push({ ...verse, ref: verseRef, id: verseRef });
        }
        return results.slice(0, 300); 
    }

    for (const book in kjv) {
      for (const verse of kjv[book]) {
        const verseRef = `${book} ${verse.chapter}:${verse.verse}`;
        if (
          verseRef.toLowerCase().includes(cleanedQuery) ||
          verse.text.toLowerCase().includes(cleanedQuery)
        ) {
          results.push({ ...verse, ref: verseRef, id: verseRef });
        }
      }
    }

    return results.slice(0, 50); 
  }, [query]);
};

export default function HolyricsStudio() {
  const [visibleColumns, setVisibleColumns] = useState({ list: true, editor: true, presenter: true });
  const [activeTab, setActiveTab] = useState('setlist');
  const [searchTerm, setSearchTerm] = useState('');
  const [bibleSearch, setBibleSearch] = useState('');
  const [setlist, setSetlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayWindows = useRef({});
  
  const bibleSearchResults = useBibleSearch(bibleSearch);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('holyricsStudioModalSeen');
    if (!hasSeenModal) {
      setIsModalOpen(true);
      sessionStorage.setItem('holyricsStudioModalSeen', 'true');
    }
  }, []);

  const postMessage = useBroadcastChannel('pefak56_holyrics_channel');
  
  const {
    songs,
    selectedSongId,
    setSelectedSongId, // Get the setter
    editedTitle, setEditedTitle,
    editedKey, setEditedKey,
    editedContent, setEditedContent,
    handleSelectSong,
    saveChanges,
    addSong,
    isSaved
  } = useSongManagement();

  const {
    presentingItem,
    parsedSections,
    activeSectionIdx,
    setActiveSectionIdx,
    isBlackout, setIsBlackout,
    isClearText, setIsClearText,
    liveFontSize, setLiveFontSize,
    liveFontFamily, setLiveFontFamily,
    liveFontColor, setLiveFontColor,
    isFitText, setIsFitText, 
    handleGoLive,
    transition, setTransition, // Add transition state
    slideDirection, setSlideDirection, // Add slideDirection state
  } = useLivePresentation(postMessage, {
    fontSize: initialDefaultFontSize
  });

  const handleSetDefaultFontSize = useCallback((size) => {
    localStorage.setItem('holyrics_default_fontSize', size);
    setLiveFontSize(size); 
  }, [setLiveFontSize]);

  const addToSetlist = useCallback((item) => {
    setSetlist((prev) => prev.some((s) => s.id === item.id) ? prev : [...prev, item]);
    setActiveTab('setlist');
  }, []);

  const removeFromSetlist = useCallback((itemId) => {
    setSetlist((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleSaveChanges = useCallback(() => {
    saveChanges(setlist, setSetlist);
    // Deselect the song after saving
    setSelectedSongId(null);
  }, [saveChanges, setlist, setSelectedSongId]);

  const handleCloseEditor = useCallback(() => {
    setSelectedSongId(null);
  }, [setSelectedSongId]);

  const toggleDisplayWindow = useCallback(async (route, name) => {
    const windowRef = displayWindows.current[name];

    if (windowRef && !windowRef.closed) {
      windowRef.close();
      displayWindows.current[name] = null;
    } else {
      let windowFeatures = `width=${window.screen.width},height=${window.screen.height},scrollbars=no,status=no,toolbar=no,location=no,menubar=no`;

      if ('getScreenDetails' in window) {
        try {
          const screenDetails = await window.getScreenDetails();
          const secondaryScreen = screenDetails.screens.find(s => !s.isPrimary);

          if (secondaryScreen) {
            windowFeatures = `left=${secondaryScreen.availLeft},top=${secondaryScreen.availTop},width=${secondaryScreen.width},height=${secondaryScreen.height},scrollbars=no,status=no,toolbar=no,location=no,menubar=no`;
          }
        } catch (err) {
          console.error("Could not get screen details:", err);
        }
      }

      const newWindow = window.open(route, name, windowFeatures);
      displayWindows.current[name] = newWindow;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F7') {
        event.preventDefault();
        toggleDisplayWindow('/presenter/main', 'main');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleDisplayWindow]);

  const handleSectionSelect = useCallback((sectionId) => {
    const sectionIndex = parsedSections.findIndex(s => s.id === sectionId);
    if (sectionIndex > -1) {
      setActiveSectionIdx(sectionIndex);
    }
  }, [parsedSections, setActiveSectionIdx]);

  const handlePrev = useCallback(() => {
    if (activeSectionIdx > 0) {
      setActiveSectionIdx(activeSectionIdx - 1);
    }
  }, [activeSectionIdx, setActiveSectionIdx]);

  const handleNext = useCallback(() => {
    if (parsedSections && activeSectionIdx < parsedSections.length - 1) {
      setActiveSectionIdx(activeSectionIdx + 1);
    }
  }, [activeSectionIdx, parsedSections, setActiveSectionIdx]);

  return (
    <div className={styles.studioContainer}>
      <DevelopmentWarningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Header
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        addSong={addSong}
        openDisplayWindow={toggleDisplayWindow}
      />

      <div className={styles.studioLayout}>
        {visibleColumns.list && (
          <LeftColumn
            activeTab={activeTab} setActiveTab={setActiveTab}
            setlist={setlist}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            songs={songs}
            addToSetlist={addToSetlist}
            bibleSearch={bibleSearch} setBibleSearch={setBibleSearch}
            bibleVerses={bibleSearchResults} 
            handleGoLive={handleGoLive}
            selectedSongId={selectedSongId}
            handleSelectSong={handleSelectSong}
            removeFromSetlist={removeFromSetlist}
            presentingItemId={presentingItem?.id}
          />
        )}

        {visibleColumns.editor && (
          <Editor
            selectedSongId={selectedSongId}
            editedTitle={editedTitle} setEditedTitle={setEditedTitle}
            editedKey={editedKey} setEditedKey={setEditedKey}
            editedContent={editedContent} setEditedContent={setEditedContent}
            liveFontFamily={liveFontFamily} setLiveFontFamily={setLiveFontFamily}
            liveFontSize={liveFontSize} setLiveFontSize={setLiveFontSize}
            liveFontColor={liveFontColor} setLiveFontColor={setLiveFontColor}
            isFitText={isFitText} setIsFitText={setIsFitText}
            transition={transition} setTransition={setTransition} // Pass transition state to Editor
            slideDirection={slideDirection} setSlideDirection={setSlideDirection} // Pass slideDirection state to Editor
            saveChanges={handleSaveChanges}
            isSaved={isSaved}
            setDefaultFontSize={handleSetDefaultFontSize}
            handleClose={handleCloseEditor} 
          />
        )}

        {visibleColumns.presenter && (
          <Presenter
            liveObject={presentingItem}
            isLive={!!presentingItem}
            isBlackout={isBlackout}
            setIsBlackout={setIsBlackout}
            isClearText={isClearText}
            sections={parsedSections}
            activeSection={parsedSections[activeSectionIdx]?.id}
            handleSectionSelect={handleSectionSelect}
            handlePrev={handlePrev}
            handleNext={handleNext}
            styleSettings={{ liveFontFamily, liveFontSize, liveFontColor, isFitText, transition, slideDirection }} // Pass transition to Presenter
          />
        )}
      </div>
    </div>
  );
}
