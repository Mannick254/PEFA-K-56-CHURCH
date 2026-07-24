import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import * as Icons from 'lucide-react';
import styles from '../styles/ChurchDepartment.module.css';
import { STATIC_MINISTRIES } from '../data/ministries';
import Seo from '../components/Seo';

const IconRenderer = ({ iconName, size = 20 }) => {
  const IconComponent = Icons[iconName] || Icons.Sparkles;
  return <IconComponent size={size} />;
};

const useDepartments = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
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

        setData(merged);
      } catch (err) {
        console.error("Fetch error:", err);
        setData(STATIC_MINISTRIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { data, isLoading };
};

const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
      </div>
    </div>
  );

const ChurchDepartment = () => {
  const { data: departments, isLoading } = useDepartments();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <>
      <Seo 
        title="Church Departments" 
        description="Explore the various departments at PEFA Kawangware 56 and find your place to serve." 
      />
      <motion.section 
        className={styles.wrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <motion.span 
              className={styles.kicker}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Get Involved
            </motion.span>
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Serving with Purpose
            </motion.h1>
            <motion.p
              className={styles.headerDescription}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find your place and purpose. Our diverse range of departments offers a place for 
              everyone to use their unique gifts to serve God and our community.
            </motion.p>
          </header>

          <div className={styles.departmentGrid}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to={`/church-department-reader/${dept.id}`} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img src={dept.image} alt={`${dept.name} ministry`} className={styles.cardImage} />
                      <div className={styles.imageOverlay} />
                      <div className={styles.iconBadge}>
                        <IconRenderer iconName={dept.iconName} size={24} />
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{dept.name}</h3>
                      <p className={styles.cardDescription}>
                        {dept.description.substring(0, 100)}...
                      </p>
                      <span className={styles.cardAction}>
                        Learn More <Icons.ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ChurchDepartment;
