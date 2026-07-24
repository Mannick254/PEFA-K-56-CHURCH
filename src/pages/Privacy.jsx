import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Eye, Database, Share2, 
  Cookie, Lock, UserCheck, Mail, MapPin,
  Camera, Baby, Trash2, Globe, ChevronRight
} from 'lucide-react';
import styles from '../styles/Privacy.module.css';
import Seo from '../components/Seo';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('collection');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sections = [
    { id: 'collection', title: 'Data Collection', icon: <Database size={18} /> },
    { id: 'usage', title: 'Usage Policy', icon: <Eye size={18} /> },
    { id: 'media', title: 'Media & Photos', icon: <Camera size={18} /> },
    { id: 'children', title: 'Minors & Kids', icon: <Baby size={18} /> },
    { id: 'sharing', title: 'Third Parties', icon: <Share2 size={18} /> },
    { id: 'security', title: 'Data Safety', icon: <Lock size={18} /> },
    { id: 'retention', title: 'Retention', icon: <Trash2 size={18} /> },
    { id: 'rights', title: 'Your Rights', icon: <UserCheck size={18} /> },
  ];

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element?.getBoundingClientRect().top ?? 0;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setActiveSection(id);
  };

  return (
    <div className={styles.pageWrapper}>
      <motion.div className={styles.progressBar} style={{ scaleX }} />
      
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.container}
        >
          <div className={styles.badge}>
            <ShieldCheck size={14} className={styles.badgeIcon} /> 
            PEFA Governance & Privacy
          </div>
          <h1 className={styles.title}>Privacy & <span className={styles.highlight}>Data Protection</span></h1>
          <p className={styles.subtitle}>
            At PEFA Kawangware 56, we handle your spiritual and personal data with the 
            highest level of integrity and biblical stewardship.
          </p>
          <div className={styles.meta}>
            <div className={styles.metaItem}><Globe size={14} /> Version 2.0 (KDA Compliant)</div>
            <div className={styles.metaItem}><Lock size={14} /> Last Updated: June 2026</div>
          </div>
        </motion.div>
      </header>

      <div className={`${styles.container} ${styles.mainGrid}`}>
        {/* Navigation Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.stickyNav}>
            <h5 className={styles.navTitle}>Policy Sections</h5>
            {sections.map(s => (
              <button 
                key={s.id} 
                onClick={() => scrollTo(s.id)} 
                className={`${styles.navLink} ${activeSection === s.id ? styles.activeNav : ''}`}
              >
                <span className={styles.iconWrapper}>{s.icon}</span>
                {s.title}
                <ChevronRight className={styles.chevron} size={14} />
              </button>
            ))}
          </div>
        </aside>

        {/* Content Body */}
        <main className={styles.content}>
          <section className={styles.introCard}>
            <h3>Our Commitment</h3>
            <p>
              This Privacy Policy explains how PEFA Church Kawangware ("we", "us", or "our") 
              collects and uses your information when you visit our website, attend our 
              services, or participate in our ministries. We are committed to complying 
              with the <strong>Kenya Data Protection Act (2019)</strong>.
            </p>
          </section>

          <section id="collection" className={styles.contentBlock}>
            <h2><Database className={styles.sectionIcon} /> 1. Information We Collect</h2>
            <p>We collect data to better serve our congregation and community.</p>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <h6>Ministry Data</h6>
                <p>Prayer requests, testimonies, and spiritual counseling notes provided voluntarily.</p>
              </div>
              <div className={styles.infoBox}>
                <h6>Financial Data</h6>
                <p>M-Pesa transaction IDs and donation records for tax and transparency purposes.</p>
              </div>
            </div>
          </section>

          <section id="media" className={styles.contentBlock}>
            <h2><Camera className={styles.sectionIcon} /> 2. Media & Photography</h2>
            <p>As a vibrant church community, we often document our services and events.</p>
            <div className={styles.policyAlert}>
              <p>By attending our services, you acknowledge that photography and video recording may occur. These are used for:</p>
              <ul className={styles.featureList}>
                <li>Live-streaming on YouTube/Facebook for home-bound members.</li>
                <li>Church newsletters and social media updates.</li>
                <li>Archival history of the ministry.</li>
              </ul>
              <small>Note: If you wish to not be photographed, please inform our ushering team.</small>
            </div>
          </section>

          <section id="children" className={styles.contentBlock}>
            <h2><Baby className={styles.sectionIcon} /> 3. Children’s Privacy</h2>
            <p>Protecting the youngest members of our flock is our priority.</p>
            <div className={styles.infoBox}>
              <p>We do not knowingly collect personal data from children under 13 without explicit parental consent. Data collected during Sunday School registration is stored securely and accessible only to authorized ministry leaders.</p>
            </div>
          </section>

          <section id="security" className={styles.contentBlock}>
            <div className={styles.securityBanner}>
              <div className={styles.lockIconBox}>
                <Lock size={32} />
              </div>
              <div>
                <h2>4. Data Security</h2>
                <p>We use TLS/SSL encryption for all data transfers. Your tithe and offering information is restricted to the church treasury department only.</p>
              </div>
            </div>
          </section>

          <section id="retention" className={styles.contentBlock}>
            <h2><Trash2 className={styles.sectionIcon} /> 5. Data Retention</h2>
            <p>We keep your personal information only as long as it is necessary for the purposes set out in this policy, or as required by Kenyan Law (e.g., financial records for 7 years).</p>
          </section>

          <section id="rights" className={styles.contentBlock}>
            <h2><UserCheck className={styles.sectionIcon} /> 6. Your Rights</h2>
            <p>Under the Data Protection Act, you have the right to:</p>
            <ul className={styles.featureList}>
              <li>Access and receive a copy of your data.</li>
              <li>Rectify inaccurate personal data.</li>
              <li>Object to the processing of your data for marketing.</li>
              <li>Request the deletion of your data (Right to be Forgotten).</li>
            </ul>
          </section>

          {/* Detailed Footer Contact */}
          <footer className={styles.contactFooter}>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <div>
                  <h6>Data Protection Officer</h6>
                  <p>56pefa@yahoo.com</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <div>
                  <h6>Physical Office</h6>
                  <p>Kawangware 56, P.O. BOX 79353, Nairobi</p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Privacy;