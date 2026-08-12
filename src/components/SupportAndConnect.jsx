import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import styles from '../styles/SupportAndConnect.module.css';

const SupportAndConnect = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`${styles.ctaCard} ${styles.giveCard}`}>
          <div className={styles.iconWrapper}>
            <Heart size={32} />
          </div>
          <h3 className={styles.cardTitle}>Support Our Mission</h3>
          <p className={styles.cardDescription}>
            Your generosity fuels our work. Partner with us in making a difference.
          </p>
          <Link to="/give" className={`${styles.ctaButton} ${styles.giveButton}`}>
            Give Online
          </Link>
        </div>
        <div className={`${styles.ctaCard} ${styles.connectCard}`}>
          <div className={styles.iconWrapper}>
            <MessageCircle size={32} />
          </div>
          <h3 className={styles.cardTitle}>Get in Touch</h3>
          <p className={styles.cardDescription}>
            We're here for you. Connect with us for prayer, questions, or a friendly chat.
          </p>
          <Link to="/contact" className={`${styles.ctaButton} ${styles.connectButton}`}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SupportAndConnect;
