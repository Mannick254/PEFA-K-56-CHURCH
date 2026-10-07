import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Calendar, User, Clock, 
  Download, Share2, Printer, Type, 
  Copy, CheckCheck, FileText, ChevronUp,
  Sparkles, ShieldCheck, Play, Radio
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import styles from '../styles/SermonReader.module.css';
import Seo from '../components/Seo';
import FeaturedSermons from '../components/FeaturedSermons';
import { getOptimizedImageUrl } from '../image-optimization';

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

const SermonReader = () => {
  const { sermonId } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(24);
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    const fetchSermon = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('id', sermonId)
          .single();
        if (error) throw error;
        setSermon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSermon();
  }, [sermonId]);

  const estimateReadingTime = (text) => {
    if (!text) return 0;
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const downloadAsText = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : sermon.content;
    const element = document.createElement("a");
    const file = new Blob([`${sermon.title}\nSpeaker: ${sermon.preacher}\nDate: ${new Date(sermon.date).toLocaleDateString()}\n\n${textContent}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${sermon.title.replace(/\s+/g, '_')}_Transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - (margin * 2);
    let y = margin;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#0f172a');
    const splitTitle = doc.splitTextToSize(sermon.title, usableWidth);
    doc.text(splitTitle, pageWidth / 2, y, { align: 'center' });
    y += (splitTitle.length * 8) + 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#64748b');
    const metaData = `Speaker: ${sermon.preacher}  |  Published: ${new Date(sermon.date).toLocaleDateString()}`;
    doc.text(metaData, pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setLineWidth(0.5);
    doc.setDrawColor('#0f172a');
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    const bodyElement = contentRef.current;
    if (bodyElement) {
      doc.html(bodyElement, {
        callback: function (doc) {
          doc.save(`${sermon.title.replace(/\s+/g, '_')}_Dispatch.pdf`);
        },
        x: margin,
        y: y,
        width: usableWidth,
        windowWidth: bodyElement.scrollWidth || 800,
        autoPaging: 'text'
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Read sermon transcript: "${sermon.title}" by ${sermon.preacher}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const copyToClipboard = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : sermon.content;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}>
        <Sparkles size={32} className={styles.accentIcon} />
        <p className={styles.loadingText}>LOADING DISPATCH...</p>
      </div>
    </div>
  );

  if (error || !sermon) return (
    <div className={styles.statusError}>
      <h2>Dispatch Not Found</h2>
      <p>{error || "The requested transcript could not be retrieved."}</p>
      <Link to="/sermons" className={styles.errorBackBtn}>Return to Index</Link>
    </div>
  );

  const videoId = getYoutubeId(sermon.video_url);

  return (
    <div className={styles.readerContainer}>
      <Seo 
        title={sermon.title} 
        description={sermon.content ? sermon.content.substring(0, 160) : ''} 
        url={`/sermons/${sermon.id}`}
        type="article"
        imageData={sermon.image_url}
        author={sermon.preacher}
        datePublished={sermon.date}
        dateModified={sermon.date}
      />

      <div className={styles.progressBarTrack}>
        <div className={styles.progressBar} style={{ width: `${readingProgress}%` }} />
      </div>

      <nav className={styles.topNav}>
        <div className={styles.navInner}>
          <Link to="/sermons" className={styles.backLink}>
            <ArrowLeft size={16} /> <span className={styles.backLabel}>SERMONS INDEX</span>
          </Link>
          
          <div className={styles.toolbar}>
            <div className={styles.fontControls}>
              <button 
                onClick={() => setFontSize(prev => Math.min(prev + 2, 28))} 
                title="Increase text size"
                disabled={fontSize >= 28}
                className={styles.fontBtn}
              >
                <Type size={15} /><span className={styles.controlSign}>+</span>
              </button>
              <span className={styles.fontSizeIndicator}>{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.max(prev - 2, 15))} 
                title="Decrease text size"
                disabled={fontSize <= 15}
                className={styles.fontBtn}
              >
                <Type size={12} /><span className={styles.controlSign}>-</span>
              </button>
            </div>

            <div className={styles.divider} />

            <button onClick={copyToClipboard} className={styles.iconBtn} title="Copy Transcript">
              {copied ? <CheckCheck size={16} className={styles.successCheck} /> : <Copy size={16} />}
            </button>
            
            <button onClick={handleShare} className={styles.iconBtn} title="Share Link">
              <Share2 size={16} />
            </button>

            <div className={styles.dropdown}>
              <button className={styles.dropbtn} title="Export Options">
                <Download size={15} /> <span className={styles.btnText}>Export</span>
              </button>
              <div className={styles.dropdownContent}>
                <button onClick={downloadAsPDF}><FileText size={14} /> Download PDF</button>
                <button onClick={downloadAsText}><FileText size={14} /> Plain Text (.txt)</button>
                <button onClick={() => window.print()}><Printer size={14} /> Print Article</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {shareToast && (
        <div className={styles.toastNotification}>
          <ShieldCheck size={16} /> Link copied to clipboard!
        </div>
      )}

      <article className={styles.sermonArticle}>
        <header className={styles.sermonHeader}>
          <div className={styles.kickerBar}>
            <span className={styles.categoryBadge}>TRANSCRIPT DISPATCH</span>
            {videoId && (
              <span className={styles.liveTag}>
                <Radio size={12} className={styles.liveIcon} /> AUDIO / VIDEO
              </span>
            )}
          </div>

          <h1 className={styles.sermonTitle}>{sermon.title}</h1>
          
          <div className={styles.metaData}>
            <span className={styles.metaItem}>
              <User size={15} className={styles.metaIcon} />
              <strong>{sermon.preacher}</strong>
            </span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaItem}>
              <Calendar size={15} className={styles.metaIcon} />
              {new Date(sermon.date).toLocaleDate-String('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className={styles.metaDivider}>|</span>
            <span className={styles.metaItem}>
              <Clock size={15} className={styles.metaIcon} />
              {estimateReadingTime(sermon.content)} min read
            </span>
          </div>
        </header>

        {videoId ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : sermon.image_url ? (
          <figure className={styles.heroImageWrapper}>
            <img 
              src={getOptimizedImageUrl(sermon.image_url, { width: 1200, quality: 90 })} 
              alt={sermon.title} 
              className={styles.heroImage} 
            />
            {sermon.preacher && (
              <figcaption className={styles.imageCaption}>
                Address delivered by {sermon.preacher}.
              </figcaption>
            )}
          </figure>
        ) : null}

        <div 
          className={styles.sermonBody} 
          ref={contentRef}
          style={{ fontSize: `${fontSize}px` }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {sermon.content}
          </ReactMarkdown>
        </div>
        
        <footer className={styles.articleFooter}>
          <div className={styles.endStamp}>
            <span className={styles.squareMarker}>■</span> END OF OFFICIAL TRANSCRIPT
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className={styles.scrollTop}
          >
            Back to Top <ChevronUp size={16} />
          </button>
        </footer>
      </article>

      <FeaturedSermons currentSermonId={sermonId} />
    </div>
  );
};

export default SermonReader;