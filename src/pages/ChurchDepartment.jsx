import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
            r => r.name?.toLowerCase() === staticDept.name?.toLowerCase()
          );
          return {
            ...staticDept,
            ...remote,
            id: staticDept.id,
            image: remote?.image_url || staticDept.image,
            iconName: remote?.icon_name || staticDept.iconName || 'Sparkles',
            description: remote?.description || staticDept.description || '',
            category: remote?.category || staticDept.category || 'Ministry'
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
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} />
    </div>
  </div>
);

const ChurchDepartment = () => {
  const { data: departments, isLoading } = useDepartments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories for newsroom pill filter
  const categories = useMemo(() => {
    const cats = new Set(departments.map(d => d.category || 'Ministry'));
    return ['All', ...Array.from(cats)];
  }, [departments]);

  // Filter departments based on search string and category
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dept.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || dept.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [departments, searchQuery, selectedCategory]);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }
    }),
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
  };

  return (
    <>
      <Seo 
        title="Church Departments & Ministries" 
        description="Explore the active departments and serving opportunities at PEFA Kawangware 56." 
      />
      
      <section className={styles.wrapper}>
        {/* Top Ticker / Breaking Header Bar */}
        <div className={styles.tickerBar}>
          <div className={styles.tickerInner}>
            <span className={styles.tickerTag}>DIRECTORIES & MINISTRIES</span>
            <span className={styles.tickerText}>Explore serving teams, community outreach, and ministry leads.</span>
          </div>
        </div>

        <div className={styles.container}>
          {/* Main Editorial Hero Banner */}
          <header className={styles.header}>
            <div className={styles.headerHeadlineGroup}>
              <span className={styles.kicker}>PEFA KAWANGWARE 56</span>
              <h1 className={styles.title}>Church Ministries & Departments</h1>
              <p className={styles.headerDescription}>
                A complete dispatch of active departments, operational units, and community serving opportunities across our church.
              </p>
            </div>

            {/* Newsroom Filter & Search Toolbar */}
            <div className={styles.filterToolbar}>
              <div className={styles.searchBox}>
                <Icons.Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search departments..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>
                    <Icons.X size={14} />
                  </button>
                )}
              </div>

              <div className={styles.categoryPills}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Featured / Lead Department Banner (First result when unfiltered) */}
          {!isLoading && filteredDepartments.length > 0 && !searchQuery && selectedCategory === 'All' && (
            <motion.div 
              className={styles.leadFeatureCard}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/church-department-reader/${filteredDepartments[0].id}`} className={styles.leadLink}>
                <div className={styles.leadImageWrapper}>
                  <img src={filteredDepartments[0].image} alt={filteredDepartments[0].name} className={styles.leadImage} />
                  <span className={styles.leadBadge}>FEATURED MINISTRY</span>
                </div>
                <div className={styles.leadContent}>
                  <div className={styles.leadHeader}>
                    <IconRenderer iconName={filteredDepartments[0].iconName} size={22} />
                    <span className={styles.leadCategory}>{filteredDepartments[0].category || 'Ministry'}</span>
                  </div>
                  <h2 className={styles.leadTitle}>{filteredDepartments[0].name}</h2>
                  <p className={styles.leadDescription}>
                    {filteredDepartments[0].description.length > 180 
                      ? `${filteredDepartments[0].description.substring(0, 180)}...` 
                      : filteredDepartments[0].description}
                  </p>
                  <span className={styles.leadAction}>
                    Read Full Dispatch <Icons.ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid Layout for Department Cards */}
          <div className={styles.departmentGrid}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredDepartments.length === 0 ? (
              <div className={styles.noResults}>
                <Icons.AlertCircle size={32} />
                <h3>No departments match your filter</h3>
                <p>Try clearing your search terms or choosing another category.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className={styles.resetBtn}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {/* Skip first item on default view since it's displayed as Lead Feature */}
                {(searchQuery || selectedCategory !== 'All' ? filteredDepartments : filteredDepartments.slice(1)).map((dept, index) => (
                  <motion.div
                    key={dept.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Link to={`/church-department-reader/${dept.id}`} className={styles.card}>
                      <div className={styles.imageWrapper}>
                        <img src={dept.image} alt={dept.name} className={styles.cardImage} loading="lazy" />
                        <div className={styles.iconBadge}>
                          <IconRenderer iconName={dept.iconName} size={18} />
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        <span className={styles.cardTag}>{dept.category || 'Ministry'}</span>
                        <h3 className={styles.cardTitle}>{dept.name}</h3>
                        <p className={styles.cardDescription}>
                          {dept.description.length > 95 
                            ? `${dept.description.substring(0, 95)}...` 
                            : dept.description}
                        </p>
                        <span className={styles.cardAction}>
                          Learn More <Icons.ChevronRight size={15} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChurchDepartment;