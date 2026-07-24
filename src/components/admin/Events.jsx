import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  X, 
  Upload as UploadIcon, 
  Link as LinkIcon, 
  Calendar, 
  MapPin, 
  Type,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import styles from '../../styles/EventAdmin.module.css';
import Upload from './upload';

const AdminEvents = () => {
  const initialFormState = {
    title: '',
    location: '',
    date: '',
    description: '',
    video_url: '',
    image_url: '',
  };

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      showStatus('error', error.message);
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = editingId
      ? await supabase.from('events').update(formData).eq('id', editingId).select()
      : await supabase.from('events').insert([formData]).select();

    if (result.error) {
      showStatus('error', result.error.message);
    } else {
      showStatus('success', `Event ${editingId ? 'updated' : 'created'} successfully!`);
      cancelEdit();
      fetchEvents();
    }
    setLoading(false);
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description,
      video_url: event.video_url || '',
      image_url: event.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) showStatus('error', error.message);
      else {
        showStatus('success', 'Event removed');
        fetchEvents();
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div>
          <h1>Event Dashboard</h1>
          <p>Schedule and manage upcoming church events and gatherings.</p>
        </div>
      </header>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}

      <section className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconCircle}>
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
          </div>
          <h2>{editingId ? 'Edit Event Details' : 'Create New Event'}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label><Type size={16} /> Event Title</label>
              <input name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="e.g. Annual Youth Conference" required />
            </div>

            <div className={styles.inputGroup}>
              <label><MapPin size={16} /> Location</label>
              <input name="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="Main Sanctuary or Online" required />
            </div>

            <div className={styles.inputGroup}>
              <label><Calendar size={16} /> Date & Time</label>
              <input name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} required />
            </div>

            <div className={styles.inputGroup}>
              <label><LinkIcon size={16} /> Promo/Video URL</label>
              <input name="video_url" type="url" value={formData.video_url} onChange={handleInputChange} placeholder="Optional YouTube link" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Event Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Tell the congregation about this event..." />
          </div>

          <div className={styles.uploadSection}>
            <label className={styles.sectionLabel}><UploadIcon size={16} /> Event Banner / Flyer</label>
            <div className={styles.uploadControls}>
              <Upload 
                onUploadSuccess={(uploadInfo) => setFormData(prev => ({...prev, image_url: uploadInfo.url}))} 
              />
              <div className={styles.urlInputWrapper}>
                <span>OR PASTE URL</span>
                <input 
                  type="text" 
                  name="image_url" 
                  placeholder="https://..." 
                  value={formData.image_url} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Event' : 'Publish Event'}
            </button>
            {editingId && (
              <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                <X size={16} /> Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.cardHeader}>
          <h2>Upcoming & Past Events</h2>
          <span className={styles.countBadge}>{events.length} Events</span>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Location</th>
                <th>Date</th>
                <th className={styles.textRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id}>
                    <td className={styles.titleCell}>{event.title}</td>
                    <td>{event.location}</td>
                    <td>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleEdit(event)} className={styles.editBtn} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className={styles.deleteBtn} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.emptyRow}>No events found. Start by adding one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminEvents;
