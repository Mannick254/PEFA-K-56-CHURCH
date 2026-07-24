import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../../styles/SermonsDisplay.module.css';
import { 
  Search, Plus, Edit2, Trash2, Video, 
  Image as ImageIcon, Calendar, User, X, AlertCircle, Loader2
} from 'lucide-react';
import Upload from './upload';

const INITIAL_FORM_STATE = {
  title: '',
  preacher: '',
  date: new Date().toISOString().split('T')[0],
  content: '',
  video_url: '',
  image_url: ''
};

const getYouTubeThumbnail = (videoUrl) => {
    if (!videoUrl) return null;
    let videoId = null;
    try {
      const url = new URL(videoUrl);
      if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      } else if (url.hostname.includes('youtube.com')) {
        if (url.pathname.includes('/embed/')) {
          videoId = url.pathname.split('/embed/')[1].split('?')[0];
        } else if (url.searchParams.has('v')) {
          videoId = url.searchParams.get('v');
        }
      }
    } catch (e) {
        console.error("Could not parse video URL", e);
        return null;
    }
    
    if (videoId) {
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
  };


const Sermons = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    useEffect(() => {
        fetchSermons();
    }, []);

    const fetchSermons = async () => {
        try {
        setLoading(true);
        const { data, error } = await supabase
            .from('sermons')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        setSermons(data || []);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
        const payload = { ...formData };

        if (editingId) {
            const { data, error } = await supabase
            .from('sermons')
            .update(payload)
            .eq('id', editingId)
            .select();
            
            if (error) throw error;
            setSermons(sermons.map(s => (s.id === editingId ? data[0] : s)));
        } else {
            const { data, error } = await supabase
            .from('sermons')
            .insert([payload])
            .select();
            
            if (error) throw error;
            setSermons([data[0], ...sermons]);
        }

        resetForm();
        } catch (err) {
        setError(err.message);
        } finally {
        setSubmitting(false);
        }
    };

    const handleEdit = (sermon) => {
        setEditingId(sermon.id);
        setFormData({
        title: sermon.title,
        preacher: sermon.preacher,
        date: sermon.date,
        content: sermon.content || '',
        video_url: sermon.video_url || '',
        image_url: sermon.image_url || ''
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this sermon permanently?')) return;
        
        try {
        const { error } = await supabase.from('sermons').delete().eq('id', id);
        if (error) throw error;
        setSermons(prev => prev.filter(s => s.id !== id));
        } catch (err) {
        alert("Failed to delete: " + err.message);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData(INITIAL_FORM_STATE);
        setIsFormOpen(false);
    };

    const filteredSermons = useMemo(() => {
        return sermons.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.preacher.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sermons, searchTerm]);

    return (
        <div className={styles.container}>
        <header className={styles.header}>
            <div>
            <h1>Sermon Library</h1>
            <p>Manage and organize your church recordings</p>
            </div>
            <button 
            className={`${styles.addBtn} ${isFormOpen ? styles.closeBtn : ''}`} 
            onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
            >
            {isFormOpen ? <X size={20} /> : <Plus size={20} />}
            {isFormOpen ? 'Cancel' : 'New Sermon'}
            </button>
        </header>

        {isFormOpen && (
            <section className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.mainForm}>
                <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Sermon Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter sermon title" />
                </div>
                <div className={styles.inputGroup}>
                    <label>Preacher</label>
                    <input name="preacher" value={formData.preacher} onChange={handleInputChange} required placeholder="Name of speaker" />
                </div>
                <div className={styles.inputGroup}>
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                    <label>Video Link (YouTube, Vimeo, or MP4)</label>
                    <input 
                    name="video_url" 
                    value={formData.video_url} 
                    onChange={handleInputChange} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    />
                </div>
                </div>

                <div className={styles.inputGroup}>
                <label>Sermon Content (Supports Markdown)</label>
                <textarea 
                    name="content" 
                    value={formData.content} 
                    onChange={handleInputChange} 
                    rows="10" 
                    placeholder="Write the sermon here. Use Markdown for formatting e.g., **bold**, *italics*, # Heading." 
                />
                 <p className={styles.markdownGuide}>
                Use Markdown for formatting. Examples: `**Bold**` for bold, `*Italics*` for italics, `# Heading 1` for a main heading, `## Heading 2` for a subheading, and new lines for paragraphs.
              </p>
                </div>

                <div className={styles.mediaGrid}>
                {/* Image Upload Area */}
                <div className={styles.uploadSection}>
                    <label>Cover Image</label>
                    <Upload 
                    onUploadSuccess={(uploadData) => {
                        if (uploadData && uploadData.url) {
                        setFormData(prev => ({ ...prev, image_url: uploadData.url }));
                        }
                    }}
                    />
                     <div className={styles.inputGroup}>
                        <label>Or paste Image URL</label>
                        <input 
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={formData.image_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            className={styles.urlInput}
                        />
                    </div>
                </div>

                {/* Instant Video Preview */}
                <div className={styles.videoPreviewSection}>
                    <label>Video Preview</label>
                    <div className={styles.miniPlayer}>
                    {formData.video_url ? (
                        <iframe
                            src={formData.video_url}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title="Sermon Preview"
                        ></iframe>
                    ) : (
                        <div className={styles.playerPlaceholder}><Video size={30} /></div>
                    )}
                    </div>
                </div>
                </div>

                <div className={styles.formActions}>
                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                    {submitting ? <><Loader2 className={styles.spinner} size={18} /> Saving...</> : editingId ? 'Update Sermon' : 'Publish Sermon'}
                </button>
                </div>
            </form>
            </section>
        )}

        <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={20} />
            <input 
            type="text" 
            placeholder="Search by title or preacher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {error && (
            <div className={styles.errorBanner}>
            <AlertCircle size={20} />
            {error}
            </div>
        )}

        {loading ? (
            <div className={styles.loadingState}><Loader2 className={styles.spinner} size={40} /></div>
        ) : (
            <div className={styles.sermonGrid}>
            {filteredSermons.map(sermon => (
                <SermonCard 
                key={sermon.id} 
                sermon={sermon} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                />
            ))}
            </div>
        )}
        
        {!loading && filteredSermons.length === 0 && (
            <div className={styles.emptyState}>No sermons found.</div>
        )}
        </div>
    );
};

const SermonCard = ({ sermon, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const content = sermon.content || '';
    const canTruncate = content.length > 250; // Character limit to enable truncation

    const imageUrl = sermon.image_url || getYouTubeThumbnail(sermon.video_url);

    return (
        <div className={styles.sermonCard}>
        <div className={styles.cardImage}>
            {imageUrl ? (
            <img src={imageUrl} alt={sermon.title} loading="lazy" />
            ) : (
            <div className={styles.imagePlaceholder}><ImageIcon size={40} /></div>
            )}
        </div>
        
        <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
            <h3>{sermon.title}</h3>
            <span className={styles.dateBadge}>
                <Calendar size={12} /> {new Date(sermon.date).toLocaleDateString()}
            </span>
            </div>
            
            <p className={styles.preacherName}><User size={14} /> {sermon.preacher}</p>
            
            <div className={`${styles.summary} ${canTruncate && !isExpanded ? styles.truncated : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
    
            {canTruncate && (
            <button onClick={toggleExpand} className={`${styles.readMoreBtn} ${isExpanded ? styles.showLess : ''}`}>
                {isExpanded ? 'Show Less' : 'Read More'}
            </button>
            )}

            {sermon.video_url && (
            <div className={styles.videoWrapper}>
                <iframe
                    src={sermon.video_url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={sermon.title}
                ></iframe>
            </div>
            )}

            <div className={styles.cardActions}>
            <button onClick={() => onEdit(sermon)} className={styles.editBtn}>
                <Edit2 size={18} /> Edit
            </button>
            <button onClick={() => onDelete(sermon.id)} className={styles.deleteBtn}>
                <Trash2 size={18} /> Delete
            </button>
            </div>
        </div>
        </div>
    );
};

export default Sermons;
