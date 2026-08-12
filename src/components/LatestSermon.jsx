import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/LatestSermon.module.css';
import { PlayCircle, Calendar, User, BookOpen, ArrowRight } from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const SermonCard = ({ sermon }) => {
  const { id, title, preacher, series, video_url, date } = sermon;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const videoId = getYouTubeId(video_url);
  // Using hqdefault for guaranteed availability or maxresdefault for high quality
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <Link to={`/sermons/${id}`} className={styles.sermonCard}>
      <div className={styles.imageWrapper}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className={styles.thumbnail} />
        ) : (
          <div className={styles.placeholderImg}><BookOpen size={48} /></div>
        )}
        <div className={styles.playOverlay}>
          <div className={styles.playBtnInner}>
            <PlayCircle size={48} fill="rgba(255,255,255,0.2)" />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.seriesBadge}>
            {series || "General Message"}
          </span>
          <span className={styles.dateBadge}>
            <Calendar size={14} /> {formattedDate}
          </span>
        </div>
        
        <h3 className={styles.sermonTitle}>{title}</h3>
        
        <div className={styles.footer}>
          <div className={styles.preacherInfo}>
            <div className={styles.avatarMini}>{preacher.charAt(0)}</div>
            <span>{preacher}</span>
          </div>
          <div className={styles.ctaText}>
            Watch <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const LatestSermon = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestSermons = async () => {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);

        if (error) throw error;
        setSermons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSermons();
  }, []);

  if (loading) {
    return (
      <section className={styles.latestSermonSection}>
        <div className={styles.container}>
            <div className={styles.headerSkeleton}></div>
            <div className={styles.sermonGrid}>
                <div className={styles.skeletonCard}></div>
                <div className={styles.skeletonCard}></div>
                <div className={styles.skeletonCard}></div>
            </div>
        </div>
      </section>
    );
  }

  if (error || sermons.length === 0) return null;

  return (
    <section className={styles.latestSermonSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.tagline}>Spiritual Nourishment</span>
            <h2 className={styles.title}>Latest From The Pulpit</h2>
          </div>
          <Link to="/sermons" className={styles.viewAll}>View All Sermons</Link>
        </div>

        <div className={styles.sermonGrid}>
          {sermons.map(sermon => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestSermon;