import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/IctFooter.module.css';
import logo from '../assets/PEFA56.svg';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const IctFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <Link to="/ict-team" className={styles.footerLogo}>
          <img src={logo} alt="PEFAK56 Logo" className={styles.logo} />
          <span className={styles.logoText}>PEFAK56 ICT</span>
        </Link>

        <p className={styles.footerText}>
          Providing innovative and reliable digital solutions to help organizations thrive in the digital age. Let's build the future together.
        </p>

        <div className={styles.footerLinks}>
          <Link to="/ict-team#about" className={styles.footerLink}>About</Link>
          <Link to="/ict-team#services" className={styles.footerLink}>Services</Link>
          <Link to="/ict-team#projects" className={styles.footerLink}>Projects</Link>
          <Link to="/ict-team#contact" className={styles.footerLink}>Contact</Link>
        </div>

        <div className={styles.socials}>
           <a href="https://www.facebook.com/PEFAKawangware56" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
             <FaFacebook />
           </a>
           <a href="https://twitter.com/PEFAKawangware" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.socialLink}>
             <FaTwitter />
           </a>
           <a href="https://www.instagram.com/pefa_kawangware_56/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
             <FaInstagram />
           </a>
           <a href="https://www.youtube.com/@PEFAK56" target="_blank" rel="noopener noreferrer" aria-label="Youtube" className={styles.socialLink}>
             <FaYoutube />
           </a>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>&copy; {currentYear} PEFAK56 ICT. All Rights Reserved.</span>
        <div>
          <Link to="/ict-team/terms" className={styles.bottomLink}>Terms of Service</Link> | 
          <Link to="/ict-team/privacy" className={styles.bottomLink}> Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default IctFooter;
