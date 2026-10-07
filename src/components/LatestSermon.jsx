import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { PlayCircle, ChevronLeft, ChevronRight, Clock, User, Calendar } from 'lucide-react';
import styles from '../styles/LatestSermon.module.css';

// Helper to extract YouTube ID
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Modernized Card Component
const SermonCard = ({ sermon, variant = 'standard', onPlay, isPlaying }) => {
  const videoId = getYoutubeId(sermon?.video_url);
  const imageToDisplay =
    sermon?.image_url ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/placeholder-sermon.jpg');

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (sermon?.id) onPlay(sermon.id);
  };

  const formattedDate = sermon?.date
    ? new Date(sermon.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.mediaContainer}>
        {isPlaying && videoId ? (
          <iframe
            className={styles.videoPlayer}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={sermon?.title}
          />
        ) : (
          <Link to={`/sermons/${sermon?.id}`} className={styles.mediaLink}>
            <img src={imageToDisplay} alt={sermon?.title} className={styles.thumbnail} />
            <div className={styles.overlayGradient} />
            
            {sermon?.series && (
              <span className={styles.seriesTag}>{sermon.series}</span>
            )}

            {videoId && (
              <button
                type="button"
                className={styles.playIconWrapper}
                onClick={handlePlayClick}
                aria-label="Play video"
              >
                <PlayCircle size={48} className={styles.playIcon} />
              </button>
            )}
          </Link>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.metaTop}>
          {formattedDate && (
            <span className={styles.metaItem}>
              <Calendar size={13} /> {formattedDate}
            </span>
          )}
          {sermon?.duration && (
            <span className={styles.metaItem}>
              <Clock size={13} /> {sermon.duration}
            </span>
          )}
        </div>

        <h3 className={styles.sermonTitle}>
          <Link to={`/sermons/${sermon?.id}`}>{sermon?.title}</Link>
        </h3>

        {sermon?.preacher && (
          <div className={styles.preacherMeta}>
            <User size={14} />
            <span>{sermon.preacher}</span>
          </div>
        )}

        {variant === 'heroCard' && sermon?.description && (
          <p className={styles.description}>{sermon.description}</p>
        )}
      </div>
    </article>
  );
};

const LatestSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const fetchLatestSermons = async () => {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false })
          .limit(10); // Fetched 10 to populate carousel & side lists

        if (error) throw error;
        setSermons(data || []);
      } catch (err) {
        console.error('Error fetching latest sermons:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestSermons();
  }, []);

  // Hero slideshow auto-rotation (rotates top 3 featured sermons)
  const heroSermons = sermons.slice(0, 3);
  const sideSermons = sermons.slice(3, 6);
  const bottomGridSermons = sermons.slice(6, 10);

  const nextHero = useCallback(() => {
    if (heroSermons.length === 0) return;
    setActiveHeroIndex((prev) => (prev + 1) % heroSermons.length);
  }, [heroSermons.length]);

  const prevHero = () => {
    if (heroSermons.length === 0) return;
    setActiveHeroIndex((prev) => (prev - 1 + heroSermons.length) % heroSermons.length);
  };

  useEffect(() => {
    // Only auto-slide if video isn't actively playing
    if (playingId) return;
    const interval = setInterval(nextHero, 6000);
    return () => clearInterval(interval);
  }, [nextHero, playingId]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
        <p>Loading Latest Sermons...</p>
      </div>
    );
  }

  if (sermons.length === 0) {
    return <p className={styles.noData}>No sermons found.</p>;
  }

  const currentHero = heroSermons[activeHeroIndex] || heroSermons[0];

  return (
    <section className={styles.container}>
      {/* CNN Style Header with Live Indicator */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.liveBadge}>FEATURED</span>
          <h2 className={styles.title}>Latest Messages</h2>
        </div>
        <Link to="/sermons" className={styles.viewAllLink}>
          View All Sermons &rarr;
        </Link>
      </div>

      {/* Main Section: Interactive Hero + Side Feed */}
      <div className={styles.mainLayout}>
        {/* Left/Main Column: Modern Hero Slideshow */}
        {currentHero && (
          <div className={styles.heroWrapper}>
            <SermonCard
              sermon={currentHero}
              variant="heroCard"
              onPlay={setPlayingId}
              isPlaying={playingId === currentHero.id}
            />

            {/* Carousel Navigation Controls */}
            {heroSermons.length > 1 && (
              <div className={styles.carouselControls}>
                <button onClick={prevHero} className={styles.controlBtn} aria-label="Previous">
                  <ChevronLeft size={20} />
                </button>
                <div className={styles.dots}>
                  {heroSermons.map((_, idx) => (
                    <button
                      key={idx}
                      className={`${styles.dot} ${idx === activeHeroIndex ? styles.activeDot : ''}`}
                      onClick={() => setActiveHeroIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button onClick={nextHero} className={styles.controlBtn} aria-label="Next">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Trending / Next Up List (CNN Side Column) */}
        <aside className={styles.sideFeed}>
          <h3 className={styles.sideFeedTitle}>Up Next</h3>
          <div className={styles.sideFeedList}>
            {sideSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                variant="compactHorizontal"
                onPlay={setPlayingId}
                isPlaying={playingId === sermon.id}
              />
            ))}
          </div>
        </aside>
      </div>

      {/* Bottom Row: Multi-Column Grid */}
      {bottomGridSermons.length > 0 && (
        <div className={styles.bottomSection}>
          <h3 className={styles.sectionSubtitle}>Recent Series</h3>
          <div className={styles.bottomGrid}>
            {bottomGridSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                variant="gridCard"
                onPlay={setPlayingId}
                isPlaying={playingId === sermon.id}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestSermons;
