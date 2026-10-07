import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoveRight, 
  BookOpen, 
  Quote, 
  Sparkles, 
  Calendar, 
  Clock, 
  Volume2, 
  Flame, 
  TrendingUp,
  Bookmark
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from '../styles/JesusSection.module.css';

// Helper to estimate reading duration
const getReadTime = (text = '') => {
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
};

const JesusLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('jesus_lessons')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setLessons(data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const featuredLesson = useMemo(() => lessons[0], [lessons]);
  const secondaryHighlights = useMemo(() => lessons.slice(1, 3), [lessons]);
  const archiveLessons = useMemo(() => lessons.slice(3), [lessons]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }} 
        transition={{ repeat: Infinity, duration: 1.8 }}
        className={styles.loader}
      >
        <Sparkles size={36} className={styles.goldIcon} />
        <p>FETCHING EDITORIAL DISPATCHES...</p>
      </motion.div>
    </div>
  );

  return (
    <section className={styles.wrapper} id="lessons">
      {/* Editorial Breaking News Bar */}
      <div className={styles.topNewsTicker}>
        <div className={styles.tickerBadge}>
          <Flame size={13} /> SCRIPTURE SPOTLIGHT
        </div>
        <div className={styles.tickerScroll}>
          <span>"The light shines in the darkness, and the darkness has not overcome it." — John 1:5</span>
        </div>
      </div>

      <div className={styles.container}>
        {/* CNN Style Masthead Header */}
        <header className={styles.sectionHeader}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.badge}
          >
            <BookOpen size={14} /> <span>SPIRITUAL JOURNALISM & ANALYSIS</span>
          </motion.div>
          <h2 className={styles.mainTitle}>Teachings of <span>the Master</span></h2>
          <p className={styles.subtitle}>Timeless wisdom contextualized for modern discipleship</p>
        </header>

        {/* Lead Headline + Top Stories Layout */}
        {featuredLesson && (
          <div className={styles.editorialGrid}>
            {/* Primary Hero Lead Card */}
            <motion.div 
              className={styles.featuredCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.featuredImageWrapper}>
                <img 
                  src={featuredLesson.image_url || 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80'} 
                  alt={featuredLesson.lesson_title} 
                  className={styles.featuredImage}
                />
                <span className={styles.categoryBadge}>FEATURED DISPATCH</span>
                {featuredLesson.scripture_reference && (
                  <div className={styles.imageOverlay}>
                    <span className={styles.scriptureTag}>{featuredLesson.scripture_reference}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.featuredContent}>
                <div className={styles.metaRow}>
                  <span className={styles.dateMeta}>
                    <Calendar size={13} /> 
                    {new Date(featuredLesson.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className={styles.readTime}>
                    <Clock size={13} /> {getReadTime(featuredLesson.message)} min read
                  </span>
                  {featuredLesson.has_audio && (
                    <span className={styles.audioMeta}>
                      <Volume2 size={13} /> Audio Available
                    </span>
                  )}
                </div>

                <h3 className={styles.featuredTitle}>{featuredLesson.lesson_title}</h3>

                <div className={styles.excerpt}>
                  <Quote size={20} className={styles.quoteIcon} />
                  <div className={styles.markdownWrapper}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {featuredLesson.message.length > 210 
                        ? `${featuredLesson.message.substring(0, 210)}...` 
                        : featuredLesson.message}
                    </ReactMarkdown>
                  </div>
                </div>

                <Link to={`/lessons/${featuredLesson.id}`} className={styles.primaryBtn}>
                  Read Full Teaching <MoveRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Secondary Highlight Stories (Right Column) */}
            {secondaryHighlights.length > 0 && (
              <aside className={styles.sideHighlights}>
                <div className={styles.sideHeader}>
                  <TrendingUp size={16} />
                  <span>TOP ANALYSIS</span>
                </div>
                <div className={styles.sideList}>
                  {secondaryHighlights.map((lesson, idx) => (
                    <Link to={`/lessons/${lesson.id}`} key={lesson.id} className={styles.sideItem}>
                      <span className={styles.sideIndex}>0{idx + 1}</span>
                      <div className={styles.sideBody}>
                        {lesson.scripture_reference && (
                          <span className={styles.sideRef}>{lesson.scripture_reference}</span>
                        )}
                        <h4>{lesson.lesson_title}</h4>
                        <span className={styles.sideMeta}>
                          <Clock size={12} /> {getReadTime(lesson.message)} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}

        {/* Previous Wisdom Archive List */}
        {archiveLessons.length > 0 && (
          <div className={styles.archiveSection}>
            <div className={styles.archiveHeader}>
              <h3 className={styles.archiveTitle}>Archive Dispatches</h3>
              <div className={styles.archiveRule} />
            </div>

            <div className={styles.lessonGrid}>
              <AnimatePresence>
                {archiveLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/lessons/${lesson.id}`} className={styles.lessonRow}>
                      <div className={styles.rowInfo}>
                        <div className={styles.rowMeta}>
                          <span className={styles.rowReference}>{lesson.scripture_reference}</span>
                          <span className={styles.rowReadTime}>
                            <Clock size={11} /> {getReadTime(lesson.message)} min
                          </span>
                        </div>
                        <h4 className={styles.rowTitle}>{lesson.lesson_title}</h4>
                      </div>
                      <div className={styles.rowArrow}>
                        <Bookmark size={18} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JesusLessons;