import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Share2, Calendar } from 'lucide-react';
import styles from '../styles/LessonReader.module.css';
import Seo from '../components/Seo';

const LessonReader = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle Reading Progress Bar
  useEffect(() => {
    const updateScroll = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setScrollProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        // Try fetching from 'jesus_lessons'
        let { data, error: fetchError } = await supabase
          .from('jesus_lessons')
          .select('lesson_title, message, image_url, created_at')
          .eq('id', lessonId)
          .maybeSingle();

        if (data) {
          setLesson(data);
          setSource("Jesus's Lesson");
        } else {
          // Try 'church_importance'
          const { data: impData } = await supabase
            .from('church_importance')
            .select('title as lesson_title, message, image_url, created_at')
            .eq('id', lessonId)
            .maybeSingle();
          
          if (impData) {
            setLesson(impData);
            setSource('Church Foundation');
          } else {
            throw new Error('This lesson could not be found.');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchContent();
  }, [lessonId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson?.lesson_title,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className={styles.statusScreen}>
        <div className={styles.spinner}></div>
        <p>Opening lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className={styles.statusScreen}>
        <h2>Something went wrong</h2>
        <p>{error || "Lesson not found"}</p>
        <Link to="/lessons" className={styles.errorBtn}>Back to Lessons</Link>
      </div>
    );
  }

  const readingTime = Math.ceil(lesson.message.split(' ').length / 200);

  return (
    <div className={styles.pageBase}>
      <Seo 
        title={lesson.lesson_title} 
        description={lesson.message.substring(0, 160).replace(/[#*`]/g, '')} 
      />

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Sticky Top Nav */}
      <nav className={styles.stickyNav}>
        <div className={styles.navInner}>
          <Link to="/lessons" className={styles.navAction}>
            <ArrowLeft size={20} />
            <span className={styles.navLabel}>Back</span>
          </Link>
          <button onClick={handleShare} className={styles.navAction}>
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      <article className={styles.article}>
        {/* Full Width Hero Image */}
        {lesson.image_url && (
          <div className={styles.heroWrapper}>
            <img src={lesson.image_url} alt="" className={styles.heroImage} />
          </div>
        )}

        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <span className={styles.sourceBadge}>{source}</span>
            <h1 className={styles.title}>{lesson.lesson_title}</h1>
            
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <Clock size={16} />
                <span>{readingTime} min read</span>
              </div>
              {lesson.created_at && (
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{new Date(lesson.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </header>

          <section className={styles.bodyContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {lesson.message}
            </ReactMarkdown>
          </section>

          <footer className={styles.footer}>
            <div className={styles.footerDivider} />
            <p>Thank you for reading this lesson.</p>
            <Link to="/lessons" className={styles.finalLink}>
              Explore more lessons
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default LessonReader;