import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, Calendar, User, PlayCircle, VideoOff } from 'lucide-react';
import styles from '../styles/Sermons.module.css';
import JesusLessons from '../components/JesusLessons';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setSermons(data);
    } catch (err) {
      setError(err.message);
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

  if (loading) return <div className={styles.loader}>Loading Library...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Sermon Library</h1>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search by title or preacher..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {error && <div className={styles.errorCard}>⚠️ {error}</div>}

      <div className={styles.sermonsGrid}>
        {filteredSermons.map((sermon) => (
          <SermonCard 
            key={sermon.id} 
            sermon={sermon} 
            playingId={playingId}
            setPlayingId={setPlayingId}
            setError={setError}
          />
        ))}
      </div>

      {!loading && filteredSermons.length === 0 && (
        <div className={styles.emptyState}>No matches found for "{searchTerm}"</div>
      )}
      
      <JesusLessons />
    </div>
  );
};

const SermonCard = ({ sermon, playingId, setPlayingId, setError }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const content = sermon.content || '';
  const canTruncate = content.length > 280;

  const hasVideo = !!sermon.video_url;
  const hasImage = !!sermon.image_url;
  const isPlaying = playingId === sermon.id;

  const backgroundImage = sermon.image_url || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1000';

  return (
    <article className={styles.sermonCard}>
      <div className={styles.mediaContainer}>
        {isPlaying && hasVideo ? (
          <div className={styles.playerWrapper}>
            <ReactPlayer
              url={sermon.video_url}
              width="100%"
              height="100%"
              controls
              playing
              muted
              onError={(e) => {
                console.error('Player error:', e);
                setError(`Failed to load video for "${sermon.title}".`);
                setPlayingId(null);
              }}
              className={styles.reactPlayer}
            />
            <button
              className={styles.pipBtn}
              onClick={() => {
                const videoEl = document.querySelector('video');
                if (videoEl && videoEl.readyState >= 1) {
                  videoEl.requestPictureInPicture().catch(err => console.error(err));
                }
              }}
            >
              Enable PiP
            </button>
          </div>
        ) : hasVideo ? (
          <div
            className={styles.videoFacade}
            onClick={() => setPlayingId(sermon.id)}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className={styles.overlay}>
              <PlayCircle size={64} className={styles.playIcon} />
              <span>Watch Sermon</span>
            </div>
          </div>
        ) : hasImage ? (
          <div
            className={styles.videoFacade}
            style={{ backgroundImage: `url(${sermon.image_url})`, cursor: 'default' }}
          />
        ) : (
          <div className={styles.noVideo}>
            <VideoOff size={40} />
            <p>Audio only / No video</p>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.tagRow}>
          <span className={styles.dateBadge}>
            <Calendar size={14} /> {new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h2 className={styles.sermonTitle}>{sermon.title}</h2>
        <p className={styles.preacherName}>
          <User size={14} /> {sermon.preacher}
        </p>
        
        <div className={`${styles.sermonDescription} ${canTruncate && !isExpanded ? styles.truncated : ''}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {canTruncate && (
          <button onClick={toggleExpand} className={`${styles.readMoreBtn} ${isExpanded ? styles.showLess : ''}`}>
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    </article>
  );
}

export default Sermons;
