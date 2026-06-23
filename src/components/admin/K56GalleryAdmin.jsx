import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, PlusCircle, Loader2, ExternalLink, Edit } from 'lucide-react';
import styles from '../../styles/K56GalleryAdmin.module.css';
import Upload from './upload';

const K56GalleryAdmin = () => {
    const [images, setImages] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [editingImage, setEditingImage] = useState(null);

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
            showStatus('error', 'Failed to load gallery');
        } else {
            setImages(data);
        }
        setIsLoading(false);
    };

    const showStatus = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!imageUrl) return;

        setIsSubmitting(true);
        const { error } = await supabase
            .from('k56_gallery')
            .insert([{ 
                image_url: imageUrl,
                caption: caption || 'Gallery Image' 
            }]);

        if (error) {
            showStatus('error', 'Error adding image: ' + error.message);
        } else {
            showStatus('success', 'Image added successfully!');
            setImageUrl('');
            setCaption('');
            fetchImages();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const { error } = await supabase
            .from('k56_gallery')
            .delete()
            .eq('id', id);

        if (error) {
            showStatus('error', 'Could not delete image');
        } else {
            showStatus('success', 'Image removed from gallery');
            setImages(images.filter(img => img.id !== id));
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingImage) return;

        const { id, image_url, caption } = editingImage;
        
        const { error } = await supabase
            .from('k56_gallery')
            .update({ image_url, caption })
            .eq('id', id);

        if (error) {
            showStatus('error', 'Error updating image: ' + error.message);
        } else {
            showStatus('success', 'Image updated successfully!');
            setImages(images.map(img => img.id === id ? editingImage : img));
            setEditingImage(null);
        }
    };


    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Gallery Management</h1>
                    <p>Add and manage external image URLs for the PEFA 56 Gallery</p>
                </div>
                {status.message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.status} ${styles[status.type]}`}
                    >
                        {status.message}
                    </motion.div>
                )}
            </header>

            <section className={styles.uploadSection}>
                <form onSubmit={handleAddImage} className={styles.formCard}>
                    <div className={styles.inputGroup}>
                        <label>Image</label>
                        <Upload 
                            onUpload={setImageUrl}
                            onUrlChange={setImageUrl}
                            initialUrl={imageUrl}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Caption (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., Sunday Service - July 2024"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Or paste Image URL</label>
                        <input 
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className={styles.urlInput}
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                        {isSubmitting ? <Loader2 className={styles.spin} /> : <PlusCircle size={20} />}
                        Add to Gallery
                    </button>
                </form>
            </section>

            <div className={styles.gridHeader}>
                <h3>Existing Images ({images.length})</h3>
                <button onClick={fetchImages} className={styles.refreshBtn}>Refresh</button>
            </div>

            {isLoading ? (
                <div className={styles.loader}>
                    <Loader2 size={48} className={styles.spin} />
                </div>
            ) : (
                <motion.div layout className={styles.imageGrid}>
                    <AnimatePresence>
                        {images.map((image) => (
                            <motion.div 
                                key={image.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={styles.imageCard}
                            >
                                <div className={styles.imageWrapper}>
                                    <img src={image.image_url} alt={image.caption} />
                                    <div className={styles.overlay}>
                                        <a href={image.image_url} target="_blank" rel="noreferrer" className={styles.iconBtn}>
                                            <ExternalLink size={18} />
                                        </a>
                                        <button onClick={() => setEditingImage(image)} className={`${styles.iconBtn} ${styles.editBtn}`}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(image.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.imageInfo}>
                                    <p>{image.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            
            <AnimatePresence>
                {editingImage && (
                    <motion.div className={styles.modalBackdrop} onClick={() => setEditingImage(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className={styles.modalContent} onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                            <h2>Edit Image</h2>
                            <form onSubmit={handleUpdate}>
                                <div className={styles.inputGroup}>
                                    <label>Image</label>
                                    <Upload 
                                        onUpload={(url) => setEditingImage({ ...editingImage, image_url: url })}
                                        onUrlChange={(url) => setEditingImage({ ...editingImage, image_url: url })}
                                        initialUrl={editingImage.image_url}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Or paste Image URL</label>
                                    <input 
                                        type="text"
                                        placeholder="https://example.com/image.png"
                                        value={editingImage.image_url}
                                        onChange={(e) => setEditingImage({ ...editingImage, image_url: e.target.value })}
                                        className={styles.urlInput}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Caption</label>
                                    <input type="text" value={editingImage.caption} onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })} />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" onClick={() => setEditingImage(null)} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default K56GalleryAdmin;
