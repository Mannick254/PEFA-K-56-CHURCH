import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, X, Share2, Calendar, 
  ChevronLeft, ChevronRight, Download, Info // Added Info icon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/K56Gallery.module.css';

const CATEGORIES = ['All', 'Events', 'Sunday Service', 'Special Programs', 'Outreach', 'Kids & Youth', 'Workshops', 'Community', 'Behind the Scenes', 'Testimonies'];

const K56Gallery = ({ limit }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    setFilteredImages(activeCategory === 'All' ? images : images.filter(img => img.category === activeCategory));
  }, [activeCategory, images]);

  const fetchImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('k56_gallery').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error:', error);
    else setImages(data || []);
    setIsLoading(false);
  };

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  const handleShare = async (img) => {
    try {
      await navigator.share({ title: 'K56 Gallery', text: img.caption, url: img.image_url });
    } catch {
      navigator.clipboard.writeText(img.image_url);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayImages = limit ? filteredImages.slice(0, limit) : filteredImages;

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <header className={styles.galleryHeader}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <span className={styles.subtitle}>Moments & Milestones</span>
                <h2 className={styles.title}>K56 Media Gallery</h2>
            </motion.div>
            <div className={styles.filterBar}>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                        onClick={() => setActiveCategory(cat)}
                        data-category={cat} // For CSS targeting
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </header>

        {isLoading ? (
          <div className={styles.skeletonGrid}>
            {[...Array(limit || 8)].map((_, i) => <div key={i} className={styles.skeletonCard} />)}
          </div>
        ) : (
          <motion.div layout className={styles.imageGrid}>
            <AnimatePresence mode='popLayout'>
              {displayImages.map((image, index) => (
                <motion.div 
                  key={image.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                  className={styles.imageCard} onClick={() => setSelectedIndex(index)} >
                  <div className={styles.imageWrapper}>
                    <img src={image.image_url} alt={image.caption} loading="lazy" />
                    <div className={styles.overlay}>
                      <Maximize2 size={24} className={styles.maxIcon} />
                      <div className={styles.overlayInfo}>
                        <span className={styles.tag}>{image.category || 'General'}</span>
                        <p>{image.caption}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {limit && images.length > limit && (
          <div className={styles.viewAllContainer}>
            <Link to="/k56-gallery" className={styles.viewAllButton}>Explore Full Gallery</Link>
          </div>
        )}
      </div>

      {/* --- Enhanced Lightbox --- */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.lightboxBackdrop} onClick={() => setSelectedIndex(null)} />
            
            <motion.button className={`${styles.navBtn} ${styles.closeBtnMain}`}
             onClick={() => setSelectedIndex(null)} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <X size={24} />
            </motion.button>

            <motion.button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage} initial={{ x: -50 }} animate={{ x: 0 }} exit={{ x: -50 }}>
              <ChevronLeft size={32} />
            </motion.button>
            <motion.button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage} initial={{ x: 50 }} animate={{ x: 0 }} exit={{ x: 50 }}>
              <ChevronRight size={32} />
            </motion.button>

            <div className={styles.lightboxContainer}>
                <motion.div className={styles.lightboxImageWrapper} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <img src={filteredImages[selectedIndex].image_url} alt="Full view" />
                </motion.div>
                <motion.div className={styles.lightboxInfoPanel} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ delay: 0.1 }}>
                    <h3 className={styles.lightboxTitle}>{filteredImages[selectedIndex].caption}</h3>
                    <div className={styles.lightboxMeta}>
                        <span className={styles.metaItem}><Calendar size={14} /> {new Date(filteredImages[selectedIndex].created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className={`${styles.metaItem} ${styles.metaCategory}`}>{filteredImages[selectedIndex].category}</span>
                    </div>
                    <p className={styles.lightboxDesc}>This moment was captured with care, reflecting the vibrant life and community at K56. More descriptive text can be added here if available in the database.</p>
                    <div className={styles.lightboxActions}>
                        <button onClick={() => handleDownload(filteredImages[selectedIndex].image_url, `K56-${selectedIndex}.jpg`)}>
                            <Download size={20} /> Download
                        </button>
                        <button onClick={() => handleShare(filteredImages[selectedIndex])}>
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default K56Gallery;
