import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, X, Share2, Calendar, 
  ChevronLeft, ChevronRight, Download, Film, Image
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/K56Gallery.module.css';
import Seo from '../components/Seo';

const CATEGORIES = ['All', 'Events', 'Sunday Service', 'Outreach', 'Community', 'Youth', 'Behind the Scenes'];

const K56GalleryPage = ({ limit }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
    setSelectedIndex(null);
  }, [activeCategory, items]);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('k56_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching items:', error);
    else setItems(data || []);
    setIsLoading(false);
  };

  const openLightbox = (index) => {
    const globalIndex = items.findIndex(item => item.id === filteredItems[index].id);
    setSelectedIndex(globalIndex);
  };
  
  const closeLightbox = () => setSelectedIndex(null);

  const nextItem = useCallback((e) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev + 1) % items.length);
  }, [selectedIndex, items.length]);

  const prevItem = useCallback((e) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [selectedIndex, items.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextItem(e);
      if (e.key === 'ArrowLeft') prevItem(e);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, nextItem, prevItem]);

  const handleShare = async (item) => {
    if (!item) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PEFA Kawangware 56 Gallery',
          text: item.caption,
          url: window.location.href,
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      navigator.clipboard.writeText(item.image_url);
      // Consider adding a notification for "Link copied to clipboard"
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;
  const currentItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <section className={styles.gallerySection}>
      <Seo title="K56 Gallery" description="Explore moments and milestones from PEFA Kawangware 56 events, community projects, and worship services." />
      <div className={styles.container}>
        {!limit && (
          <header className={styles.galleryHeader}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                  </button>
                ))}
              </div>
            </div>
          </header>
        )}

        <motion.div layout className={styles.imageGrid}>
          {isLoading ? (
            [...Array(limit || 12)].map((_, i) => (
              <div key={i} className={`${styles.skeletonCard} ${styles.pulse}`} />
            ))
          ) : (
            <AnimatePresence>
              {displayItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.imageCard}
                  onClick={() => setSelectedIndex(filteredItems.indexOf(item))}
                >
                  <div className={styles.imageWrapper}>
                    {item.media_type === 'video' ? (
                      <video src={item.image_url} loading="lazy" muted loop autoPlay playsInline />
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
                  <div className={styles.descriptionBar}>
      <p className={styles.descriptionText}>{item.description}</p>
    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {limit && items.length > limit && (
          <div className={styles.viewAllContainer}>
            <Link to="/k56-gallery" className={styles.viewAllButton}>Explore Full Gallery</Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && filteredItems[selectedIndex] && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.lightboxBackdrop} onClick={closeLightbox} />
            
            <button className={`${styles.navBtn} ${styles.closeBtn}`} onClick={closeLightbox}><X size={24} /></button>
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevItem}><ChevronLeft size={32} /></button>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextItem}><ChevronRight size={32} /></button>

            <motion.div 
              className={styles.lightboxContent}
              layoutId={`card-${filteredItems[selectedIndex].id}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.mainImageArea}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={filteredItems[selectedIndex].id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredItems[selectedIndex].media_type === 'video' ? (
                      <video src={filteredItems[selectedIndex].image_url} controls autoPlay className={styles.lightboxVideo} />
                    ) : (
                      <img 
                        src={filteredItems[selectedIndex].image_url} 
                        alt={filteredItems[selectedIndex].caption}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className={styles.infoSidebar}>
                <div>
                  <span className={styles.imageCounter}>
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                  <h3 className={styles.lightboxTitle}>{filteredItems[selectedIndex].caption}</h3>
                  <div className={styles.metaBadge}><Calendar size={14}/> {new Date(filteredItems[selectedIndex].created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className={styles.metaBadge}>{filteredItems[selectedIndex].category}</div>
                </div>
                
                <p className={styles.lightboxDesc}>
                  {filteredItems[selectedIndex].description || `A moment from our ${filteredItems[selectedIndex].category} activities. This image reflects the vibrant life and community spirit at PEFA Kawangware 56.`}
                </p>

                <div className={styles.lightboxActions}>
                  <button className={styles.actionBtn} onClick={() => handleDownload(filteredItems[selectedIndex].image_url, `K56-Gallery-${filteredItems[selectedIndex].id}`)}>
                    <Download size={18} /> Download
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleShare(filteredItems[selectedIndex])}>
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default K56GalleryPage;