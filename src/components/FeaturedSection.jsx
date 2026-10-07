import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOptimizedImageUrl } from '../image-optimization';
import styles from '../styles/FeaturedSection.module.css';

const getYoutubeId = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            return urlObj.searchParams.get('v');
        }
    } catch (e) {
        console.error('Invalid URL:', e);
        return null;
    }
    return null;
};

const FeaturedSection = ({ currentPointId }) => {
    const [featured, setFeatured] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data, error } = await supabase
                .from('church_importance')
                .select('id, title, message, image_url, video_url')
                .neq('id', currentPointId) // Don't fetch the current article
                .limit(4); // Fetch 4 other articles

            if (error) {
                console.error('Error fetching featured content:', error);
            } else {
                setFeatured(data);
            }
        };

        fetchFeatured();
    }, [currentPointId]);

    return (
        <div className={styles.featuredSection}>
            <h3 className={styles.sectionTitle}>Continue Reading</h3>
            <div className={styles.featuredGrid}>
                {featured.map(item => {
                    const videoId = getYoutubeId(item.video_url);
                    const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
                    const imageToDisplay = videoThumbnail || (item.image_url ? getOptimizedImageUrl(item.image_url, { width: 400, quality: 80 }) : null);

                    return (
                        <div
                            key={item.id}
                            className={styles.featuredCard}
                            onClick={() => navigate(`/church-importance/${item.id}`)}
                        >
                            {imageToDisplay && <img src={imageToDisplay} alt={item.title} className={styles.cardImage} />}
                            <div className={styles.cardContent}>
                                <span className={styles.cardTag}>More on this Topic</span>
                                <h4 className={styles.cardTitle}>{item.title}</h4>
                                <p className={styles.cardDescription}>
                                    {item.message.substring(0, 100)}...
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FeaturedSection;
