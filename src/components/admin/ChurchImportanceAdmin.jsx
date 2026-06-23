import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
    Save, Plus, Trash2, Edit3, Image as ImageIcon, 
    Type, AlignLeft, X, RefreshCw, CheckCircle2 
} from 'lucide-react';
import styles from '../../styles/CIAdmin.module.css';
import Upload from './upload';

const ChurchImportanceAdmin = () => {
    const [points, setPoints] = useState([]);
    const [formState, setFormState] = useState({ image_url: '', title: '', message: '' });
    const [editingPoint, setEditingPoint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchPoints();
    }, []);

    const showNotification = (text, type = 'success') => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchPoints = async () => {
        setIsLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('church_importance')
                .select('*')
                .order('created_at', { ascending: true });
            if (fetchError) throw fetchError;
            setPoints(data || []);
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (point) => {
        setEditingPoint(point);
        setFormState({ 
            image_url: point.image_url || '', 
            title: point.title, 
            message: point.message 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingPoint(null);
        setFormState({ image_url: '', title: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const action = editingPoint
                ? supabase.from('church_importance').update(formState).eq('id', editingPoint.id)
                : supabase.from('church_importance').insert([formState]);

            const { error: submitError } = await action;
            if (submitError) throw submitError;

            showNotification(`Point ${editingPoint ? 'updated' : 'created'} successfully!`);
            resetForm();
            fetchPoints();
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this importance point permanently?')) {
            try {
                const { error: deleteError } = await supabase.from('church_importance').delete().eq('id', id);
                if (deleteError) throw deleteError;
                showNotification('Point deleted successfully!');
                fetchPoints();
            } catch (err) {
                showNotification(err.message, 'error');
            }
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Notification Toast */}
            {notification && (
                <div className={`${styles.notification} ${styles[`toast-${notification.type}`]}`}>
                    {notification.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
                    {notification.text}
                </div>
            )}

            <div className={styles.adminHeaderSection}>
                <div>
                    <h2 className={styles.adminPageTitle}>Church Foundations</h2>
                    <p className={styles.adminPageSubtitle}>Manage the "Importance of the Church" cards and their theological messages.</p>
                </div>
                <button onClick={fetchPoints} className={styles.refreshBtn} title="Refresh Data">
                    <RefreshCw size={20} className={isLoading ? styles.spin : ''} />
                </button>
            </div>

            <div className={styles.adminGridMain}>
                {/* Editor Section */}
                <div className={`${styles.adminCard} ${styles.editorCard}`}>
                    <div className={styles.adminCardHeader}>
                        <div className={styles.headerIcon}>
                            {editingPoint ? <Edit3 size={20} /> : <Plus size={20} />}
                        </div>
                        <h3>{editingPoint ? 'Edit Point' : 'Create New Foundation'}</h3>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.modernForm}>
                        <div className={styles.formField}>
                            <label><Type size={16} /> Title</label>
                            <input 
                                name="title" 
                                type="text" 
                                placeholder="e.g., The Body of Christ" 
                                value={formState.title} 
                                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))} 
                                required 
                            />
                        </div>

                        <div className={styles.formField}>
                            <label><ImageIcon size={16} /> Image</label>
                            <Upload 
                                onUpload={(url) => setFormState(prev => ({ ...prev, image_url: url }))}
                                onUrlChange={(url) => setFormState(prev => ({ ...prev, image_url: url }))}
                                initialUrl={formState.image_url} 
                            />
                        </div>

                        <div className={styles.formField}>
                            <label><AlignLeft size={16} /> Message (Supports Multiple Paragraphs)</label>
                            <textarea 
                                name="message" 
                                placeholder="Enter the main message. Use Enter to create new paragraphs." 
                                value={formState.message} 
                                onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))} 
                                required 
                                rows={8}
                            ></textarea>
                            <small className={styles.fieldHint}>New lines in this box will appear as paragraphs in the app.</small>
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                                {isSaving ? 'Processing...' : (
                                    <><Save size={18} /> {editingPoint ? 'Update Changes' : 'Publish Point'}</>
                                )}
                            </button>
                            {editingPoint && (
                                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                                    <X size={18} /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className={styles.listSection}>
                    <h3 className={styles.sectionLabel}>Current Points ({points.length})</h3>
                    {isLoading && points.length === 0 ? (
                        <div className={styles.skeletonList}></div>
                    ) : (
                        <div className={styles.pointsStack}>
                            {points.map((point) => (
                                <div key={point.id} className={styles.pointItemCard}>
                                    <div className={styles.pointPreviewImage}>
                                        <img src={point.image_url} alt={`Visual for ${point.title}`} />
                                        <div className={styles.pointBadge}>#{point.id.toString().slice(0, 3)}</div>
                                    </div>
                                    <div className={styles.pointItemContent}>
                                        <h4>{point.title}</h4>
                                        <div className={styles.truncatedText}>{point.message}</div>
                                        <div className={styles.pointItemActions}>
                                            <button onClick={() => handleEdit(point)} className={styles.editAction}>
                                                <Edit3 size={16} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(point.id)} className={styles.deleteAction}>
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChurchImportanceAdmin;