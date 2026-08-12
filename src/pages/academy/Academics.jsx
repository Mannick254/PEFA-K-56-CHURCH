import React from 'react';
import Seo from '../../components/Seo';
import AcademyNavbar from '../../components/AcademyNavbar';
import AcademyFooter from '../../components/AcademyFooter';
import styles from '../../styles/AcademyAcademics.module.css';
import Breadcrumb from '../../components/Breadcrumb';

const AcademyAcademics = () => {
  const breadcrumbPaths = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/academy' },
    { name: 'Academics', path: '/academy/academics' },
  ];

  return (
    <div>
      <Seo
        title="Academic Programs - PEFA Fiftysix Academy | Christian Curriculum"
        description="Explore the government-approved Christian curriculum at PEFA Fiftysix Academy. We offer holistic academic programs from playgroup to grade six, focusing on spiritual growth and character development."
        keywords="PEFA Fiftysix Academy, academic programs, Christian curriculum, Kenya education, playgroup, preschool, primary school, holistic education, co-curricular activities"
      />
      <AcademyNavbar />
      <Breadcrumb paths={breadcrumbPaths} />

      <header className={styles.pageHeader}>
        <h1>Our Academic Programs</h1>
        <p>A commitment to excellence in education, guided by Christian faith.</p>
      </header>

      <main className={styles.container}>
        <section className={styles.curriculumOverview}>
          <h2>Curriculum Overview</h2>
          <p>
            PEFA Fiftysix Academy proudly follows the government-approved curriculum of Kenya, ensuring that our students receive a nationally recognized and high-quality education. Our unique approach is holistic, aiming to develop not just strong academic skills but also unwavering moral character and a Christ-centered worldview.
          </p>
        </section>

        <section className={styles.programs}>
          <h2>Our Academic Levels</h2>
          <div className={styles.programGrid}>
            <div className={styles.programCard}>
              <h3>Playgroup & Preschool (PP1 & PP2)</h3>
              <p>Our early years program focuses on learning through play in a safe, nurturing, and stimulating environment. We build foundational skills in literacy, numeracy, and social interaction, preparing our youngest students for primary school with a love for learning.
              </p>
            </div>
            <div className={styles.programCard}>
              <h3>Lower Primary (Grade 1 - 3)</h3>
              <p>In lower primary, we build upon the foundation laid in preschool. The curriculum is designed to be engaging and interactive, fostering a love for learning while developing core competencies in key subjects within a Christian context.</p>
            </div>
            <div className={styles.programCard}>
              <h3>Upper Primary (Grade 4 - 6)</h3>
              <p>Our upper primary program is designed to prepare students for the next stage of their education. We encourage critical thinking, problem-solving, and independent learning, all grounded in biblical principles. The curriculum is comprehensive, covering all required subjects to ensure our students are well-rounded individuals.</p>
            </div>
          </div>
        </section>

        <section className={styles.extraCurricular}>
            <h2>Beyond the Classroom: Co-Curricular Activities</h2>
            <p>We believe in the importance of a holistic education that extends beyond academics. Our students have numerous opportunities to participate in a variety of co-curricular activities, including:</p>
            <ul>
                <li>Spiritual programs and weekly chapel services to nurture faith</li>
                <li>A wide range of sports and physical education for healthy development</li>
                <li>Creative arts, including music, drama, and fine arts</li>
                <li>Educational trips and community outreach programs to broaden horizons</li>
            </ul>
        </section>
      </main>

      <AcademyFooter />
    </div>
  );
};

export default AcademyAcademics;
