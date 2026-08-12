import React from 'react';
import Seo from '../../components/Seo';
import AcademyNavbar from '../../components/AcademyNavbar';
import AcademyFooter from '../../components/AcademyFooter';
import styles from '../../styles/AcademyAdmissions.module.css';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

const AcademyAdmissions = () => {
  const breadcrumbPaths = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/academy' },
    { name: 'Admissions', path: '/academy/admissions' },
  ];

  return (
    <div>
      <Seo
        title="Admissions Process - PEFA Fiftysix Academy | Apply Now"
        description="Learn about the admissions process at PEFA Fiftysix Academy. Find information on how to apply, required documents, tuition, and more. Join our Christian school community today."
        keywords="PEFA Fiftysix Academy, admissions, enrollment, application, school registration, Christian school admissions, how to apply, tuition fees"
      />
      <AcademyNavbar />
      <Breadcrumb paths={breadcrumbPaths} />

      <header className={styles.pageHeader}>
        <h1>Admissions</h1>
        <p>Join our family and begin your journey toward a Christ-centered education.</p>
      </header>

      <main className={styles.container}>
        <section className={styles.process}>
          <h2>Our Admissions Process</h2>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Inquire</h3>
                <p>Contact us to express your interest and receive an application form. We are happy to answer any preliminary questions you may have about our programs.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Application Review</h3>
                <p>Submit the completed application form along with the required documents. Our admissions team will carefully review your application to ensure a good fit.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Interview</h3>
                <p>An informal interview with the parents and student will be scheduled. This helps us get to know you better and discuss how we can meet your child's unique needs.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Offer of Admission</h3>
                <p>If successful, you will receive an official offer of admission. We are excited to welcome you to the PEFA Fiftysix Academy family!</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.details}>
          <h2>Important Information</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <h3>Required Documents</h3>
              <ul>
                <li>Completed Application Form</li>
                <li>Copy of student's Birth Certificate</li>
                <li>Previous School Report Cards (if applicable)</li>
                <li>Passport-sized photos of the student</li>
              </ul>
            </div>
            <div className={styles.detailCard}>
              <h3>Tuition and Fees</h3>
              <p>For detailed information about our current tuition and fee structure, please contact our admissions office. We are committed to providing affordable, high-quality Christian education.</p>
            </div>
          </div>
        </section>

        <section className={styles.whyChooseUs}>
          <h2>Why Choose PEFA Fiftysix Academy?</h2>
          <ul>
            <li>A Christ-centered education with strong moral values and spiritual development.</li>
            <li>A government-approved curriculum ensuring high academic standards.</li>
            <li>Small class sizes for personalized attention and effective learning.</li>
            <li>A safe, nurturing, and stimulating learning environment for all students.</li>
            <li>A dedicated team of qualified and passionate Christian educators.</li>
            <li>Explore our <Link to="/academy/academics" className={styles.textLink}>academic programs</Link> to learn more.</li>
          </ul>
        </section>

        <section className={styles.cta}>
          <h2>Ready to Apply?</h2>
          <p>We are excited to welcome you to our school community. Contact our admissions office today to start the application process or to schedule a visit.</p>
          <Link to="/academy/contact" className={styles.ctaButton}>Contact Admissions</Link>
        </section>
      </main>

      <AcademyFooter />
    </div>
  );
};

export default AcademyAdmissions;
