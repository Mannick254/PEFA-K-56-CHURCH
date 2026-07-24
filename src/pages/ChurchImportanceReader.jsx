import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOptimizedImageUrl } from '../image-optimization';
import { ArrowLeft, BookOpen, Clock, Share2 } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from '../styles/ChurchReader.module.css';
import Seo from '../components/Seo';

const ChurchImportanceReader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [point, setPoint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reading progress bar logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPoint = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const { data, error: fetchError } = await supabase
                    .from('church_importance')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) throw fetchError;

                if (data) {
                    setPoint({
                        ...data,
                        imageUrl: getOptimizedImageUrl(data.image_url, { width: 1200, quality: 90 }),
                    });
                }
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPoint();
    }, [id]);

    // Calculate reading time
    const readingTime = useMemo(() => {
        if (!point?.message) return 0;
        const words = point.message.split(/\s+/).length;
        return Math.ceil(words / 200); // Avg 200 wpm
    }, [point]);

    const handleBack = () => navigate('/#church-importance');

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Loading inspiration...</p>
            </div>
        );
    }

    if (error || !point) {
        return (
            <div className={styles.errorContainer}>
                <Seo title="Error" />
                <h2>Something went wrong</h2>
                <p>{error || "We couldn't find the content you're looking for."}</p>
                <button onClick={handleBack} className={styles.backButton}>Return Home</button>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Seo title={point.title} description={point.message.substring(0, 160)} />
            {/* Progress Bar */}
            <motion.div className={styles.progressBar} style={{ scaleX }} />

            <nav className={styles.navHeader}>
                <div className={styles.navContent}>
                    <button onClick={handleBack} className={styles.iconButton} title="Go back">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <button className={styles.iconButton} onClick={() => navigator.share?.({ title: point.title, url: window.location.href })}>
                        <Share2 size={20} />
                    </button>
                </div>
            </nav>

            <main className={styles.mainContent}>
                <motion.header 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.articleHeader}
                >
                    <div className={styles.badge}>
                        <BookOpen size={14} />
                        <span>Spiritual Growth</span>
                    </div>
                    <h1 className={styles.title}>{point.title}</h1>
                    
                    <div className={styles.metaData}>
                        <div className={styles.metaItem}>
                            <Clock size={16} />
                            <span>{readingTime} min read</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.metaItem}>
                            <span>Church Importance Series</span>
                        </div>
                    </div>
                </motion.header>

                {point.imageUrl && (
                    <motion.div 
                        className={styles.heroImageWrapper}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img src={point.imageUrl} alt={point.title} className={styles.heroImage} />
                    </motion.div>
                )}

                <motion.article 
                    className={styles.articleBody}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {point.message?.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                </motion.article>

                <footer className={styles.articleFooter}>
                    <div className={styles.footerLine}></div>
                    <p>Peace be with you.</p>
                    <button onClick={handleBack} className={styles.finalBackBtn}>
                        Explore more topics
                    </button>
                </footer>
            </main>
        </div>
    );
};

export default ChurchImportanceReader;