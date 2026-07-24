import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/EventsDisplay.module.css';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Clock, ChevronRight } from 'lucide-react';

const Events = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      setItems(eventsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logic to filter and sort events
  const filteredEvents = useMemo(() => {
    const now = new Date();
    
    return items
      .filter(event => {
        const eventDate = new Date(event.date);
        const matchesTab = activeTab === 'upcoming' ? eventDate >= now : eventDate < now;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        // Sort upcoming soonest first, sort past most recent first
        return activeTab === 'upcoming' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      });
  }, [items, activeTab, searchQuery]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <Seo title="Events" description="Stay up to date with the latest events at PEFA Kawangware 56." />
      
      <header className={styles.header}>
        <h1 className={styles.title}>Church Events</h1>
        <p className={styles.subtitle}>Join us in fellowship and community growth.</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>

        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeletonCard} />)}
        </div>
      ) : error ? (
        <div className={styles.errorCard}>
          <p>Oops! {error}</p>
          <button onClick={fetchData} className={styles.retryBtn}>Try Again</button>
        </div>
      ) : (
        <>
          {filteredEvents.length > 0 ? (
            <div className={styles.eventsGrid}>
              {filteredEvents.map((item) => (
                <Link to={`/event/${item.id}`} key={item.id} className={styles.eventCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.dateBadge}>
                       <span className={styles.dateDay}>{new Date(item.date).getDate()}</span>
                       <span className={styles.dateMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    
                    <h2 className={styles.eventTitle}>{item.title}</h2>
                    
                    <div className={styles.eventMeta}>
                      <div className={styles.metaItem}>
                        <Clock size={16} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <p className={styles.eventDescription}>{item.description}</p>
                    
                    <div className={styles.detailsBtn}>
                      View Details <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Calendar size={48} />
              <p>No {activeTab} events found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
