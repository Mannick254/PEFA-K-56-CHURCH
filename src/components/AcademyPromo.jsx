import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Heart, MessageCircle, Sparkles, ArrowRight, 
  Eye, CheckCircle2, Newspaper, Scan 
} from 'lucide-react';
import styles from '../styles/APS.module.css';

// News & Feature spotlight data configuration
const FEATURE_MAP = {
  academy: {
    tag: 'Christ-Centered Education',
    matchScore: 99.1,
    visualFeatures: ['Child Development', 'Academic Excellence'],
    type: 'academyPattern'
  },
  give: {
    tag: 'Empowering Impact',
    matchScore: 98.4,
    visualFeatures: ['Vibrant Warmth', 'Community Uplift'],
    type: 'givePattern'
  },
  connect: {
    tag: 'Active Fellowship',
    matchScore: 96.8,
    visualFeatures: ['Prayer & Care', 'Open Atmosphere'],
    type: 'connectPattern'
  }
};

const PromoCard = ({ 
  delay = 0, 
  cardType, 
  icon: IconComponent, 
  title, 
  description, 
  link, 
  linkText, 
  showHighlights, 
  isHero = false 
}) => {
  const featureMap = FEATURE_MAP[cardType];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ y: -4 }}
      className={`${styles.card} ${isHero ? styles.academyHeroCard : styles.ctaCard}`}
    >
      <div className={`${styles.cssVisualBg} ${styles[featureMap.type]} ${showHighlights ? styles.heatmapActive : ''}`}>
        <div className={styles.neuralGrid} />
        {showHighlights && <div className={styles.scanLine} />}
        <div className={isHero ? styles.bgOverlayHero : styles.bgOverlay} />
      </div>

      <div className={styles.badgeRow}>
        {isHero ? (
          <div className={styles.badge}>
            <GraduationCap size={14} />
            <span>Nurturing Future Leaders</span>
          </div>
        ) : null}
        <div className={styles.aiBadge}>
          <Sparkles size={12} className={styles.sparkleIcon} />
          <span>{featureMap.matchScore}% Relevance</span>
        </div>
        {!isHero && <span className={styles.categoryPill}>{featureMap.tag}</span>}
      </div>

      <div className={isHero ? styles.heroContent : styles.cardBody}>
        {isHero ? (
          <>
            <h2 className={styles.heroTitle}>{title}</h2>
            <p className={styles.heroDescription}>{description}</p>
          </>
        ) : (
          <div className={styles.headerGroup}>
            <div className={`${styles.iconWrapper} ${styles[`${cardType}Icon`]}`}>
              <IconComponent size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </div>
          </div>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.featurePills}>
            {featureMap.visualFeatures.map((feature, i) => (
              <span key={i} className={styles.featurePill}>
                <CheckCircle2 size={12} /> {feature}
              </span>
            ))}
          </div>

          <Link 
            to={link} 
            className={isHero ? styles.heroCtaButton : `${styles.ctaButton} ${styles[`${cardType}Button`]}`}
          >
            <span>{linkText}</span>
            <ArrowRight size={14} className={styles.arrowIcon} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const AcademyPromo = () => {
  const [showHighlights, setShowHighlights] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  const shouldShowAcademy = !pathname.startsWith('/academy');
  const shouldShowGive = pathname !== '/give';
  const shouldShowConnect = pathname !== '/contact';

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* Meta Bar */}
        <div className={styles.aiMetaBar}>
          <div className={styles.aiTag}>
            <Newspaper size={14} className={styles.pulseIcon} />
            <span>PEFA & Feature Academy</span>
            <span className={styles.statusDot} />
          </div>

          <button 
            className={`${styles.heatmapToggle} ${showHighlights ? styles.active : ''}`}
            onClick={() => setShowHighlights(!showHighlights)}
            aria-label="Toggle Feature Visual Highlights"
          >
            {showHighlights ? <Scan size={14} /> : <Eye size={14} />}
            <span>{showHighlights ? 'Hide Highlights' : 'Explore Highlights'}</span>
          </button>
        </div>

        {/* Hero Spotlight Card */}
        {shouldShowAcademy && (
          <PromoCard 
            isHero
            delay={0}
            cardType="academy"
            icon={GraduationCap}
            title="PEFA Fiftysix Academy"
            description="An integral part of our church community, providing quality, Christ-centered education from playgroup to grade six. Committed to academic excellence and spiritual growth."
            link="/academy"
            linkText="Visit Academy"
            showHighlights={showHighlights}
          />
        )}

        {/* Sub Feature Cards Grid */}
        <div className={styles.grid}>
          {shouldShowGive && (
            <PromoCard 
              delay={0.1}
              cardType="give"
              icon={Heart}
              title="Support Our Mission"
              description="Your generosity fuels our work. Partner with us in making a difference."
              link="/give"
              linkText="Give Online"
              showHighlights={showHighlights}
            />
          )}

          {shouldShowConnect && (
            <PromoCard 
              delay={0.2}
              cardType="connect"
              icon={MessageCircle}
              title="Get in Touch"
              description="We're here for you. Connect with us for prayer, questions, or a chat."
              link="/contact"
              linkText="Contact Us"
              showHighlights={showHighlights}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AcademyPromo;