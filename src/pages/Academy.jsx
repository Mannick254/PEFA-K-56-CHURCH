
import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from '../styles/Academy.module.css';
import AcademyNavbar from '../components/AcademyNavbar';
import AcademyFooter from '../components/AcademyFooter';
import Breadcrumb from '../components/Breadcrumb';

const Academy = () => {
  const breadcrumbPaths = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/academy' },
  ];

  return (
    <div className={styles.academyPage}>
      <Seo 
        title="PEFA Fiftysix Academy - Christian School in Kenya" 
        description="Discover PEFA Fiftysix Academy, a leading Christian school in Kenya, offering a nurturing, spiritual environment and a government-approved curriculum for playgroup up to grade six."
        keywords="PEFA Fiftysix Academy, Christian school, education in Kenya, primary school, playgroup, preschool, spiritual education, character building"
        url="/academy"
        type="website"
      />

      <AcademyNavbar />
      <Breadcrumb paths={breadcrumbPaths} />

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>PEFA Fiftysix Academy</h1>
          <p>Nurturing minds, building character, and fostering spiritual growth.</p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.intro}>
          <h2>Welcome to PEFA Fiftysix Academy</h2>
          <p>
            PEFA Fiftysix Academy is a distinguished Christian school in Kenya, dedicated to providing a nurturing and spiritual environment where students can excel. Our committed staff champions academic excellence and the development of strong moral character, all within a framework of Christian values. We proudly follow the government-approved curriculum, ensuring a high-quality, recognized education that prepares students for a bright future.
          </p>
        </section>

        <section className={styles.aboutFeature}>
          <p>Learn more about our mission, vision, and the core values that guide our educational approach.</p>
          <Link to="/academy/about" className={styles.aboutLink}>About Us</Link>
        </section>

        <section className={styles.programs}>
          <h2>Our Academic Programs</h2>
          <p className={styles.progressNote}>As a growing institution, we currently offer enriching programs for children from playgroup up to grade six.</p>
          <div className={styles.programGrid}>
            <div className={styles.programCard}>
              <h3>Playgroup & Preschool</h3>
              <p>Our early years program offers a fun, safe, and engaging introduction to learning, designed to spark curiosity and a love for education in our youngest students.</p>
            </div>
            <div className={styles.programCard}>
              <h3>Lower & Upper Primary</h3>
              <p>Our comprehensive primary school program (up to Grade 6) builds a strong foundation in core subjects while nurturing individual talents and interests, preparing students for future academic success.</p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Admissions</h2>
          <p>Interested in enrolling your child at PEFA Fiftysix Academy? Learn more about our admissions process and how to apply.</p>
          <Link to="/academy/admissions" className={styles.ctaLink}>Admissions</Link>
        </section>

        <section className={styles.ctaSection}>
          <h2>Academics</h2>
          <p>Explore our curriculum and the academic programs we offer to our students.</p>
          <Link to="/academy/academics" className={styles.ctaLink}>Academics</Link>
        </section>
      </main>

      <AcademyFooter />
    </div>
  );
};

export default Academy;
