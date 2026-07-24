import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Save,
  Edit3,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  X,
  RefreshCw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import styles from '../../styles/CIAdmin.module.css';

const LiveAdmin = () => {
  const [formState, setFormState] = useState({
    is_live: false,
    stream_url: '',
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchLiveData();
  }, []);

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_status')
        .select('id, title, stream_url, is_live, description')
        .eq('id', 1)
        .single();
      if (error) throw error;
      if (data) setFormState(data);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('live_status')
        .update({
          title: formState.title,
          stream_url: formState.stream_url,
          is_live: formState.is_live,
          description: formState.description
        })
        .eq('id', 1);

      if (error) throw error;

      showNotification('Live status updated successfully!');
      fetchLiveData();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = null;
        if (url.includes('v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      // Facebook
      if (url.includes('facebook.com')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
      }
      // TikTok video posts
      if (url.includes('tiktok.com')) {
        if (url.includes('/video/')) {
          const videoIdMatch = url.match(/\/video\/(\d+)/);
          if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
          }
        }
        // TikTok Live cannot be embedded
        if (url.includes('/live')) {
          return null;
        }
      }
    } catch (e) {
      console.error('Error parsing URL', e);
    }
    return null;
  };

  return (
    <div className={styles.adminContainer}>
      {notification && (
        <div className={`${styles.notification} ${styles[`toast-${notification.type}`]}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          {notification.text}
        </div>
      )}

      <div className={styles.adminHeaderSection}>
        <div>
          <h2 className={styles.adminPageTitle}>Live Stream Management</h2>
          <p className={styles.adminPageSubtitle}>
            Control the live status and stream details for your website.
          </p>
        </div>
        <button onClick={fetchLiveData} className={styles.refreshBtn} title="Refresh Data">
          <RefreshCw size={20} className={isLoading ? styles.spin : ''} />
        </button>
      </div>

      <div className={styles.adminGridMain}>
        {/* Editor Card */}
        <div className={`${styles.adminCard} ${styles.editorCard}`}>
          <div className={styles.adminCardHeader}>
            <div className={styles.headerIcon}>
              <Edit3 size={20} />
            </div>
            <h3>Edit Live Status</h3>
          </div>

          <form onSubmit={handleSubmit} className={styles.modernForm}>
            <div className={styles.formField}>
              <label><Type size={16} /> Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Sunday Service, Youth Night"
                value={formState.title}
                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className={styles.formField}>
              <label><LinkIcon size={16} /> Stream URL</label>
              <input
                name="stream_url"
                type="text"
                placeholder="YouTube, Facebook, or TikTok URL..."
                value={formState.stream_url}
                onChange={(e) => setFormState(prev => ({ ...prev, stream_url: e.target.value }))}
                required
              />
            </div>

            <div className={styles.formField}>
              <label><FileText size={16} /> Description</label>
              <textarea
                name="description"
                placeholder="Optional description of the stream..."
                value={formState.description || ''}
                onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className={styles.formField}>
              <label>Live Status</label>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  id="is_live"
                  checked={formState.is_live}
                  onChange={(e) => setFormState(prev => ({ ...prev, is_live: e.target.checked }))}
                />
                <label htmlFor="is_live">
                  {formState.is_live ? 'Currently Live' : 'Currently Offline'}
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                {isSaving ? 'Saving...' : (<><Save size={18} /> Save Changes</>)}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className={`${styles.adminCard} ${styles.previewCard}`}>
          <div className={styles.adminCardHeader}>
            <div className={styles.headerIcon}>
              <ImageIcon size={20} />
            </div>
            <h3>Live Preview</h3>
          </div>
          <div className={styles.livePreview}>
            {formState.stream_url && getEmbedUrl(formState.stream_url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                <iframe
                  src={getEmbedUrl(formState.stream_url)}
                  title="Stream Preview"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : formState.stream_url.includes('tiktok.com') && formState.stream_url.includes('/live') ? (
              <a href={formState.stream_url} target="_blank" rel="noopener noreferrer" className={styles.tiktokLink}>
                Watch Live on TikTok
              </a>
            ) : (
              <p>Enter a valid YouTube, Facebook, or TikTok video URL to see a preview. TikTok Live links will show a redirect button instead.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAdmin;
