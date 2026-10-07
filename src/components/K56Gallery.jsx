import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { X, ChevronRight, Film, Sparkles, Search, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGalleryMedia } from '../hooks/useGalleryMedia';
import GalleryLightbox from './GalleryLightbox';
import styles from '../styles/K56Gallery.module.css';

const CATEGORIES = [
  'All',
  'Events',
  'Sunday Service',
  'Special Programs',
  'Outreach',
  'Kids & Youth',
  'Workshops',
  'Community',
  'Behind the Scenes',
  'Testimonies',
];

const K56Gallery = ({ limit }) => {
  const {
    media,
    filteredMedia,
    images,
    videos,
    isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    getVisuallySimilar,
  } = useGalleryMedia(limit);

  const [selectedItem, setSelectedItem] = useState(null);
  const [featuredVideoOrientation, setFeaturedVideoOrientation] = useState('landscape');
  const [featuredImageOrientation, setFeaturedImageOrientation] = useState('landscape');

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const sidebarVideos = videos.length > 1 ? videos.slice(1, 5) : [];

  const bigCardImage = images.length > 0 ? images[0] : null;
  const sidebarImages = images.length > 1 ? images.slice(1, 5) : [];
  const galleryImages = images.length > 5 ? images.slice(5) : [];

  const visuallySimilarItems = useMemo(
    () => getVisuallySimilar(selectedItem),
    [selectedItem, getVisuallySimilar]
  );

  const handleVideoMetadata = (e) => {
    const { videoWidth, videoHeight } = e.target;
    setFeaturedVideoOrientation(videoWidth < videoHeight ? 'portrait' : 'landscape');
  };

  const handleImageMetadata = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setFeaturedImageOrientation(naturalWidth < naturalHeight ? 'portrait' : 'landscape');
  };

  if (isLoading) {
    return (
      <div className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.imageGrid}>
            {[...Array(limit || 12)].map((_, i) => (
              <div key={i} className={`${styles.skeletonCard} ${styles.pulse}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        {/* Compact Header Bar */}
        <header className={styles.galleryHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.headerBadge}>
              <Cpu size={12} className={styles.aiIcon} /> Powered by pefak56 Visual AI
            </div>
            <h2 className={styles.title}>
              K56 Media <span className={styles.subtitleInline}>— Moments & Milestones</span>
            </h2>
          </div>

          <div className={styles.headerControls}>
            <div className={styles.searchBarWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="AI Natural Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Compact Filter Bar */}
        <div className={styles.filterWrapper}>
          <div className={styles.filterBar}>
            {CATEGORIES.map((cat) => (
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

        {/* Videos Section (CNN Split Feature Layout) */}
        {videos.length > 0 && (
          <div className={styles.mediaSection}>
            <div className={styles.sectionHeaderCompact}>
              <h3 className={styles.sectionTitle}>Featured Videos</h3>
            </div>
            <div
              className={`${styles.cnnLayout} ${
                featuredVideoOrientation === 'portrait' ? styles.portraitMode : styles.landscapeMode
              }`}
            >
              {featuredVideo && (
                <div
                  className={`${styles.mainFeatureCard} ${styles.mediaCard}`}
                  onClick={() => setSelectedItem(featuredVideo)}
                >
                  <video
                    key={featuredVideo.id}
                    src={featuredVideo.image_url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    className={styles.mainVideoPlayer}
                    onLoadedMetadata={handleVideoMetadata}
                  />
                  <div className={styles.mediaOverlay}>
                    <div className={styles.playIconWrapper}>
                      <Film size={24} />
                    </div>
                    <h3>{featuredVideo.caption}</h3>
                  </div>
                </div>
              )}

              {sidebarVideos.length > 0 && (
                <div className={styles.sidebarStack}>
                  {sidebarVideos.map((video) => (
                    <div
                      key={video.id}
                      className={styles.sidebarCardItem}
                      onClick={() => setSelectedItem(video)}
                    >
                      <div className={styles.sidebarThumbWrapper}>
                        <video src={video.image_url} muted playsInline preload="metadata" />
                        <div className={styles.miniPlayBadge}>
                          <Film size={14} />
                        </div>
                      </div>
                      <div className={styles.sidebarInfo}>
                        <span className={styles.cardCategory}>{video.category}</span>
                        <h4>{video.caption}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Section (CNN Split Feature Layout) */}
        {images.length > 0 && (
          <div className={styles.mediaSection}>
            <div className={styles.sectionHeaderCompact}>
              <h3 className={styles.sectionTitle}>Featured Images</h3>
            </div>
            <div
              className={`${styles.cnnLayout} ${
                featuredImageOrientation === 'portrait'
                  ? styles.portraitMode
                  : styles.landscapeMode
              }`}
            >
              {bigCardImage && (
                <div
                  className={`${styles.mainFeatureCard} ${styles.mediaCard}`}
                  onClick={() => setSelectedItem(bigCardImage)}
                >
                  <img
                    src={bigCardImage.image_url}
                    alt={bigCardImage.caption}
                    onLoad={handleImageMetadata}
                  />
                  <div className={styles.mediaOverlay}>
                    <h3>{bigCardImage.caption}</h3>
                  </div>
                </div>
              )}

              {sidebarImages.length > 0 && (
                <div className={styles.sidebarStack}>
                  {sidebarImages.map((image) => (
                    <div
                      key={image.id}
                      className={styles.sidebarCardItem}
                      onClick={() => setSelectedItem(image)}
                    >
                      <div className={styles.sidebarThumbWrapper}>
                        <img src={image.image_url} alt={image.caption} />
                      </div>
                      <div className={styles.sidebarInfo}>
                        <span className={styles.cardCategory}>{image.category}</span>
                        <h4>{image.caption}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rest of Gallery Images */}
            {galleryImages.length > 0 && (
              <LayoutGroup>
                <motion.div layout className={styles.imageGrid}>
                  <AnimatePresence mode="popLayout">
                    {galleryImages.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className={styles.imageCard}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className={styles.imageWrapper}>
                          <img src={item.image_url} alt={item.caption} loading="lazy" />
                          <div className={styles.aiBadge}>
                            <Sparkles size={11} /> {item.ai_quality_score}% Match
                          </div>
                          <div className={styles.overlay}>
                            <div className={styles.overlayContent}>
                              <span className={styles.tag}>{item.category}</span>
                              <p className={styles.captionText}>{item.caption}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            )}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && videos.length === 0 && !isLoading && (
          <div className={styles.noResults}>
            <h3>No media found.</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}

        {/* View All Link */}
        {limit && media.length > limit && (
          <div className={styles.viewAllContainer}>
            <Link to="/k56-gallery" className={styles.viewAllButton}>
              Explore Full Gallery
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        selectedItem={selectedItem}
        filteredMedia={filteredMedia}
        visuallySimilarItems={visuallySimilarItems}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
      />
    </section>
  );
};

export default K56Gallery;
