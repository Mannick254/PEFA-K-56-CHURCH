import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoveRight, Flame, Heart, Sparkles } from 'lucide-react';
import styles from '../styles/PrayerHighlight.module.css';

const PrayerHighlight = () => {
    const [latestPrayer, setLatestPrayer] = useState(null);
    const [loading, setLoading] = useState(true);

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
                }
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPrayer();
    }, []);

    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.editorialLayout}>
                    
                    <motion.div 
                        className={styles.infoColumn}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.badge}>
                            <Flame size={16} className={styles.flameIcon} />
                            <span>K-56 PRAYER ALTAR</span>
                        </div>
                        <h2 className={styles.title}>Carrying One <br/>Another's <span>Burdens</span></h2>
                        <p className={styles.description}>
                            At PEFA Kawangware 56 Church, we believe prayer is the engine of the church. 
                            Your request is a sacred trust. Join us in standing in the gap for the latest need.
                        </p>
                        <Link to="/prayers" className={styles.mainCta}>
                            Visit Prayer Wall <MoveRight size={20} />
                        </Link>
                    </motion.div>

                    <div className={styles.feedColumn}>
                        {loading ? (
                            <div className={styles.loadingState}>Connecting to Altar...</div>
                        ) : latestPrayer ? (
                            <motion.div 
                                key={latestPrayer.id} 
                                className={styles.prayerRow}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className={styles.rowHeader}>
                                    <span className={styles.prayerTitle}>{latestPrayer.title}</span>
                                    <span className={styles.date}>
                                        {new Date(latestPrayer.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={styles.requestText}>
                                    `"{latestPrayer.request.substring(0, 120)}..."`
                                </p>
                                <div className={styles.rowActions}>
                                    <button className={styles.amenAction}>
                                        <Heart size={16} /> <span>Stand with them</span>
                                    </button>
                                    <div className={styles.intercessionTag}>
                                        <Sparkles size={14} /> Active Intercession
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className={styles.noPrayerState}>No recent prayer requests.</div>
                        )
                    }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrayerHighlight;
