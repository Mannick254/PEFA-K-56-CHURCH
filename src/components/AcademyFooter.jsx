import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt 
} from 'react-icons/fa';
import styles from '../styles/AcademyFooter.module.css';

const AcademyFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <h2 className={styles.logoText}>PEFA FiftySix <span>Academy</span></h2>
            <p className={styles.description}>
              Nurturing minds, building character, and empowering the next generation of leaders through excellence in education.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Links Column */}
          <div className={styles.linksCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/academy">Home</Link></li>
              <li><Link to="/academy/about">About Us</Link></li>
              <li><Link to="/academy/admissions">Admissions</Link></li>
              <li><Link to="/academy/academics">Academics</Link></li>
              <li><Link to="/academy/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.contactCol}>
            <h4>Get In Touch</h4>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.icon} />
              <span>Macharia Road,Kawangware 56 stage, Nairobi, Kenya</span>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.icon} />
              <span>info@pefa56academy.org</span>
            </div>
            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.icon} />
              <span>0705 647 734</span>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className={styles.newsletterCol}>
            <h4>Newsletter</h4>
            <p>Subscribe to get the latest updates and school news.</p>
            <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} PEFA FiftySix Academy. All Rights Reserved.</p>
           <p>Designed by <Link to="/ict-team">PEFAK56 ICT TEAM</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default AcademyFooter;
