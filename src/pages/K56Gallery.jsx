import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Share2, Calendar } from 'lucide-react';
import styles from '../styles/K56Gallery.module.css';

const K56GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('k56_gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error);
        } else {
            setImages(data);
        }
        setIsLoading(false);
    };

    const handleShare = (url) => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    return (
        <section className={styles.gallerySection}>
            <div className={styles.container}>
                <header className={styles.galleryHeader}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={styles.subtitle}
                    >
                        Our Community in Motion
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.title}
                    >
                        K56 Media Gallery
                    </motion.h2>
                    <div className={styles.divider}></div>
                </header>

                {isLoading ? (
                    <div className={styles.skeletonGrid}>
                        {[...Array(12).keys()].map(i => <div key={i} className={styles.skeletonCard} />)}
                    </div>
                ) : (
                    <motion.div 
                        className={styles.imageGrid}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {images.map((image) => (
                            <motion.div 
                                key={image.id} 
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    show: { opacity: 1, scale: 1 }
                                }}
                                className={styles.imageCard}
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className={styles.imageWrapper}>
                                    <img 
                                        src={image.image_url} 
                                        alt={image.caption} 
                                        loading="lazy"
                                    />
                                    <div className={styles.overlay}>
                                        <div className={styles.overlayIcons}>
                                            <Maximize2 size={24} color="white" />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.captionArea}>
                                    <p>{image.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence>
                    {selectedImage && (
                        <motion.div 
                            className={styles.lightbox}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className={styles.lightboxBackdrop} onClick={() => setSelectedImage(null)} />
                            
                            <motion.div 
                                className={styles.lightboxContent}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
                                    <X size={32} />
                                </button>

                                <img src={selectedImage.image_url} alt={selectedImage.caption} />
                                
                                <div className={styles.lightboxFooter}>
                                    <div className={styles.footerText}>
                                        <h3>{selectedImage.caption}</h3>
                                        <span><Calendar size={14} /> {new Date(selectedImage.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button onClick={() => handleShare(selectedImage.image_url)} className={styles.shareBtn}>
                                        <Share2 size={20} /> Share
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default K56GalleryPage;
