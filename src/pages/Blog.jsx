import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Flame, Newspaper, TrendingUp, Sparkles, Filter } from 'lucide-react';
import styles from '../styles/Blog.module.css';
import Seo from '../components/Seo';
import { supabase } from '../supabaseClient';

const KindnessCarousel = React.lazy(() => import('../components/KindnessCarousel'));
const ChurchImportance = React.lazy(() => import('../components/ChurchImportance'));
const JesusLessons = React.lazy(() => import('../components/JesusLessons'));
const UpcomingEvents = React.lazy(() => import('../components/UpcomingEvents'));
const LoadingFallback = () => <div className={styles.suspenseLoader}>Loading editorial experience...</div>;

// Helper to calculate estimated read time
const calculateReadTime = (content = '') => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const unique = ['All', ...new Set(posts.map((p) => p.category).filter(Boolean))];
    return unique;
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const heroPost = filteredPosts[0];
  const sideHighlightPosts = filteredPosts.slice(1, 4);
  const gridPosts = filteredPosts.slice(4);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
    })
  };

  if (isLoading) {
    return (
      <>
        <Seo title="The Gazette | PEFA Kawangware 56" description="Stories of faith and community." url="/blog" type="website" />
        <div className={styles.newsroomSkeleton}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonSidebar} />
        </div>
      </>
    );
  }

  return (
    <div className={styles.cnnPageWrapper}>
      <Seo 
        title="PEFA Newsroom | Community Stories & Insights" 
        description="Breaking stories of faith, community impact, and spiritual leadership from PEFA Kawangware 56."
        keywords="church news, faith editorial, spiritual growth, Nairobi impact"
        url="/blog"
        type="website"
      />

      {/* Ticker Banner */}
      <div className={styles.newsTickerBar}>
        <div className={styles.tickerBadge}>
          <Flame size={14} /> LATEST UPDATES
        </div>
        <div className={styles.tickerContent}>
          <span>Welcome to the PEFA Kawangware 56 Editorial Desk • Weekly devotionals and impact reports updated live</span>
        </div>
      </div>

      <div className={styles.newsContainer}>
        {/* CNN Style Editorial Header */}
        <header className={styles.editorialHeader}>
          <div className={styles.masthead}>
            <span className={styles.mastheadTag}><Newspaper size={18} /> EDITORIAL DESK</span>
            <h1>PEFA Faith & Community Hub</h1>
            <p className={styles.dateline}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Category Filter Pills */}
          <nav className={styles.categoryBar} aria-label="Blog categories">
            <Filter size={16} className={styles.filterIcon} />
            <div className={styles.categoryPills}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.pill} ${selectedCategory === cat ? styles.pillActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <Sparkles size={32} />
            <h3>No stories currently published</h3>
            <p>Check back shortly for upcoming editorial pieces and community updates.</p>
          </div>
        ) : (
          <>
            {/* Top Stories Layout: Hero + Side Lead Column */}
            {heroPost && (
              <section className={styles.topStoriesSection}>
                {/* Hero Lead Story */}
                <motion.article 
                  className={styles.heroArticle}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Link to={`/blog/${heroPost.id}`} className={styles.heroLink}>
                    <div className={styles.heroImageWrapper}>
                      <img src={heroPost.image_url} alt={heroPost.title} loading="eager" />
                      <span className={styles.categoryBadge}>{heroPost.category || 'Featured'}</span>
                    </div>
                    <div className={styles.heroBody}>
                      <span className={styles.readTime}>
                        <Clock size={14} /> {calculateReadTime(heroPost.content)} min read
                      </span>
                      <h2>{heroPost.title}</h2>
                      <p className={styles.heroExcerpt}>
                        {heroPost.excerpt || heroPost.content?.substring(0, 160) + '...'}
                      </p>
                      <div className={styles.authorMeta}>
                        <span>By <strong>{heroPost.author || 'Editorial Team'}</strong></span>
                        <span className={styles.dot}>•</span>
                        <span>{new Date(heroPost.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>

                {/* Sidebar Top Headlines */}
                <aside className={styles.sidebarSection}>
                  <div className={styles.sidebarHeader}>
                    <TrendingUp size={18} />
                    <h3>Top Stories</h3>
                  </div>
                  <div className={styles.sidebarList}>
                    {sideHighlightPosts.map((post, idx) => (
                      <Link to={`/blog/${post.id}`} key={post.id} className={styles.sidebarItem}>
                        <span className={styles.itemIndex}>0{idx + 1}</span>
                        <div className={styles.itemContent}>
                          <span className={styles.subCategory}>{post.category}</span>
                          <h4>{post.title}</h4>
                          <span className={styles.miniMeta}>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </aside>
              </section>
            )}

            {/* Main News Grid */}
            {gridPosts.length > 0 && (
              <section className={styles.gridSection}>
                <div className={styles.sectionHeader}>
                  <h2>More Coverage</h2>
                  <div className={styles.headerRule} />
                </div>

                <div className={styles.newsGrid}>
                  <AnimatePresence>
                    {gridPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        layout
                      >
                        <Link to={`/blog/${post.id}`} className={styles.newsCard}>
                          <div className={styles.cardImageWrapper}>
                            <img src={post.image_url} alt={post.title} loading="lazy" />
                            <span className={styles.cardCategory}>{post.category}</span>
                          </div>
                          <div className={styles.cardContent}>
                            <span className={styles.cardReadTime}>
                              <Clock size={12} /> {calculateReadTime(post.content)} min read
                            </span>
                            <h3>{post.title}</h3>
                            <div className={styles.cardFooter}>
                              <span>{post.author || 'PEFA Desk'}</span>
                              <ArrowRight size={14} className={styles.cardArrow} />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Editorial Interactive Components */}
      <Suspense fallback={<LoadingFallback />}>
        <div className={styles.darkSectionWrapper}>
          <JesusLessons />
        </div>
        <ChurchImportance />
        <UpcomingEvents />
        <KindnessCarousel />
      </Suspense>
    </div>
  );
};

export default Blog;