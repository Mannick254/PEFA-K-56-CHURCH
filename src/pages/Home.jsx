import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowRight, MapPin, Clock, Heart, Phone, Users, Calendar, 
  Sparkles, MessageCircle, BookOpen, Baby, GraduationCap, 
  PlayCircle, Zap, Mic2, Home as HomeIcon, Flame
} from 'lucide-react';
import { FaWhatsapp, FaDove } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import useSubscriptionStore from '../subscriptionStore'; // Import the store

// Modular Components
import Hero from '../components/Hero';
import Seo from '../components/Seo';

// Lazy-loaded components
const PrayerHighlight = React.lazy(() => import('../components/PrayerHighlight'));
const KindnessCarousel = React.lazy(() => import('../components/KindnessCarousel'));
const ChurchImportance = React.lazy(() => import('../components/ChurchImportance'));
const JesusLessons = React.lazy(() => import('../components/JesusLessons'));
const Bible = React.lazy(() => import('../components/Bible'));
const ChurchEstablished = React.lazy(() => import('../components/ChurchEstablished'));
const K56Gallery = React.lazy(() => import('../components/K56Gallery'));
const ChurchDepartmentsSection = React.lazy(() => import('../components/ChurchDepartmentsSection'));
const StatementOfFaithPreview = React.lazy(() => import('../components/StatementOfFaithPreview'));
const WeeklyRhythms = React.lazy(() => import('../components/WeeklyRhythms'));
const UpcomingEvents = React.lazy(() => import('../components/UpcomingEvents'));

const LoadingFallback = () => <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;

const Home = ({ setNotification }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vision, setVision] = useState('');
  const { subscribe, unsubscribe } = useSubscriptionStore(); // Use the store

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false })
          .limit(2);

        if (error) throw error;
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    const fetchVision = async () => {
      const { data, error } = await supabase.from('about_us').select('our_mission_p1').single();
      if (!error) setVision(data.our_mission_p1);
    };

    fetchEvents();
    fetchVision();
    setLoading(false);
  }, []);

  useEffect(() => {
    // Subscribe to the 'sermons' table
    subscribe('sermons', (payload) => {
      console.log('Sermons table change detected:', payload);
      // You can update your component's state here based on the payload
      // For example, refetch sermons or update the list in real-time
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe('sermons');
    };
  }, [subscribe, unsubscribe]);


  // 1. Sunday School Data
  const sundaySchoolClasses = [
    { name: "Elohim", age: "Below 5 years", icon: <Baby size={20} />, color: "#FFD700" },
    { name: "Shalom", age: "6 - 8 years", icon: <Heart size={20} />, color: "#FF6B6B" },
    { name: "Shamah", age: "9 - 12 years", icon: <Sparkles size={20} />, color: "#4ECDC4" },
    { name: "Teens", age: "13 - 17 years", icon: <Users size={20} />, color: "#A29BFE" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Seo title="PEFA Kawangware 56 Church" description="Transforming lives through the Word. Join us for worship, fellowship, and community service." />
      {/* Scroll Progress Bar */}
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {/* 1. HERO SECTION */}
      <Hero />
      
      {/* LIVE NOW SECTION */}
      <section className={styles.liveNowSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.liveNowCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.liveBadgeContainer}>
              <span className={styles.livePulse}></span>
              <span className={styles.liveNowText}>LIVE NOW</span>
            </div>
            <h2 className={styles.liveTitle}>Join Our Service Live</h2>
            <p className={styles.liveDescription}>Experience the power of worship and the word, right where you are. Don't miss out on what God is doing.</p>
            <Link to="/live" className={styles.liveBtn}>
              <PlayCircle size={22} />
              Watch Live Service
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. SUNDAY EXPERIENCE (Bento Grid) */}
      <section id="visit" className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
             <span className={styles.tagline}><Calendar size={16}/> THE LORD'S DAY</span>
             <h2 className={styles.serifTitle}>Sunday Experience</h2>
          </div>

          <div className={styles.bentoGrid}>
            {/* Main Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className={`${styles.bentoCard} ${styles.mainSchedule}`}>
              <div className={styles.cardHighlight}>
                <Clock className={styles.goldText} size={28} />
                <h3>Worship Services</h3>
              </div>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <span className={styles.time}>06:00 AM</span>
                  <div className={styles.details}><strong>Morning Glory</strong><p>6:00 AM - 8:45 AM</p></div>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.time}>08:45 AM</span>
                  <div className={styles.details}><strong>First Service</strong><p>8:45 AM - 9:45 AM</p></div>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.time}>10:00 AM</span>
                  <div className={styles.details}><strong>Second Service</strong><p>10:00 AM - 1:00 PM</p></div>
                </div>
              </div>
            </motion.div>

            {/* Generational Learning */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${styles.bentoCard} ${styles.learningCenter}`}>
              <h3>Specialized Classes</h3>
              <div className={styles.miniClasses}>
                 <div className={styles.miniClassItem}><GraduationCap size={18} /><span><strong>Teens Class:</strong> 10:00 AM - 10:30 AM</span></div>
                 <div className={styles.miniClassItem}><Baby size={18} /><span><strong>Sunday School:</strong> 11:00 AM - 12:00 PM</span></div>
                 <div className={styles.miniClassItem}><BookOpen size={18} /><span><strong>Discipleship:</strong> 1:00 PM - 1:20 PM</span></div>
              </div>
              <div className={styles.classGrid}>
                {sundaySchoolClasses.map((cls) => (
                  <div key={cls.name} className={styles.classTag}>
                    <span className={styles.classIcon} style={{ background: cls.color }}>{cls.icon}</span>
                    <div className={styles.classInfo}><span className={styles.className}>{cls.name}</span><span className={styles.classAge}>{cls.age}</span></div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`${styles.bentoCard} ${styles.locationCard}`}>
              <MapPin className={styles.goldText} size={32} />
              <h3>Find Us</h3>
              <p>Kawangware 56, Nairobi</p>
              <p className={styles.subtext}>50 Mitres From 56 Stage</p>
              <a href="https://www.google.com/maps/place/P.E.F.A+CHURCH+KAWANGWARE+56/@-1.2800642,36.7478542,17z/data=!4m14!1m7!3m6!1s0x182f19a7347bc27f:0x4699241aa71a8bae!2sP.E.F.A+CHURCH+KAWANGWARE+56!8m2!3d-1.2800642!4d36.7504291!16s%2Fg%2F11v6whlm41!3m5!1s0x182f19a7347bc27f:0x4699241aa71a8bae!8m2!3d-1.2800642!4d36.7504291!16s%2Fg%2F11v6whlm41?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className={styles.mapBtn}>Open Maps</a>
            </motion.div>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <WeeklyRhythms />
      </Suspense>

      {/* OUR VISION SECTION */}
      <section className={styles.visionSection}>
        <motion.div 
          className={styles.visionInner}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <FaDove size={48} />
          <h2 className={styles.visionTitle}>Our Vision</h2>
          <p className={styles.visionText}>{vision}</p>
          <Link to="/about" className={styles.visionBtn}>Learn More</Link>
        </motion.div>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <Bible setNotification={setNotification} />
        <K56Gallery limit={6} />
      </Suspense>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Link to="/K56-Gallery" className={styles.contactBtn}>See More</Link>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <StatementOfFaithPreview />
        <UpcomingEvents />
        <ChurchDepartmentsSection />
        <section className={styles.footerCTA}>
            <PrayerHighlight />
        </section>
      </Suspense>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactInner}>
            <MessageCircle size={40} className={styles.contactIcon} />
            <h2 className={styles.contactTitle}>Get in Touch</h2>
            <p className={styles.contactDescription}>Have a question, a prayer request, or just want to say hello? We'd love to hear from you.</p>
            <Link to="/contact" className={styles.contactBtn}>Contact Us</Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <div className={styles.darkSectionWrapper}>
           <JesusLessons />
        </div>
        <section className={styles.theologySection}>
          <div className={styles.container}>
              <div className={styles.theologyGrid}>
                  <div className={styles.verticalDivider} />
                  <ChurchEstablished />
              </div>
          </div>
        </section>
        <ChurchImportance />
        <KindnessCarousel />
      </Suspense>

      <a href="https://wa.me/254724435230" className={styles.fabPrayer} target="_blank" rel="noopener noreferrer">
         <FaWhatsapp size={24} />
         <span className={styles.fabText}>Need Prayer?</span>
      </a>
    </div>
  );
};

export default Home;