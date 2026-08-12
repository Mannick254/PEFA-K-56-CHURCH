import React from 'react';
import { Link } from 'react-router-dom';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctTeam.module.css';


const IctTeamHome = () => {
  return (
    <div className={styles.pageWrapper}>
      <Seo
        title="PEFAK56 ICT TEAM | DIGITAL INNOVATION & SYSTEMS"
        description="Professional web development, live streaming, and IT systems management by PEFAK56. Nairobi's leading tech team for church and academy solutions."
        keywords="PEFAK56, ICT team Nairobi, Web development Kenya, Church Live Streaming"
      />
      
      <IctNavbar />

      {/* Hero Section with Animated Background */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Innovating for Excellence</span>
          <h1 className={styles.glitchTitle}>PEFAK56 ICT Team</h1>
          <p className={styles.heroSubtext}>
            We bridge the gap between <span>faith and technology</span> through 
            bespoke digital solutions and seamless systems management.
          </p>
          <div className={styles.ctaGroup}>
            <Link to="/ict-team/Projects" className={styles.primaryBtn}>View Our Work</Link>
            <Link to="/ict-team/Contact" className={styles.secondaryBtn}>Get in Touch</Link>
			<Link to="/ict-team/admin" className={styles.tertiaryBtn}>Admin</Link>
          </div>
        </div>
        <div className={styles.heroVisual}></div>
      </header>

      <main className={styles.container}>
        {/* Tech Stack Marquee / Icons */}
        <section className={styles.techStack}>
          <h3>Our Technology Stack</h3>
          <div className={styles.stackGrid}>
            <span>React</span>
            <span>Next.js</span>
            <span>Node.js</span>
            <span>vMix</span>
            <span>AWS</span>
            <span>Python</span>
          </div>
        </section>
      </main>

      <IctFooter />
    </div>
  );
};

export default IctTeamHome;