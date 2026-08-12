
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/BlogReader.module.css';
import Seo from '../components/Seo';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

// New Skeleton Loader Component
const SkeletonLoader = () => (
    <div className={styles.readerPage}>
        <div className={`${styles.skeleton} ${styles.skeletonHeader}`}></div>
        <div className={styles.container}>
            <div className={styles.articleHeader}>
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ height: '48px', width: '80%', margin: '0 auto 20px' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonMeta}`} style={{ height: '24px', width: '50%', margin: '0 auto' }}></div>
            </div>
            <div className={styles.content}>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '95%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '90%' }}></div>
                <br />
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '98%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '92%' }}></div>
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100%' }}></div>
            </div>
        </div>
    </div>
);

const BlogReader = () => {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
            } else {
                setPost(data);
            }
            setIsLoading(false);
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (!post) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                <p className="mb-6">Sorry, we couldn't find the post you're looking for.</p>
                <Link to="/blog" className="text-indigo-600 hover:underline flex items-center justify-center">
                    <ArrowLeft size={18} className="mr-2" /> Back to Blog
                </Link>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Blog', path: 'blog' },
        { label: post.title.length > 40 ? `${post.title.substring(0, 40)}...` : post.title, path: `blog/${id}` }
    ];

    return (
        <>
            <Seo 
                title={post.title} 
                description={post.content.substring(0, 150)}
                url={`/blog/${post.id}`}
                type="blogpost"
                imageData={post.image_url}
                author={post.author}
                datePublished={post.created_at}
                dateModified={post.created_at}
            />
            <div className={styles.readerPage}>
                <div 
                    className={styles.headerImage}
                    style={{ backgroundImage: `url(${post.image_url})` }}
                ></div>

                <div className={styles.container}>
                    <Breadcrumb crumbs={breadcrumbs} />
                    <article>
                        <header className={styles.articleHeader}>
                            <p className={styles.category}>{post.category}</p>
                            <h1 className={styles.title}>{post.title}</h1>
                            <div className={styles.meta}>
                                <span className={styles.author}>
                                    <User size={14} style={{ display: 'inline-block', marginRight: '6px' }} /> 
                                    {post.author}
                                </span>
                                &bull;
                                <span>
                                    <Calendar size={14} style={{ display: 'inline-block', marginRight: '6px' }} /> 
                                    {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </header>

                        <div className={styles.content}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

export default BlogReader;
