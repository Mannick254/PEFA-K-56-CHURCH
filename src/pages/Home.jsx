import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Heart, Users, Calendar, 
  Sparkles, BookOpen, Baby, GraduationCap, ChevronRight, ExternalLink 
} from 'lucide-react';

import styles from '../styles/Home.module.css';
import { supabase } from '../supabaseClient';
import useSubscriptionStore from '../subscriptionStore';
import Layout from '../components/Layout';

// Lazy-loaded components
const LatestSermon = React.lazy(() => import('../components/LatestSermon'));
const WelcomeSection = React.lazy(() => import('../components/WelcomeSection'));
const PrayerHighlight = React.lazy(() => import('../components/PrayerHighlight'));
const Bible = React.lazy(() => import('../components/Bible'));
const ChurchEstablished = React.lazy(() => import('../components/ChurchEstablished'));
const K56Gallery = React.lazy(() => import('../components/K56Gallery'));
const ChurchDepartmentsSection = React.lazy(() => import('../components/ChurchDepartmentsSection'));
const StatementOfFaithPreview = React.lazy(() => import('../components/StatementOfFaithPreview'));
const WeeklyRhythms = React.lazy(() => import('../components/WeeklyRhythms'));
const UpcomingEvents = React.lazy(() => import('../components/UpcomingEvents'));

const LoadingFallback = () => (
  <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
    Loading section...
  </div>
);

const Home = () => {
  const [vision, setVision] = useState('');
  const { subscribe, unsubscribe } = useSubscriptionStore();

  useEffect(() => {
    let isMounted = true;

    const fetchVision = async () => {
      try {
        const { data, error } = await supabase
          .from('about_us')
          .select('our_mission_p1')
          .maybeSingle();

        if (error) throw error;
        if (data && isMounted) setVision(data.our_mission_p1);
      } catch (err) {
        console.error('Error fetching vision data:', err.message);
      }
    };

    fetchVision();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    subscribe('sermons', (payload) => {
      console.log('Sermons table change detected:', payload);
    });

    return () => {
      unsubscribe('sermons');
    };
  }, [subscribe, unsubscribe]);

  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <WelcomeSection vision={vision} />
      </Suspense>

      {/* PEFA-Style Sunday Experience Feature Section */}
      <section id="visit" className={styles.pefaSundaySection}>
        <div className={styles.container}>
          <div className={styles.pefaHeader}>
            <div className={styles.pefaBadge}>
              <Calendar size={14} className={styles.pefaBadgeIcon} />
              <span>WEEKEND EXPERIENCE</span>
            </div>
            <h2 className={styles.pefaTitle}>Sunday at PEFA Kawangware 56</h2>
            <p className={styles.pefaSubtitle}>
              Join us in person for powerful worship, transformative Word, and authentic community fellowship.
            </p>
          </div>

          <div className={styles.pefaGrid}>
            {/* Featured PEFA Hero Card: Service Times */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`${styles.pefaCard} ${styles.pefaCardFeatured}`}
            >
              <div className={styles.pefaCardTag}>
                <Clock size={14} /> MAIN WORSHIP
              </div>
              <h3 className={styles.pefaCardTitle}>Service Times</h3>
              <p className={styles.pefaCardExcerpt}>
                Experience vibrant praise, biblical preaching, and heartfelt community in our main gatherings.
              </p>
              <div className={styles.pefaScheduleList}>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>Morning Glory</span>
                  <span className={styles.pefaTimeValue}>6:00 AM</span>
                </div>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>First Service</span>
                  <span className={styles.pefaTimeValue}>8:45 AM</span>
                </div>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>Second Service</span>
                  <span className={styles.pefaTimeValue}>10:00 AM</span>
                </div>
              </div>
            </motion.div>

            {/* Standard PEFA Card: Classes & Discipleship */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={styles.pefaCard}
            >
              <div className={styles.pefaCardTag}>
                <Users size={14} /> GROWTH & COMMUNITY
              </div>
              <h3 className={styles.pefaCardTitle}>Classes & Discipleship</h3>
              <p className={styles.pefaCardExcerpt}>
                Tailored spiritual growth tracks designed for teenagers, kids, and growing disciples.
              </p>
              <div className={styles.pefaScheduleList}>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>Teens Class</span>
                  <span className={styles.pefaTimeValue}>10:00 AM</span>
                </div>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>Sunday School</span>
                  <span className={styles.pefaTimeValue}>11:00 AM</span>
                </div>
                <div className={styles.pefaScheduleRow}>
                  <span className={styles.pefaTimeLabel}>Discipleship</span>
                  <span className={styles.pefaTimeValue}>1:00 PM</span>
                </div>
              </div>
            </motion.div>

            {/* Standard PEFA Card: Location & Directions */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={styles.pefaCard}
            >
              <div className={styles.pefaCardTag}>
                <MapPin size={14} /> LOCATION & DIRECTION
              </div>
              <h3 className={styles.pefaCardTitle}>Find Us</h3>
              <p className={styles.pefaCardExcerpt}>
				Located in Nairobi, about 100 metres from Kawangware 56 stage. Everyone is welcome to worship with us.
              </p>
              <div className={styles.pefaLocationBox}>
                <p className={styles.pefaLocationAddress}>
                  <strong>PEFA Church Kawangware 56</strong><br />
					Nairobi, Kenya, near Kawangware 56 stage.
                </p>
                <a 
                  href="https://www.google.com/maps/place/P.E.F.A+CHURCH+KAWANGWARE+56/@-1.2800642,36.7478542,17z" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.pefaActionBtn}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grouped primary dynamic sections */}
      <Suspense fallback={<LoadingFallback />}>
        <WeeklyRhythms />
        <LatestSermon />
        <Bible />
        <K56Gallery limit={10} />
      </Suspense>

      

      {/* Grouped secondary structural sections */}
      <Suspense fallback={<LoadingFallback />}>
        <StatementOfFaithPreview />
        <UpcomingEvents />
        <ChurchDepartmentsSection limit={3} />
        <section className={styles.footerCTA}>
          <PrayerHighlight />
        </section>
        <section className={styles.theologySection}>
          <div className={styles.container}>
            <div className={styles.theologyGrid}>
              <div className={styles.verticalDivider} />
              <ChurchEstablished />
            </div>
          </div>
        </section>
      </Suspense>
    </Layout>
  );
};

export default Home;