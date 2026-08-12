import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/JesusLessonsAdmin.module.css';
import Upload from './upload';
import { BookOpen, Type, MessageSquare, Image, Link2, Save } from 'lucide-react';

const LessonForm = ({ lesson, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        lesson_title: '',
        message: '',
        scripture_reference: '',
        image_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (lesson) {
            setFormData(lesson);
        } else {
            setFormData({ lesson_title: '', message: '', scripture_reference: '', image_url: '' });
        }
    }, [lesson]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data, error } = lesson
                ? await supabase.from('jesus_lessons').update(formData).eq('id', lesson.id).select().single()
                : await supabase.from('jesus_lessons').insert([formData]).select().single();
            
            if (error) throw error;
            onSave(data); // Pass the saved data back to the parent
        } catch (error) {
            console.error('Error saving lesson:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadSuccess = (uploadInfo) => {
        setFormData(prev => ({ ...prev, image_url: uploadInfo.url }));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.drawerForm}>
            <div className={styles.inputGroup}>
                <label><Type size={14}/> Title</label>
                <input
                    type="text"
                    name="lesson_title"
                    value={formData.lesson_title}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label><BookOpen size={14}/> Scripture</label>
                <input
                    type="text"
                    name="scripture_reference"
                    value={formData.scripture_reference}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label><MessageSquare size={14}/> Message</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="10"
                />
            </div>

            <div className={styles.inputGroup}>
                <label><Image size={14}/> Lesson Image</label>
                <Upload onUploadSuccess={handleUploadSuccess} />
            </div>

            <div className={styles.inputGroup}>
                <label><Link2 size={14}/> Image URL</label>
                <input 
                    type="text"
                    name="image_url"
                    placeholder="Or paste image URL here"
                    value={formData.image_url}
                    onChange={handleInputChange}
                />
                {formData.image_url && (
                    <div className={styles.imagePreview}>
                        <img src={formData.image_url} alt="Preview" />
                    </div>
                )}
            </div>

            <div className={styles.drawerFooter}>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    <Save size={18}/>
                    {isSubmitting ? 'Saving...' : (lesson ? 'Update Lesson' : 'Save Lesson')}
                </button>
                <button type="button" onClick={onCancel} className={styles.secondaryBtn}>Cancel</button>
            </div>
        </form>
    );
};

export default LessonForm;
