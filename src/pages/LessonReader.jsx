import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  ArrowLeft, Clock, Share2, Calendar, 
  Type, Copy, CheckCheck, BookOpen, 
  Download, ChevronUp, ShieldCheck 
} from 'lucide-react';
import styles from '../styles/LessonReader.module.css';
import Seo from '../components/Seo';

const LessonReader = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [fontSize, setFontSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);

  // Handle Scroll Progress safely
  useEffect(() => {
    const updateScroll = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        // Fetch from 'jesus_lessons'
        const { data: jesusData } = await supabase
          .from('jesus_lessons')
          .select('lesson_title, message, image_url, created_at')
          .eq('id', lessonId)
          .maybeSingle();

        if (jesusData) {
          setLesson(jesusData);
          setSource("Jesus's Lesson");
        } else {
          // Fetch from 'church_importance'
          const { data: impData } = await supabase
            .from('church_importance')
            .select('title as lesson_title, message, image_url, created_at')
            .eq('id', lessonId)
            .maybeSingle();

          if (impData) {
            setLesson(impData);
            setSource('Church Foundation');
          } else {
            throw new Error('This lesson transcript could not be found.');
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

  // Share functionality with fallback toast
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lesson?.lesson_title,
          text: `Read this lesson: "${lesson?.lesson_title}"`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share error:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const copyToClipboard = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : lesson.message;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : lesson.message;
    const element = document.createElement("a");
    const file = new Blob([`${lesson.lesson_title}\nSource: ${source}\n\n${textContent}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${lesson.lesson_title.replace(/\s+/g, '_')}_Lesson.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className={styles.statusScreen}>
        <div className={styles.loaderIconWrapper}>
          <BookOpen size={32} className={styles.loaderBook} />
        </div>
        <p className={styles.loadingText}>Opening lesson transcript...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className={styles.statusScreen}>
        <h2>Lesson Unavailable</h2>
        <p>{error || "The requested lesson could not be loaded."}</p>
        <Link to="/lessons" className={styles.errorBtn}>Return to Lessons</Link>
      </div>
    );
  }

  const readingTime = Math.max(1, Math.ceil(lesson.message.split(/\s+/).length / 200));

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

      {/* Sticky Top Navbar */}
      <nav className={styles.stickyNav}>
        <div className={styles.navInner}>
          <Link to="/lessons" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Lessons</span>
          </Link>

          <div className={styles.toolbar}>
            {/* Font Sizing Controls */}
            <div className={styles.fontControls}>
              <button 
                onClick={() => setFontSize(prev => Math.min(prev + 2, 26))} 
                title="Increase text size"
                disabled={fontSize >= 26}
              >
                <Type size={16} /><span className={styles.sign}>+</span>
              </button>
              <span className={styles.fontIndicator}>{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.max(prev - 2, 14))} 
                title="Decrease text size"
                disabled={fontSize <= 14}
              >
                <Type size={13} /><span className={styles.sign}>-</span>
              </button>
            </div>

            <div className={styles.divider} />

            <button onClick={copyToClipboard} className={styles.iconBtn} title="Copy Content">
              {copied ? <CheckCheck size={16} className={styles.successIcon} /> : <Copy size={16} />}
            </button>

            <button onClick={downloadAsText} className={styles.iconBtn} title="Download Plain Text">
              <Download size={16} />
            </button>
            
            <button onClick={handleShare} className={styles.iconBtn} title="Share Lesson">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Toast Feedback */}
      {shareToast && (
        <div className={styles.toastNotification}>
          <ShieldCheck size={16} /> Link copied to clipboard!
        </div>
      )}

      {/* Article Body */}
      <article className={styles.article}>
        {lesson.image_url && (
          <div className={styles.heroWrapper}>
            <img src={lesson.image_url} alt={lesson.lesson_title} className={styles.heroImage} />
          </div>
        )}

        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <span className={styles.sourceBadge}>{source}</span>
            <h1 className={styles.title}>{lesson.lesson_title}</h1>
            
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <Clock size={15} />
                <span>{readingTime} min read</span>
              </div>
              {lesson.created_at && (
                <div className={styles.metaItem}>
                  <Calendar size={15} />
                  <span>{new Date(lesson.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </header>

          <section 
            className={styles.bodyContent} 
            ref={contentRef}
            style={{ fontSize: `${fontSize}px` }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {lesson.message}
            </ReactMarkdown>
          </section>

          <footer className={styles.footer}>
            <div className={styles.footerDivider} />
            <p>End of Lesson Study</p>
            <div className={styles.footerActions}>
              <Link to="/lessons" className={styles.finalLink}>
                Explore More Lessons
              </Link>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className={styles.scrollTop}
              >
                Back to Top <ChevronUp size={16} />
              </button>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default LessonReader;