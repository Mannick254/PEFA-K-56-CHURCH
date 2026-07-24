import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Film } from 'lucide-react'; // Added Film icon
import styles from '../styles/LatestSermon.module.css';
import { supabase } from '../supabaseClient';

const LatestSermon = () => {
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchLatestSermon = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setSermon(data);
      } catch (error) {
        console.error('Error fetching latest sermon:', error);
        setError('Could not fetch the latest sermon.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSermon();
  }, []);

  if (loading) {
    return <div>Loading latest sermon...</div>;
  }
  
  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  if (!sermon) {
    return null;
  }

  const { id, title, preacher, date, thumbnail_url, excerpt } = sermon;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className={styles.sermonSection}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>From the Pulpit</h2>
          <p className={styles.subtitle}>
            Catch up on the most recent message from our services. Join us as we explore God's Word together.
          </p>
        </header>

        <div className={styles.latestSermon}>
          <div className={styles.thumbnailContainer}>
            {thumbnail_url && !imageError ? (
              <img 
                src={thumbnail_url} 
                alt={title} 
                className={styles.thumbnail} 
                onError={handleImageError} 
              />
            ) : (
              <div className={styles.thumbnailFallback}>
                <Film size={48} className={styles.fallbackIcon} />
                <span className={styles.fallbackText}>Sermon Visuals Coming Soon</span>
              </div>
            )}
          </div>

          <div className={styles.content}>
            <h3 className={styles.sermonTitle}>{title}</h3>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Calendar size={14} /> {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className={styles.metaItem}>
                <User size={14} /> {preacher}
              </span>
            </div>
            <p className={styles.excerpt}>{excerpt || 'Join us to discover the key takeaways from this week\'s message.'}</p>
            <div className={styles.ctaContainer}>
              <Link to={`/sermons/${id}`} className={styles.primaryCta}>Listen Now</Link>
              <Link to="/sermons" className={styles.secondaryCta}>More Sermons <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestSermon;
