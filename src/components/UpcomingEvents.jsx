import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import styles from '../styles/UpcomingEvents.module.css';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setLoading(true);
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', now) // Only fetch future events
          .order('date', { ascending: true })
          .limit(3);

        if (error) throw error;
        setEvents(data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);
  
    useEffect(() => {
    if (events.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, events]);


  const formatDate = (dateString) => {
    if (!dateString) {
        return { day: 'N/A', month: 'N/A', fullDate: 'Date not specified' };
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return { day: 'N/A', month: 'N/A', fullDate: 'Invalid date' };
    }
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        fullDate: date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };
  };

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    // Check if the time is explicitly set (not midnight)
    if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
        return null; // Don't show time if it's exactly midnight UTC
    }
    
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  const mobileCardVariants = {
    enter: {
      x: '100%',
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: '-100%',
      opacity: 0
    }
  };


  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.skeletonHeader} />
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.badge}>Don't Miss Out</span>
          <h2 className={styles.title}>Upcoming Events</h2>
          <p className={styles.subtitle}>Join our community for these special gatherings and services.</p>
        </div>
        <Link to="/events" className={styles.desktopViewAll}>
          View All Events <ArrowRight size={18} />
        </Link>
      </header>

      <div className={styles.grid}>
        {events.map((event) => {
          const { day, month, fullDate } = formatDate(event.date);
          const time = formatTime(event.date);
          return (
            <Link to={`/event/${event.id}`} key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                  alt={event.title} 
                  className={styles.image}
                />
                <div className={styles.dateOverlay}>
                  <span className={styles.dateDay}>{day}</span>
                  <span className={styles.dateMonth}>{month}</span>
                </div>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <Calendar size={14} className={styles.icon} />
                    <span>{fullDate}</span>
                  </div>
                  {time && (
                    <div className={styles.metaItem}>
                      <Clock size={14} className={styles.icon} />
                      <span>{time}</span>
                    </div>
                  )}
                  <div className={styles.metaItem}>
                    <MapPin size={14} className={styles.icon} />
                    <span className={styles.truncate}>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.learnMore}>Event Details</span>
                <div className={styles.arrowCircle}>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className={styles.mobileCarousel}>
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            variants={mobileCardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {events[currentIndex] &&
              (() => {
                const event = events[currentIndex];
                const { day, month, fullDate } = formatDate(event.date);
                const time = formatTime(event.date);
                return (
                  <Link to={`/event/${event.id}`} key={event.id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img 
                        src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                        alt={event.title} 
                        className={styles.image}
                      />
                      <div className={styles.dateOverlay}>
                        <span className={styles.dateDay}>{day}</span>
                        <span className={styles.dateMonth}>{month}</span>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <div className={styles.meta}>
                        <div className={styles.metaItem}>
                          <Calendar size={14} className={styles.icon} />
                          <span>{fullDate}</span>
                        </div>
                        {time && (
                          <div className={styles.metaItem}>
                            <Clock size={14} className={styles.icon} />
                            <span>{time}</span>
                          </div>
                        )}
                        <div className={styles.metaItem}>
                          <MapPin size={14} className={styles.icon} />
                          <span className={styles.truncate}>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.learnMore}>Event Details</span>
                      <div className={styles.arrowCircle}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })()}
          </motion.div>
        </AnimatePresence>
      </div>


      <div className={styles.mobileViewAll}>
        <Link to="/events" className={styles.viewAllButton}>
          View All Events
        </Link>
      </div>
    </section>
  );
};

export default UpcomingEvents;
