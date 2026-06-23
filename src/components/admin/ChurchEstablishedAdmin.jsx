import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Plus, Edit2, Trash2, Save, 
  Church, Image as ImageIcon, AlertCircle 
} from 'lucide-react';
import styles from '../../styles/ChurchEstablished.module.css';
import Upload from './upload';

const ChurchEstablishedAdmin = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image_url: ''
  });

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('church_established')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) showStatus('error', error.message);
    else setPoints(data || []);
    setLoading(false);
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPoint) {
        const { error } = await supabase
          .from('church_established')
          .update(formData)
          .eq('id', editingPoint.id);
        if (error) throw error;
        showStatus('success', 'Point updated successfully!');
      } else {
        const { error } = await supabase.from('church_established').insert([formData]);
        if (error) throw error;
        showStatus('success', 'Point added successfully!');
      }
      resetForm();
      fetchPoints();
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (point) => {
    setEditingPoint(point);
    setFormData({
      title: point.title,
      message: point.message,
      image_url: point.image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this point?')) return;

    try {
      const { error } = await supabase.from('church_established').delete().eq('id', id);
      if (error) throw error;
      showStatus('success', 'Point removed successfully.');
      fetchPoints();
    } catch (error) {
      showStatus('error', error.message);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', image_url: '' });
    setEditingPoint(null);
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Church Mission Manager</h1>
          <p>Explain the core reasons why the church was established</p>
        </div>
        <Church className={styles.headerIcon} size={42} />
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          <AlertCircle size={20} />
          {status.message}
        </div>
      )}

      <div className={styles.mainGrid}>
        {/* Form Section */}
        <section className={styles.formPanel}>
          <form onSubmit={handleSubmit} className={styles.card}>
            <h2 className={styles.cardTitle}>
              {editingPoint ? 'Edit Point' : 'Create New Mission Point'}
            </h2>
            
            <div className={styles.inputGroup}>
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Spiritual Growth"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Message / Description</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Describe this reason in detail..."
                required
                rows="4"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Visual Asset</label>
              <Upload
                  onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  onUrlChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  initialUrl={formData.image_url}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={loading} className={styles.primaryBtn}>
                {editingPoint ? <><Save size={18} /> Update</> : <><Plus size={18} /> Add Point</>}
              </button>
              {editingPoint && (
                <button type="button" onClick={resetForm} className={styles.secondaryBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List Section */}
        <section className={styles.listPanel}>
          <div className={styles.listHeader}>
            <h2>Active Points ({points.length})</h2>
            <button onClick={fetchPoints} className={styles.refreshBtn}>Refresh</button>
          </div>

          <div className={styles.dataGrid}>
            {points.map((point) => (
              <div key={point.id} className={styles.dataCard}>
                <div className={styles.dataImage}>
                  {point.image_url ? (
                    <img src={point.image_url} alt={point.title} />
                  ) : (
                    <div className={styles.noImage}><ImageIcon size={30} /></div>
                  )}
                </div>
                <div className={styles.dataContent}>
                  <h3>{point.title}</h3>
                  <p>{point.message}</p>
                  <div className={styles.dataActions}>
                    <button onClick={() => handleEdit(point)} className={styles.editBtn}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(point.id)} className={styles.deleteBtn}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChurchEstablishedAdmin;
