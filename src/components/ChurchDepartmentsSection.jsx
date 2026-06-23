import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import styles from '../styles/ChurchDepartmentsSection.module.css';
import { Link } from 'react-router-dom';

const ChurchDepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('church_departments')
          .select('id, name, head, image_url')
          .order('name', { ascending: true })
          .limit(4);

        if (error) throw error;
        setDepartments(data || []);
      } catch (err) {
        setError("Unable to load ministries at this moment.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className={styles.wrapper}>
      {/* Background Decorative Elements */}
      <div className={styles.bgGlow} />
      
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={styles.badge}
          >
            <Sparkles size={14} /> <span>Join a Ministry</span>
          </motion.div>
          <h2 className={styles.title}>Impactful <span>Ministries</span></h2>
          <p className={styles.subtitle}>
            Every member has a unique gift. Discover where you can serve, grow, and connect within our specialized departments.
          </p>
        </header>

        {error ? (
          <div className={styles.errorState}>
            <AlertCircle size={32} />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonLine} style={{ width: '70%' }} />
                <div className={styles.skeletonLine} style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {departments.map((dept) => (
              <motion.article 
                key={dept.id} 
                className={styles.card}
                variants={cardVariants}
                whileHover="hover"
              >
                <Link to={`/church-department/${dept.id}`} className={styles.link}>
                  <div className={styles.imageWrapper}>
                    <motion.div 
                      className={styles.imageZoomer}
                      variants={{ hover: { scale: 1.1 } }}
                      transition={{ duration: 0.6 }}
                    >
                      {dept.image_url ? (
                        <img src={dept.image_url} alt={dept.name} className={styles.image} />
                      ) : (
                        <div className={styles.placeholder}>
                          <Users size={40} />
                        </div>
                      )}
                    </motion.div>
                    
                    <div className={styles.glassOverlay}>
                      <div className={styles.leaderPill}>
                        <UserCheck size={14} />
                        <span>{dept.head}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.deptName}>{dept.name}</h3>
                    <div className={styles.ctaText}>
                      Learn More <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        <footer className={styles.footer}>
          <Link to="/church-department" className={styles.mainCta}>
            <span>View All Departments</span>
            <div className={styles.ctaIcon}>
              <ArrowRight size={20} />
            </div>
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default ChurchDepartmentsSection;