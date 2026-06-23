import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowRight, MoveRight } from 'lucide-react';
import styles from '../styles/StatementOfFaithPreview.module.css';

const StatementOfFaithPreview = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const { data, error } = await supabase
          .from('statement_of_faith')
          .select('title, content')
          .order('id', { ascending: true })
          .limit(4); // Showing 4 to create a stronger vertical rhythm

        if (error) throw error;
        setStatements(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatements();
  }, []);

  return (
    <section className={styles.sofWrapper}>
      <div className={styles.container}>
        <div className={styles.layoutGrid}>
          
          {/* Left Side: Sticky Header */}
          <motion.div 
            className={styles.headerSide}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className={styles.tag}>DOCRINAL FOUNDATION</span>
            <h2 className={styles.mainTitle}>What We Believe At <span>PEFA K-56</span></h2>
            <p className={styles.subtext}>
              Our faith is not a suggestion; it is the anchor of our community. 
              Explore the core tenets that guide our worship and walk.
            </p>
            <Link to="/statement-of-faith" className={styles.exploreLink}>
              View Full Creed <MoveRight size={20} />
            </Link>
          </motion.div>

          {/* Right Side: Editorial List (No Cards) */}
          <div className={styles.listSide}>
            {loading ? (
              <div className={styles.loader}>Loading Foundation...</div>
            ) : (
              statements.map((statement, index) => (
                <motion.div 
                  key={index} 
                  className={styles.statementRow}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.rowNumber}>0{index + 1}</div>
                  <div className={styles.rowContent}>
                    <h4 className={styles.rowTitle}>{statement.title}</h4>
                    <p className={styles.rowText}>
                      {statement.content.substring(0, 160)}...
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatementOfFaithPreview;