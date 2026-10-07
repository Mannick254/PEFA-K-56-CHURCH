import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/JesusLessons.module.css';
import Seo from '../components/Seo';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight, 
  Flame, 
  Volume2, 
  Sparkles, 
  Share2, 
  Filter 
} from 'lucide-react';

// Helper to strip markdown for plain text excerpts
const stripMarkdown = (text = '') => {
  // Removes common markdown syntax like *, #, _, `, ~, >
  return text.replace(/[#*_`~>]/g, '');
};

// Helper to estimate reading duration
const getReadTime = (text = '') => {
  const wpm = 180;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
};

const JesusLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jesus_lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setLessons(data || []);
      }
      setLoading(false);
    };

    fetchLessons();
  }, []);

  // Derive dynamic topic tags/categories
  const tags = useMemo(() => {
    const extracted = lessons.map((l) => l.category || l.topic || 'Teachings');
    return ['All', ...new Set(extracted)];
  }, [lessons]);

  // Filter lessons based on search query and category tags
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch = 
        lesson.lesson_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.scripture_reference?.toLowerCase().includes(searchQuery.toLowerCase());

      const lessonTag = lesson.category || lesson.topic || 'Teachings';
      const matchesTag = selectedTag === 'All' || lessonTag === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [lessons, searchQuery, selectedTag]);

  // Featured Lead Lesson
  const leadLesson = filteredLessons[0];
  const remainingLessons = filteredLessons.slice(1);

  const handleShare = async (e, lesson) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: lesson.lesson_title,
          text: `Read this lesson: ${lesson.lesson_title}`,
          url: `${window.location.origin}/lessons/${lesson.id}`,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    }
  };

  return (
    <div className={styles.editorialContainer}>
      <Seo
        title="Teachings & Scripture Insights | CNN Style Newsroom"
        description="Explore deep spiritual lessons, teachings, and scripture analysis from Jesus Christ."
      />

      {/* Breaking / Featured Scripture Banner */}
      <div className={styles.topAlertBar}>
        <div className={styles.alertBadge}>
          <Flame size={14} /> DAILY SCRIPTURE
        </div>
        <p className={styles.alertText}>
          "I am the light of the world. Whoever follows me will never walk in darkness." — John 8:12
        </p>
      </div>

      <div className={styles.innerWrapper}>
        {/* Newsroom Header */}
        <header className={styles.editorialHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.kicker}>
              <BookOpen size={16} /> SPIRITUAL INSIGHTS & SERIES
            </span>
            <h1>Lessons from Jesus</h1>
            <p className={styles.subtitle}>
              In-depth commentary, parables, and timeless principles applied to modern living.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className={styles.controlBar}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search teachings, topics, or scripture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Mobile Swipeable Filter Tags */}
            <div className={styles.tagsScrollContainer}>
              <Filter size={16} className={styles.filterIcon} />
              <div className={styles.tagsWrapper}>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.tagPill} ${selectedTag === tag ? styles.activeTag : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Loading State Skeleton */}
        {loading && (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonLead}></div>
            <div className={styles.skeletonGrid}>
              <div className={styles.skeletonCard}></div>
              <div className={styles.skeletonCard}></div>
              <div className={styles.skeletonCard}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorBox}>
            <p>Unable to retrieve editorial lessons at this time. ({error})</p>
          </div>
        )}

        {/* Content Display */}
        {!loading && !error && (
          <>
            {filteredLessons.length === 0 ? (
              <div className={styles.emptyState}>
                <Sparkles size={32} />
                <h3>No teachings match your criteria</h3>
                <p>Try resetting your search query or selecting a different category filter.</p>
              </div>
            ) : (
              <>
                {/* Lead Headline Banner (Top Story) */}
                {leadLesson && (
                  <section className={styles.leadSection}>
                    <Link to={`/lessons/${leadLesson.id}`} className={styles.leadCard}>
                      {leadLesson.image_url && (
                        <div className={styles.leadImageWrapper}>
                          <img src={leadLesson.image_url} alt={leadLesson.lesson_title} />
                          <span className={styles.leadTag}>
                            {leadLesson.category || 'Featured Lesson'}
                          </span>
                        </div>
                      )}
                      <div className={styles.leadContent}>
                        <div className={styles.metaRow}>
                          <span className={styles.readTime}>
                            <Clock size={14} /> {getReadTime(leadLesson.message)} min read
                          </span>
                          {leadLesson.has_audio && (
                            <span className={styles.audioBadge}>
                              <Volume2 size={14} /> Audio Available
                            </span>
                          )}
                        </div>
                        <h2>{leadLesson.lesson_title}</h2>
                        {leadLesson.scripture_reference && (
                          <div className={styles.scriptureTag}>
                            Reference: {leadLesson.scripture_reference}
                          </div>
                        )}
                        <p className={styles.leadExcerpt}>
                          {stripMarkdown(leadLesson.message).substring(0, 180)}...
                        </p>
                        <div className={styles.leadFooter}>
                          <span className={styles.readLink}>
                            Read Full Insight <ArrowRight size={16} />
                          </span>
                          <button
                            className={styles.shareBtn}
                            onClick={(e) => handleShare(e, leadLesson)}
                            aria-label="Share story"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </section>
                )}

                {/* Sub-Lessons Grid */}
                {remainingLessons.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionDivider}>
                      <h3>More Lessons & Parables</h3>
                      <div className={styles.rule} />
                    </div>

                    <div className={styles.lessonsGrid}>
                      {remainingLessons.map((lesson) => (
                        <Link
                          to={`/lessons/${lesson.id}`}
                          key={lesson.id}
                          className={styles.lessonCard}
                        >
                          {lesson.image_url && (
                            <div className={styles.cardImage}>
                              <img src={lesson.image_url} alt={lesson.lesson_title} />
                              <span className={styles.cardCategory}>
                                {lesson.category || 'Teaching'}
                              </span>
                            </div>
                          )}
                          <div className={styles.cardContent}>
                            <div className={styles.cardMeta}>
                              <span>
                                <Clock size={12} /> {getReadTime(lesson.message)} min
                              </span>
                              {lesson.scripture_reference && (
                                <span className={styles.miniReference}>
                                  {lesson.scripture_reference}
                                </span>
                              )}
                            </div>
                            <h3>{lesson.lesson_title}</h3>
                            <p>{stripMarkdown(lesson.message).substring(0, 90)}...</p>
                            <div className={styles.cardFooter}>
                              <span className={styles.cardReadMore}>
                                Read Story <ArrowRight size={14} />
                              </span>
                              <button
                                className={styles.miniShareBtn}
                                onClick={(e) => handleShare(e, lesson)}
                                aria-label="Share"
                              >
                                <Share2 size={14} />
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JesusLessons;