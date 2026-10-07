import React, { useState, useEffect } from 'react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctAbout.module.css';
import { Cpu } from 'lucide-react';

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

const IctHome = () => {
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
        title="PEFAK56 ICT Team | Digital Ministry Architects"
        description="The official landing page for the PEFA Kawangware 56 ICT Team. Discover our vision and work in pioneering digital solutions for ministry."
        keywords="PEFAK56 ICT, church technology, digital ministry, software engineering, live streaming"
      />
      
      <IctNavbar />

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
      
      <IctFooter />
    </div>
  );
};

export default IctHome;