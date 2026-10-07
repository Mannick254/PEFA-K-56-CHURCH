import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/SermonHoverCard.module.css';
import { PlayCircle, Loader, AlertTriangle } from 'lucide-react';

const SermonHoverCard = () => {
    const [latestSermon, setLatestSermon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestSermon = async () => {
            try {
                const { data, error } = await supabase
                    .from('sermons')
                    .select('id, title, preacher, video_url, image_url, date')
                    .order('date', { ascending: false })
                    .limit(3);

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    setLatestSermon(data[0]);
                }
            } catch (err) {
                setError('Failed to load the latest sermon.');
                console.error('Error fetching latest sermon:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestSermon();
    }, []);

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return (
            <div className={`${styles.wrapper} ${styles.stateCard}`}>
                <Loader size={18} className={styles.spinner} />
                <span>Loading Bulletin...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.wrapper} ${styles.errorCard}`}>
                <AlertTriangle size={20} className={styles.errorIcon} />
                <div>
                    <p className={styles.errorTitle}>Network Error</p>
                    <p className={styles.errorMessage}>{error}</p>
                </div>
            </div>
        );
    }

    if (!latestSermon) {
        return null; // Or a fallback component if you prefer
    }

    const videoId = getYoutubeId(latestSermon.video_url);
    const imageToDisplay = latestSermon.image_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/placeholder-sermon.jpg');

    return (
        <div className={styles.sideCard}>
            {imageToDisplay && (
                <div className={styles.sideMediaWrapper}>
                    <img src={imageToDisplay} alt={latestSermon.title} className={styles.sideThumbnail} />
                    {videoId && (
                        <div className={styles.sidePlayOverlay}>
                            <PlayCircle size={24} />
                        </div>
                    )}
                </div>
            )}
            <div className={styles.sideContent}>
                <span className={styles.sidePreacher}>{latestSermon.preacher}</span>
                <Link to={`/sermons/${latestSermon.id}`} className={styles.sideHeadlineLink}>
                    <h4 className={styles.sideHeadline}>{latestSermon.title}</h4>
                </Link>
                <span className={styles.sideDate}>
                    {new Date(latestSermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
};

export default SermonHoverCard;