import React from 'react';
import styles from '../styles/About.module.css';

const About = () => {
  return (
    <section id="about" className={styles.aboutContainer}>
      <div className={styles.aboutHeader}>
        <h1 className={styles.aboutTitle}>About Us</h1>
        <p className={styles.aboutSubtitle}>
          Rooted in Christ • Serving Kawangware • Embracing the Future
        </p>
      </div>

      <div className={styles.aboutContent}>
        <p className={styles.aboutText}>
          <strong>PEFA Kawangware 56 Church</strong> is a vibrant branch of the
          Pentecostal Evangelistic Fellowship of Africa (PEFA), located in the
          heart of Nairobi. We are a Christ-centered community committed to
          worship, discipleship, and outreach.
        </p>
        <p className={styles.aboutText}>
          Our mission is to obey the Great Commission by making disciples,
          nurturing believers, and serving our neighborhood with love. We raise
          families in faith, guide children in the way of the Lord
          <em>(Proverbs 22:6)</em>, and empower youth to live boldly for Christ.
        </p>
        <p className={styles.aboutText}>
          Known for lively worship services, strong choir ministry, pastoral
          counseling, and community support programs, we stand as a spiritual
          anchor in Kawangware, offering hope and encouragement to all.
        </p>
        <p className={styles.aboutText}>
          Whether you are seeking a home church, pastoral guidance, or simply a
          place to encounter God’s presence, PEFA Kawangware 56 welcomes you
          with warmth and fellowship.
        </p>
      </div>

      <div className={styles.digitalSection}>
        <h2 className={styles.sectionTitle}>Embracing the Digital Age</h2>
        <p className={styles.aboutText}>
          We are excited to embrace modern technology. This application is a new
          step in our journey, designed to bring our church family closer and
          make our resources more accessible than ever.
        </p>
        <ul className={styles.featureList}>
          <li><strong>🎥 Online Sermons:</strong> Access past sermons anytime.</li>
          <li><strong>📅 Digital Events Calendar:</strong> Stay up-to-date with activities.</li>
          <li><strong>🙏 Online Prayer Requests:</strong> Submit prayer needs directly.</li>
          <li><strong>📢 Community Updates:</strong> Receive announcements and news.</li>
        </ul>
      </div>
    </section>
  );
};

export default About;

