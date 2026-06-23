import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchEstablished.module.css';
import { motion } from 'framer-motion';
import { Landmark, History, ShieldCheck, Flame } from 'lucide-react';

const ChurchEstablished = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchPoints = async () => {
            const { data, error } = await supabase.from('church_established').select('*');
            if (!error) {
                setPoints(data.map(point => ({...point, imageUrl: point.image_url || 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1779698892/PK56_uh2j35.jpg'})));
            }
            setLoading(false);
        };
        fetchPoints();
    }, []);

    const toggleReadMore = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
        }
    };

    // Helper to assign icons if images are missing or to supplement them
    const iconMap = [<Landmark />, <History />, <ShieldCheck />, <Flame />];

    if (loading) return <div className={styles.skeletonLoader}>Loading Foundations...</div>;
    if (points.length === 0) return null;

    return (
        <section className={styles.establishedSection}>
            <div className={styles.container}>
                <header className={styles.sectionHeader}>
                    <span className={styles.kicker}>Our Roots</span>
                    <h2 className={styles.sectionTitle}>Built on the Rock</h2>
                    <p className={styles.sectionSubtitle}>
                        The history and spiritual foundations that have shaped PEFA Kawangware 56 into a beacon of hope.
                    </p>
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
                            key={index} 
                            className={styles.pointCard}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                        >
                            <div className={styles.imageWrapper}>
                                
                                    <img src={point.imageUrl} alt={point.title || "Church foundation"} className={styles.pointImage} />
                                
                                <div className={styles.iconBadge}>
                                    {iconMap[index % iconMap.length]}
                                </div>
                            </div>
                            
                            <div className={styles.pointContent}>
                                <h3 className={styles.pointTitle}>{point.title}</h3>
                                <p className={styles.pointMessage}>
                                    {expandedCard === index ? point.message : `${point.message.substring(0, 100)}...`}
                                </p>
                                <button onClick={() => toggleReadMore(index)} className={styles.readMoreBtn}>
                                    {expandedCard === index ? 'Read Less' : 'Read More'}
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ChurchEstablished;