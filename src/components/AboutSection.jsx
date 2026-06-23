import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/AboutSection.module.css';
import { ArrowRight, Users, CheckSquare, Coffee } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContent}>
        <h2 className={styles.title}>Welcome to a Place of Hope & Community</h2>
        <p className={styles.subtitle}>
          We are a vibrant, multicultural church dedicated to seeing lives transformed by the power of the Holy Spirit. Our doors are wide open to people from all backgrounds, regardless of where they are on their spiritual journey.
        </p>
        
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <Users className={styles.icon} />
            <p>A welcoming community for all ages and backgrounds.</p>
          </div>
          <div className={styles.feature}>
            <CheckSquare className={styles.icon} />
            <p>Biblically-sound teachings that apply to your daily life.</p>
          </div>
          <div className={styles.feature}>
            <Coffee className={styles.icon} />
            <p>A warm fellowship where you can build lasting relationships.</p>
          </div>
        </div>
        
        <Link to="/about" className={styles.learnMoreBtn}>
          Learn More About Our Story <ArrowRight size={20} />
        </Link>
      </div>
      <div className={styles.aboutImage}>
        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80" alt="Church community" />
      </div>
    </section>
  );
};

export default AboutSection;
