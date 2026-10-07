import React, { useState, useEffect } from 'react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctAbout.module.css';
import { 
  Users, 
  Target, 
  Code, 
  Shield, 
  Award, 
  Activity, 
  Terminal, 
  Radio, 
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop',
    tag: 'Digital Leadership'
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop',
    tag: 'Collaborative Engineering'
  },
  {
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1400&auto=format&fit=crop',
    tag: 'High-Impact Systems'
  }
];

const teamMembers = [
  // Populate with team data when ready
];

const IctAbout = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Seo
        title="About PEFAK56 ICT Team | Vision & Digital Architecture"
        description="Discover the team driving PEFA Kawangware 56's technological and broadcast infrastructure. Bridging innovation and ministry."
        keywords="PEFAK56 ICT team, church tech, nairobi software engineers, digital ministry"
      />
      
      <IctNavbar />

      {/* Media-Rich CNN Style Hero */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackgroundContainer}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}
            >
              <img src={slide.image} alt={slide.tag} className={styles.heroImg} />
            </div>
          ))}
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.topBadge}>
            <span className={styles.liveIndicator} />
            <span>SPECIAL REPORT • ICT DIRECTORETTE</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Architects of <span className={styles.highlightText}>Digital Ministry</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            A multidisciplinary team of software engineers, media producers, and cloud strategists pioneering broadcast-grade and enterprise solutions.
          </p>

          <div className={styles.slideBar}>
            <div className={styles.slideTagInfo}>
              <Cpu size={14} />
              <span>Current Focus: {heroSlides[currentSlide].tag}</span>
            </div>
            <div className={styles.dotIndicators}>
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${idx === currentSlide ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Switch to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        
        {/* News ticker / Metrics Bar */}
        <section className={styles.tickerBar}>
          <div className={styles.container}>
            <div className={styles.tickerGrid}>
              <div className={styles.tickerItem}>
                <Radio size={18} className={styles.tickerIcon} />
                <div>
                  <strong>Live Streaming</strong>
                  <span>1080p60 Broadcast Ready</span>
                </div>
              </div>
              <div className={styles.tickerItem}>
                <Zap size={18} className={styles.tickerIcon} />
                <div>
                  <strong>System Uptime</strong>
                  <span>99.9% Cloud Availability</span>
                </div>
              </div>
              <div className={styles.tickerItem}>
                <Terminal size={18} className={styles.tickerIcon} />
                <div>
                  <strong>Core Stack</strong>
                  <span>React, Node, Vite, Supabase</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Highlight Blocks */}
        <section className={`${styles.section} ${styles.missionSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.kicker}>STRATEGIC DIRECTION</span>
              <h2>Purpose & Ambition</h2>
            </div>

            <div className={styles.missionGrid}>
              <div className={styles.missionCard}>
                <div className={styles.cardHeader}>
                  <Target size={28} className={styles.missionIcon} />
                  <h3>Our Mission</h3>
                </div>
                <p>
                  To design, build, and maintain robust technological solutions that amplify the ministry of PEFA Kawangware 56, enabling our message to reach a global audience with clarity and impact.
                </p>
                <ul className={styles.cardList}>
                  <li><CheckCircle2 size={16} /> Enterprise Web Architecture</li>
                  <li><CheckCircle2 size={16} /> High-Reliability Live Broadcasts</li>
                  <li><CheckCircle2 size={16} /> Secure Administrative Tools</li>
                </ul>
              </div>

              <div className={styles.missionCard}>
                <div className={styles.cardHeader}>
                  <Users size={28} className={styles.missionIcon} />
                  <h3>Our Vision</h3>
                </div>
                <p>
                  To be a benchmark for technological excellence in ministry, pioneering innovative systems that streamline operations, foster deep engagement, and support spiritual growth worldwide.
                </p>
                <ul className={styles.cardList}>
                  <li><CheckCircle2 size={16} /> Continuous Innovation</li>
                  <li><CheckCircle2 size={16} /> Scalable Infrastructure</li>
                  <li><CheckCircle2 size={16} /> Data Protection & Privacy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Roster Section */}
        <section className={`${styles.section} ${styles.teamSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.kicker}>THE ROSTER</span>
              <h2>Meet the Engineers</h2>
              <p>The minds driving our software, networks, and production hardware.</p>
            </div>

            <div className={styles.teamGrid}>
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div className={styles.teamMemberCard} key={index}>
                    <div className={styles.imageFrame}>
                      <img src={member.imageUrl} alt={member.name} className={styles.memberImage} />
                      <div className={styles.memberOverlay} />
                    </div>
                    <div className={styles.memberInfo}>
                      <h4>{member.name}</h4>
                      <span>{member.role}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Terminal size={32} />
                  <div>
                    <h4>Roster Updating</h4>
                    <p>Team profiles are being configured for the current release deployment.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Core Principles */}
        <section className={`${styles.section} ${styles.valuesSection}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.kicker}>ENGINEERING ETHOS</span>
              <h2>Core Technical Values</h2>
            </div>

            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <Code size={26} className={styles.valueIcon} />
                <h4>Innovation & Craftsmanship</h4>
                <p>Applying modern frameworks, optimized pipelines, and clean code standards for high-performance delivery.</p>
              </div>

              <div className={styles.valueCard}>
                <Shield size={26} className={styles.valueIcon} />
                <h4>Security & Integrity</h4>
                <p>Enforcing strict access policies, encrypted communication, and responsible data management across all services.</p>
              </div>

              <div className={styles.valueCard}>
                <Award size={26} className={styles.valueIcon} />
                <h4>Excellence & Ownership</h4>
                <p>Taking complete accountability for system lifecycles—from initial architecture to production monitoring.</p>
              </div>

              <div className={styles.valueCard}>
                <Activity size={26} className={styles.valueIcon} />
                <h4>Reliability & Uptime</h4>
                <p>Engineering redundant, scalable systems designed to maintain seamless operation during peak broadcasts.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <IctFooter />
    </div>
  );
};

export default IctAbout;