import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ShieldCheck, ScrollText, AlertCircle, Globe, Mail, ChevronRight } from 'lucide-react';
import styles from '../styles/Terms.module.css';

const Terms = () => {
  const sections = [
    { id: 'use', title: '1. Use of the Website', icon: <Globe size={20} /> },
    { id: 'intellectual', title: '2. Intellectual Property', icon: <Scale size={20} /> },
    { id: 'user-content', title: '3. User Content', icon: <ScrollText size={20} /> },
    { id: 'disclaimer', title: '4. Disclaimer', icon: <AlertCircle size={20} /> },
    { id: 'liability', title: '5. Limitation of Liability', icon: <ShieldCheck size={20} /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={styles.badge}
          >
            Legal Documentation
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className={styles.lastUpdated}
          >
            Last Updated: July 24, 2024
          </motion.p>
        </div>
      </header>

      <div className={`${styles.container} ${styles.mainContent}`}>
        {/* Sticky Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.stickyNav}>
            <h4>Contents</h4>
            <ul>
              {sections.map((item) => (
                <li key={item.id} onClick={() => scrollToSection(item.id)}>
                  {item.icon}
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Text Section */}
        <main className={styles.legalText}>
          <section className={styles.intro}>
            <p>
              Welcome to the <strong>PEFA Church Kawangware 56</strong> website. These Terms of Service 
              govern your use of our digital platforms. By accessing our website, you agree to be bound by 
              these conditions. We’ve designed this page to be as clear as possible regarding your rights 
              and our responsibilities.
            </p>
          </section>

          <section id="use" className={styles.contentBlock}>
            <h2><Globe className={styles.sectionIcon} /> 1. Use of the Website</h2>
            <p>
              You agree to use the website only for lawful purposes and in a way that does not infringe 
              the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. 
            </p>
            <div className={styles.callout}>
              <strong>Prohibited behavior:</strong> Includes harassing other users, transmitting obscene 
              content, or disrupting the normal flow of dialogue within our community platforms.
            </div>
          </section>

          <section id="intellectual" className={styles.contentBlock}>
            <h2><Scale className={styles.sectionIcon} /> 2. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and sermon media, is the 
              property of <strong>PEFA Church Organization</strong>. 
            </p>
            <p>
              You may use materials for personal, non-commercial spiritual growth, but you may not 
              reproduce or distribute them for commercial gain without prior written consent.
            </p>
          </section>

          <section id="user-content" className={styles.contentBlock}>
            <h2><ScrollText className={styles.sectionIcon} /> 3. User-Generated Content</h2>
            <p>
              By posting prayer requests or testimonies, you grant us a royalty-free, perpetual right 
              to share this content across our ministry platforms to encourage others, unless 
              explicitly marked as private.
            </p>
          </section>

          <section id="disclaimer" className={styles.contentBlock}>
            <h2><AlertCircle className={styles.sectionIcon} /> 4. Disclaimer of Warranties</h2>
            <p>
              This website is provided on an "as is" basis. While we strive for 100% uptime and 
              accurate information, PEFA Church makes no warranties regarding the constant 
              availability or absolute accuracy of all digital content.
            </p>
          </section>

          <section id="liability" className={styles.contentBlock}>
            <h2><ShieldCheck className={styles.sectionIcon} /> 5. Limitation of Liability</h2>
            <p>
              PEFA Church Organization will not be liable for any damages arising from the use or 
              inability to use this website, including technical failures or data loss.
            </p>
          </section>

          <div className={styles.contactCard}>
            <h3>Questions about our Terms?</h3>
            <p>Our administrative team is here to help clarify any legal concerns.</p>
            <a href="mailto:56pefa@yahoo.com" className={styles.emailBtn}>
              <Mail size={18} />
              Contact Administration
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Terms;