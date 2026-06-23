import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/EventsDisplay.module.css';

const Events = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        const mappedEvents = eventsData.map(event => ({
          id: `event-${event.id}`,
          type: 'event',
          title: event.title,
          date: event.date,
          description: event.description,
          location: event.location,
        }));

        setItems(mappedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItems = (items) => {
    if (items.length === 0) {
      return <p className={styles.noEvents}>No events found.</p>;
    }

    return (
      <div className={styles.eventsGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.eventCard}>
            <h2 className={styles.eventTitle}>{item.title}</h2>
            <div className={styles.eventMeta}>
              <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
              <span><strong>Location:</strong> {item.location}</span>
            </div>
            <p className={styles.eventDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}
      {!loading && !error && renderItems(items)}
    </div>
  );
};

export default Events;
