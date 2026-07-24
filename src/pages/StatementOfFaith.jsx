import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import styles from '../styles/StatementOfFaith.module.css';

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

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <Loader2 className={styles.spinner} size={40} />
      <span>Loading Foundations...</span>
    </div>
  );

  return (
    <section className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* Header mimicking the image structure */}
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h1 className={styles.mainTitle}>STATEMENT OF FAITH</h1>
          <p className={styles.affirmationText}>
            Our Core Doctrines must be fully affirmed by all community members.
          </p>
          <div className={styles.thickDivider} />
        </motion.header>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={20} />
            <p>Database connection error. Please try again later.</p>
          </div>
        )}

        {/* The Numbered List Layout */}
        <div className={styles.pillarList}>
          {statements.map((statement, index) => (
            <motion.div 
              key={statement.id}
              className={styles.pillarRow}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* The Bold Circle Number from your image */}
              <div className={styles.numberContainer}>
                <div className={styles.circleNumber}>
                  {index + 1}
                </div>
                {index !== statements.length - 1 && <div className={styles.connectingLine} />}
              </div>

              {/* The Content side */}
              <div className={styles.contentSide}>
                <h3 className={styles.doctrineTitle}>{statement.title}</h3>
                <p className={styles.doctrineContent}>
                  {statement.content}
                </p>
                {statement.bible_reference && (
                  <div className={styles.reference}>
                    <BookOpen size={14} className={styles.refIcon} />
                    <span>{statement.bible_reference}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatementOfFaith;