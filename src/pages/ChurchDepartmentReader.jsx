
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import * as Icons from 'lucide-react';
import { STATIC_MINISTRIES } from '../data/ministries';
import styles from '../styles/ChurchDepartmentReader.module.css';
import readerStyles from '../styles/SermonReader.module.css';
import Seo from '../components/Seo';

const ChurchDepartmentReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(22);
  const [relatedDepts, setRelatedDepts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const staticDept = STATIC_MINISTRIES.find(d => d.id === id);
        
        if (!staticDept) {
          setLoading(false);
          return;
        }

        const { data: remoteData } = await supabase
          .from('church_departments')
          .select('*')
          .eq('name', staticDept.name)
          .single();

        const activeDept = {
          ...staticDept,
          ...remoteData,
          image: remoteData?.image_url || staticDept?.image,
          iconName: remoteData?.icon_name || staticDept?.iconName || 'Sparkles',
          description: remoteData?.description || staticDept?.description || '',
          meetingTime: remoteData?.meeting_time || staticDept?.meetingTime || 'Sundays post-service',
          location: remoteData?.location || staticDept?.location || 'Main Sanctuary, Room B',
          category: remoteData?.category || staticDept?.category || 'Ministry Dispatch'
        };

        setDept(activeDept);

        const related = STATIC_MINISTRIES.filter(d => d.id !== id).slice(0, 3);
        setRelatedDepts(related);

      } catch (err) {
        console.error("Error loading department:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderArea}>
        <div className={styles.spinner} />
        <p>Loading Department Dispatch...</p>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className={styles.errorArea}>
        <h2>Department Not Found</h2>
        <p>The ministry dispatch you are looking for does not exist or has been archived.</p>
        <Link to="/church-department" className={styles.backBtn}>Return to Directory</Link>
      </div>
    );
  }

  const IconComponent = Icons[dept.iconName] || Icons.Sparkles;
  const paragraphs = dept.description.split('\n\n');

  return (
    <main className={styles.wrapper}>
      <Seo title={`${dept.name} | PEFA Kawangware 56`} description={dept.description.substring(0, 160)} />

      <div className={styles.editorialBar}>
        <div className={styles.editorialBarInner}>
          <Link to="/church-department" className={styles.backLink}>
            <Icons.ArrowLeft size={14} /> Back to Directory
          </Link>
          <span className={styles.categoryBadge}>{dept.category}</span>
        </div>
      </div>

      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{dept.name}</h1>
          <p className={styles.articleSubheading}>
            An overview of mission goals, leadership, and operational activities within PEFA Kawangware 56.
          </p>

          <div className={styles.bylineBar}>
            <div className={styles.authorMeta}>
              <div className={styles.iconCircle}>
                <IconComponent size={20} />
              </div>
              <div>
                <span className={styles.bylineLabel}>DEPARTMENT HEAD</span>
                <span className={styles.bylineValue}>{dept.head || 'Ministry Leadership Team'}</span>
              </div>
            </div>

            <div className={readerStyles.fontControls}>
                <button 
                    onClick={() => setFontSize(prev => Math.min(prev + 2, 32))} 
                    title="Increase text size"
                    disabled={fontSize >= 32}
                    className={readerStyles.fontBtn}
                >
                    <Icons.Type size={15} /><span className={readerStyles.controlSign}>+</span>
                </button>
                <span className={readerStyles.fontSizeIndicator}>{fontSize}px</span>
                <button 
                    onClick={() => setFontSize(prev => Math.max(prev - 2, 16))} 
                    title="Decrease text size"
                    disabled={fontSize <= 16}
                    className={readerStyles.fontBtn}
                >
                    <Icons.Type size={12} /><span className={readerStyles.controlSign}>-</span>
                </button>
            </div>
          </div>
        </header>

        <div className={styles.heroImageWrapper}>
          <img src={dept.image} alt={dept.name} className={styles.heroImage} />
          <span className={styles.imageCaption}>PEFA Kawangware 56 Ministry Operations & Community Outreach</span>
        </div>

        <div className={styles.articleBodyGrid}>
          <div 
            className={`${styles.mainContent} ${readerStyles.sermonBody}`}
            style={{ fontSize: `${fontSize}px`}}
          >
            {paragraphs.map((para, idx) => {
              const isVerse = idx === paragraphs.length - 1 && (para.includes(':') || para.toLowerCase().includes('verse'));
              
              if (isVerse) {
                return (
                  <blockquote key={idx} className={styles.scriptureCallout}>
                    <Icons.Quote size={24} className={styles.quoteIcon} />
                    <p className={styles.scriptureText}>{para}</p>
                  </blockquote>
                );
              }

              return (
                <p key={idx} className={`${idx === 0 ? styles.firstPara : ''}`}>
                  {para}
                </p>
              );
            })}

            <div className={styles.ctaBox}>
              <div className={styles.ctaHeader}>
                <Icons.UserPlus size={22} className={styles.ctaIcon} />
                <h3>Get Involved with {dept.name}</h3>
              </div>
              <p>Ready to deploy your gifts? Connect with our team to start serving in this department.</p>
              <button className={styles.joinButton}>Inquire About Joining</button>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <h4 className={styles.sidebarHeading}>DEPARTMENT BRIEF</h4>
              
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}><Icons.Calendar size={14} /> MEETING TIME</span>
                <span className={styles.infoValue}>{dept.meetingTime}</span>
              </div>

              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}><Icons.MapPin size={14} /> LOCATION</span>
                <span className={styles.infoValue}>{dept.location}</span>
              </div>

              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}><Icons.UserCheck size={14} /> LEADERSHIP</span>
                <span className={styles.infoValue}>{dept.head || 'Church Leadership Council'}</span>
              </div>

              <hr className={styles.divider} />
              
              <p className={styles.sidebarNote}>
                * Meeting schedules may adjust during special church services or calendar holidays.
              </p>
            </div>
          </aside>
        </div>

        {relatedDepts.length > 0 && (
          <section className={styles.relatedSection}>
            <h3 className={styles.relatedHeading}>MORE MINISTRIES</h3>
            <div className={styles.relatedGrid}>
              {relatedDepts.map(item => (
                <Link key={item.id} to={`/church-department-reader/${item.id}`} className={styles.relatedCard}>
                  <img src={item.image} alt={item.name} className={styles.relatedImage} />
                  <div className={styles.relatedContent}>
                    <span className={styles.relatedTag}>MINISTRY</span>
                    <h4 className={styles.relatedTitle}>{item.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
};

export default ChurchDepartmentReader;