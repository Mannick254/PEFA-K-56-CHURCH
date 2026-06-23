import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchImportance.module.css';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Heart, Users, ShieldCheck, Sparkles, Plus, Minus, BookOpen } from 'lucide-react';
import { getOptimizedImageUrl } from '../image-optimization';

const ChurchImportance = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchPoints = async () => {
            const { data, error } = await supabase.from('church_importance').select('*');
            if (!error) {
                const optimizedPoints = data.map(point => ({
                    ...point,
                    // Correctly use image_url from the database
                    imageUrl: getOptimizedImageUrl(point.image_url, { width: 500, quality: 80 })
                }));
                setPoints(optimizedPoints);
            }
            setLoading(false);
        };
        fetchPoints();
    }, []);

    // Logic to map icons based on title keywords for more relevance
    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('love') || t.includes('heart')) return <Heart />;
        if (t.includes('community') || t.includes('people')) return <Users />;
        if (t.includes('protect') || t.includes('truth')) return <ShieldCheck />;
        return <Sparkles />;
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className={styles.spinner}
            />
            <p>Gathering foundations...</p>
        </div>
    );

    return (
        <section className={styles.importanceSection}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.kicker}>Why We Gather</span>
                        <h2 className={styles.sectionTitle}>The Importance of the <span className={styles.accent}>Church</span></h2>
                        <div className={styles.titleUnderline} />
                    </motion.div>
                </header>

                <LayoutGroup>
                    <motion.div layout className={styles.pointsGrid}>
                        {points.map((point, index) => {
                            const isExpanded = expandedCard === index;
                            
                            return (
                                <motion.article 
                                    layout
                                    key={index} 
                                    className={`${styles.pointCard} ${isExpanded ? styles.expanded : ''}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <motion.img 
                                            layout
                                            src={point.imageUrl || '/api/placeholder/400/300'} 
                                            alt={point.title} 
                                            className={styles.pointImage} 
                                        />
                                        <div className={styles.imageOverlay} />
                                        <div className={styles.floatingIcon}>
                                            {getIcon(point.title)}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.content}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardNumber}>0{index + 1}</span>
                                            <h3 className={styles.pointTitle}>{point.title}</h3>
                                        </div>

                                        <motion.div layout className={styles.messageContainer}>
                                            <div className={styles.pointMessage}>
                                                {isExpanded 
                                                    ? point.message 
                                                    : `${point.message.substring(0, 110)}...`
                                                }
                                            </div>
                                        </motion.div>

                                        <button 
                                            onClick={() => setExpandedCard(isExpanded ? null : index)} 
                                            className={styles.actionBtn}
                                        >
                                            {isExpanded ? (
                                                <><Minus size={16} /> Show Less</>
                                            ) : (
                                                <><Plus size={16} /> Learn More</>
                                            )}
                                        </button>
                                    </div>

                                    {/* Subtle background decoration for expanded state */}
                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className={styles.cardDecoration}
                                        >
                                            <BookOpen size={120} />
                                        </motion.div>
                                    )}
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </LayoutGroup>
            </div>
        </section>
    );
};

export default ChurchImportance;