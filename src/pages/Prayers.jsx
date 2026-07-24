import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Prayers.module.css';
import Seo from '../components/Seo';

const Prayers = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [title, setTitle] = useState('');
  const [request, setRequest] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPrayers = async () => {
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select('id, title, request, created_at, submitted_by') // Fixed the *_id typo
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !request) return alert("Please fill in the title and request.");
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('prayers')
        .insert([{ 
          title, 
          request, 
          submitted_by: submittedBy || 'Anonymous' 
        }]);

      if (error) throw error;

      setSuccess(true);
      setTitle('');
      setRequest('');
      setSubmittedBy('');
      fetchPrayers();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <Seo title="Community Prayers" description="Share your prayer requests with the PEFA Kawangware 56 community and pray for others." />
      <div className={styles.header}>
        <h1 className={styles.title}>Community Prayers</h1>
        <p className={styles.subtitle}>Share your burdens and lift others in prayer.</p>
      </div>

      <div className={styles.layout}>
        {/* Form Section */}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.formCard}>
            <h3>Submit a Request</h3>
            <div className={styles.inputGroup}>
              <label>Your Name (Optional)</label>
              <input 
                type="text" 
                placeholder="Anonymous" 
                value={submittedBy} 
                onChange={(e) => setSubmittedBy(e.target.value)} 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Prayer Title</label>
              <input 
                type="text" 
                placeholder="e.g., Healing for family" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Prayer Request</label>
              <textarea 
                placeholder="How can we pray for you?" 
                value={request} 
                onChange={(e) => setRequest(e.target.value)} 
                required
              />
            </div>
            <button type="submit" disabled={submitting} className={styles.button}>
              {submitting ? 'Sending...' : 'Submit Prayer'}
            </button>
            {success && <p className={styles.successMsg}>Prayer submitted successfully!</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}
          </form>
        </div>

        {/* List Section */}
        <div className={styles.listSection}>
          {loading ? (
            <div className={styles.loader}>Loading prayers...</div>
          ) : prayers.length > 0 ? (
            <div className={styles.prayersGrid}>
              {prayers.map((prayer) => (
                <div key={prayer.id} className={styles.prayerCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.author}>{prayer.submitted_by || 'Anonymous'}</span>
                    <span className={styles.date}>
                        {new Date(prayer.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className={styles.prayerTitle}>{prayer.title}</h2>
                  <p className={styles.prayerRequest}>{prayer.request}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noPrayers}>No prayer requests yet. Be the first to share.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Prayers;