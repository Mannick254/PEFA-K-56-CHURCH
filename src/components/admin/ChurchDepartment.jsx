import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/ChurchDepartmentAdmin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Edit2, Trash2, 
  Users, UserCheck, Loader2, Upload, 
  Image as ImageIcon, Mail, 
  Clock, MapPin, Tag, Globe, Settings2
} from 'lucide-react';
import Uploader from './upload';

const ChurchDepartmentAdmin = () => {
  const initialFormState = {
    name: '',
    head: '',
    email: '',
    description: '',
    meeting_info: '',
    location: '',
    category: 'General',
    status: 'active',
    image_url: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from('church_departments').select('*').order('name');
      if (error) throw error;
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = ({ url }) => {
    setImagePreview(url);
    setImageUrlInput(url);
    setFormData(prev => ({ ...prev, image_url: url }));
    setSuccess('Image uploaded successfully!');
  };

  const handleUrlInputChange = (e) => {
    const url = e.target.value;
    setImageUrlInput(url);
    setImagePreview(url);
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editing) {
        const { id, created_at, ...updatePayload } = formData;
        const { error } = await supabase.from('church_departments').update(updatePayload).eq('id', editing);
        if (error) throw error;
        setSuccess('Team updated successfully');
      } else {
        const { error } = await supabase.from('church_departments').insert([formData]);
        if (error) throw error;
        setSuccess('Department launched!');
      }
      resetForm();
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const deptToDelete = departments.find(d => d.id === id);
      if (deptToDelete?.image_url) {
        const bucket = 'media'; // Using the default bucket
        const urlParts = deptToDelete.image_url.split(`/${bucket}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }
      const { error } = await supabase.from('church_departments').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Department deleted.');
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImagePreview(null);
    setImageUrlInput('');
    setEditing(null);
    setActiveTab('identity');
  };

  const handleEdit = (dept) => {
    setEditing(dept.id);
    setFormData({ ...initialFormState, ...dept });
    setImagePreview(dept.image_url);
    setImageUrlInput(dept.image_url || '');
    setActiveTab('identity');
    window.scrollTo(0, 0);
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [departments, searchTerm]);

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Ministry Management</h2>
          <p className={styles.subtitle}>Configure church departments and leadership</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><Users size={16}/> {departments.length} Teams</div>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <aside className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.tabs}>
              <button className={activeTab === 'identity' ? styles.activeTab : ''} onClick={() => setActiveTab('identity')}><Tag size={16}/> Identity</button>
              <button className={activeTab === 'logistics' ? styles.activeTab : ''} onClick={() => setActiveTab('logistics')}><Settings2 size={16}/> Logistics</button>
              <button className={activeTab === 'media' ? styles.activeTab : ''} onClick={() => setActiveTab('media')}><ImageIcon size={16}/> Media</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.tabContent}>
              <AnimatePresence mode="wait">
                {activeTab === 'identity' && (
                  <motion.div key="identity" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className={styles.inputGroup}><label>Department Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Outreach Team" required /></div>
                    <div className={styles.inputGroup}><label>Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}><option value="Worship">Worship & Arts</option><option value="Creative">Media & Tech</option><option value="Outreach">Community Outreach</option><option value="Hospitality">Hospitality</option><option value="Admin">Administration</option><option value="General">General</option></select></div>
                    <div className={styles.inputGroup}><label>Mission Statement</label><textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="What is the heartbeat of this team?" /></div>
                  </motion.div>
                )}
                {activeTab === 'logistics' && (
                  <motion.div key="logistics" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className={styles.inputGroup}><label>Lead Coordinator</label><div className={styles.iconInput}><UserCheck size={18} /><input type="text" value={formData.head} onChange={(e) => setFormData({...formData, head: e.target.value})} /></div></div>
                    <div className={styles.inputGroup}><label>Public Contact Email</label><div className={styles.iconInput}><Mail size={18} /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div></div>
                    <div className={styles.inputRow}><div className={styles.inputGroup}><label><Clock size={14}/> Schedule</label><input type="text" value={formData.meeting_info} onChange={(e) => setFormData({...formData, meeting_info: e.target.value})} placeholder="Tues @ 7PM" /></div><div className={styles.inputGroup}><label><MapPin size={14}/> Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Room 102" /></div></div>
                  </motion.div>
                )}
                {activeTab === 'media' && (
                  <motion.div key="media" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    {imagePreview && <div className={styles.previewZone}><p>Image Preview:</p><img src={imagePreview} alt="Preview"/></div>}
                    <Uploader 
                      bucket="media" 
                      folder="uploads" 
                      onUploadSuccess={handleUploadSuccess} 
                      label="Upload Department Image"
                    />
                    <div className={styles.urlInputArea} style={{marginTop: '1rem'}}><Globe size={16}/><input type="text" placeholder="Or paste image URL..." value={imageUrlInput} onChange={handleUrlInputChange}/></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={styles.formFooter}><button type="submit" className={styles.submitBtn} disabled={submitting}>{submitting ? <Loader2 className={styles.spin} /> : (editing ? 'Update Team' : 'Create Team')}</button>{editing && <button type="button" className={styles.clearBtn} onClick={resetForm}>Cancel</button>}</div>
            </form>
          </div>
        </aside>

        <main className={styles.listSection}>
          <div className={styles.searchRow}><Search size={18} /><input type="text" placeholder="Find a team..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className={styles.grid}>
            {loading ? <Loader2 className={styles.spin} /> : filteredDepartments.map(dept => (
              <motion.div layout key={dept.id} className={styles.deptCard}>
                <div className={styles.cardImg}>{dept.image_url ? <img src={dept.image_url} alt={dept.name} /> : <div className={styles.noImg}><ImageIcon/></div>}<div className={styles.badge}>{dept.category}</div></div>
                <div className={styles.cardContent}><h4>{dept.name}</h4><p className={styles.lead}><UserCheck size={14}/> {dept.head}</p><div className={styles.meta}>{dept.location && <span><MapPin size={12}/> {dept.location}</span>}{dept.meeting_info && <span><Clock size={12}/> {dept.meeting_info}</span>}</div></div>
                <div className={styles.cardActions}><button onClick={() => handleEdit(dept)} className={styles.edit}><Edit2 size={16}/></button><button onClick={() => handleDelete(dept.id)} className={styles.del}><Trash2 size={16}/></button></div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChurchDepartmentAdmin;