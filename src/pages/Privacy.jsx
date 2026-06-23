import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, Database, Share2, 
  Cookie, Clock, Lock, UserCheck, Mail, MapPin 
} from 'lucide-react';
import styles from '../styles/Privacy.module.css';

const Privacy = () => {
  const sections = [
    { id: 'collection', title: 'Information Collection', icon: <Database size={18} /> },
    { id: 'usage', title: 'How We Use Data', icon: <Eye size={18} /> },
    { id: 'sharing', title: 'Data Sharing', icon: <Share2 size={18} /> },
    { id: 'security', title: 'Security Measures', icon: <Lock size={18} /> },
    { id: 'rights', title: 'Your Rights', icon: <UserCheck size={18} /> },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.container}
        >
          <div className={styles.badge}><ShieldCheck size={14} /> Privacy Center</div>
          <h1>Privacy Policy</h1>
          <p>Your trust is our priority. Learn how we protect your personal information at PEFA Kawangware 56.</p>
          <div className={styles.meta}>
            <span>Version 1.2</span>
            <span className={styles.dot}></span>
            <span>Last Updated: July 24, 2024</span>
          </div>
        </motion.div>
      </header>

      <div className={`${styles.container} ${styles.mainGrid}`}>
        {/* Quick Navigation Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.stickyNav}>
            <h5>Contents</h5>
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className={styles.navLink}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className={styles.content}>
          <section className={styles.introCard}>
            <p>
              Welcome to the PEFA Church Kawangware website. We are committed to protecting your 
              personal information and your right to privacy. If you have any questions or 
              concerns about this notice, please contact us at 
              <a href="mailto:56pefa@yahoo.com"> 56pefa@yahoo.com</a>.
            </p>
          </section>

          <section id="collection" className={styles.contentBlock}>
            <h2><Database className={styles.sectionIcon} /> 1. Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you register, donate, or contact our ministry.</p>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <h6>Personal Details</h6>
                <p>Names, phone numbers, email addresses, and mailing addresses provided via forms.</p>
              </div>
              <div className={styles.infoBox}>
                <h6>Payment Data</h6>
                <p>Donation information is processed securely. We do not store credit card numbers on our local servers.</p>
              </div>
            </div>
          </section>

          <section id="usage" className={styles.contentBlock}>
            <h2><Eye className={styles.sectionIcon} /> 2. How We Use Your Information</h2>
            <ul className={styles.featureList}>
              <li>To facilitate account creation and secure logon.</li>
              <li>To share testimonies (only with your explicit consent).</li>
              <li>To send spiritual resources and church updates.</li>
              <li>To respond to prayer requests and legal inquiries.</li>
            </ul>
          </section>

          <section id="sharing" className={styles.contentBlock}>
            <h2><Share2 className={styles.sectionIcon} /> 3. Will Your Information Be Shared?</h2>
            <p>We only share information to comply with laws, protect your rights, or fulfill ministry obligations. We <strong>never sell</strong> your data to third-party advertisers.</p>
          </section>

          <section id="security" className={styles.contentBlock}>
            <div className={styles.securityBanner}>
              <Lock size={32} />
              <div>
                <h2>6. How We Keep Your Information Safe</h2>
                <p>We implement industry-standard encryption and organizational security measures to protect your data from unauthorized access.</p>
              </div>
            </div>
          </section>

          <section id="rights" className={styles.contentBlock}>
            <h2><UserCheck className={styles.sectionIcon} /> 7. Your Privacy Rights</h2>
            <p>You have the right to request access to your data, request corrections, or ask for your information to be deleted from our records.</p>
          </section>

          {/* Contact Section */}
          <footer className={styles.contactFooter}>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <div>
                  <h6>Email Us</h6>
                  <p>56pefa@yahoo.com</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <div>
                  <h6>Visit Us</h6>
                  <p>P.O. BOX 79353, Nairobi, Kenya</p>
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