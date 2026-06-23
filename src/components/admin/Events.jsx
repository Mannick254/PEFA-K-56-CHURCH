import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/AdminEvents.module.css';
import Upload from './upload';

const AdminEvents = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data: events, error: eventsError } = await supabase.from('events').select('*');
    if (eventsError) setError(eventsError.message);

    const allItems = [...events.map(e => ({ ...e, type: 'event' }))].sort((a, b) => new Date(b.date) - new Date(a.date));

    setItems(allItems);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let itemData = { title, description, date, location, image_url: imageUrl };
    let tableName = 'events';

    let result;
    if (editing) {
      result = await supabase.from(tableName).update(itemData).eq('id', editing.id).select();
    } else {
      result = await supabase.from(tableName).insert([itemData]).select();
    }

    const { data, error } = result;
    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data) {
      fetchItems(); // Refetch all items
      cancelEdit();
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date);
    setLocation(item.location);
    setImageUrl(item.image_url || '');
  };

  const handleDelete = async (item) => {
    const tableName = 'events';
    const { error } = await supabase.from(tableName).delete().eq('id', item.id);

    if (error) {
      setError(error.message);
    } else {
      fetchItems(); // Refetch all items
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setDate('');
    setImageUrl('');
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h2>{editing ? 'Edit Event' : 'Add New Event'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        
        <div className={styles.imageUploadContainer}>
          <label>Event Image</label>
          <Upload 
            onUpload={setImageUrl} 
            onUrlChange={setImageUrl}
            initialUrl={imageUrl}
          />
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
        </div>

        <div className={styles.formButtons}>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : editing ? 'Update' : 'Add'}
          </button>
          {editing && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
      {error && <p className={styles.error}>⚠️ {error}</p>}

      <h2>Manage Events</h2>
      {loading && <p>Loading...</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{`Location: ${item.location}`}</td>
              <td className={styles.actionButtons}>
                <button onClick={() => handleEdit(item)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(item)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEvents;
