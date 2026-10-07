import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock, Radio, ChevronRight, Sparkles } from 'lucide-react';
import styles from '../styles/UpcomingEvents.module.css';

// Reusable CNN-Style Event Card Sub-Component
const EventCard = ({ event, formatDate, formatTime }) => {
  const { day, month, fullDate, isoString } = formatDate(event.date);
  const time = formatTime(event.date);

  return (
    <Link to={`/event/${event.id}`} className={styles.cnnEventCard}>
      {/* Image Container with Live Overlay */}
      <div className={styles.cnnImageWrapper}>
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          alt={event.title} 
          className={styles.cnnImage}
        />
        <div className={styles.cnnDateBadge}>
          <span className={styles.cnnDateDay}>{day}</span>
          <span className={styles.cnnDateMonth}>{month}</span>
        </div>
        <div className={styles.cnnCategoryTag}>
          <span>SPECIAL COVERAGE</span>
        </div>
      </div>
      
      {/* Editorial Content */}
      <div className={styles.cnnContent}>
        <div className={styles.cnnEventHeader}>
          <h3 className={styles.cnnEventTitle}>{event.title}</h3>
        </div>

        <div className={styles.cnnMetaGroup}>
          <div className={styles.cnnMetaItem}>
            <Calendar size={13} className={styles.cnnIconRed} />
            <time dateTime={isoString}>{fullDate}</time>
          </div>

          {time && (
            <div className={styles.cnnMetaItem}>
              <Clock size={13} className={styles.cnnIconRed} />
              <span>{time}</span>
            </div>
          )}

          {event.location && (
            <div className={styles.cnnMetaItem}>
              <MapPin size={13} className={styles.cnnIconRed} />
              <span className={styles.truncate}>{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / Call to Action */}
      <div className={styles.cnnCardFooter}>
        <span className={styles.cnnReadMore}>Full Dispatch</span>
        <div className={styles.cnnArrowCircle}>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

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
          .gte('date', now)
          .order('date', { ascending: true })
          .limit(3);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Carousel timer for mobile bulletin
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
      return { day: '--', month: '---', fullDate: 'Date Pending', isoString: '' };
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { day: '--', month: '---', fullDate: 'Invalid Date', isoString: '' };
    }
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      isoString: date.toISOString()
    };
  };

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    // Check if time is explicitly set
    if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
      return null;
    }
    
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const mobileCardVariants = {
    enter: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };

  if (loading) {
    return (
      <section className={styles.cnnEventsSection}>
        <div className={styles.cnnContainer}>
          <div className={styles.cnnSkeletonHeader} />
          <div className={styles.cnnGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.cnnSkeletonCard} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className={styles.cnnEventsSection}>
      <div className={styles.cnnContainer}>
        
        {/* CNN Eyebrow Header */}
        <header className={styles.cnnHeader}>
          <div className={styles.cnnHeaderLeft}>
            <div className={styles.cnnLiveBadge}>
              <Radio size={12} className={styles.livePulseIcon} />
              <span> UPCOMING DISPATCHES</span>
            </div>
            <h2 className={styles.cnnMainTitle}>
              Community <span className={styles.cnnHighlight}>Gatherings</span>
            </h2>
            <p className={styles.cnnSubtitle}>
              Stay informed on upcoming convocations, services, and ministry initiatives across PEFA Kawangware 56.
            </p>
          </div>

          <Link to="/events" className={styles.cnnDesktopViewAll}>
            <span>Full Event Directory</span>
            <ChevronRight size={16} />
          </Link>
        </header>

        {/* Desktop Newsroom Grid */}
        <div className={styles.cnnGrid}>
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              formatDate={formatDate} 
              formatTime={formatTime} 
            />
          ))}
        </div>

        {/* Mobile Breaking Bulletin Carousel */}
        <div className={styles.cnnMobileCarousel}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              variants={mobileCardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {events[currentIndex] && (
                <EventCard 
                  event={events[currentIndex]} 
                  formatDate={formatDate} 
                  formatTime={formatTime} 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Carousel Pagination Indicators */}
          <div className={styles.cnnCarouselDots}>
            {events.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.cnnDot} ${idx === currentIndex ? styles.cnnDotActive : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to event slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className={styles.cnnMobileViewAll}>
          <Link to="/events" className={styles.cnnMobileBtn}>
            <span>Access Full Event Directory</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default UpcomingEvents;