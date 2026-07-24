import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Live.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Heart, MessageSquare, 
  ExternalLink, Check, Clock 
} from 'lucide-react';
import { FaYoutube, FaDove } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Seo from './Seo';

const Live = () => {
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [vision, setVision] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second for that "Live Broadcast" feel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchVision = async () => {
    const { data } = await supabase.from('about_us').select('our_mission_p1').single();
    if (data) setVision(data.our_mission_p1);
  };

  const fetchLiveStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('live_status').select('*').limit(1);
      if (error) throw error;
      setLiveStatus(data?.[0] || { is_live: false, title: 'Currently Offline', stream_url: '' });
    } catch (err) {
      setLiveStatus({ is_live: false, title: 'Network Error', stream_url: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    fetchVision();
    const channel = supabase
      .channel('realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_status' }, fetchLiveStatus)
      .subscribe();
    return () => channel.unsubscribe();
  }, []);

  const addHeart = () => {
    const id = Date.now();
    setHearts((prev) => [...prev, id]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h !== id)), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.broadcastPulse} />
        <p className={styles.loadingText}>ESTABLISHING SATELLITE LINK...</p>
      </div>
    );
  }

  return (
    <div className={styles.livePage}>
      <Seo 
        title={liveStatus?.is_live ? `LIVE: ${liveStatus.title}` : 'Live Service | PEFA Kawangware 56'} 
        description={liveStatus?.is_live ? (liveStatus.description || `Watch the live service from PEFA Kawangware 56.`) : "We're currently offline, but you can watch our past sermons or join our next service. Connect with PEFA Kawangware 56 online."} 
      />
      {/* BACKGROUND BLUR EFFECT (Al Jazeera Style) */}
      <div className={styles.bgGlow} />

      {/* TOP TICKER BAR */}
      <div className={styles.tickerBar}>
        <div className={styles.tickerLabel}>LIVE UPDATE</div>
        <div className={styles.tickerContent}>
          <p>Welcome to PEFA K56 Online. Join our community for worship and word. • "Our Vision: {vision}" • Stay connected via our social media platforms.</p>
        </div>
        <div className={styles.clockZone}>
          <Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <main className={styles.mainContainer}>
        <AnimatePresence mode="wait">
          {liveStatus?.is_live ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={styles.broadcastGrid}
            >
              {/* VIDEO SECTION */}
              <section className={styles.videoSection}>
                <div className={styles.playerWrapper}>
                  {/* Watermark */}
                  <div className={styles.watermark}>
                    <span className={styles.pefaText}>PEFA</span>
                    <span className={styles.k56Text}>K56</span>
                  </div>

                  <div className={styles.aspectRatio}>
                    {getEmbedUrl(liveStatus.stream_url) ? (
                      <iframe
                        src={getEmbedUrl(liveStatus.stream_url)}
                        title="Main Broadcast"
                        allowFullScreen
                        className={styles.iframePlayer}
                      />
                    ) : (
                      <div className={styles.linkFallback}>
                        <Radio size={48} />
                        <p>Stream format requires external viewing</p>
                        <a href={liveStatus.stream_url} target="_blank" rel="noreferrer">Open Broadcast</a>
                      </div>
                    )}
                  </div>

                  {/* Player Controls Overlay */}
                  <div className={styles.playerUI}>
                    <div className={styles.liveIndicator}>
                      <div className={styles.redDot} /> LIVE
                    </div>
                  </div>
                </div>

                {/* HEART OVERLAY AREA */}
                <div className={styles.interactionOverlay}>
                  {hearts.map(id => (
                    <motion.div
                      key={id}
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -300, opacity: 0, scale: 2 }}
                      className={styles.heartIcon}
                    ><Heart fill="#ff3b3b" /></motion.div>
                  ))}
                </div>
              </section>

              {/* SIDEBAR / INFO SECTION */}
              <section className={styles.infoSection}>
                <div className={styles.contentCard}>
                  <h1 className={styles.mainTitle}>{liveStatus.title}</h1>
                  <p className={styles.description}>{liveStatus.description}</p>
                  
                  <div className={styles.actionGrid}>
                    <button onClick={addHeart} className={styles.primaryAction}>
                      <Heart size={20} /> <span>Amen</span>
                    </button>
                    <button onClick={() => window.open('/prayers', '_blank')} className={styles.secondaryAction}>
                      <MessageSquare size={20} /> <span>Prayer</span>
                    </button>
                    <button onClick={handleShare} className={styles.secondaryAction}>
                      {copied ? <Check size={20} /> : <ExternalLink size={20} />} <span>Share</span>
                    </button>
                  </div>

                  <div className={styles.externalLinks}>
                    <p className={styles.linkTitle}>Watch on Official Channels:</p>
                    <div className={styles.socialBtns}>
                      <a href={liveStatus.stream_url} className={styles.ytLink}><FaYoutube /> YouTube</a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className={styles.fbLink}><ExternalLink size={16} /> Facebook</a>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            /* OFFLINE STATE - Still professional */
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className={styles.offlineHero}>
               <div className={styles.offlineBox}>
                  <Radio size={64} className={styles.offIcon} />
                  <h2>Broadcast is Currently Concluded</h2>
                  <p>Our next scheduled service begins Sunday at 10:00 AM (GMT+3)</p>
                  <div className={styles.offlineButtons}>
                    <Link to="/sermons" className={styles.btnSolid}>Archives</Link>
                    <Link to="/contact" className={styles.btnOutline}>Join Community</Link>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER VISION SECTION */}
      <section className={styles.visionFooter}>
        <div className={styles.visionContent}>
            <FaDove className={styles.visionIcon} />
            <div>
              <h3>OUR VISION</h3>
              <p>{vision}</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Live;
