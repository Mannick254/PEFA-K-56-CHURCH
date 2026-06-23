import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Trash2, Edit3, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import styles from '../../styles/KindnessActsAdmin.module.css';
import Upload from './upload';

const KindnessActs = () => {
  const [acts, setActs] = useState([]);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingAct, setEditingAct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetchActs();
  }, []);

  const fetchActs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kindness_acts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setActs(data || []);
    } catch (error) {
      showStatus('error', 'Failed to fetch acts');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
        showStatus('error', 'Impact message is required.');
        return;
    }
    setIsSubmitting(true);
    try {
      const actData = {
        imageurl: imageUrl,
        description: message
      };

      if (editingAct) {
        const { error } = await supabase
          .from('kindness_acts')
          .update(actData)
          .eq('id', editingAct.id);
        if (error) throw error;
        showStatus('success', 'Act updated successfully');
      } else {
        const { error } = await supabase
          .from('kindness_acts')
          .insert([actData]);
        if (error) throw error;
        showStatus('success', 'New act added');
      }

      resetForm();
      fetchActs();
    } catch (error) {
      showStatus('error', error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingAct(null);
    setMessage('');
    setImageUrl('');
  };

  const handleEdit = (act) => {
    setEditingAct(act);
    setMessage(act.description);
    setImageUrl(act.imageurl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (act) => {
    if (!window.confirm('Delete this kindness act?')) return;

    try {
      if (act.imageurl && act.imageurl.includes(supabase.storage.from('church-assets').getPublicUrl('').data.publicUrl)) {
        const path = new URL(act.imageurl).pathname.split('/media/')[1];
        await supabase.storage.from('media').remove([path]);
      }

      const { error } = await supabase.from('kindness_acts').delete().eq('id', act.id);
      if (error) throw error;

      setActs(acts.filter(a => a.id !== act.id));
      showStatus('success', 'Act deleted');
    } catch (error) {
      showStatus('error', 'Delete failed');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div>
          <h1>Kindness Carousel Management</h1>
          <p>Share stories of impact with the congregation</p>
        </div>
      </header>

      {status.msg && (
        <div className={`${styles.status} ${styles[status.type]}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {status.msg}
        </div>
      )}

      <div className={styles.layout}>
        <section className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.card}>
            <h3>{editingAct ? 'Edit Act' : 'Add New Act'}</h3>

            <div className={styles.uploadArea}>
              <Upload 
                  onUpload={setImageUrl}
                  onUrlChange={setImageUrl}
                  initialUrl={imageUrl}
              />
            </div>
            <div className={styles.inputGroup}>
                <label>Or paste Image URL</label>
                <input 
                    type="text"
                    placeholder="https://example.com/image.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={styles.urlInput}
                />
            </div>

            <div className={styles.inputGroup}>
              <label>Impact Message</label>
              <textarea
                placeholder="Describe the act of kindness..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? <Loader2 className={styles.spinner} size={18} /> : (editingAct ? 'Update Act' : 'Publish Act')}
              </button>
              {editingAct && (
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.listSection}>
          {loading ? (
            <div className={styles.loadingState}><Loader2 className={styles.spinner} /> Loading acts...</div>
          ) : (
            <div className={styles.grid}>
              {acts.map((act) => (
                <div key={act.id} className={styles.actCard}>
                  <div className={styles.cardImage}>
                    {act.imageurl ? <img src={act.imageurl} alt="Kindness" /> : <div className={styles.noImage}>No Image</div>}
                  </div>
                  <div className={styles.cardBody}>
                    <p>{act.description}</p>
                    <div className={styles.cardActions}>
                      <button onClick={() => handleEdit(act)} className={styles.editBtn}>
                        <Edit3 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(act)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default KindnessActs;
