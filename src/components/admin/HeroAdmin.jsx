import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/HeroAdmin.module.css';
import Upload from './upload';

const HeroAdmin = () => {
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [heroId, setHeroId] = useState(null);

    const fetchHeroData = async () => {
        const { data, error } = await supabase
            .from('hero')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching hero data:', error);
            return;
        }

        if (data && data.length > 0) {
            const hero = data[0];
            setHeroTitle(hero.title);
            setHeroSubtitle(hero.subtitle);
            setHeroImage(hero.image_url || '');
            setIsPublished(hero.published);
            setHeroId(hero.id);
        }
    };

    useEffect(() => {
        fetchHeroData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const heroData = {
            title: heroTitle,
            subtitle: heroSubtitle,
            image_url: heroImage,
            published: isPublished
        };

        if (heroId) {
            const { error } = await supabase
                .from('hero')
                .update(heroData)
                .eq('id', heroId);

            if (error) {
                console.error('Error updating hero data:', error);
            } else {
                console.log('Updated:', heroData);
            }
        } else {
            const { data, error } = await supabase
                .from('hero')
                .insert([heroData])
                .select();
            
            if (error) {
                console.error('Error creating hero data:', error);
            } else if (data) {
                setHeroId(data[0].id);
                console.log('Hero content created');
            }
        }
    };

    const handleDelete = async () => {
        if (!heroId) return;

        const { error } = await supabase
            .from('hero')
            .delete()
            .eq('id', heroId);

        if (error) {
            console.error('Error deleting hero data:', error);
        } else {
            setHeroTitle('');
            setHeroSubtitle('');
            setHeroImage('');
            setIsPublished(false);
            setHeroId(null);
            console.log('Hero content deleted');
        }
    };

    const handlePublish = async () => {
        if (!heroId) return;

        const { error } = await supabase
            .from('hero')
            .update({ published: !isPublished })
            .eq('id', heroId);

        if (error) {
            console.error('Error updating publish status:', error);
        } else {
            setIsPublished(!isPublished);
            console.log('Publish status:', !isPublished);
        }
    };

    return (
        <div className={styles.heroAdmin}>
            <h3>Hero Section Management</h3>
            <form onSubmit={handleUpdate}>
                <div className={styles.formGroup}>
                    <label htmlFor="heroTitle">Hero Title</label>
                    <input
                        id="heroTitle"
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        placeholder="Enter Hero Title"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="heroSubtitle">Hero Subtitle</label>
                    <input
                        id="heroSubtitle"
                        type="text"
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        placeholder="Enter Hero Subtitle"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Hero Image</label>
                    {heroImage && <img src={heroImage} alt="Hero" className={styles.heroImagePreview} />}
                    <Upload
                        onUpload={(url) => setHeroImage(url)}
                        onUrlChange={(url) => setHeroImage(url)}
                        initialUrl={heroImage}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    {(!heroId || isPublished) && (
                        <button type="submit" className={styles.updateButton}>
                            {heroId ? 'Update' : 'Create'}
                        </button>
                    )}
                    {heroId && (
                        <button type="button" onClick={handlePublish} className={isPublished ? styles.unpublishButton : styles.publishButton}>
                            {isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                    )}
                    {isPublished && heroId && (
                        <button type="button" onClick={handleDelete} className={styles.deleteButton}>Delete</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default HeroAdmin;
