import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

const fadeInParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Top Section */}
        <motion.div 
          className={styles.topRow}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInParent}
        >
          <motion.div className={styles.brandSide} variants={fadeInChild}>
            <div className={styles.logoArea}>
              <div className={styles.iconWrapper}>
                <Flame size={32} strokeWidth={2.5} />
              </div>
              <div className={styles.logoText}>
                <span className={styles.churchName}>ALL NATIONS GOSPEL</span>
                <span className={styles.branchCode}>K-56 BRANCH</span>
              </div>
            </div>
            <p className={styles.missionText}>
              Restoring hope and building lives through the power of the Holy Spirit. 
              Under the spiritual leadership of <strong>Rev. Daniel O. Ramogi.</strong>
            </p>
          </motion.div>
          
          <motion.div className={styles.newsletterSide} variants={fadeInChild}>
            <h4>Stay Connected</h4>
            <p>Subscribe to our newsletter for the latest updates and inspirations.</p>
            <form 
              className={styles.newsletterForm} 
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </motion.div>
        </motion.div>

        {/* Middle Section */}
        <motion.div 
          className={styles.grid}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInParent}
        >
          <motion.div className={styles.column} variants={fadeInChild}>
             <h5 className={styles.columnTitle}>Ministry</h5>
            <ul className={styles.linkList}>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/Church-Department">Leadership</Link></li>
              <li><Link to="/statement-of-faith">What We Believe</Link></li>
              <li><Link to="/prayers">Prayer Altar</Link></li>
              <li><Link to="/lessons">Daily Discipleship</Link></li>
            </ul>
          </motion.div>

          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>Connect</h5>
            <ul className={styles.linkList}>
              <li><Link to="/sermons">Sermons</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/k56-gallery">Gallery</Link></li>
              <li><Link to="/live">Live page</Link></li>
              <li><Link to="/give">Give</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </motion.div>
          
          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>Sister Branches</h5>
            <ul className={styles.linkList}>
              <li>PEFA Undugu</li>
              <li>PEFA Ngando</li>
              <li>PEFA Karen End</li>
              <li>PEFA Satellite</li>
            </ul>
          </motion.div>

          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>Resources</h5>
            <ul className={styles.linkList}>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/ict-team">ICT Team</Link></li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className={styles.bottomRow}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInParent}
        >
            <div className={styles.copyWrapper}>
                <motion.p className={styles.copyright} variants={fadeInChild}>
                    &copy; {currentYear} PEFA Kawangware 56. All Rights Reserved.
                </motion.p>
                <motion.p className={styles.designCredit} variants={fadeInChild}>
                    Designed by <Link to="/ict-team">PEFAK56 ICT TEAM</Link>
                </motion.p>
            </div>
          <motion.div className={styles.socialIcons} variants={fadeInChild}>
            <a href="https://www.facebook.com/PEFAKawangware56" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com/PEFAKawangware" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="https://www.instagram.com/pefa_kawangware_56/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.youtube.com/@PEFAK56" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <FaYoutube size={20} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
