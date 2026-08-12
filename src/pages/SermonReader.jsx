import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, Calendar, User, Clock, 
  Download, Share2, Printer, Type, 
  Copy, CheckCheck, FileText 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import styles from '../styles/SermonReader.module.css';
import Seo from '../components/Seo';

const SermonReader = () => {
  const { sermonId } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(18); // Default reader font size
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef(null);

  // Calculate Reading Progress
  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateScrollProgress);
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

  // Utility: Estimate Reading Time
  const estimateReadingTime = (text) => {
    if (!text) return 0;
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Feature: Download as Plain Text
  const downloadAsText = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : sermon.content;
    const element = document.createElement("a");
    const file = new Blob([`${sermon.title}\nBy ${sermon.preacher}\n\n${textContent}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${sermon.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  // Feature: Download as PDF
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

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor('#1a1a1a'); // --text-main from CSS
    const splitTitle = doc.splitTextToSize(sermon.title, usableWidth);
    doc.text(splitTitle, pageWidth / 2, y, { align: 'center' });
    y += (splitTitle.length * 8) + 5;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor('#64748b'); // --text-muted from CSS
    const metaData = `By ${sermon.preacher} on ${new Date(sermon.date).toLocaleDateString()}`;
    doc.text(metaData, pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setLineWidth(0.5);
    doc.setDrawColor('#e2e8f0'); // --border-color from CSS
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    const bodyElement = contentRef.current;
    if (bodyElement) {
        doc.html(bodyElement, {
            callback: function (doc) {
                doc.save(`${sermon.title.replace(/\s+/g, '_')}.pdf`);
            },
            x: margin,
            y: y,
            width: usableWidth,
            windowWidth: bodyElement.scrollWidth,
            autoPaging: 'text'
        });
    }
  };

  // Feature: Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Check out this sermon: ${sermon.title}`,
          url: window.location.href,
        });
      } catch (err) { console.log('Error sharing', err); }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const copyToClipboard = () => {
    const textContent = contentRef.current ? contentRef.current.innerText : sermon.content;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className={styles.loader}> <div className={styles.spinner} /> </div>;
  if (error || !sermon) return <div className={styles.statusError}>{error || "Sermon not found"}</div>;

  return (
    <div className={styles.readerContainer}>
      <Seo 
        title={sermon.title} 
        description={sermon.content.substring(0, 160)} 
        url={`/sermons/${sermon.id}`}
        type="article"
        imageData={sermon.image_url}
        author={sermon.preacher}
        datePublished={sermon.date}
        dateModified={sermon.date}
      />
      
      {/* Reading Progress Bar */}
      <div className={styles.progressBar} style={{ width: `${readingProgress}%` }} />

      <nav className={styles.topNav}>
        <Link to="/sermons" className={styles.backLink}>
          <ArrowLeft size={18} /> <span>Library</span>
        </Link>
        
        {/* Floating Action Toolbar */}
        <div className={styles.toolbar}>
          <button onClick={() => setFontSize(prev => Math.min(prev + 2, 26))} title="Increase font">
            <Type size={18} />+
          </button>
          <button onClick={() => setFontSize(prev => Math.max(prev - 2, 14))} title="Decrease font">
            <Type size={14} />-
          </button>
          <div className={styles.divider} />
          <button onClick={copyToClipboard} title="Copy Text">
            {copied ? <CheckCheck size={18} color="#4caf50" /> : <Copy size={18} />}
          </button>
          <button onClick={handleShare} title="Share">
            <Share2 size={18} />
          </button>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}><Download size={18} /></button>
            <div className={styles.dropdownContent}>
              <button onClick={downloadAsPDF}><FileText size={14} /> PDF</button>
              <button onClick={downloadAsText}><FileText size={14} /> Text</button>
              <button onClick={() => window.print()}><Printer size={14} /> Print</button>
            </div>
          </div>
        </div>
      </nav>

      <article className={styles.sermonArticle} style={{ fontSize: `${fontSize}px` }}>
        <header className={styles.sermonHeader}>
          <h1 className={styles.sermonTitle}>{sermon.title}</h1>
          <div className={styles.metaData}>
            <span className={styles.metaItem}><User size={16} /> {sermon.preacher}</span>
            <span className={styles.metaItem}><Calendar size={16} /> {new Date(sermon.date).toLocaleDateString()}</span>
            <span className={styles.metaItem}><Clock size={16} /> {estimateReadingTime(sermon.content)} min read</span>
          </div>
        </header>

        {sermon.video_url && (
          <div className={styles.videoWrapper}>
            <iframe
              src={sermon.video_url.replace('watch?v=', 'embed/')}
              title={sermon.title}
              allowFullScreen
            />
          </div>
        )}

        <div className={styles.sermonBody} ref={contentRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {sermon.content}
          </ReactMarkdown>
        </div>
        
        <footer className={styles.articleFooter}>
            <p>End of Transcript</p>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className={styles.scrollTop}>
                Back to top
            </button>
        </footer>
      </article>
    </div>
  );
};

export default SermonReader;