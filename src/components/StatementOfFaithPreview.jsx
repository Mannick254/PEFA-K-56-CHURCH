import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronRight, BookOpen, ShieldCheck } from 'lucide-react';
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
          .limit(2);

        if (error) throw error;
        setStatements(data);
      } catch (err) {
        console.error('Error loading doctrinal statements:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatements();
  }, []);

  return (
    <section className={styles.cnnFaithSection}>
      <div className={styles.container}>
        <div className={styles.cnnLayoutGrid}>
          
          {/* Left Side: CNN Sticky Editorial Header */}
          <motion.div 
            className={styles.cnnHeaderSide}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.cnnCategoryBadge}>
              <ShieldCheck size={14} className={styles.cnnBadgeIcon} />
              <span>SPECIAL REPORT | DOCTRINAL FOUNDATION</span>
            </div>

            <h2 className={styles.cnnMainTitle}>
              What We Believe At <span className={styles.cnnHighlight}>PEFA K-56</span>
            </h2>

            <p className={styles.cnnSubtext}>
              Our faith is not a suggestion; it is the anchor of our community. 
              Explore the core biblical tenets that guide our worship, leadership, and daily walk.
            </p>

            <Link to="/statement-of-faith" className={styles.cnnExploreBtn}>
              <span>Read Full Creed & Doctrine</span>
              <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Right Side: CNN Wire Index List */}
          <div className={styles.cnnListSide}>
            {loading ? (
              <div className={styles.cnnLoaderWrapper}>
                <div className={styles.cnnSkeletonRow} />
                <div className={styles.cnnSkeletonRow} />
                <div className={styles.cnnSkeletonRow} />
              </div>
            ) : (
              statements.map((statement, index) => (
                <motion.div 
                  key={index} 
                  className={styles.cnnArticleRow}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                >
                  <div className={styles.cnnIndexBadge}>
                    <span>ART.</span>
                    <strong>0{index + 1}</strong>
                  </div>

                  <div className={styles.cnnArticleBody}>
                    <div className={styles.cnnMetaRow}>
                      <span className={styles.cnnTopicTag}>CORE TENET</span>
                    </div>

                    <h3 className={styles.cnnArticleTitle}>{statement.title}</h3>

                    <p className={styles.cnnArticleExcerpt}>
                      {statement.content.length > 160 
                        ? `${statement.content.substring(0, 160)}...` 
                        : statement.content}
                    </p>

                    <Link to="/statement-of-faith" className={styles.cnnReadMoreLink}>
                      <span>Explore this principle</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}

            {/* Bottom Mobile Action CTA */}
            <div className={styles.cnnMobileActionWrapper}>
              <Link to="/statement-of-faith" className={styles.cnnMobileBtn}>
                <BookOpen size={16} />
                <span>View All Doctrinal Statements</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatementOfFaithPreview;