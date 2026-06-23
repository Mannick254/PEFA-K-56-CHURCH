import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchDepartment.module.css';
import { motion } from 'framer-motion';
import { Users, UserCheck, Sparkles, ArrowUpRight } from 'lucide-react';

const ChurchDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('church_departments')
          .select('id, name, head, image_url')
          .order('name', { ascending: true });

        if (error) throw error;
        setDepartments(data);
      } catch (err) {
        setError(err.message);
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
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] } 
    }
  };

  if (loading) return (
    <div className={styles.loader}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Sparkles className={styles.goldText} />
      </motion.div>
      <span>Gathering our teams...</span>
    </div>
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={styles.kicker}
          >
            Our Ministry
          </motion.span>
          <h2 className={styles.title}>Church Departments</h2>
          <p className={styles.subtitle}>
            Discover the heartbeat of our church. Our departments are dedicated to serving God and our community with excellence and love.
          </p>
        </header>

        {error && <div className={styles.error}>Unable to load departments.</div>}

        <motion.div 
          className={styles.departmentGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {departments.map((dept) => (
            <motion.article 
              key={dept.id} 
              className={styles.deptCard}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className={styles.imageArea}>
                {dept.image_url ? (
                  <img src={dept.image_url} alt={dept.name} className={styles.deptImage} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <Users size={40} />
                  </div>
                )}
                <div className={styles.cardOverlay}>
                    <div className={styles.badge}><Users size={12}/> Department</div>
                </div>
              </div>

              <div className={styles.contentArea}>
                <h3 className={styles.deptName}>{dept.name}</h3>
                <div className={styles.leaderInfo}>
                  <UserCheck size={16} className={styles.goldText} />
                  <span>Led by <strong>{dept.head}</strong></span>
                </div>
                <button className={styles.learnMore}>
                  Get Involved <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChurchDepartment;