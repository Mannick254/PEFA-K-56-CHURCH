import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveRight, Flame, Heart, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import styles from '../styles/PrayerHighlight.module.css';

const PrayerHighlight = () => {
    const [latestPrayer, setLatestPrayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prayed, setPrayed] = useState(false);
    const [prayCount, setPrayCount] = useState(0);

    useEffect(() => {
        const fetchLatestPrayer = async () => {
            try {
                const { data, error } = await supabase
                    .from('prayers')
                    .select('id, title, request, created_at')
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) throw error;
                if (data && data.length > 0) {
                    setLatestPrayer(data[0]);
                    setPrayCount(data[0].prayer_count || 12);
                }
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPrayer();
    }, []);

    const handleAmenClick = () => {
        if (!prayed) {
            setPrayed(true);
            setPrayCount((prev) => prev + 1);
        }
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.editorialLayout}>
                    
                    {/* Left Brand Column */}
                    <motion.div 
                        className={styles.infoColumn}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.badge}>
                            <Flame size={14} className={styles.flameIcon} />
                            <span>PRAYER ALTAR</span>
                        </div>
                        <h2 className={styles.title}>Carrying One <br/>Another's <span>Burdens</span></h2>
                        <p className={styles.description}>
                            At PEFA Kawangware 56, intercession is our foundation. 
                            Stand with our community by lifting up the latest prayer concern today.
                        </p>
                        
                        <div className={styles.ctaGroup}>
                            <Link to="/prayers" className={styles.mainCta}>
                                View Prayer Wall <MoveRight size={18} />
                            </Link>
                            <Link to="/prayers/submit" className={styles.secondaryCta}>
                                Submit Request
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Live Feed Column */}
                    <div className={styles.feedColumn}>
                        <div className={styles.liveIndicatorHeader}>
                            <div className={styles.liveDotWrapper}>
                                <span className={styles.pulseDot} />
                                <span className={styles.liveText}>LIVE INTERCESSION FEED</span>
                            </div>
                            <span className={styles.privacyNote}>
                                <ShieldCheck size={13} /> Confidential & Moderated
                            </span>
                        </div>

                        {loading ? (
                            <div className={styles.loadingState}>
                                <Sparkles size={20} className={styles.spinningIcon} />
                                <span>Connecting to Prayer Altar...</span>
                            </div>
                        ) : latestPrayer ? (
                            <motion.div 
                                key={latestPrayer.id} 
                                className={styles.prayerRow}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={styles.rowHeader}>
                                    <span className={styles.prayerTitle}>{latestPrayer.title}</span>
                                    <span className={styles.date}>
                                        <Clock size={12} />
                                        {new Date(latestPrayer.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <blockquote className={styles.requestText}>
                                    "{latestPrayer.request.length > 140 
                                        ? `${latestPrayer.request.substring(0, 140)}...` 
                                        : latestPrayer.request}"
                                </blockquote>

                                <div className={styles.rowActions}>
                                    <motion.button 
                                        className={`${styles.amenAction} ${prayed ? styles.amenActive : ''}`}
                                        onClick={handleAmenClick}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Heart size={16} className={prayed ? styles.heartFilled : ''} /> 
                                        <span>{prayed ? 'Prayed' : 'Stand in Prayer'}</span>
                                        <span className={styles.countBadge}>{prayCount}</span>
                                    </motion.button>

                                    <div className={styles.intercessionTag}>
                                        <Sparkles size={13} /> Active Request
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className={styles.noPrayerState}>No recent prayer requests found.</div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PrayerHighlight;