import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import styles from '../styles/About.cnn.module.css';
import { ShieldCheck, Heart, Globe, Anchor, ArrowRight, Sparkles } from 'lucide-react';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';
import MarkdownDisplay from '../components/MarkdownDisplay';

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data, error } = await supabase.from('about_us').select('*').single();
        if (!error) setAboutContent(data);
      } catch (err) {
        console.error("Error fetching about content:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  const beliefs = [
    { icon: <ShieldCheck />, title: "The Bible", text: aboutContent?.bible_context || "The inspired Word of God." },
    { icon: <Heart />, title: "The Trinity", text: "One God, eternally existent in three persons." },
    { icon: <Globe />, title: "Our Outreach", text: aboutContent?.digital_age_p1 || "Spreading hope globally." },
    { icon: <Anchor />, title: "Salvation", text: "Restoration through faith and grace." },
  ];

  if (isLoading) return <AboutSkeleton />;

  return (
    <div className={styles.mainWrapper}>
      <Seo 
        title={`About | ${aboutContent?.title}`}
        description={aboutContent?.subtitle} 
        url="/about"
      />

      <main className={styles.mainContent}>
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <Breadcrumb />
                <h1 className={styles.pageTitle}>
                    <MarkdownDisplay markdown={aboutContent?.title} />
                </h1>
                <div className={styles.pageSubtitle}>
                    <MarkdownDisplay markdown={aboutContent?.subtitle} />
                </div>
            </div>

          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <h2 className={styles.serifTitle}>
                <MarkdownDisplay markdown={aboutContent?.our_story_title} />
              </h2>
              <div className={styles.pLead}>
                <MarkdownDisplay markdown={aboutContent?.our_story_p1} />
              </div>
              <div className={styles.pBody}>
                <MarkdownDisplay markdown={aboutContent?.our_story_p2} />
              </div>
            </div>

            <div className={styles.storyVisual}>
              <img 
                src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1781692303/IMG_20260609_194629_lmtpxr.jpg" 
                alt="Our Heritage"
                className={styles.mainImage}
              />
            </div>
          </div>
        </div>
      </main>

      <section className={styles.missionSection}>
          <div className={styles.container}>
            <h2 className={styles.missionTitle}><MarkdownDisplay markdown={aboutContent?.our_mission_title} /></h2>
            <div className={styles.missionText}>
                <MarkdownDisplay markdown={aboutContent?.our_mission_p1} />
            </div>
        </div>
      </section>

      <section className={styles.bentoSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>OUR PILLARS</span>
            <h2 className={styles.serifTitle}>Foundations of Faith</h2>
          </div>
          
          <div className={styles.bentoGrid}>
            {beliefs.map((belief, idx) => (
              <div key={idx} className={styles.bentoCard}>
                <div className={styles.bentoIconWrapper}>{belief.icon}</div>
                <h3>{belief.title}</h3>
                <div className={styles.bentoText}><MarkdownDisplay markdown={belief.text} /></div>
              </div>
            ))}

            <div className={`${styles.bentoCard} ${styles.ctaBackground}`}>
              <div className={styles.ctaContent}>
                <Sparkles className={styles.ctaIcon} />
                <h3>{aboutContent?.join_us_title || "Be Part of the Story"}</h3>
                <p>Join us this Sunday and experience a community built on love.</p>
                <button className={styles.modernButton}>
                  Plan Your Visit <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutSkeleton = () => (
    <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>
);

export default About;
