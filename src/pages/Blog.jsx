import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/Blog.module.css';
import Seo from '../components/Seo';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase

const KindnessCarousel = React.lazy(() => import('../components/KindnessCarousel'));
const ChurchImportance = React.lazy(() => import('../components/ChurchImportance'));
const JesusLessons = React.lazy(() => import('../components/JesusLessons'));
const LoadingFallback = () => <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  if (isLoading) {
    return (
        <>
            <Seo 
                title="Our Blog" 
                description="Insights, stories, and updates from the PEFA Kawangware 56 community. Stay connected with our church family."
                keywords="church blog, spiritual growth, community stories, Nairobi church, PEFA Kawangware 56"
                url="/blog"
                type="website"
            />
            <div className={styles.loadingState}>Loading articles...</div>
        </>
    );
  }

  if (!posts.length) {
    return (
        <>
            <Seo 
                title="Our Blog" 
                description="Insights, stories, and updates from the PEFA Kawangware 56 community. Stay connected with our church family."
                keywords="church blog, spiritual growth, community stories, Nairobi church, PEFA Kawangware 56"
                url="/blog"
                type="website"
            />
            <div className={styles.emptyState}>No articles have been published yet.</div>
        </>
    );
  }

  return (
    <div className={styles.blogPage}>
      <Seo 
        title="Our Blog" 
        description="Insights, stories, and updates from the PEFA Kawangware 56 community. Stay connected with our church family."
        keywords="church blog, spiritual growth, community stories, Nairobi church, PEFA Kawangware 56"
        url="/blog"
        type="website"
      />

      <div className={styles.container}>
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>From the Heart of Our Church</h1>
          <p>Stories of faith, community impact, and spiritual insights.</p>
        </motion.header>

        {featuredPost && (
          <motion.section 
            className={styles.featuredPost}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className={styles.featuredImageWrapper}>
              <img src={featuredPost.image_url} alt={featuredPost.title} />
            </div>
            <div className={styles.featuredContent}>
              <p className={styles.category}>{featuredPost.category}</p>
              <h2>{featuredPost.title}</h2>
              <div className={styles.authorInfo}>
                <span>{featuredPost.author} &bull; {new Date(featuredPost.created_at).toLocaleDateString()}</span>
              </div>
              <Link to={`/blog/${featuredPost.id}`} className={styles.readMoreBtn}>
                Read Full Story <ArrowRight size={16} />
              </Link>
            </div>
          </motion.section>
        )}

        {otherPosts.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>More To Explore</h2>
            <div className={styles.postGrid}>
              {otherPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Link to={`/blog/${post.id}`} className={styles.postCard}>
                    <div className={styles.postCardImage} style={{backgroundImage: `url(${post.image_url})`}} />
                    <div className={styles.postCardContent}>
                      <p className={styles.category}>{post.category}</p>
                      <h3>{post.title}</h3>
                      <p className={styles.postCardMeta}>{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <div className={styles.darkSectionWrapper}>
           <JesusLessons />
        </div>
        <ChurchImportance />
        <KindnessCarousel />
      </Suspense>
    </div>
  );
};

export default Blog;
