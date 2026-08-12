
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Coffee } from 'lucide-react';
import styles from '../styles/WelcomeSection.module.css';

const WelcomeSection = () => {
  return (
    <section className={styles.welcomeSection}>
        <div>
          <h2 className={styles.title}>
            Welcome Home
          </h2>
          
          <p className={styles.subtitle}>
            Restoring hope and building lives through the power of the Holy Spirit. 
            We are more than a church; we are a family. Whether you're a lifelong believer 
            or just exploring faith, there is a place for you here.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.iconWrapper}><Heart size={24} /></div>
              <p>Heartfelt Worship</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.iconWrapper}><Users size={24} /></div>
              <p>Loving Community</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.iconWrapper}><Coffee size={24} /></div>
              <p>Place to Grow</p>
            </div>
          </div>

          <div className={styles.ctaGroup}>
            <Link to="/about" className={styles.primaryBtn}>
              Learn Our Story
            </Link>
            <Link to="/visit" className={styles.secondaryBtn}>
              Plan Your Visit
            </Link>
          </div>
        </div>
    </section>
  );
};

export default WelcomeSection;
