import React, { useRef, useCallback, useState, useEffect } from 'react';
import styles from './Editor.module.css';
import {
  Save,
  PenLine,
  Palette,
  Type,
  Tag,
  Music2,
  Check,
  CaseSensitive,
  CheckCheck,
  X,
  Film // Add Film icon for transitions
} from 'lucide-react';

const FONT_FAMILIES = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Segoe UI, sans-serif',
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace'
];

const TRANSITIONS = [
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'flip', label: 'Flip' },
];

const SLIDE_DIRECTIONS = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'up', label: 'Up' },
    { value: 'down', label: 'Down' },
];

const MUSIC_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUICK_TAGS = ['Chorus', 'Pre-Chorus', 'Bridge', 'Tag', 'Outro'];

export function Editor({
  selectedSongId,
  editedTitle = '',
  setEditedTitle,
  editedKey = 'C',
  setEditedKey,
  editedContent = '',
  setEditedContent,
  liveFontFamily = 'Inter, sans-serif',
  setLiveFontFamily,
  liveFontSize = 24,
  setLiveFontSize,
  liveFontColor = '#ffffff',
  setLiveFontColor,
  isFitText = true,
  transition = 'fade', // Add transition prop
  setTransition, // Add setTransition prop
  slideDirection = 'left', // Add slideDirection prop
  setSlideDirection, // Add setSlideDirection prop
  saveChanges,
  isSaved = false,
  setDefaultFontSize, 
  handleClose, // New prop
}) {
  const textareaRef = useRef(null);
  const [isDefaultSet, setIsDefaultSet] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleSetDefault = () => {
    setDefaultFontSize(liveFontSize);
    setIsDefaultSet(true);
    setTimeout(() => setIsDefaultSet(false), 2000); 
  };

  const getNextVerseNumber = () => {
    const verseTags = editedContent.match(/\[Verse (\d+)\]/g) || [];
    if (verseTags.length === 0) {
      return 1;
    }
    const lastVerse = verseTags[verseTags.length - 1];
    const lastVerseNumber = parseInt(lastVerse.match(/\[Verse (\d+)\]/)[1], 10);
    return lastVerseNumber + 1;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, value } = textarea;

      const lastLineBreak = value.lastIndexOf('\n', selectionStart - 1);
      const currentLine = value.substring(lastLineBreak + 1, selectionStart);

      if (currentLine.trim() === '') {
        e.preventDefault();
        const nextVerseNumber = getNextVerseNumber();
        const tagText = `[Verse ${nextVerseNumber}]\n`;

        const newContent =
          value.substring(0, selectionStart) +
          tagText +
          value.substring(selectionStart);

        setEditedContent(newContent);
        setTimeout(() => {
          textarea.focus();
          const newCursorPosition = selectionStart + tagText.length;
          textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    let verseCounter = getNextVerseNumber();
    const verses = pastedText.split(/\n\s*\n/).filter(verse => verse.trim() !== '');

    const formattedVerses = verses.map((verse, index) => {
      const verseTag = `[Verse ${verseCounter + index}]`;
      return `${verseTag}\n${verse.trim()}`;
    });

    const textToInsert = formattedVerses.join('\n\n');

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent =
      editedContent.substring(0, start) +
      textToInsert +
      editedContent.substring(end);

    setEditedContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + textToInsert.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const insertSectionTag = useCallback((tagName) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tagText = `\n[${tagName}]\n`;

    const newContent =
      editedContent.substring(0, start) +
      tagText +
      editedContent.substring(end);

    setEditedContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagText.length, start + tagText.length);
    }, 0);
  }, [editedContent, setEditedContent]);

  if (!selectedSongId) {
    return (
      <div className={styles.middleColumn}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <PenLine size={48} strokeWidth={1.5} />
          </div>
          <h2>Select a song to edit</h2>
          <p>Choose a song from your library or setlist to edit lyrics, key, and font settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.middleColumn}>
      <div className={styles.editorContainer}>
        <header className={styles.editorHeader}>
          <div className={styles.headerTitle}>
            <h2>Song Editor</h2>
             <button onClick={handleClose} className={styles.closeButton} title="Close Editor (Esc)">
                <X size={18} />
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
                <div className={styles.toolItem} title="Font Family">
                  <Type size={14} className={styles.toolIcon} />
                  <select
                    value={liveFontFamily}
                    onChange={(e) => setLiveFontFamily(e.target.value)}
                    className={styles.selectControl}
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f}>
                        {f.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.toolItem} title="Font Size (px)">
                  <CaseSensitive size={14} className={styles.toolIcon} />
                  <input
                    type="number"
                    min="12"
                    max="120"
                    value={liveFontSize}
                    onChange={(e) => setLiveFontSize(Number(e.target.value))}
                    className={styles.numberInput}
                    disabled={isFitText}
                  />
                  <span className={styles.unitLabel}>px</span>
                </div>

                <div className={styles.colorPickerWrapper} title="Live Text Color">
                  <input
                    type="color"
                    value={liveFontColor}
                    onChange={(e) => setLiveFontColor(e.target.value)}
                    className={styles.colorInput}
                  />
                  <div
                    className={styles.colorBadge}
                    style={{ backgroundColor: liveFontColor }}
                  />
                  <Palette size={14} className={styles.colorIcon} />
                </div>
                
                <div className={styles.toolItem} title="Transition">
                  <Film size={14} className={styles.toolIcon} />
                  <select
                    value={transition}
                    onChange={(e) => setTransition(e.target.value)}
                    className={styles.selectControl}
                  >
                    {TRANSITIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {transition === 'slide' && (
                  <div className={styles.toolItem} title="Slide Direction">
                    <select
                      value={slideDirection}
                      onChange={(e) => setSlideDirection(e.target.value)}
                      className={styles.selectControl}
                    >
                      {SLIDE_DIRECTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                 <button 
                    onClick={handleSetDefault}
                    className={`${styles.setDefaultBtn} ${isDefaultSet ? styles.confirmed : ''}`}
                    title="Set as default font size"
                    disabled={isDefaultSet}
                  >
                    {isDefaultSet ? <CheckCheck size={14} /> : <Save size={14} />}
                    <span>{isDefaultSet ? 'Default Set' : 'Set Default'}</span>
                  </button>
              </div>

            <div className={styles.toolGroup}>
                <button
                  onClick={saveChanges}
                  className={`${styles.saveBtn} ${isSaved ? styles.savedState : ''}`}>
                  {isSaved ? <Check size={16} /> : <Save size={16} />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
            </div>
          </div>
        </header>

        <div className={styles.editorFormGroup}>
          <div className={styles.titleInputWrapper}>
            <input
              type="text"
              className={styles.titleInput}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Song Title..."
            />
          </div>

          <div className={styles.keySelectWrapper} title="Song Key">
            <Music2 size={15} className={styles.keyIcon} />
            <select
              className={styles.keySelect}
              value={editedKey}
              onChange={(e) => setEditedKey(e.target.value)}
            >
              {MUSIC_KEYS.map((k) => (
                <option key={k} value={k}>
                  Key of {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.quickTagsBar}>
          <span className={styles.quickTagsLabel}>
            <Tag size={13} /> Quick Section:
          </span>
          <div className={styles.tagChips}>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.tagChip}
                onClick={() => insertSectionTag(tag)}>
                + [{tag}]
              </button>
            ))}
          </div>
        </div>

        <div className={styles.textareaWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.lyricsEditor}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={`Enter lyrics here.\n\nStructure slides using bracket tags:\n[Verse 1]\nAmazing grace how sweet the sound...\n\n[Chorus]\nMy chains are gone...`}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}