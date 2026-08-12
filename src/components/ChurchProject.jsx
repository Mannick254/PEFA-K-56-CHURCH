import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/ChurchProject.module.css';

const ChurchProject = () => {
  return (
    <section className={styles.projectSection}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.subtitle}>Our Next Chapter</span>
            <h1 className={styles.title}>Church Expansion Project</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className={styles.description}>
              We are excited to announce our church expansion project. This project is a step of faith as we seek to create more space for worship, fellowship, and ministry to our growing community.
            </p>
          </motion.div>
        </header>

        <div className={styles.mainContent}>
            <motion.div 
                className={styles.imageContainer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {/* You can place an image of the project plan here */}
                <img src="https://via.placeholder.com/800x500" alt="Church Project Plan" className={styles.projectImage} />
            </motion.div>
            <motion.div 
                className={styles.textContainer}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h3 className={styles.subheading}>Project Goals</h3>
                <ul className={styles.goalList}>
                    <li>A new, larger sanctuary to accommodate our growing congregation.</li>
                    <li>Dedicated space for youth and children's ministries.</li>
                    <li>A multi-purpose hall for community events and outreach.</li>
                    <li>Improved accessibility for all members.</li>
                </ul>
                <p>Your support, whether through prayer, volunteering, or financial giving, is crucial to making this vision a reality. Join us in building a legacy for generations to come.</p>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ChurchProject;
