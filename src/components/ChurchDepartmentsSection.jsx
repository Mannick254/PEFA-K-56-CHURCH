import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, ChevronRight, AlertCircle, Sparkles, Shield, Layers } from 'lucide-react';
import styles from '../styles/ChurchDepartmentsSection.module.css';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { STATIC_MINISTRIES } from '../data/ministries';

const ChurchDepartmentsSection = ({ limit }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const { data: supabaseData, error: dbError } = await supabase
          .from('church_departments')
          .select('*')
          .order('name', { ascending: true });

        if (dbError) throw dbError;

        const merged = STATIC_MINISTRIES.map(staticDept => {
          const remote = supabaseData?.find(
            r => r.name.toLowerCase() === staticDept.name.toLowerCase()
          );
          return {
            ...staticDept,
            ...remote,
            id: staticDept.id,
            image: remote?.image_url || staticDept.image,
            iconName: remote?.icon_name || staticDept.iconName || 'Sparkles',
            description: remote?.description || staticDept.description || ''
          };
        });

        setDepartments(limit ? merged.slice(0, limit) : merged);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load ministries at this moment.");
        setDepartments(limit ? STATIC_MINISTRIES.slice(0, limit) : STATIC_MINISTRIES);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [limit]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className={styles.cnnDeptSection}>
      <div className={styles.container}>
        
        {/* CNN Top Header */}
        <header className={styles.cnnHeader}>
          <div className={styles.cnnCategoryBadge}>
            <Layers size={13} className={styles.cnnBadgeIcon} />
            <span>MINISTRY NETWORK | SPECIAL DIRECTORY</span>
          </div>
          <h2 className={styles.cnnTitle}>
            Impactful <span className={styles.cnnHighlight}>Ministries & Departments</span>
          </h2>
          <p className={styles.cnnSubtitle}>
            Every member has a unique gift. Explore our active operational wings serving our sanctuary and the Kawangware 56 community.
          </p>
        </header>

        {error && !loading && (
          <div className={styles.cnnErrorBox}>
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* CNN Loading State */}
        {loading ? (
          <div className={styles.cnnSkeletonGrid}>
            {[...Array(limit || 4)].map((_, i) => (
              <div key={i} className={styles.cnnSkeletonCard}>
                <div className={styles.cnnSkeletonImage} />
                <div className={styles.cnnSkeletonLine} style={{ width: '80%' }} />
                <div className={styles.cnnSkeletonLine} style={{ width: '50%' }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className={styles.cnnGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {departments.map((dept, idx) => {
              const isLeadStory = idx === 0; // First item styled as CNN Lead Feature Card
              
              return (
                <motion.article 
                  key={dept.id} 
                  className={`${styles.cnnCard} ${isLeadStory ? styles.cnnCardFeatured : ''}`}
                  variants={cardVariants}
                >
                  <Link to={`/church-department-reader/${dept.id}`} className={styles.cnnLink}>
                    
                    <div className={styles.cnnImageWrapper}>
                      {dept.image ? (
                        <img src={dept.image} alt={dept.name} className={styles.cnnImage} />
                      ) : (
                        <div className={styles.cnnPlaceholder}>
                          <Users size={36} />
                        </div>
                      )}

                      {/* CNN Category Overlay Tag */}
                      <div className={styles.cnnTagOverlay}>
                        <span>DEPT</span>
                      </div>

                      {/* Leader Overlay Pill */}
                      {dept.head && (
                        <div className={styles.cnnLeaderTag}>
                          <UserCheck size={13} />
                          <span>{dept.head}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.cnnContent}>
                      <div className={styles.cnnMeta}>
                        <span className={styles.cnnMinistryLabel}>PEFA K-56 MINISTRY</span>
                      </div>
                      
                      <h3 className={styles.cnnDeptName}>{dept.name}</h3>

                      {isLeadStory && dept.description && (
                        <p className={styles.cnnExcerpt}>
                          {dept.description.length > 130 
                            ? `${dept.description.substring(0, 130)}...` 
                            : dept.description}
                        </p>
                      )}

                      <div className={styles.cnnCtaText}>
                        <span>Explore Department</span>
                        <ChevronRight size={15} />
                      </div>
                    </div>

                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* CNN Newsroom Directory Action Footer */}
        <footer className={styles.cnnFooter}>
          <Link to="/church-department" className={styles.cnnFooterBtn}>
            <span>View All Church Departments</span>
            <ChevronRight size={18} />
          </Link>
        </footer>

      </div>
    </section>
  );
};

export default ChurchDepartmentsSection;