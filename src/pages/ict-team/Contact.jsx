import React from 'react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctContact.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const IctContact = () => {
  return (
    <div className={styles.pageWrapper}>
      <Seo
        title="Contact PEFAK56 ICT Team"
        description="Get in touch with the PEFAK56 ICT Team for inquiries about web development, IT support, and digital solutions."
        keywords="PEFAK56 ICT contact, IT support Kenya, church tech support"
      />
      <IctNavbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Get in Touch</h1>
            <p className={styles.subtitle}>
              We're here to help with your technical needs. Reach out to us for support, project inquiries, or collaborations.
            </p>
          </div>
          <div className={styles.contactGrid}>
            <div className={styles.contactForm}>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>Send Message</button>
              </form>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.infoBlock}>
                <Mail size={24} className={styles.icon} />
                <div>
                  <h4>Email Us</h4>
                  <p>ict.support@pefak56.org</p>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <Phone size={24} className={styles.icon} />
                <div>
                  <h4>Call Us</h4>
                  <p>+254 759 871145</p>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <MapPin size={24} className={styles.icon} />
                <div>
                  <h4>Find Us</h4>
                  <p>PEFA Kawangware 56, Nairobi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <IctFooter />
    </div>
  );
};

export default IctContact;
