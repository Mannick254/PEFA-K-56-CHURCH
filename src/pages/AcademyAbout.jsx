
import React from 'react';
import Seo from '../components/Seo';
import styles from '../styles/AcademyAbout.module.css';
import AcademyNavbar from '../components/AcademyNavbar';
import AcademyFooter from '../components/AcademyFooter';
import Breadcrumb from '../components/Breadcrumb';

const AcademyAbout = () => {
  const breadcrumbPaths = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/academy' },
    { name: 'About', path: '/academy/about' },
  ];

  return (
    <div className={styles.academyAboutPage}>
      <Seo 
        title="About PEFA Fiftysix Academy - Our Mission, Vision, and Values" 
        description="Learn about the mission, vision, and core values of PEFA Fiftysix Academy, a leading Christian school dedicated to academic excellence and spiritual growth."
        keywords="PEFA Fiftysix Academy, about us, Christian education, mission, vision, core values, academic excellence, spiritual growth, character development"
        url="/academy/about"
        type="website"
      />

      <AcademyNavbar />
      <Breadcrumb paths={breadcrumbPaths} />

      <main className={styles.container}>
        <section className={styles.about}>
          <h2>About PEFA Fiftysix Academy</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutCard}>
              <h3>Our Mission</h3>
              <p>To provide a Christ-centered education that equips students for a life of purpose, leadership, and service in their communities and the world.</p>
            </div>
            <div className={styles.aboutCard}>
              <h3>Our Vision</h3>
              <p>To be a leading Christian educational institution, recognized for producing graduates who are not only academically excellent but also spiritually mature and socially responsible citizens.</p>
            </div>
            <div className={styles.aboutCard}>
              <h3>Core Values</h3>
              <ul>
                <li><strong>Faith:</strong> Upholding our Christian beliefs in all aspects of our school life.</li>
                <li><strong>Excellence:</strong> Striving for the highest standards in academics, character, and spiritual development.</li>
                <li><strong>Integrity:</strong> Promoting honesty, respect, and responsibility in our students.</li>
                <li><strong>Service:</strong> Encouraging a heart of service towards others.</li>
                <li><strong>Community:</strong> Fostering a supportive and caring school community.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <AcademyFooter />
    </div>
  );
};

export default AcademyAbout;
