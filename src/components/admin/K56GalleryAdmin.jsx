import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, PlusCircle, Loader2, ExternalLink, Edit, X, Film, Image } from 'lucide-react';
import styles from '../../styles/K56GalleryAdmin.module.css';
import Upload from './upload';
import VideoUploader from './VideoUpload';

const K56GalleryAdmin = () => {
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('k56_gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching media:', error);
        } else {
            setMedia(data || []);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        const { error } = await supabase
            .from('k56_gallery')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting item:', error);
        } else {
            fetchMedia();
        }
    };

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Gallery Management</h1>
                    <p>Add and manage images and videos for the PEFA 56 Gallery</p>
                </div>
                <button onClick={() => { setCurrentItem(null); setIsModalOpen(true); }} className={styles.addBtn}>
                    <PlusCircle size={20} />
                    Add New Media
                </button>
            </header>

            <div className={styles.gridHeader}>
                <h3>Existing Media ({media.length})</h3>
                <button onClick={fetchMedia} className={styles.refreshBtn}>Refresh</button>
            </div>

            {isLoading ? (
                <div className={styles.loader}>
                    <Loader2 size={48} className={styles.spin} />
                </div>
            ) : (
                <motion.div layout className={styles.imageGrid}>
                    <AnimatePresence>
                        {media.map((item) => (
                            <motion.div 
                                key={item.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={styles.imageCard}
                            >
                                <div className={styles.imageWrapper}>
                                    {item.media_type === 'video' ? (
                                        <video 
                                            src={item.image_url} 
                                            controls 
                                            preload="metadata" 
                                            playsInline 
                                            muted 
                                            autoPlay 
                                            loop
                                            className={styles.mediaPreview} 
                                        />
                                    ) : (
                                        <img src={item.image_url} alt={item.caption} className={styles.mediaPreview} />
                                    )}
                                    <div className={styles.overlay}>
                                        <a href={item.image_url} target="_blank" rel="noreferrer" className={styles.iconBtn}>
                                            <ExternalLink size={18} />
                                        </a>
                                        <button onClick={() => { setCurrentItem(item); setIsModalOpen(true); }} className={`${styles.iconBtn} ${styles.editBtn}`}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.imageInfo}>
                                    <p>{item.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            
            <AnimatePresence>
                {isModalOpen && (
                    <GalleryFormModal
                        item={currentItem}
                        onClose={() => setIsModalOpen(false)}
                        onSave={fetchMedia}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const GalleryFormModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        image_url: '', caption: '', category: 'Events', media_type: 'image'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Events', 
        'Sunday Service',
        'Special Programs',
        'Outreach',
        'Kids & Youth',
        'Workshops', 
        'Community', 
        'Behind the Scenes',
        'Testimonies'
    ];

    useEffect(() => {
        if (item) {
            setFormData({
                image_url: item.image_url || '',
                caption: item.caption || '',
                category: item.category || 'Events',
                media_type: item.media_type || 'image',
                id: item.id
            });
        } else {
            setFormData({ image_url: '', caption: '', category: 'Events', media_type: 'image' });
        }
    }, [item]);

    const handleUploadSuccess = ({ url }) => {
        setFormData(prevFormData => ({ ...prevFormData, image_url: url }));
        setIsSubmitting(false);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { id, ...submitData } = formData;

        const { error } = item
            ? await supabase.from('k56_gallery').update(submitData).eq('id', id)
            : await supabase.from('k56_gallery').insert([submitData]);

        if (error) {
            console.error('Error saving item:', error);
            alert('Error saving item: ' + error.message)
        } else {
            onSave();
            onClose();
        }
        setIsSubmitting(false);
    };

    const handleMediaTypeChange = (type) => {
        if (item) return;
        setFormData({ ...formData, media_type: type, image_url: '' });
    }

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.modalPaper}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className={styles.modalHeader}>
                    <h2>{item ? 'Edit Media' : 'Add New Media'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modernForm}>
                    {!item && (
                        <div className={styles.inputGroup}>
                            <label>Media Type</label>
                            <div className={styles.mediaTypeSelector}>
                                <button type="button" onClick={() => handleMediaTypeChange('image')} className={formData.media_type === 'image' ? styles.active : ''}><Image size={16}/> Image</button>
                                <button type="button" onClick={() => handleMediaTypeChange('video')} className={formData.media_type === 'video' ? styles.active : ''}><Film size={16}/> Video</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>{formData.media_type === 'image' ? 'Image' : 'Video'}</label>
                        {formData.image_url ? null : formData.media_type === 'image' ? (
                            <Upload onUploadSuccess={handleUploadSuccess} />
                        ) : (
                            <VideoUploader 
                                onUploadSuccess={handleUploadSuccess} 
                                onUploadStart={() => setIsSubmitting(true)}
                                onUploadError={(err) => { alert('Upload failed: ' + err); setIsSubmitting(false); }}
                            />
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Media URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            placeholder="Auto-filled on upload, or paste a URL"
                        />
                         {formData.image_url && (
                            <div style={{ marginTop: '1rem' }}>
                                {formData.media_type === 'video' ? (
                                    <video 
                                        key={formData.image_url}
                                        src={formData.image_url} 
                                        controls 
                                        preload="metadata"
                                        playsInline 
                                        autoPlay
                                        muted
                                        className={styles.mediaPreview} 
                                    />
                                ) : (
                                    <img src={formData.image_url} alt="Preview" className={styles.mediaPreview} />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, image_url: ''})}
                                    className={styles.secondaryBtn}
                                    style={{ marginTop: '0.5rem', width: 'auto', display: 'inline-flex', alignItems: 'center' }}
                                >
                                    <X size={14} style={{ marginRight: '0.5rem' }}/> Clear Media
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Caption</label>
                        <input
                            type="text"
                            value={formData.caption}
                            onChange={(e) => setFormData({...formData, caption: e.target.value})}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" onClick={onClose} className={styles.secondaryBtn}>Cancel</button>
                        <button type="submit" className={styles.primaryBtn} disabled={isSubmitting || !formData.image_url}>
                            {isSubmitting ? <Loader2 className={styles.spin} /> : (item ? 'Save Changes' : 'Add to Gallery')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default K56GalleryAdmin;
