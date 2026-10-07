import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOptimizedImageUrl } from '../image-optimization';
import { Play, Clock, Video } from 'lucide-react';
import styles from '../styles/FeaturedSermons.module.css';

// Helper function to remove markdown
const removeMarkdown = (text) => {
  if (!text) return '';
  // This regex will remove most common markdown syntax
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2')   // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // Links
    .replace(/#+\s/g, '')              // Headers
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Code
    .replace(/>\s/g, '')               // Blockquotes
    .replace(/-\s/g, '')               // List items
    .replace(/\n/g, ' ');              // New lines
};

// Helper function to extract YouTube ID
const getYoutubeId = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      return urlObj.searchParams.get('v');
    }
  } catch (e) {
    console.error('Invalid URL:', e);
    return null;
  }
  return null;
};

const FeaturedSermons = ({ currentSermonId }) => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('sermons')
          .select('id, title, content, image_url, video_url, created_at')
          .order('id', { ascending: false })
          .limit(4);

        if (currentSermonId) {
          query = query.neq('id', currentSermonId);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) setFeatured(data);
      } catch (err) {
        console.error('Error fetching featured sermons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [currentSermonId]);

  // Helper to estimate read/listen time
  const getReadTime = useCallback((content = '') => {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, []);

  if (loading) return <SkeletonLoader />;

  if (!featured || featured.length === 0) return null;

  return (
    <section className={styles.featuredSection}>
      {/* Editorial Header Bar */}
      <header className={styles.sectionHeader}>
        <div className={styles.kickerRow}>
          <span className={styles.kickerBadge}>NEXT IN SERIES</span>
          <span className={styles.kickerDivider}>|</span>
          <span className={styles.kickerText}>RECOMMENDED WATCHES</span>
        </div>
        <h3 className={styles.sectionTitle}>Continue Listening</h3>
        <div className={styles.headerAccent} />
      </header>

      {/* Grid Layout */}
      <div className={styles.featuredGrid}>
        {featured.map((item) => {
          const videoId = getYoutubeId(item.video_url);
          const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
          const imageToDisplay =
            videoThumbnail ||
            (item.image_url
              ? getOptimizedImageUrl(item.image_url, { width: 600, quality: 85 })
              : 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80');

          const hasVideo = Boolean(videoId || item.video_url);
          const estTime = getReadTime(item.content);
          const description = removeMarkdown(item.content);

          return (
            <article
              key={item.id}
              className={styles.featuredCard}
              onClick={() => navigate(`/sermons/${item.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(`/sermons/${item.id}`);
              }}
            >
              {/* Media Container with CNN Play Button Overlay */}
              <div className={styles.imageWrapper}>
                <img src={imageToDisplay} alt={item.title} className={styles.cardImage} loading="lazy" />

                {hasVideo && (
                  <div className={styles.playOverlay}>
                    <div className={styles.playCircle}>
                      <Play size={16} fill="currentColor" className={styles.playIcon} />
                    </div>
                  </div>
                )}

                <div className={styles.mediaTag}>
                  {hasVideo ? (
                    <span className={styles.videoBadge}>
                      <Video size={11} /> VIDEO
                    </span>
                  ) : (
                    <span className={styles.audioBadge}>SERMON</span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardContent}>
                <div className={styles.metaRow}>
                  <span className={styles.topicLabel}>SPIRITUAL MESSAGES</span>
                  <span className={styles.dotSeparator}>•</span>
                  <span className={styles.timeLabel}>
                    <Clock size={12} /> {estTime} min read
                  </span>
                </div>

                <h4 className={styles.cardTitle}>{item.title}</h4>

                <p className={styles.cardDescription}>
                  {description.length > 110
                    ? `${description.substring(0, 110).trim()}...`
                    : description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const SkeletonLoader = () => (
  <div className={styles.featuredSection}>
    <div className={styles.skeletonHeader} />
    <div className={styles.featuredGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  </div>
);

export default FeaturedSermons;
