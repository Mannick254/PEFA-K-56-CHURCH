import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchImportance.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, ShieldCheck, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../image-optimization';
import { useNavigate } from 'react-router-dom';

const ChurchImportance = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const { data, error } = await supabase
                    .from('church_importance')
                    .select('*')
                    .order('id', { ascending: true });
                
                if (!error && data) {
                    const optimizedPoints = data.map(point => ({
                        ...point,
                        imageUrl: getOptimizedImageUrl(point.image_url, { width: 800, quality: 85 })
                    }));
                    setPoints(optimizedPoints);
                }
            } catch (err) {
                console.error("Error fetching church foundations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPoints();
    }, []);

    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('love') || t.includes('heart')) return <Heart className={styles.icon} />;
        if (t.includes('community') || t.includes('people')) return <Users className={styles.icon} />;
        if (t.includes('protect') || t.includes('truth')) return <ShieldCheck className={styles.icon} />;
        return <Sparkles className={styles.icon} />;
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    if (loading) return <SkeletonLoader />;

    return (
        <section className={styles.importanceSection}>
            {/* Background Decorative Elements */}
            <div className={styles.lightLeak} />
            
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.kicker}>The Living Body</span>
                        <h2 className={styles.sectionTitle}>
                            The Heart of the <span className={styles.accent}>Church</span>
                        </h2>
                        <div className={styles.titleUnderline} />
                        <p className={styles.subtitle}>
                            Understanding why the local church is God's primary vehicle for spiritual growth and community.
                        </p>
                    </motion.div>
                </header>

                <motion.div 
                    className={styles.pointsGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {points.map((point, index) => (
                        <motion.article 
                            key={point.id} 
                            className={styles.pointCard}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                        >
                            <div className={styles.imageWrapper}>
                                <img 
                                    src={point.imageUrl || '/api/placeholder/800/600'} 
                                    alt={point.title} 
                                    className={styles.pointImage} 
                                />
                                <div className={styles.glassOverlay}>
                                    <div className={styles.iconCircle}>
                                        {getIcon(point.title)}
                                    </div>
                                </div>
                                <span className={styles.floatingNumber}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className={styles.cardContent}>
                                <h3 className={styles.pointTitle}>{point.title}</h3>
                                <p className={styles.pointDescription}>
                                    {point.message.length > 130 
                                        ? `${point.message.substring(0, 130)}...` 
                                        : point.message}
                                </p>
                                
                                <button 
                                    onClick={() => navigate(`/church-importance/${point.id}`)} 
                                    className={styles.readMoreBtn}
                                >
                                    <span>Read Insight</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const SkeletonLoader = () => (
    <div className={styles.importanceSection}>
        <div className={styles.container}>
            <div className={styles.skeletonHeader} />
            <div className={styles.pointsGrid}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.skeletonCard} />
                ))}
            </div>
        </div>
    </div>
);

export default ChurchImportance;