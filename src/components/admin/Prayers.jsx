import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit2, Trash2, Save, X, Heart, MessageSquare } from 'lucide-react';
import styles from '../../styles/AdminPrayers.module.css';

const PrayersAdmin = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    request: ''
  });

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showStatus('error', error.message);
    } else {
      setPrayers(data);
    }
    setLoading(false);
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.request.trim()) {
      showStatus('error', 'Both title and request are required.');
      return;
    }
    
    setLoading(true);
    try {
      if (editingPrayer) {
        const { error } = await supabase
          .from('prayers')
          .update(formData)
          .eq('id', editingPrayer.id);
        if (error) throw error;
        showStatus('success', 'Prayer request updated successfully!');
      } else {
        const { error } = await supabase.from('prayers').insert([formData]);
        if (error) throw error;
        showStatus('success', 'Prayer request added successfully!');
      }
      resetForm();
      fetchPrayers();
    } catch (error) {
      showStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prayer request?')) return;

    try {
      const { error } = await supabase.from('prayers').delete().eq('id', id);
      if (error) throw error;
      showStatus('success', 'Prayer deleted.');
      fetchPrayers();
    } catch (error) {
      showStatus('error', error.message);
    }
  };

  const startEdit = (prayer) => {
    setEditingPrayer(prayer);
    setFormData({ title: prayer.title, request: prayer.request });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingPrayer(null);
    setFormData({ title: '', request: '' });
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div>
          <h1>Prayer Wall Manager</h1>
          <p>Review and manage community prayer requests</p>
        </div>
        <Heart className={styles.headerIcon} size={40} />
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingPrayer ? 'Edit Prayer Request' : 'Add New Prayer Request'}
          </h2>
          
          <div className={styles.inputGroup}>
            <label>Prayer Title</label>
            <input
              type="text"
              placeholder="e.g., Healing for Family"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Request Details</label>
            <textarea
              placeholder="Enter the prayer details..."
              value={formData.request}
              onChange={(e) => setFormData({ ...formData, request: e.target.value })}
              required
              rows="4"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Processing...' : editingPrayer ? <><Save size={18}/> Update Prayer</> : <><Plus size={18}/> Add Prayer</>}
            </button>
            {editingPrayer && (
              <button type="button" onClick={resetForm} className={styles.secondaryBtn}>
                <X size={18}/> Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Prayer Requests ({prayers.length})</h2>
          <button onClick={fetchPrayers} className={styles.refreshBtn}>Refresh List</button>
        </div>

        <div className={styles.prayerGrid}>
          {prayers.length === 0 && !loading && (
            <p className={styles.emptyState}>No prayer requests found.</p>
          )}
          
          {prayers.map((prayer) => (
            <div key={prayer.id} className={styles.prayerCard}>
              <div className={styles.cardDecoration}>
                <MessageSquare size={20} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardDate}>
                  {new Date(prayer.created_at).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </span>
                <h3>{prayer.title}</h3>
                <p>{prayer.request}</p>
                <div className={styles.cardActions}>
                  <button onClick={() => startEdit(prayer)} className={styles.editBtn}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(prayer.id)} className={styles.deleteBtn}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrayersAdmin;