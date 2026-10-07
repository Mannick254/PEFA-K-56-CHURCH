
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOptimizedImageUrl } from '../image-optimization';
import { ArrowLeft, BookOpen, Clock, Share2, Copy, Check, Bookmark, Type } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from '../styles/ChurchReader.module.css';
import readerStyles from '../styles/SermonReader.module.css';
import Seo from '../components/Seo';
import MarkdownDisplay from '../components/MarkdownDisplay';
import FeaturedSection from '../components/FeaturedSection';

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

const ChurchImportanceReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(22);

  // Smooth editorial reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPoint = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('church_importance')
          .select('*, video_url')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setPoint({
            ...data,
            imageUrl: getOptimizedImageUrl(data.image_url, { width: 1200, quality: 90 })
          });
        }
      } catch (err) {
        console.error('Error fetching church point:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoint();
  }, [id]);

  const readingTime = useMemo(() => {
    if (!point?.message) return 1;
    const words = point.message.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [point]);

  const paragraphs = useMemo(() => {
    if (!point?.message) return [];
    return point.message.split('\n').filter((p) => p.trim().length > 0);
  }, [point]);

  const keyTakeaways = useMemo(() => {
    if (paragraphs.length <= 1) return [];
    return paragraphs.slice(0, 3).map((p) => {
      const firstSentence = p.split('.')[0];
      return firstSentence.length > 120 ? `${firstSentence.substring(0, 117)}...` : firstSentence;
    });
  }, [paragraphs]);

  const handleBack = () => navigate('/#church-importance');

  const handleShare = useCallback(async () => {
    const shareData = {
      title: point?.title || 'Church Importance',
      text: point?.message?.substring(0, 100),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  }, [point]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Loading story...</p>
      </div>
    );
  }

  if (error || !point) {
    return (
      <div className={styles.errorContainer}>
        <Seo title="Error" />
        <h2>Unable to load article</h2>
        <p>{error || "We couldn't find the content you're looking for."}</p>
        <button onClick={handleBack} className={styles.backButton}>
          Return Home
        </button>
      </div>
    );
  }

  const videoId = getYoutubeId(point.video_url);

  return (
    <div className={styles.pageWrapper}>
      <Seo title={point.title} description={point.message.substring(0, 160)} />

      <motion.div className={styles.progressBar} style={{ scaleX }} />

      <nav className={styles.navHeader}>
        <div className={styles.navContent}>
          <button onClick={handleBack} className={styles.iconButton} aria-label="Go back">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className={readerStyles.fontControls} style={{ margin: '0 auto'}}>
            <button 
                onClick={() => setFontSize(prev => Math.min(prev + 2, 32))} 
                title="Increase text size"
                disabled={fontSize >= 32}
                className={readerStyles.fontBtn}
            >
                <Type size={15} /><span className={readerStyles.controlSign}>+</span>
            </button>
            <span className={readerStyles.fontSizeIndicator}>{fontSize}px</span>
            <button 
                onClick={() => setFontSize(prev => Math.max(prev - 2, 16))} 
                title="Decrease text size"
                disabled={fontSize <= 16}
                className={readerStyles.fontBtn}
            >
                <Type size={12} /><span className={readerStyles.controlSign}>-</span>
            </button>
          </div>

          <div className={styles.navActions}>
            <button
              className={styles.iconButton}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Save for later"
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button className={styles.iconButton} onClick={handleShare} aria-label="Share article">
              {copied ? <Check size={18} className={styles.successIcon} /> : <Share2 size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.articleHeader}
        >
          <div className={styles.kicker}>
            <span className={styles.kickerCategory}>SPIRITUAL GROWTH</span>
            <span className={styles.kickerDivider}>|</span>
            <span className={styles.kickerSub}>EXAMINING FAITH</span>
          </div>

          <h1 className={styles.title}>{point.title}</h1>

          <div className={styles.bylineRow}>
            <div className={styles.metaItem}>
              <Clock size={15} />
              <span>{readingTime} min read</span>
            </div>
            <span className={styles.dotSeparator}>•</span>
            <div className={styles.metaItem}>
              <BookOpen size={15} />
              <span>Church Importance Series</span>
            </div>
          </div>
        </motion.header>

        {videoId ? (
            <div className={styles.videoWrapper}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={point.title}
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        ) : point.imageUrl && (
          <motion.figure
            className={styles.heroImageWrapper}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <img src={point.imageUrl} alt={point.title} className={styles.heroImage} />
            <figcaption className={styles.imageCaption}>
              {point.title} — Exploring the foundational role of faith communities.
            </figcaption>
          </motion.figure>
        )}

        {keyTakeaways.length > 0 && (
          <motion.div
            className={styles.takeawaysBox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className={styles.takeawaysTitle}>Key Takeaways</h3>
            <ul className={styles.takeawaysList}>
              {keyTakeaways.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.article
          className={`${styles.articleBody} ${readerStyles.sermonBody}`}
          style={{ fontSize: `${fontSize}px` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MarkdownDisplay markdown={point.message} />
        </motion.article>

        <footer className={styles.articleFooter}>
          <div className={styles.footerShareBar}>
            <p>Enjoyed this reading? Share it with your community.</p>
            <button onClick={handleShare} className={styles.shareBtn}>
              <Share2 size={16} />
              <span>{copied ? 'Link Copied!' : 'Share Story'}</span>
            </button>
          </div>

          <div className={styles.footerLine} />

          <div className={styles.footerNavigation}>
            <button onClick={handleBack} className={styles.finalBackBtn}>
              <ArrowLeft size={16} />
              <span>Explore More Topics</span>
            </button>
          </div>
        </footer>
        
        <FeaturedSection currentPointId={id} />
      </main>
    </div>
  );
};

export default ChurchImportanceReader;