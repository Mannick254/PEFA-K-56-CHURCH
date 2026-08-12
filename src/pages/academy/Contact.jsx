import React from 'react';
import Seo from '../../components/Seo';
import AcademyNavbar from '../../components/AcademyNavbar';
import AcademyFooter from '../../components/AcademyFooter';
import styles from '../../styles/AcademyContact.module.css';
import Breadcrumb from '../../components/Breadcrumb';

const AcademyContact = () => {
  const breadcrumbPaths = [
    { name: 'Home', path: '/' },
    { name: 'Academy', path: '/academy' },
    { name: 'Contact', path: '/academy/contact' },
  ];

  return (
    <div>
      <Seo 
        title="Contact PEFA Fiftysix Academy - Admissions & Inquiries"
        description="Contact PEFA Fiftysix Academy in Nairobi, Kenya. Reach out for admissions, inquiries, or to schedule a visit. Find our address, phone number, and email."
        keywords="PEFA Fiftysix Academy, contact us, admissions, inquiries, school address, phone number, email, Nairobi, Kenya, Christian school"
      />
      <AcademyNavbar />
      <Breadcrumb paths={breadcrumbPaths} />
      
      <header className={styles.pageHeader}>
        <h1>Contact Us</h1>
        <p>We are here to help. Reach out with any questions or to schedule a visit.</p>
      </header>

      <main className={styles.container}>
        <div className={styles.contactContent}>
          <div className={styles.contactForm}>
            <h2>Send Us a Message</h2>
            <p>For any inquiries, please fill out the form below, and we will get back to you as soon as possible.</p>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" required></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>Send Message</button>
            </form>
          </div>
          <div className={styles.contactInfo}>
            <h2>Contact Information</h2>
            <div className={styles.infoItem}>
              <h3>Our Location</h3>
              <p>Macharia Road, Kawangware 56 stage, Nairobi, Kenya</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Email Us</h3>
              <p>For general inquiries, email us at: <a href="mailto:info@pefa56academy.org">info@pefa56academy.org</a></p>
              <p>For admissions, email us at: <a href="mailto:admissions@pefa56academy.org">admissions@pefa56academy.org</a></p>
            </div>
            <div className={styles.infoItem}>
              <h3>Call Us</h3>
              <p>You can reach our office during school hours at: <strong>0705 647 734</strong></p>
               <p>For technical support (ICT Team), call: <strong>0759871145</strong></p>
            </div>
            <div className={styles.infoItem}>
              <h3>School Hours</h3>
              <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
              <p>Saturday & Sunday: Closed</p>
            </div>
          </div>
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
};

export default AcademyContact;