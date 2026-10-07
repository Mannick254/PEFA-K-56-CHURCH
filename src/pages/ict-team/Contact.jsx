import React from 'react';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import Seo from '../../components/Seo';
import styles from '../../styles/IctContact.modern.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const IctContact = () => {
  return (
    <div className={styles.pageWrapper}>
      <Seo
        title="Contact PEFAK56 ICT Team | Technical Support & Inquiries"
        description="Reach out to the PEFAK56 ICT Team for technical support, project inquiries, or collaboration opportunities. We are here to assist with your digital needs."
        keywords="PEFAK56 ICT contact, IT support Kenya, church tech support, web development Nairobi"
      />
      <IctNavbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Get In Touch</h1>
            <p className={styles.subtitle}>
              Whether you have a project idea, a technical issue, or a collaboration proposal, we're ready to connect. Reach out and let's build something great together.
            </p>
          </header>
          <div className={styles.contactGrid}>
            <div className={styles.contactForm}>
                <h3>Send a Message</h3>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required placeholder="e.g., John Doe" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required placeholder="e.g., you@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required placeholder="e.g., Project Inquiry"/>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required placeholder="Your detailed message..."></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>Send Message</button>
              </form>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.infoBlock}>
                <Mail size={20} className={styles.icon} />
                <div>
                  <h4>Email Us</h4>
                  <a href="mailto:ict.support@pefak56.org">ict.support@pefak56.org</a>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <Phone size={20} className={styles.icon} />
                <div>
                  <h4>Call Us</h4>
                  <a href="tel:+254759871145">+254 759 871145</a>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <MapPin size={20} className={styles.icon} />
                <div>
                  <h4>Find Us</h4>
                  <p>PEFA Kawangware 56, Nairobi, Kenya</p>
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