import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ChurchPurpose.module.css';

const ChurchPurpose = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { data, error } = await supabase.from('church_purpose').select('*');
        if (error) {
          throw error;
        }
        setPoints(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <section className={styles.purposeSection}>
      <h2 className={styles.sectionTitle}></h2>
      <div className={styles.grid}>
        {points.map((point) => (
          <div key={point.id} className={styles.card}>
            <img src={point.imageUrl} alt={point.title} className={styles.image} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{point.title}</h3>
              <p className={styles.cardMessage}>{point.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChurchPurpose;
