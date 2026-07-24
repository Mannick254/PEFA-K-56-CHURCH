import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/JesusLessons.module.css';
import Seo from '../components/Seo';

const JesusLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jesus_lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setLessons(data);
      }
      setLoading(false);
    };

    fetchLessons();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Seo
        title="Lessons from Jesus"
        description="Explore a collection of lessons and teachings from Jesus Christ."
      />
      <header className={styles.pageHeader}>
        <h1>Lessons from Jesus</h1>
        <p>Explore a collection of lessons and teachings from Jesus Christ.</p>
      </header>

      {loading && (
        <div className={styles.status}>
          <div className={styles.spinner}></div>
          <p>Loading lessons...</p>
        </div>
      )}

      {error && (
        <div className={styles.status}>
          <p className={styles.error}>Could not fetch lessons. {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.lessonsGrid}>
          {lessons.map((lesson) => (
            <Link to={`/lessons/${lesson.id}`} key={lesson.id} className={styles.lessonCard}>
              {lesson.image_url && (
                <div className={styles.cardImage}>
                  <img src={lesson.image_url} alt={lesson.lesson_title} />
                </div>
              )}
              <div className={styles.cardContent}>
                <h3>{lesson.lesson_title}</h3>
                <p>{lesson.message.substring(0, 100)}...</p>
                <span className={styles.readMore}>
                  Read Lesson &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JesusLessons;
