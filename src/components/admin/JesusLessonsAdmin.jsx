import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit2, Trash2, Save, BookOpen } from 'lucide-react';
import styles from '../../styles/JesusLessonsAdmin.module.css';
import Upload from './upload';

const JesusLessonsAdmin = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    lesson_title: '',
    message: '',
    scripture_reference: '',
    image_url: ''
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jesus_lessons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      showStatus('error', error.message);
    } else {
      setLessons(data);
    }
    setLoading(false);
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('jesus_lessons')
          .update(formData)
          .eq('id', editingLesson.id);
        if (error) throw error;
        showStatus('success', 'Lesson updated successfully!');
      } else {
        const { error } = await supabase.from('jesus_lessons').insert([formData]);
        if (error) throw error;
        showStatus('success', 'Lesson created successfully!');
      }
      resetForm();
      fetchLessons();
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      lesson_title: lesson.lesson_title,
      message: lesson.message,
      scripture_reference: lesson.scripture_reference || '',
      image_url: lesson.image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lesson permanently?')) return;

    try {
      const { error } = await supabase.from('jesus_lessons').delete().eq('id', id);
      if (error) throw error;
      showStatus('success', 'Lesson deleted.');
      fetchLessons();
    } catch (error) {
      showStatus('error', error.message);
    }
  };

  const resetForm = () => {
    setFormData({ lesson_title: '', message: '', scripture_reference: '', image_url: '' });
    setEditingLesson(null);
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div>
          <h1>Jesus Lessons Manager</h1>
          <p>Create and manage spiritual teachings for the community</p>
        </div>
        <BookOpen className={styles.headerIcon} size={40} />
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Lesson Title</label>
              <input
                type="text"
                value={formData.lesson_title}
                onChange={(e) => setFormData({...formData, lesson_title: e.target.value})}
                placeholder="e.g., The Beatitudes"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Scripture Reference</label>
              <input
                type="text"
                value={formData.scripture_reference}
                onChange={(e) => setFormData({...formData, scripture_reference: e.target.value})}
                placeholder="e.g., Matthew 5:1-12"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Message Content</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Write the lesson content here..."
                required
                rows="5"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Lesson Image</label>
              <Upload 
                onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onUrlChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                initialUrl={formData.image_url} 
              />
                <div className={styles.inputGroup}>
                    <label>Or paste Image URL</label>
                    <input 
                        type="text"
                        placeholder="https://example.com/image.png"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        className={styles.urlInput}
                    />
                </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {editingLesson ? <><Save size={18} /> Update</> : <><Plus size={18} /> Create</>}
            </button>
            {editingLesson && (
              <button type="button" onClick={resetForm} className={styles.secondaryBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Existing Lessons ({lessons.length})</h2>
          <button onClick={fetchLessons} className={styles.refreshBtn}>Refresh List</button>
        </div>

        {loading && <div className={styles.loader}>Loading lessons...</div>}

        <div className={styles.lessonGrid}>
          {lessons.map((lesson) => (
            <div key={lesson.id} className={styles.lessonCard}>
              {lesson.image_url && (
                <div className={styles.cardImage}>
                  <img src={lesson.image_url} alt={lesson.lesson_title} />
                </div>
              )}
              <div className={styles.cardContent}>
                <span className={styles.cardDate}>
                  {new Date(lesson.created_at).toLocaleDateString()}
                </span>
                <h3>{lesson.lesson_title}</h3>
                {lesson.scripture_reference && (
                  <span className={styles.scriptureBadge}>{lesson.scripture_reference}</span>
                )}
                <p>{lesson.message.substring(0, 120)}...</p>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(lesson)} className={styles.editBtn}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(lesson.id)} className={styles.deleteBtn}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JesusLessonsAdmin;
