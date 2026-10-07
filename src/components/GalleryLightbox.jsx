import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, Minimize2, X, Share2, Calendar, 
  ChevronLeft, ChevronRight, Download, Check, Film, Image as ImageIcon,
  Cpu, Layers 
} from 'lucide-react';
import styles from '../styles/GL.module.css';

const GalleryLightbox = ({ selectedItem, filteredMedia, visuallySimilarItems, onClose, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef(null);

  const getSelectedIndex = useCallback(() => {
    if (!selectedItem) return -1;
    return filteredMedia.findIndex((item) => item.id === selectedItem.id);
  }, [selectedItem, filteredMedia]);

  const nextItem = useCallback((e) => {
    e?.stopPropagation();
    const currentIndex = getSelectedIndex();
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    onSelect(filteredMedia[nextIndex]);
  }, [filteredMedia, getSelectedIndex, onSelect]);

  const prevItem = useCallback((e) => {
    e?.stopPropagation();
    const currentIndex = getSelectedIndex();
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    onSelect(filteredMedia[prevIndex]);
  }, [filteredMedia, getSelectedIndex, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === 'ArrowRight') nextItem(e);
      if (e.key === 'ArrowLeft') prevItem(e);
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, nextItem, prevItem, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'K56 Gallery', text: item.caption, url: item.image_url });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(item.image_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!selectedItem) return null;

  const currentIndex = getSelectedIndex();

  return (
    <AnimatePresence>
      <motion.div
        ref={lightboxRef}
        className={styles.lightbox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.lightboxBackdrop} onClick={onClose} />

        <motion.div 
          className={styles.lightboxContent}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Left Media Stage */}
          <div className={styles.mainImageArea}>
            <div className={styles.mediaFrame}>
              {selectedItem.media_type === 'video' ? (
                <video
                  key={selectedItem.id}
                  src={selectedItem.image_url}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  className={styles.lightboxMedia}
                />
              ) : (
                <motion.img
                  key={selectedItem.id}
                  src={selectedItem.image_url}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={styles.lightboxMedia}
                />
              )}
            </div>

            {/* Float Navigation Controls */}
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevItem} aria-label="Previous">
              <ChevronLeft size={22} />
            </button>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextItem} aria-label="Next">
              <ChevronRight size={22} />
            </button>

            <div className={styles.mediaTopBar}>
              <button onClick={toggleFullscreen} className={styles.toolBtn} title="Fullscreen">
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Right Information Sidebar */}
          <div className={styles.infoSidebar}>
            <div className={styles.infoHead}>
              <div className={styles.topMetaRow}>
                <span className={styles.imageCounter}>
                  {currentIndex + 1} / {filteredMedia.length}
                </span>
                <span className={styles.categoryBadge}>{selectedItem.category}</span>
              </div>
              
              <h3 className={styles.lightboxTitle}>{selectedItem.caption}</h3>
              
              <div className={styles.lightboxMeta}>
                <div className={styles.metaBadge}>
                  <Calendar size={13} /> {new Date(selectedItem.created_at).toLocaleDateString()}
                </div>
                <div className={styles.metaBadge}>
                  {selectedItem.media_type === 'video' ? <Film size={13} /> : <ImageIcon size={13} />} {selectedItem.media_type}
                </div>
              </div>
            </div>

            <div className={styles.cnnAnalysisBox}>
              <div className={styles.cnnBoxHeader}>
                <Cpu size={14} className={styles.aiIcon} /> 
                <span>AI Vision Analysis</span>
              </div>
              <p className={styles.confidenceScore}>
                Confidence: <strong>{selectedItem.ai_quality_score}%</strong>
              </p>
              {selectedItem.ai_tags && selectedItem.ai_tags.length > 0 && (
                <div className={styles.tagPills}>
                  {selectedItem.ai_tags.map((tag, idx) => (
                    <span key={idx} className={styles.aiPill}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {visuallySimilarItems && visuallySimilarItems.length > 0 && (
              <div className={styles.similarSection}>
                <div className={styles.sectionTitleRow}>
                  <Layers size={14} />
                  <h4>Visually Similar</h4>
                </div>
                <div className={styles.similarGrid}>
                  {visuallySimilarItems.map((simItem) => (
                    <div
                      key={simItem.id}
                      className={styles.similarThumb}
                      onClick={() => {
                        const targetItem = filteredMedia.find((m) => m.id === simItem.id);
                        if (targetItem) onSelect(targetItem);
                      }}
                    >
                      <img src={simItem.image_url} alt={simItem.caption} />
                      <span className={styles.simScore}>
                        {Math.round(simItem.similarityScore * 100)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.lightboxActions}>
              <button onClick={() => window.open(selectedItem.image_url, '_blank')} className={styles.actionBtn}>
                <Download size={15} /> Download
              </button>
              <button onClick={() => handleShare(selectedItem)} className={styles.actionBtnPrimary}>
                {copied ? <Check size={15} /> : <Share2 size={15} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryLightbox;