import { useState, useCallback, useEffect } from 'react';

const MOCK_BIBLE_VERSES = [
  { ref: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
  { ref: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' }
];

function parseSongContent(text = '') {
  if (!text.trim()) return [];

  const finalSlides = [];
  let slideId = 0;
  
  const sections = [];
  // This regex is probably fine for splitting into major sections.
  const rawSections = text.split(/\n?\[(.*?)\]\n?/g);

  // Start at 1 to skip any leading empty string from the split
  for (let i = 1; i < rawSections.length; i += 2) {
    const type = rawSections[i]?.trim() || 'Section';
    const content = rawSections[i + 1]?.trim() || '';
    
    if (type || content) {
      sections.push({ tag: type, content });
    }
  }
  
  // If no bracketed sections are found, treat the whole text as a single section.
  if (sections.length === 0 && text.trim()) {
      sections.push({ tag: 'Verse', content: text.trim() });
  }

  // Now, iterate through the coarse sections and split their content by newlines.
  for (const section of sections) {
      const paragraphs = section.content.split(/\n\s*\n/); // Split content by blank line
      paragraphs.forEach(p => {
          if (p.trim()) {
              finalSlides.push({
                  id: slideId++,
                  tag: section.tag,
                  content: p.trim()
              });
          }
      });
  }

  return finalSlides;
}

export function useLivePresentation(postMessage, options = {}) {
  // Presentation Content State
  const [presentation, setPresentation] = useState({
    item: null,
    sections: [],
    activeIdx: null,
  });

  // Display Toggle State
  const [displayControls, setDisplayControls] = useState({
    isBlackout: false,
    isClearText: false,
    isFitText: false,
  });

  // Styling Customization State
  const [styleSettings, setStyleSettings] = useState({
    fontSize: options.fontSize || 48, // Use initial font size from options
    fontFamily: 'Arial',
    fontColor: '#ffffff',
    transition: 'fade', // Add transition state
    slideDirection: 'left', // Add slideDirection state
  });

  const broadcastState = useCallback((overrides = {}) => {
    const { item, sections, activeIdx } = presentation;
    const currentSection = activeIdx !== null ? sections[activeIdx]?.content ?? '' : '';
    const nextSection = activeIdx !== null ? sections[activeIdx + 1]?.content ?? '' : '';

    const payload = {
      title: item?.title ?? '',
      content: currentSection,
      nextContent: nextSection,
      isBlackout: displayControls.isBlackout,
      isClearText: displayControls.isClearText,
      isFitText: displayControls.isFitText,
      fontSize: styleSettings.fontSize,
      fontFamily: styleSettings.fontFamily,
      fontColor: styleSettings.fontColor,
      transition: styleSettings.transition,
      slideDirection: styleSettings.slideDirection, // Add slideDirection to payload
      ...overrides
    };

    postMessage?.({ type: 'SYNC_STATE', payload });
  }, [presentation, displayControls, styleSettings, postMessage]);

  useEffect(() => {
    broadcastState();
  }, [broadcastState]);

  const handleGoLive = useCallback((item, type = 'song') => {
    const isSong = type === 'song';
    const title = isSong ? item.title : item.ref;
    const content = isSong ? item.content : `[VERSE]\n${item.text}`;

    const sections = parseSongContent(content);

    setPresentation({
      item: { ...item, title },
      sections,
      activeIdx: sections.length > 0 ? 0 : null,
    });

    setDisplayControls(prev => ({...prev, 
      isBlackout: false,
      isClearText: false,
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isInputActive || !presentation.item || presentation.sections.length === 0) return;

      const maxIdx = presentation.sections.length - 1;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          setPresentation(prev => ({
            ...prev,
            activeIdx: prev.activeIdx === null ? 0 : Math.min(prev.activeIdx + 1, maxIdx)
          }));
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          setPresentation(prev => ({
            ...prev,
            activeIdx: prev.activeIdx === null ? 0 : Math.max(prev.activeIdx - 1, 0)
          }));
          break;

        case 'b':
        case 'B':
          setDisplayControls(prev => ({ ...prev, isBlackout: !prev.isBlackout }));
          break;

        case 'c':
        case 'C':
          setDisplayControls(prev => ({ ...prev, isClearText: !prev.isClearText }));
          break;

        default:
          if (e.key >= '1' && e.key <= '9') {
            const targetIdx = Number(e.key) - 1;
            if (presentation.sections[targetIdx]) {
              setPresentation(prev => ({ ...prev, activeIdx: targetIdx }));
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation.item, presentation.sections]);

  // Return formatted state & updater API
  return {
    presentingItem: presentation.item,
    parsedSections: presentation.sections,
    activeSectionIdx: presentation.activeIdx,
    setActiveSectionIdx: (idx) => setPresentation(prev => ({ ...prev, activeIdx: idx })),
    
    isBlackout: displayControls.isBlackout,
    setIsBlackout: (val) => setDisplayControls(prev => ({
      ...prev,
      isBlackout: typeof val === 'function' ? val(prev.isBlackout) : val
    })),
    
    isClearText: displayControls.isClearText,
    setIsClearText: (val) => setDisplayControls(prev => ({
      ...prev,
      isClearText: typeof val === 'function' ? val(prev.isClearText) : val
    })),

    isFitText: displayControls.isFitText,
    setIsFitText: (val) => setDisplayControls(prev => ({ 
      ...prev,
      isFitText: typeof val === 'function' ? val(prev.isFitText) : val
    })),

    liveFontSize: styleSettings.fontSize,
    setLiveFontSize: (val) => setStyleSettings(prev => ({ ...prev, fontSize: typeof val === 'function' ? val(prev.fontSize) : val })),
    
    liveFontFamily: styleSettings.fontFamily,
    setLiveFontFamily: (val) => setStyleSettings(prev => ({ ...prev, fontFamily: typeof val === 'function' ? val(prev.fontFamily) : val })),
    
    liveFontColor: styleSettings.fontColor,
    setLiveFontColor: (val) => setStyleSettings(prev => ({ ...prev, fontColor: typeof val === 'function' ? val(prev.fontColor) : val })),
    
    transition: styleSettings.transition,
    setTransition: (val) => setStyleSettings(prev => ({ ...prev, transition: val })), // Add transition setter

    slideDirection: styleSettings.slideDirection,
    setSlideDirection: (val) => setStyleSettings(prev => ({ ...prev, slideDirection: val })), // Add slideDirection setter

    handleGoLive,
    mockBibleVerses: MOCK_BIBLE_VERSES,
  };
}