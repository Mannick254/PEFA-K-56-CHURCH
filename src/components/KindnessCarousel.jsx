import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, BookOpen, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/KindnessCarousel.module.css';
import ReactMarkdown from 'react-markdown';

const KindnessCarousel = () => {
    const [kindnessActs, setKindnessActs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchKindnessActs = async () => {
        const { data, error } = await supabase
            .from('kindness_acts')
            .select('imageurl, description');
        if (error) {
            console.error('Error fetching kindness acts:', error);
        } else {
            setKindnessActs(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchKindnessActs();
    }, []);

    const nextSlide = useCallback(() => {
        setIsExpanded(false);
        setCurrentIndex((prev) => (prev + 1) % kindnessActs.length);
    }, [kindnessActs.length]);

    const prevSlide = () => {
        setIsExpanded(false);
        setCurrentIndex((prev) => (prev - 1 + kindnessActs.length) % kindnessActs.length);
    };

    useEffect(() => {
        if (kindnessActs.length > 0 && !isPaused && !isExpanded) {
            const timer = setInterval(nextSlide, 6000);
            return () => clearInterval(timer);
        }
    }, [kindnessActs, isPaused, isExpanded, nextSlide]);

    if (loading) return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Spreading Kindness...</p>
        </div>
    );
    
    if (kindnessActs.length === 0) return null;

    const currentAct = kindnessActs[currentIndex];
    const description = currentAct.description || '';
    const isLongDescription = description.length > 180;
    const displayDescription = isExpanded ? description : `${description.substring(0, 180)}${isLongDescription ? '...' : ''}`;

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.badge}>
                    <Heart size={14} className={styles.heartIcon} />
                    <span>Our Impact</span>
                </div>
                <h2 className={styles.sectionTitle}>Faith in Action</h2>
                <div className={styles.titleUnderline}></div>
                <p className={styles.sectionSubtitle}>
                    Witness how our community is sharing God's love through daily acts of kindness.
                </p>
            </div>

            <div 
                className={styles.carouselContainer}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className={styles.slide}
                    >
                        <div className={styles.imageWrapper}>
                            <img 
                                src={currentAct.imageurl} 
                                alt="Kindness act" 
                                className={styles.image} 
                            />
                            <div className={styles.imageOverlay}></div>
                        </div>
                        
                        <motion.div 
                            layout
                            className={`${styles.glassOverlay} ${isExpanded ? styles.expandedOverlay : ''}`}
                        >
                            <motion.div layout="position" className={styles.messageContent}>
                                <div className={styles.markdownWrapper}>
                                    <ReactMarkdown>{displayDescription}</ReactMarkdown>
                                </div>
                                
                                {isLongDescription && (
                                    <button 
                                        onClick={() => setIsExpanded(!isExpanded)} 
                                        className={styles.readMoreBtn}
                                    >
                                        {isExpanded ? (
                                            <><ChevronUp size={16} /> Show Less</>
                                        ) : (
                                            <><BookOpen size={16} /> Read Full Story</>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className={styles.controls}>
                    <button className={styles.navBtn} onClick={prevSlide} aria-label="Previous slide">
                        <ChevronLeft size={24} />
                    </button>
                    <button className={styles.navBtn} onClick={nextSlide} aria-label="Next slide">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className={styles.pagination}>
                    {kindnessActs.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => {
                                setIsExpanded(false);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>

                {/* Timer Bar */}
                <div className={styles.timerTrack}>
                    {!isPaused && !isExpanded && (
                        <motion.div 
                            key={`timer-${currentIndex}`}
                            className={styles.timerBar}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default KindnessCarousel;