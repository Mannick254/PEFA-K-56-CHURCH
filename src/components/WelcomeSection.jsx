import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Shield, Globe, ArrowRight, Heart, Users, Coffee, Sparkles, Tv } from 'lucide-react';
import { FaDove } from 'react-icons/fa';
import styles from '../styles/WelcomeSection.module.css';

const WelcomeSection = ({ vision }) => {
  const defaultVision = "To reach communities locally and globally with the transformational love of Christ, nurturing believers into mature disciples and building a sanctuary of hope for every generation.";

  return (
    <section className={styles.cnnWelcomeSection}>
      <div className={styles.container}>
        
        {/* CNN Top Newsroom Banner */}
        <div className={styles.cnnTopBar}>
          <div className={styles.cnnCategoryBadge}>
            <span className={styles.cnnBadgeDot}></span>
            PEFA NETWORK 56
          </div>
          <div className={styles.cnnTickerMeta}>
            <Sparkles size={13} className={styles.cnnIconSparkle} />
            <span className={styles.cnnTickerText}>SUNDAY WORSHIP & COMMUNITY GATHERINGS</span>
          </div>
        </div>

        {/* CNN Hero Editorial Grid */}
        <div className={styles.cnnHeroGrid}>
          
          {/* Left Column: Lead Editorial Story */}
          <div className={styles.cnnLeadContent}>
            <div className={styles.cnnEyebrow}>WELCOME STATEMENT</div>
            <h1 className={styles.cnnMainTitle}>
              Restoring Hope. <br />
              <span className={styles.cnnHighlightText}>Building Lives Together.</span>
            </h1>

            <p className={styles.cnnLeadExcerpt}>
              Empowered by the Holy Spirit, we are more than a church—we are a global family. 
              Whether you are a lifelong believer or exploring faith for the first time, your story matters here.
            </p>

            <div className={styles.cnnCtaRow}>
              <Link to="/visit" className={styles.cnnPrimaryBtn}>
                Plan Your Visit <ArrowRight size={16} />
              </Link>
              <Link to="/about" className={styles.cnnSecondaryBtn}>
                Learn Our Story
              </Link>
            </div>

            {/* CNN Editorial Key Highlights Bar */}
            <div className={styles.cnnKeyMetricsBar}>
              <div className={styles.cnnMetricItem}>
                <Users size={16} className={styles.cnnMetricIcon} />
                <div className={styles.cnnMetricText}>
                  <strong>Global Family</strong>
                  <span>Welcoming all backgrounds</span>
                </div>
              </div>
              <div className={styles.cnnMetricItem}>
                <Heart size={16} className={styles.cnnMetricIcon} />
                <div className={styles.cnnMetricText}>
                  <strong>Community First</strong>
                  <span>Outreach & care ministries</span>
                </div>
              </div>
              <div className={styles.cnnMetricItem}>
                <Coffee size={16} className={styles.cnnMetricIcon} />
                <div className={styles.cnnMetricText}>
                  <strong>Fellowship</strong>
                  <span>Connect groups weekly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Live Broadcast Box */}
          <div className={styles.cnnBroadcastColumn}>
            <div className={styles.cnnBroadcastCard}>
              <div className={styles.cnnCardHeader}>
                <div className={styles.cnnLiveBadge}>
                  <span className={styles.cnnPulseDot}></span>
                  LIVE BROADCAST
                </div>
                <span className={styles.cnnChannelTag}><Tv size={12} /> CH 01</span>
              </div>

              <div className={styles.cnnCardBody}>
                <h2 className={styles.cnnBroadcastTitle}>Join Our Worship Service</h2>
                <p className={styles.cnnBroadcastDesc}>
                  Experience powerful worship and a life-changing word live from our sanctuary.
                </p>

                <div className={styles.cnnBroadcastMeta}>
                  <span><Globe size={13} /> Worldwide Stream</span>
                  <span><Shield size={13} /> Ultra HD Quality</span>
                </div>

                <Link to="/live" className={styles.cnnWatchBtn} aria-label="Watch Live Stream">
                  <PlayCircle size={18} />
                  <span>Watch Live Stream</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CNN Feature Card: Guiding Mission & Vision */}
        <div className={styles.cnnMissionCard}>
          <div className={styles.cnnMissionBadge}>
            <FaDove size={24} className={styles.cnnDoveIcon} />
          </div>
          <div className={styles.cnnMissionContent}>
            <div className={styles.cnnMissionHeader}>
              <span className={styles.cnnTag}>MISSION STATEMENT</span>
              <h2 className={styles.cnnMissionTitle}>Our Guiding Vision</h2>
            </div>
            <blockquote className={styles.cnnMissionText}>
              "{vision && vision.trim() !== '' ? vision : defaultVision}"
            </blockquote>
            <Link to="/about" className={styles.cnnMissionBtn}>
              <span>Discover Our Purpose</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WelcomeSection;