import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Mail, ArrowRight, CheckCircle2, Radio } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';
import WebsiteVisits from './WebsiteVisits';

const fadeInParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInChild = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Top Editorial Red Accent Strip */}
      <div className={styles.topBarAccent} />

      <div className={styles.container}>
        
        {/* Top Section: Brand & Newsletter */}
        <motion.div 
          className={styles.topRow}
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeInParent}
        >
          <motion.div className={styles.brandSide} variants={fadeInChild}>
            <div className={styles.logoArea}>
              <div className={styles.iconWrapper}>
                <Flame size={28} strokeWidth={2.5} />
              </div>
              <div className={styles.logoText}>
                <span className={styles.churchName}>ALL NATIONS GOSPEL</span>
                <span className={styles.branchCode}>PEFA KAWANGWARE 56</span>
              </div>
            </div>
            <p className={styles.missionText}>
              Restoring hope and building lives through the power of the Holy Spirit. 
              Under the spiritual leadership of <strong>Rev. Daniel O. Ramogi</strong>.
            </p>
            <div className={styles.liveBadge}>
              <Radio size={14} className={styles.liveDot} />
              <Link to="/live">BROADCAST & LIVE SERVICES</Link>
            </div>
          </motion.div>
          
          <motion.div className={styles.newsletterSide} variants={fadeInChild}>
            <span className={styles.newsletterTag}>NEWSLETTER DISPATCH</span>
            <h4>Stay Connected & Informed</h4>
            <p>Subscribe for weekly sermon digests, ministry updates, and spiritual announcements.</p>
            
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <div className={styles.inputGroup}>
                <Mail size={16} className={styles.mailIcon} />
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit" aria-label="Subscribe">
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {isSubscribed && (
              <motion.div 
                className={styles.subscribedFeedback}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 size={16} />
                <span>Thank you for subscribing to our dispatch!</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <div className={styles.sectionDivider} />

        {/* Middle Section: Directory Columns */}
        <motion.div 
          className={styles.grid}
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeInParent}
        >
          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>MINISTRY</h5>
            <ul className={styles.linkList}>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/church-department">Leadership & Departments</Link></li>
              <li><Link to="/statement-of-faith">What We Believe</Link></li>
              <li><Link to="/prayers">Prayer Altar</Link></li>
              <li><Link to="/lessons">Daily Discipleship</Link></li>
            </ul>
          </motion.div>

          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>DIRECTORY</h5>
            <ul className={styles.linkList}>
              <li><Link to="/sermons">Sermons Archive</Link></li>
              <li><Link to="/events">Events Calendar</Link></li>
              <li><Link to="/contact">Contact Directory</Link></li>
              <li><Link to="/k56-gallery">Media Gallery</Link></li>
              <li><Link to="/live">Live Stream</Link></li>
              <li><Link to="/give">Support & Giving</Link></li>
              <li><Link to="/blog">News & Blog</Link></li>
            </ul>
          </motion.div>
          
          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>BRANCH NETWORK</h5>
            <ul className={styles.linkList}>
              <li><span className={styles.staticLink}>PEFA Undugu</span></li>
              <li><span className={styles.staticLink}>PEFA Ngando</span></li>
              <li><span className={styles.staticLink}>PEFA Karen End</span></li>
              <li><Link to="/satellite-churches">All Satellite Churches</Link></li>
            </ul>
          </motion.div>

          <motion.div className={styles.column} variants={fadeInChild}>
            <h5 className={styles.columnTitle}>LEGAL & ICT</h5>
            <ul className={styles.linkList}>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/ict-team">ICT Engineering Team</Link></li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <div className={styles.sectionDivider} />

        {/* Bottom Section: Copyright & Social Links */}
        <motion.div 
          className={styles.bottomRow}
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={fadeInParent}
        >
          <div className={styles.copyWrapper}>
            <motion.p className={styles.copyright} variants={fadeInChild}>
              &copy; {currentYear} PEFA Kawangware 56. All Rights Reserved.
            </motion.p>
            <motion.p className={styles.designCredit} variants={fadeInChild}>
              Engineered & Maintained by <Link to="/ict-team">PEFAK56 ICT TEAM</Link>
            </motion.p>
           <WebsiteVisits />
          </div>

          <motion.div className={styles.socialIcons} variants={fadeInChild}>
            <a href="https://www.facebook.com/PEFAKawangware56" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF size={15} />
            </a>
            <a href="https://twitter.com/PEFAKawangware" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter size={15} />
            </a>
            <a href="https://www.instagram.com/pefa_kawangware_56/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={16} />
            </a>
            <a href="https://www.youtube.com/@PEFAK56" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <FaYoutube size={16} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;