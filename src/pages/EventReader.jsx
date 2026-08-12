import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react';
import styles from '../styles/EventReader.module.css';

const EventReader = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        setError('Failed to fetch event details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops!</h2>
        <p>{error || 'Event not found.'}</p>
        <Link to="/events" className={styles.backBtn}>Return to Events</Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const postedDate = event.created_at ? new Date(event.created_at) : null;

  let timeToDisplay = 'Time not available';
  if(event.time) {
      // Assumes time is in 'HH:mm:ss' format
      const d = new Date(`1970-01-01T${event.time}`);
      timeToDisplay = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } else if (event.date.includes('T')) {
      timeToDisplay = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return (
    <div className={styles.pageWrapper}>
      <Seo 
        title={event.title} 
        description={event.description}
        url={`/event/${event.id}`}
        type="event"
        imageData={event.image_url}
        location={event.location}
        startDate={event.date}
      />
      
      <div className={styles.topNav}>
        <Breadcrumb paths={[{ name: 'Events', path: '/events' }, { name: event.title }]} />
      </div>

      <main className={styles.container}>
        {/* Hero Section */}
        <header className={styles.hero}>
          {event.image_url && (
            <div className={styles.imageWrapper}>
              <img src={event.image_url} alt={event.title} className={styles.heroImage} />
            </div>
          )}
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{event.title}</h1>
            <div className={styles.quickMeta}>
              <div className={styles.metaItem}>
                <Calendar size={20} />
                <span>{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className={styles.metaItem}>
                <MapPin size={20} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Main Content */}
          <article className={styles.mainContent}>
            <section className={styles.descriptionSection}>
              <h3>About this event</h3>
              <p className={styles.description}>{event.description}</p>
            </section>
          </article>

          {/* Sidebar Actions */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.detailsBox}>
                <div className={styles.detailRow}>
                  <Clock size={18} />
                  <div>
                    <strong>Time</strong>
                    <p>{timeToDisplay}</p>
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <MapPin size={18} />
                  <div>
                    <strong>Venue</strong>
                    <p>{event.location}</p>
                  </div>
                </div>
                {postedDate && (
                  <div className={styles.detailRow}>
                    <Calendar size={18} />
                    <div>
                      <strong>Posted On</strong>
                      <p>{postedDate.toLocaleDateString([], { month: 'long', day: 'numeric' })} at {postedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.primaryBtn}>Register Now</button>
                <button className={styles.secondaryBtn}>
                  <Share2 size={18} /> Share Event
                </button>
              </div>

              <Link to="/events" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to all events
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EventReader;
