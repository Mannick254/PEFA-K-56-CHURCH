import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/StatementOfFaith.module.css';
import { motion } from 'framer-motion';
import { Book, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const StatementOfFaith = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('statement_of_faith')
          .select('*')
          .order('priority', { ascending: true });

        if (error) throw error;
        setStatements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
    }
  };

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <Loader2 className={styles.spinner} size={40} />
      <span>Consulting the foundations...</span>
    </div>
  );

  return (
    <section className={styles.mainWrapper}>
      <div className={styles.container}>
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.badge}>
             <Sparkles size={14} className={styles.gold} />
             <span>Theological Pillars</span>
          </div>
          <h1 className={styles.mainTitle}>Statement of Faith</h1>
          <p className={styles.subtitle}>
            Our core convictions and the eternal truths that guide PEFA Kawangware 56.
          </p>
        </motion.header>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={24} />
            <p>Doctrine content currently unavailable.</p>
          </div>
        )}

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {statements.map((statement) => (
            <motion.article 
              key={statement.id}
              className={styles.doctrineCard}
              variants={itemVariants}
            >
              <div className={styles.cardHeader}>
                <span className={styles.watermark}>0{statement.priority}</span>
                <h3 className={styles.doctrineTitle}>{statement.title}</h3>
              </div>
              
              <div className={styles.contentBody}>
                <p>{statement.content}</p>
              </div>

              {statement.bible_reference && (
                <div className={styles.referenceBadge}>
                  <Book size={12} />
                  <span>{statement.bible_reference}</span>
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatementOfFaith;