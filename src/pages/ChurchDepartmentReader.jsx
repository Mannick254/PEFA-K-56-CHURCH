
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import * as Icons from 'lucide-react';
import { STATIC_MINISTRIES } from '../data/ministries';
import styles from '../styles/ChurchDepartmentReader.module.css';
import Seo from '../components/Seo';

const ChurchDepartmentReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Find local static data
        const staticDept = STATIC_MINISTRIES.find(d => d.id === id);
        
        if (!staticDept) {
            setLoading(false);
            return;
        }

        // 2. Fetch remote data
        const { data: remoteData } = await supabase
          .from('church_departments')
          .select('*')
          .eq('name', staticDept.name)
          .single();

        // 3. Merge (Remote overrides static where applicable)
        if (remoteData || staticDept) {
          setDept({
            ...staticDept,
            ...remoteData,
            image: remoteData?.image_url || staticDept?.image,
            iconName: remoteData?.icon_name || staticDept?.iconName || 'Sparkles',
            description: remoteData?.description || staticDept?.description || ''
          });
        }
      } catch (err) {
        console.error("Error loading department:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className={styles.loader}><div className={styles.spinner} /></div>;
  if (!dept) return <div className={styles.errorArea}>Department not found. <Link to="/church-department">Go Back</Link></div>;

  const IconComponent = Icons[dept.iconName] || Icons.Sparkles;

  // Split description by double newlines for the 3-paragraph layout
  const paragraphs = dept.description.split('\n\n');

  return (
    <main className={styles.wrapper}>
        <Seo title={dept.name} description={dept.description.substring(0, 160)} />
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className={styles.hero}
        style={{ '--bg-image': `url(${dept.image})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to="/church-department" className={styles.backButton}>
            <Icons.ArrowLeft size={18} />
            <span>All Departments</span>
          </Link>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.iconCircle}>
              <IconComponent size={32} />
            </div>
            <h1 className={styles.title}>{dept.name}</h1>
            
            {dept.head && (
              <div className={styles.leaderBadge}>
                <Icons.UserCheck size={18} />
                <span>Led by <strong>{dept.head}</strong></span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.textContent}>
              {paragraphs.map((para, idx) => {
                // Check if this paragraph contains a Bible verse (last paragraph)
                const isVerse = idx === paragraphs.length - 1;
                
                return (
                  <motion.p 
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={isVerse ? styles.scripturePara : styles.bodyPara}
                  >
                    {para}
                  </motion.p>
                );
              })}
              
              <div className={styles.ctaBox}>
                <h3>Ready to make an impact?</h3>
                <p>Join the {dept.name} and use your gifts for the Kingdom.</p>
                <button className={styles.joinButton}>Inquire About Joining</button>
              </div>
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.stickyCard}>
                <h4>Meeting Times</h4>
                <div className={styles.infoRow}>
                  <Icons.Calendar size={18} />
                  <span></span>
                </div>
                <div className={styles.infoRow}>
                  <Icons.MapPin size={18} />
                  <span></span>
                </div>
                <hr className={styles.divider} />
                <p className={styles.sidebarNote}>
                  * Times may vary during special events. Contact the department head for details.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChurchDepartmentReader;
