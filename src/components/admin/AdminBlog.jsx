import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
    Plus, Edit3, Trash2, ChevronDown,
    Search, X, User, Tag, Calendar, Image as ImageIcon, CheckCircle
} from 'lucide-react';
import styles from '../../styles/AdminBlog.module.css';
import Uploader from './upload';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPost, setExpandedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) toast.error("Error: " + error.message);
        else setPosts(data);
        setIsLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this masterpiece? This action cannot be undone.')) {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) toast.error(error.message);
            else {
                toast.success('Post removed');
                fetchPosts();
            }
        }
    };

    const filteredPosts = useMemo(() =>
        posts.filter(p =>
            (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        ), [posts, searchTerm]);

    return (
        <div className={styles.adminContainer}>
            <Toaster position="top-right" reverseOrder={false} />

            <header className={styles.topBar}>
                <div className={styles.titleArea}>
                    <h1>Content Studio</h1>
                    <p>{filteredPosts.length} total posts</p>
                </div>
                <button
                    onClick={() => { setCurrentPost(null); setIsModalOpen(true); }}
                    className={styles.primaryBtn}
                >
                    <Plus size={18} /> <span>New Post</span>
                </button>
            </header>

            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Filter by title, author, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <main className={styles.contentGrid}>
                {isLoading ? (
                     <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <p>Syncing with database...</p>
                     </div>
                ) : (
                    <div className={styles.postList}>
                        {filteredPosts.map(post => (
                            <div
                                key={post.id}
                                className={`${styles.postCard} ${expandedPost === post.id ? styles.active : ''}`}
                            >
                                <div
                                    className={styles.postHeader}
                                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                >
                                    <div className={styles.mainInfo}>
                                        <h3>{post.title}</h3>
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaItem}><User size={14}/> {post.author}</span>
                                            <span className={styles.categoryPill}>{post.category}</span>
                                            <span className={styles.metaItem}><Calendar size={14}/> {new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expandedPost === post.id ? 180 : 0 }}
                                        className={styles.chevron}
                                    >
                                        <ChevronDown size={20} />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expandedPost === post.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className={styles.expandedContent}
                                        >
                                            <div className={styles.previewBox}>
                                                {post.image_url && <img src={post.image_url} alt="Cover" className={styles.previewThumb} />}
                                                <div className={styles.contentSnippet}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {post.content ? post.content.substring(0, 300) + '...' : ''}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            <div className={styles.cardActions}>
                                                <button onClick={() => { setCurrentPost(post); setIsModalOpen(true); }} className={styles.editBtn}>
                                                    <Edit3 size={16} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <PostModal
                        post={currentPost}
                        onClose={() => setIsModalOpen(false)}
                        onSave={fetchPosts}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const PostModal = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '', author: '', category: '', content: '', image_url: ''
    });

    useEffect(() => {
        if (post) {
            setFormData(post);
        } else {
            setFormData({ title: '', author: '', category: '', content: '', image_url: '' });
        }
    }, [post]);

    const handleUploadSuccess = ({ url }) => {
        setFormData(prevFormData => ({ ...prevFormData, image_url: url }));
        toast.success('Image uploaded!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = post
            ? await supabase.from('posts').update(formData).eq('id', post.id)
            : await supabase.from('posts').insert([formData]);

        if (error) toast.error(error.message);
        else {
            toast.success(post ? 'Updated' : 'Published');
            onSave();
            onClose();
        }
    };

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.modalPaper}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className={styles.modalHeader}>
                    <h2>{post ? 'Edit Post' : 'Craft New Post'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modernForm}>
                    <div className={styles.inputGroup}>
                        <label>Post Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Featured Image</label>
                        <Uploader onUploadSuccess={handleUploadSuccess} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Featured Image URL</label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            placeholder="Auto-filled on upload, or paste a URL"
                        />
                         {formData.image_url && (
                            <div style={{ marginTop: '1rem' }}>
                                <img src={formData.image_url} alt="Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, image_url: ''})}
                                    className={styles.secondaryBtn}
                                    style={{ marginTop: '0.5rem', width: 'auto', display: 'inline-flex', alignItems: 'center' }}
                                >
                                    <X size={14} style={{ marginRight: '0.5rem' }}/> Clear Image
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Body Content (Markdown)</label>
                        <textarea
                            rows="8"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        />
                         <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px', borderRadius: '5px' }}>
                            <h4 style={{marginTop: 0}}>Markdown Preview</h4>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {formData.content || 'Start typing to see a preview...'}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" onClick={onClose} className={styles.secondaryBtn}>Discard</button>
                        <button type="submit" className={styles.primaryBtn}>Save Changes</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AdminBlog;