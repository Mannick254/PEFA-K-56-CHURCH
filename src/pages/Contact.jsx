import React from 'react';
import styles from '../styles/Contact.module.css';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Seo from '../components/Seo';

const Contact = () => {
  return (
    <div className={styles.contactPage}>
        <Seo 
            title="Contact Us" 
            description="Get in touch with PEFA Kawangware 56. We'd love to hear from you."
            url="/contact"
            type="website"
        />
      <header className={styles.header}>
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Whether you have a question, a prayer request, or just want to say hello, feel free to reach out.</p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <Mail className={styles.icon} />
            <h4>Email Us</h4>
            <p>For general inquiries, our inbox is always open.</p>
            <a href="mailto:56pefa@yahoo.com">56pefa@yahoo.com</a>
          </div>
          <div className={styles.infoCard}>
            <Phone className={styles.icon} />
            <h4>Call Us</h4>
            <p>Our office is open from 9 AM to 5 PM on weekdays.</p>
            <a href="tel:+254724435230">+254 724 435 230</a>
          </div>
          <div className={styles.infoCard}>
            <MapPin className={styles.icon} />
            <h4>Find Us</h4>
            <p>PEFA Kawangware 56 Church, Kawangware, Nairobi</p>
            <a href="https://www.google.com/maps/search/?api=1&query=PEFA+Kawangware+56" target="_blank" rel="noopener noreferrer">Get Directions</a>
          </div>
        </div>

        <div className={styles.contactFormWrapper}>
          <h3>Send a Message</h3>
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>Send Message</button>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Connect with us on social media</p>
        <div className={styles.socialLinks}>
          <a href="https://www.facebook.com/people/Pefa-Church-Kawangware-56/100069538963801/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        </div>
      </footer>
    </div>
  );
};

export default Contact;