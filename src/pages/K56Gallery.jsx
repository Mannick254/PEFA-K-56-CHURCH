import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, X, Share2, Calendar, 
  ChevronLeft, ChevronRight, Download, Filter 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/K56Gallery.module.css';
import Seo from '../components/Seo';

const CATEGORIES = ['All', 'Events', 'Sunday Service', 'Special Programs', 'Outreach', 'Kids & Youth', 'Workshops', 'Community', 'Behind the Scenes', 'Testimonies'];

const K56GalleryPage = ({ limit }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === activeCategory));
    }
  }, [activeCategory, images]);

  const fetchImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('k56_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setImages(data || []);
    setIsLoading(false);
  };

  // Navigation Logic
  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Keyboard support
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
      await navigator.share({
        title: 'K56 Gallery',
        text: img.caption,
        url: img.image_url,
      });
    } catch {
      navigator.clipboard.writeText(img.image_url);
      // You can trigger your Notification component here
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
       <Seo title="K56 Gallery" description="Explore moments and milestones from PEFA Kawangware 56 events, community, projects, and behind the scenes." />
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
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <div className={styles.skeletonGrid}>
            {[...Array(limit || 8)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : (
          <motion.div layout className={styles.imageGrid}>
            <AnimatePresence mode='popLayout'>
              {displayImages.map((image, index) => (
                <motion.div 
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={styles.imageCard}
                  onClick={() => setSelectedIndex(index)}
                >
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
            
            <button className={styles.navBtn} style={{ left: '20px' }} onClick={prevImage}>
              <ChevronLeft size={40} />
            </button>

            <motion.div 
              className={styles.lightboxContent}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className={styles.lightboxHeader}>
                <div className={styles.headerInfo}>
                  <h3>{filteredImages[selectedIndex].caption}</h3>
                  <p><Calendar size={14} /> {new Date(filteredImages[selectedIndex].created_at).toLocaleDateString()}</p>
                </div>
                <div className={styles.headerActions}>
                  <button onClick={() => handleDownload(filteredImages[selectedIndex].image_url, `K56-${selectedIndex}.jpg`)}>
                    <Download size={20} />
                  </button>
                  <button onClick={() => handleShare(filteredImages[selectedIndex])}>
                    <Share2 size={20} />
                  </button>
                  <button onClick={() => setSelectedIndex(null)} className={styles.closeBtn}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className={styles.mainImageContainer}>
                <img src={filteredImages[selectedIndex].image_url} alt="Full view" />
              </div>
            </motion.div>

            <button className={styles.navBtn} style={{ right: '20px' }} onClick={nextImage}>
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default K56GalleryPage;
