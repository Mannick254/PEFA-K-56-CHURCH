import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRight, BookOpen, Quote, Sparkles, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/JesusLessons.module.css';

const JesusLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  // Separate the newest lesson to feature it prominently
  const { featured, stream } = useMemo(() => {
    return {
      featured: lessons[0],
      stream: lessons.slice(1)
    };
  }, [lessons]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading Eternal Wisdom...
      </motion.div>
    </div>
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* Header Section */}
        <header className={styles.sectionHeader}>
          <div className={styles.badge}>
            <Sparkles size={14} /> <span>DAILY DISCIPLESHIP</span>
          </div>
          <h2 className={styles.mainTitle}>Teachings of <span>the Master</span></h2>
        </header>

        {/* Featured Lesson - Large Editorial Style */}
        {featured && (
          <motion.div 
            className={styles.featuredArea}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.featuredImage}>
              <img src={featured.image_url || '/placeholder-jesus.jpg'} alt="" />
              <div className={styles.featuredOverlay}>
                <span className={styles.scriptureTag}>{featured.scripture_reference}</span>
              </div>
            </div>
            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{featured.lesson_title}</h3>
              <div className={styles.featuredVerse}>
                <Quote size={20} className={styles.goldQuote} />
                <p>{featured.verse}</p>
              </div>
              <div className={styles.markdownWrapper}>
                <ReactMarkdown>{featured.message}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}

        {/* The Wisdom Stream - Sequential Layout */}
        <div className={styles.streamContainer}>
          <div className={styles.streamHeader}>
            <Minus size={40} className={styles.dividerIcon} />
            <h4>Further Lessons</h4>
          </div>

          <div className={styles.streamList}>
            {stream.map((lesson, index) => (
              <motion.div 
                key={lesson.id} 
                className={styles.lessonRow}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className={styles.rowLead}>
                  <span className={styles.rowNumber}>0{index + 1}</span>
                  <div className={styles.rowMeta}>
                    <h4 className={styles.rowTitle}>{lesson.lesson_title}</h4>
                    <span className={styles.rowScripture}>{lesson.scripture_reference}</span>
                  </div>
                </div>

                <div className={styles.rowBody}>
                  <div className={`${styles.rowMessage} ${expandedId === lesson.id ? styles.expanded : ''}`}>
                    <ReactMarkdown>{lesson.message}</ReactMarkdown>
                  </div>
                  
                  <button 
                    className={styles.expandBtn}
                    onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                  >
                    {expandedId === lesson.id ? 'Close Lesson' : 'Read Full Teaching'}
                    <MoveRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default JesusLessons;