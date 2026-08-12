import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, Calendar, User, PlayCircle, BookOpen, Clock, ArrowRight } from 'lucide-react';
import styles from '../styles/Sermons.module.css';
import JesusLessons from '../components/JesusLessons';
import Seo from '../components/Seo';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (err) {
      console.error("Error fetching sermons:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSermons = useMemo(() => {
    return sermons.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.preacher.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sermons, searchTerm]);

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Loading Library...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Seo 
        title="Sermon Library | PEFA Kawangware 56" 
        description="Watch and read life-changing sermons."
        url="/sermons"
        type="website"
      />
      
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Sermon <span>Library</span></h1>
          <p className={styles.subtitle}>Equipping the saints through the power of the Word.</p>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by title, topic, or preacher..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className={styles.sermonsGrid}>
        {filteredSermons.map((sermon) => (
          <SermonCard 
            key={sermon.id} 
            sermon={sermon} 
            isPlaying={playingId === sermon.id}
            onPlay={() => setPlayingId(sermon.id)}
          />
        ))}
      </main>

      {filteredSermons.length === 0 && (
        <div className={styles.emptyState}>
          <BookOpen size={48} />
          <p>No sermons found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className={styles.resetBtn}>Clear Search</button>
        </div>
      )}
      
      <JesusLessons />
    </div>
  );
};

const SermonCard = ({ sermon, isPlaying, onPlay }) => {
  const content = sermon.content || '';
  const hasText = content.trim().length > 0;
  
  // Helper to extract YouTube ID
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(sermon.video_url);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  const imageToDisplay = sermon.image_url || videoThumbnail;

  // IMPORTANT: Modern check to see if we should even show a media frame
  const showMediaFrame = !!(sermon.video_url || sermon.image_url);

  return (
    <article className={`${styles.sermonCard} ${!showMediaFrame ? styles.noMediaCard : ''}`}>
      {showMediaFrame && (
        <div className={styles.mediaContainer}>
          {isPlaying && videoId ? (
            <iframe
              className={styles.videoPlayer}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={sermon.title}
            ></iframe>
          ) : (
            <div 
              className={styles.thumbnailWrapper}
              onClick={videoId ? onPlay : undefined}
            >
              <img 
                src={imageToDisplay || '/placeholder-sermon.jpg'} 
                alt={sermon.title} 
                className={styles.thumbnail}
                loading="lazy"
              />
              <div className={styles.mediaOverlay}>
                {videoId ? (
                  <div className={styles.playAction}>
                    <PlayCircle size={50} strokeWidth={1.5} />
                    <span>Watch Now</span>
                  </div>
                ) : (
                  <Link to={`/sermons/${sermon.id}`} className={styles.playAction}>
                    <BookOpen size={50} strokeWidth={1.5} />
                    <span>Read Notes</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span className={styles.date}>
            <Calendar size={14} /> 
            {new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className={styles.preacher}>
            <User size={14} /> {sermon.preacher}
          </span>
        </div>

        <Link to={`/sermons/${sermon.id}`} className={styles.titleLink}>
          <h2 className={styles.sermonTitle}>{sermon.title}</h2>
        </Link>
        
        <div className={styles.excerpt}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.length > 120 ? `${content.substring(0, 120)}...` : content}
          </ReactMarkdown>
        </div>

        <div className={styles.cardFooter}>
          <Link to={`/sermons/${sermon.id}`} className={styles.readMoreLink}>
            Details <ArrowRight size={16} />
          </Link>
          {videoId && !isPlaying && (
            <button onClick={onPlay} className={styles.quickWatchBtn}>
              <PlayCircle size={16} /> Video
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default Sermons;