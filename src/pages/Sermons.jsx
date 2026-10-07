import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, Calendar, User, PlayCircle, BookOpen, ArrowRight, Video, Flame, TrendingUp } from 'lucide-react';
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

  // Breakdown for CNN Layout when not searching
  const isSearching = searchTerm.trim().length > 0;
  const leadSermon = !isSearching && filteredSermons.length > 0 ? filteredSermons[0] : null;
  const sideSermons = !isSearching && filteredSermons.length > 1 ? filteredSermons.slice(1, 4) : [];
  const mainGridSermons = !isSearching ? filteredSermons.slice(4) : filteredSermons;

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Loading Sermon Network...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Seo 
        title="Sermon Library | PEFA Kawangware 56" 
        description="Watch and read life-changing sermons in a modern news layout."
        url="/sermons"
        type="website"
      />
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brandBadge}>
            <span className={styles.liveDot}></span> PEFA K56 STYLE
          </div>
          <h1 className={styles.pageTitle}>Sermon <span>Network</span></h1>
          <p className={styles.subtitle}>Equipping the saints through the power of the Word.</p>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search headlines, topics, or preachers..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* LEAD FEATURE STORY (BIG CARD) */}
      {leadSermon && (
        <section className={styles.leadSection}>
          <BigFeatureCard 
            sermon={leadSermon} 
            isPlaying={playingId === leadSermon.id}
            onPlay={() => setPlayingId(leadSermon.id)}
          />
        </section>
      )}

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div className={styles.mainLayout}>
        {/* Left / Center Grid */}
        <div className={styles.gridSection}>
          {!isSearching && mainGridSermons.length > 0 && (
            <div className={styles.sectionHeader}>
              <Flame size={18} className={styles.sectionIcon} />
              <h2>MORE HEADLINES</h2>
            </div>
          )}

          <main className={styles.sermonsGrid}>
            {mainGridSermons.map((sermon) => (
              <SermonCard 
                key={sermon.id} 
                sermon={sermon} 
                isPlaying={playingId === sermon.id}
                onPlay={() => setPlayingId(sermon.id)}
              />
            ))}
          </main>
        </div>

        {/* CNN Right Sidebar Bulletins */}
        {!isSearching && sideSermons.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <TrendingUp size={18} className={styles.sidebarIcon} />
              <h3>QUICK BULLETINS</h3>
            </div>
            <div className={styles.sideCardsContainer}>
              {sideSermons.map((sermon) => (
                <SideSermonCard 
                  key={sermon.id} 
                  sermon={sermon}
                  isPlaying={playingId === sermon.id}
                  onPlay={() => setPlayingId(sermon.id)}
                />
              ))}
            </div>
          </aside>
        )}
      </div>

      {filteredSermons.length === 0 && (
        <div className={styles.emptyState}>
          <BookOpen size={48} />
          <p>No sermon features found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className={styles.resetBtn}>Clear Search</button>
        </div>
      )}
      
      <JesusLessons />
    </div>
  );
};

/* ==========================================================================
   1. BIG FEATURE CARD (Lead Headline)
   ========================================================================== */
const BigFeatureCard = ({ sermon, isPlaying, onPlay }) => {
  const videoId = getYoutubeId(sermon.video_url);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  const imageToDisplay = sermon.image_url || videoThumbnail;
  const content = sermon.content || '';

  return (
    <article className={styles.bigCard}>
      <div className={styles.bigMediaContainer}>
        <div className={`${styles.cnnTag} ${styles.leadTag}`}>
          {videoId ? <><Video size={13} /> FEATURED BROADCAST</> : <><BookOpen size={13} /> TOP STORY</>}
        </div>

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
              className={styles.bigThumbnail}
              style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
            />
            <div className={styles.mediaOverlay}>
              {videoId && (
                <div className={styles.bigPlayButton}>
                  <PlayCircle size={64} strokeWidth={1.5} />
                  <span>WATCH SPECIAL REPORT</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bigCardBody}>
        <div className={styles.metaHeader}>
          <span className={styles.preacher}><User size={14} /> {sermon.preacher}</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.date}>
            <Calendar size={14} /> 
            {new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <Link to={`/sermons/${sermon.id}`} className={styles.headlineLink}>
          <h1 className={styles.bigHeadline}>{sermon.title}</h1>
        </Link>
        
        <div className={styles.bigExcerpt}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.length > 220 ? `${content.substring(0, 220)}...` : content}
          </ReactMarkdown>
        </div>

        <div className={styles.bigCardFooter}>
          <Link to={`/sermons/${sermon.id}`} className={styles.readStoryLink}>
            READ FULL SERMON NOTES <ArrowRight size={16} />
          </Link>
          {videoId && !isPlaying && (
            <button onClick={onPlay} className={styles.cnnWatchBtn}>
              <PlayCircle size={16} /> Play Video
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

/* ==========================================================================
   2. STANDARD CARD (Main Grid)
   ========================================================================== */
const SermonCard = ({ sermon, isPlaying, onPlay }) => {
  const videoId = getYoutubeId(sermon.video_url);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const imageToDisplay = sermon.image_url || videoThumbnail;
  const content = sermon.content || '';

  return (
    <article className={styles.cnnCard}>
      <div className={styles.mediaContainer}>
        <div className={styles.cnnTag}>
          {videoId ? <><Video size={11} /> WATCH</> : <><BookOpen size={11} /> READ</>}
        </div>

        {isPlaying && videoId ? (
          <iframe
            className={styles.videoPlayer}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={sermon.title}
          ></iframe>
        ) : (
          <div className={styles.thumbnailWrapper} onClick={videoId ? onPlay : undefined}>
            <img src={imageToDisplay || '/placeholder-sermon.jpg'} alt={sermon.title} className={styles.thumbnail} style={{ aspectRatio: '16 / 9', objectFit: 'cover' }} />
            <div className={styles.mediaOverlay}>
              {videoId && <PlayCircle size={44} className={styles.playIcon} />}
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaHeader}>
          <span className={styles.preacher}><User size={12} /> {sermon.preacher}</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.date}>
            <Calendar size={12} /> 
            {new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <Link to={`/sermons/${sermon.id}`} className={styles.headlineLink}>
          <h2 className={styles.headline}>{sermon.title}</h2>
        </Link>
        
        <div className={styles.excerpt}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.length > 110 ? `${content.substring(0, 110)}...` : content}
          </ReactMarkdown>
        </div>

        <div className={styles.cardFooter}>
          <Link to={`/sermons/${sermon.id}`} className={styles.readStoryLink}>
            FULL STORY <ArrowRight size={14} />
          </Link>
          {videoId && !isPlaying && (
            <button onClick={onPlay} className={styles.cnnWatchBtn}>
              <PlayCircle size={14} /> Watch
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

/* ==========================================================================
   3. SIDEBAR COMPACT CARD (Right Bulletins)
   ========================================================================== */
const SideSermonCard = ({ sermon, isPlaying, onPlay }) => {
  const videoId = getYoutubeId(sermon.video_url);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const imageToDisplay = sermon.image_url || videoThumbnail;

  return (
    <div className={styles.sideCard}>
      {imageToDisplay && (
        <div className={styles.sideMediaWrapper} onClick={videoId ? onPlay : undefined}>
          <img src={imageToDisplay} alt={sermon.title} className={styles.sideThumbnail} style={{ aspectRatio: '16 / 9', objectFit: 'cover' }} />
          {videoId && (
            <div className={styles.sidePlayOverlay}>
              <PlayCircle size={24} />
            </div>
          )}
        </div>
      )}
      <div className={styles.sideContent}>
        <span className={styles.sidePreacher}>{sermon.preacher}</span>
        <Link to={`/sermons/${sermon.id}`} className={styles.sideHeadlineLink}>
          <h4 className={styles.sideHeadline}>{sermon.title}</h4>
        </Link>
        <span className={styles.sideDate}>
          {new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

// Utility function for Youtube URL parsing
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default Sermons;