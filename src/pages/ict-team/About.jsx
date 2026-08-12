import React from 'react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctAbout.module.css';
import { Users, Target, Code, Shield } from 'lucide-react';

const IctAbout = () => {
  return (
    <div className={styles.pageWrapper}>
      <Seo
        title="About the PEFAK56 ICT Team"
        description="Learn about the mission, vision, and members of the PEFA Kawangware 56 ICT Team."
        keywords="PEFAK56 ICT team, church technology, Nairobi tech team"
      />
      <IctNavbar />
      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>We Are The Architects of Digital Ministry</h1>
            <p className={styles.heroSubtitle}>
              A passionate team dedicated to leveraging technology to spread the gospel and enhance our church community.
            </p>
          </div>
        </div>

        <section className={styles.missionSection}>
          <div className={styles.container}>
            <div className={styles.missionGrid}>
              <div className={styles.missionCard}>
                <Target size={40} className={styles.missionIcon} />
                <h3>Our Mission</h3>
                <p>To provide innovative and reliable technological solutions that support and amplify the ministry of PEFA Kawangware 56, ensuring our message reaches a global audience.</p>
              </div>
              <div className={styles.missionCard}>
                <Users size={40} className={styles.missionIcon} />
                <h3>Our Vision</h3>
                <p>To be a leading example of how technology can be used to effectively manage church operations, engage the community, and foster spiritual growth in a digital age.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.teamSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <div className={styles.teamGrid}>
              {/* Add team member cards here */}
            </div>
          </div>
        </section>
        
        <section className={styles.valuesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <Code size={32} />
                <h4>Innovation</h4>
                <p>We constantly seek creative and cutting-edge solutions.</p>
              </div>
              <div className={styles.valueCard}>
                <Shield size={32} />
                <h4>Integrity</h4>
                <p>We operate with transparency and uphold the highest ethical standards.</p>
              </div>
              <div className={styles.valueCard}>
                <Users size={32} />
                <h4>Collaboration</h4>
                <p>We believe in the power of teamwork and community.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <IctFooter />
    </div>
  );
};

export default IctAbout;
