import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowRight, MapPin, Clock, Heart, Phone, Users, Calendar, 
  Sparkles, MessageCircle, BookOpen, Baby, GraduationCap, 
  PlayCircle, Zap, Mic2, Home as HomeIcon, Flame
} from 'lucide-react';
import { FaDove } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import useSubscriptionStore from '../subscriptionStore'; // Import the store

// Modular Components
import Hero from '../components/Hero';
import PrayerHighlight from '../components/PrayerHighlight';
import KindnessCarousel from '../components/KindnessCarousel';
import ChurchImportance from '../components/ChurchImportance';
import JesusLessons from '../components/JesusLessons';
import Bible from '../components/Bible';
import ChurchEstablished from '../components/ChurchEstablished';
import K56Gallery from '../components/K56Gallery';
import ChurchDepartmentsSection from '../components/ChurchDepartmentsSection';
import StatementOfFaithPreview from '../components/StatementOfFaithPreview';

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

  // 2. Weekly Program Data
  const weeklyPrograms = [
    { day: "Monday", time: "5:30 PM - 7:30 PM", title: "Family Day", detail: "Men's Ministry Day", icon: <Users size={20}/> },
    { day: "Tuesday", time: "5:30 PM - 7:30 PM", title: "Prayer Meeting", detail: "Intercession & Power", icon: <Zap size={20}/> },
    { day: "Wednesday", time: "5:30 PM - 7:30 PM", title: "Women Ministry", detail: "", icon: <Flame size={20}/> },
    { day: "Thursday", time: "5:30 PM - 7:30 PM", title: "Bible Study", detail: "Deep Word Foundation", icon: <BookOpen size={20}/> },
    { day: "Friday", time: "5:30 PM - 7:30 PM", title: "Fellowship", detail: "House Groups & Choir Practice", icon: <HomeIcon size={20}/> },
    { day: "Saturday", time: "4:00 PM - 6:00 PM", title: "Worship Practice", detail: "Praise & Worship Team", icon: <Mic2 size={20}/> },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Scroll Progress Bar */}
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {/* 1. HERO SECTION */}
      <Hero />

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

      {/* 3. WEEKLY RHYTHMS */}
      <section className={styles.weeklySection}>
        <div className={styles.container}>
          <div className={styles.gridHeader}>
            <div>
              <h2 className={styles.serifTitle}>Weekly Rhythms</h2>
              <p>Join our specialized mid-week fellowships and growth sessions.</p>
            </div>
          </div>
          <div className={styles.weeklyGrid}>
            {weeklyPrograms.map((prog, index) => (
              <motion.div key={prog.day} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={styles.weeklyCard}>
                <div className={styles.weeklyIcon}>{prog.icon}</div>
                <div className={styles.weeklyContent}>
                  <span className={styles.weeklyDay}>{prog.day}</span>
                  <h4>{prog.title}</h4>
                  <p>{prog.detail}</p>
                  <div className={styles.weeklyTime}><Clock size={14} /> {prog.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

      {/* 4. MAGAZINE SECTION (Sermons/Events) */}
      <section className={styles.magazineSection}>
        <div className={styles.container}>
          <div className={styles.gridHeader}>
            <div><h2 className={styles.serifTitle}>Spiritual Nourishment</h2><p>Latest messages and upcoming community gatherings.</p></div>
            <Link to="/events" className={styles.exploreBtn}>Full Calendar <ArrowRight size={18} /></Link>
          </div>
          <div className={styles.magazineGrid}>
            <div className={styles.featuredSermonCard}>
              <div className={styles.sermonContent}>
                 <span className={styles.liveBadge}>LATEST SERMON</span>
                 <h3>Walking in Divine Purpose</h3>
                 <p>Senior Pastor | Sunday Oct 2024</p>
                 <Link to="/sermons" className={styles.watchBtn}>Watch Message</Link>
              </div>
            </div>
            <div className={styles.eventsStack}>
              <h4 className={styles.stackTitle}>Upcoming Events</h4>
              {loading && <p>Loading events...</p>}
              {error && <p>Error loading events: {error}</p>}
              {!loading && !error && events.map((event) => (
                <div key={event.id} className={styles.eventRow}>
                   <div className={styles.eventDate}><span className={styles.day}>{new Date(event.date).getDate()}</span><span className={styles.month}>{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span></div>
                   <div className={styles.eventDetails}><h4>{event.title}</h4><span><Clock size={12}/> {event.location}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Bible setNotification={setNotification} />
      <K56Gallery limit={6} />
      <StatementOfFaithPreview />

      {/* 5. DARK SPIRITUALITY SECTION */}
      <div className={styles.darkSectionWrapper}>
           <JesusLessons />
      </div>

      {/* 6. THEOLOGY & FOUNDATION */}
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

      <ChurchDepartmentsSection />

      {/* 7. PRAYER & GENEROSITY */}
      <section className={styles.footerCTA}>
        <PrayerHighlight />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className={styles.ctaCard}>
          <div className={styles.ctaGlass}>
            <Heart className={styles.heartPulse} size={48} />
            <h2 className={styles.ctaTitle}>Support the Mission</h2>
            <p className={styles.ctaText}>Your generosity fuels our outreach in Kawangware and beyond.</p>
            
            <div className={styles.mpesaCard}>
              <div className={styles.mpesaHeader}><span>M-PESA LIPA NA</span><strong>OFFERING</strong></div>
              <div className={styles.mpesaBody}>
                <div className={styles.payItem}><small>PAY BILL</small><strong>400200</strong></div>
                <div className={styles.payItem}><small>ACCOUNT</small><strong>1652142</strong></div>
              </div>
            </div>

            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.primaryBtn}>Request Prayer</Link>
              <a href="tel:+254724435230" className={styles.outlineBtn}><Phone size={18} /> Contact Office</a>
            </div>
          </div>
        </motion.div>
      </section>

      <Link to="/contact" className={styles.fabPrayer}>
         <MessageCircle size={24} />
         <span className={styles.fabText}>Need Prayer?</span>
      </Link>
    </div>
  );
};

export default Home;
