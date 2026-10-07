import React, { useMemo, useCallback } from 'react';
import styles from './Presenter.module.css';
import Pefak56MediaLogo from './Pefak56MediaLogo'; // Import the logo component
import {
  Tv,
  ArrowLeft,
  ArrowRight,
  Video,
  VideoOff,
  Radio
} from 'lucide-react';

const SectionTiles = ({ sections, activeSection, handleSectionSelect }) => (
  <div className={styles.sectionGrid} role="region" aria-label="Song Sections">
    {sections.map((section) => {
      const isActive = activeSection === section.id;
      return (
        <div
          key={section.id}
          tabIndex={0}
          role="button"
          aria-pressed={isActive}
          className={`${styles.sectionTile} ${isActive ? styles.activeSection : ''}`}
          onClick={() => handleSectionSelect(section.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSectionSelect(section.id);
            }
          }}
        >
          <span className={styles.sectionBadge}>{section.tag}</span>
          <p className={styles.sectionText}>{section.content}</p>
        </div>
      );
    })}
  </div>
);

const PreviewMockups = ({
  liveContent,
  nextContent,
  styleSettings,
  isBlackout
}) => {

  const fontStyle = {
    fontFamily: styleSettings.liveFontFamily,
    fontSize: `${styleSettings.liveFontSize}px`,
    color: styleSettings.liveFontColor,
    transition: styleSettings.transition,
    slideDirection: styleSettings.slideDirection,
  };

  return (
    <div className={styles.previewConsole}>
      <div className={`${styles.screenMockup} ${isBlackout ? styles.blackoutMock : ''}`}>
        <div className={styles.screenInner}>
          {isBlackout ? (
            <Pefak56MediaLogo />
          ) : (
            <pre style={fontStyle} className={styles.previewText}>
              {liveContent}
            </pre>
          )}
          <div className={styles.screenFooter}>
            <span className={`${styles.statusDot} ${isBlackout ? styles.dotBlackout : styles.dotLive}`} />
            <p className={styles.screenNote}>
              {isBlackout ? 'Live: BLACKOUT' : 'Live: Main Projector'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.screenMockupNext}>
        <div className={styles.screenInner}>
          <pre style={fontStyle} className={styles.previewText}>
            {nextContent || <span className={styles.endOfSlide}>— End of Presentation —</span>}
          </pre>
          <div className={styles.screenFooter}>
            <span className={styles.statusDotNext} />
            <p className={styles.screenNote}>Next: Stage Monitor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Presenter({
  liveObject,
  isLive = false,
  isBlackout = false,
  setIsBlackout,
  sections,
  activeSection,
  handleSectionSelect,
  handlePrev,
  handleNext,
  styleSettings
}) {
  const toggleBlackout = useCallback(() => {
    setIsBlackout((prev) => !prev);
  }, [setIsBlackout]);

  if (!isLive || !liveObject) {
    return (
      <div className={styles.rightColumn}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Tv size={48} strokeWidth={1.5} />
          </div>
          <h2>Nothing is live yet</h2>
          <p>Click "Go Live" on a song or verse to start presenting.</p>
        </div>
      </div>
    );
  }

  const activeSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const liveContent = sections[activeSectionIndex]?.content || '';
  const nextContent = sections[activeSectionIndex + 1]?.content || '';

  return (
    <div className={styles.rightColumn}>
      <header className={styles.presenterHeader}>
        <div className={styles.titleWrapper}>
          <h2>{liveObject.title || liveObject.ref}</h2>
          <span className={styles.liveTag}>
            <Radio size={12} className={styles.pulseIcon} /> LIVE
          </span>
        </div>

        <div className={styles.controlGroup}>
          <button 
            onClick={handlePrev} 
            className={styles.ctrlBtn} 
            title="Previous Section (Left Arrow)"
            aria-label="Previous"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            onClick={handleNext} 
            className={styles.ctrlBtn} 
            title="Next Section (Right Arrow)"
            aria-label="Next"
          >
            <ArrowRight size={18} />
          </button>
          <button
            onClick={toggleBlackout}
            className={`${styles.ctrlBtn} ${styles.blackoutBtn} ${isBlackout ? styles.activeBlackout : ''}`}
            title="Toggle Blackout"
          >
            {isBlackout ? <VideoOff size={18} /> : <Video size={18} />}
            <span>Blackout</span>
          </button>
        </div>
      </header>

      <SectionTiles
        sections={sections}
        activeSection={activeSection}
        handleSectionSelect={handleSectionSelect}
      />

      <PreviewMockups
        liveContent={liveContent}
        nextContent={nextContent}
        isBlackout={isBlackout}
        styleSettings={styleSettings}
      />
    </div>
  );
}