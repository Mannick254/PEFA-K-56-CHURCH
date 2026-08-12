import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit2, Trash2, BookOpen, Loader2 } from 'lucide-react';
import styles from '../../styles/JesusLessonsAdmin.module.css';
import { useDrawer } from '../../context/DrawerContext';
import LessonForm from './LessonForm';

const JesusLessonsAdmin = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { openDrawer, closeDrawer } = useDrawer();

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

  const handleSave = () => {
    fetchLessons();
    closeDrawer();
    showStatus('success', 'Lesson saved successfully!');
  };

  const openLessonForm = (lesson = null) => {
    openDrawer(
      lesson ? 'Edit Lesson' : 'New Lesson',
      <LessonForm lesson={lesson} onSave={handleSave} onCancel={closeDrawer} />
    );
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

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div>
          <h1>Jesus' Lessons</h1>
        </div>
        <button onClick={() => openLessonForm()} className={styles.primaryBtn}>
            <Plus size={18} />
            Add New Lesson
        </button>
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}
      
      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Existing Lessons ({lessons.length})</h2>
          <button onClick={fetchLessons} className={styles.refreshBtn}>Refresh List</button>
        </div>

        {loading && !lessons.length ? (
            <div className={styles.loader}>
                <Loader2 size={32} className={styles.spin} />
                <span>Loading lessons...</span>
            </div>
        ) : (
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
                    <button onClick={() => openLessonForm(lesson)} className={styles.editBtn}>
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
        )}
      </section>
    </div>
  );
};

export default JesusLessonsAdmin;
