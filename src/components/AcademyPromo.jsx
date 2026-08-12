import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/AcademyPromo.module.css';
import { GraduationCap } from 'lucide-react';

const AcademyPromo = () => {
  return (
    <section className={styles.promoSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <GraduationCap size={20} />
            <span>Nurturing Future Leaders</span>
          </div>
          <h2 className={styles.title}>PEFA Fiftysix Academy</h2>
          <p className={styles.description}>
            An integral part of our church community, the academy provides quality, Christ-centered education from playgroup to grade six. We are committed to academic excellence and spiritual growth.
          </p>
          <Link to="/academy" className={styles.ctaButton}>
            Visit the Academy
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AcademyPromo;
