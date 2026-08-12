import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Maximize2, X, Share2, Calendar, 
  ChevronLeft, ChevronRight, Download, Copy, Check, Film, Image
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/K56Gallery.module.css';

const CATEGORIES = ['All', 'Events', 'Sunday Service', 'Special Programs', 'Outreach', 'Kids & Youth', 'Workshops', 'Community', 'Behind the Scenes', 'Testimonies'];

const K56Gallery = ({ limit }) => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('k56_gallery').select('*').order('created_at', { ascending: false });
        if (limit) query = query.limit(limit);
        
        const { data, error } = await query;
        if (error) throw error;
        setMedia(data || []);
        setFilteredMedia(data || []);
      } catch (err) {
        console.error('Error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, [limit]);

  useEffect(() => {
    const filtered = activeCategory === 'All' 
      ? media 
      : media.filter(item => item.category === activeCategory);
    setFilteredMedia(filtered);
  }, [activeCategory, media]);

  const nextItem = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev + 1) % filteredMedia.length);
  }, [filteredMedia.length]);

  const prevItem = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev - 1 + filteredMedia.length) % filteredMedia.length);
  }, [filteredMedia.length]);

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'K56 Gallery', text: item.caption, url: item.image_url });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(item.image_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <header className={styles.galleryHeader}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={styles.subtitle}>Moments & Milestones</span>
            <h2 className={styles.title}>K56 Media Gallery</h2>
          </motion.div>

          <div className={styles.filterWrapper}>
            <div className={styles.filterBar}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="activeTab" className={styles.activeUnderline} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className={styles.imageGrid}>
            {[...Array(limit || 8)].map((_, i) => (
              <div key={i} className={`${styles.skeletonCard} ${styles.pulse}`} />
            ))}
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className={styles.imageGrid}>
              <AnimatePresence mode='popLayout'>
                {filteredMedia.map((item, index) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`${styles.imageCard} ${item.media_type === 'video' ? styles.videoCard : ''}`} 
                    onClick={() => setSelectedIndex(index)} 
                  >
                    <div className={styles.imageWrapper}>
                      {item.media_type === 'video' ? (
                        <video 
                          src={item.image_url} 
                          muted 
                          loop 
                          playsInline 
                          autoPlay 
                          preload="metadata" 
                          className={styles.mediaPreview} 
                        />
                      ) : (
                        <img src={item.image_url} alt={item.caption} loading="lazy" />
                      )}
                      <div className={styles.overlay}>
                        <div className={styles.overlayContent}>
                          <span className={styles.tag}>{item.category}</span>
                           <p className={styles.captionText}>{item.caption}</p>
                           <div className={styles.mediaIcon}>
                            {item.media_type === 'video' ? <Film size={20} /> : <Image size={20} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {limit && media.length > limit && (
          <div className={styles.viewAllContainer}>
            <Link to="/k56-gallery" className={styles.viewAllButton}>
              Explore Full Gallery
              <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Modern Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.lightboxBackdrop} onClick={() => setSelectedIndex(null)} />
            
            <div className={styles.lightboxContent}>
              <div className={styles.mainImageArea}>
                {filteredMedia[selectedIndex].media_type === 'video' ? (
                  <video 
                    key={filteredMedia[selectedIndex].id}
                    src={filteredMedia[selectedIndex].image_url} 
                    controls 
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className={styles.lightboxMedia}
                  />
                ) : (
                  <motion.img 
                    key={filteredMedia[selectedIndex].id}
                    src={filteredMedia[selectedIndex].image_url} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 25 }}
                    className={styles.lightboxMedia}
                  />
                )}
                
                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevItem}><ChevronLeft /></button>
                <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextItem}><ChevronRight /></button>
                <button className={styles.closeBtn} onClick={() => setSelectedIndex(null)}><X /></button>
              </div>

              <div className={styles.infoSidebar}>
                <div className={styles.infoHead}>
                  <span className={styles.imageCounter}>
                    {selectedIndex + 1} / {filteredMedia.length}
                  </span>
                  <h3 className={styles.lightboxTitle}>{filteredMedia[selectedIndex].caption}</h3>
                  <div className={styles.lightboxMeta}>
                    <div className={styles.metaBadge}><Calendar size={14}/> {new Date(filteredMedia[selectedIndex].created_at).toLocaleDateString()}</div>
                    <div className={styles.metaBadge}>{filteredMedia[selectedIndex].category}</div>
                     <div className={styles.metaBadge}>{filteredMedia[selectedIndex].media_type === 'video' ? <Film size={14}/> : <Image size={14} />} {filteredMedia[selectedIndex].media_type}</div>
                  </div>
                </div>

                <p className={styles.lightboxDesc}>
                  Captured during {filteredMedia[selectedIndex].category}. 
                  This moment represents the growth and community spirit of K56.
                </p>

                <div className={styles.lightboxActions}>
                  <button onClick={() => window.open(filteredMedia[selectedIndex].image_url)} className={styles.actionBtn}>
                    <Download size={18} /> Download
                  </button>
                  <button onClick={() => handleShare(filteredMedia[selectedIndex])} className={styles.actionBtn}>
                    {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default K56Gallery;
