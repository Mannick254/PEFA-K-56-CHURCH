import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import styles from '../../styles/ChurchDepartmentAdmin.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Plus, Search, Edit2, Trash2, X, CheckCircle, 
  Users, UserCheck, AlertCircle, Loader2, Upload, Image as ImageIcon, Link as LinkIcon, Crop 
} from 'lucide-react';

const ChurchDepartmentAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Effect to handle preview from URL input
  useEffect(() => {
    if (imageUrlInput) {
      setImagePreview(imageUrlInput);
    }
  }, [imageUrlInput]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('church_departments')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader();
        reader.addEventListener('load', () =>
            setImagePreview(reader.result?.toString() || ''),
        );
        reader.readAsDataURL(e.target.files[0]);
        setIsCropping(true);
        setImageFile(e.target.files[0]);
        setImageUrlInput(''); // Prioritize file upload, clear URL input
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('department-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('department-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };
  
  function onImageLoad(e) {
    const { width: imageWidth, height: imageHeight } = e.currentTarget;
    
    // Define the crop aspect ratio
    const aspectRatio = 1;

    // Create a crop that fills the width of the image, with the correct aspect ratio.
    let crop = makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspectRatio,
      imageWidth,
      imageHeight
    );

    // If the resulting crop is taller than the image, it means the image is wider than the aspect ratio.
    // In this case, we need to base the crop on 100% height instead.
    if (crop.height > 100) {
        crop = makeAspectCrop(
            {
                unit: '%',
                height: 100
            },
            aspectRatio,
            imageWidth,
            imageHeight
        );
    }
    
    // Now, center it horizontally and align to the top vertically.
    crop.x = (100 - crop.width) / 2;
    crop.y = 0; // Align to the top

    setCrop(crop);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptHead.trim()) return;

    setSubmitting(true);
    setError(null);
    
    try {
      let finalImageUrl = null;

      // A selected file takes priority
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      } else if (imageUrlInput.trim()) {
        finalImageUrl = imageUrlInput.trim();
      } else if (editing) {
        // If editing and no new image is provided, keep the existing one
        finalImageUrl = imagePreview;
      }

      const payload = { 
        name: newDeptName, 
        head: newDeptHead, 
        image_url: finalImageUrl 
      };

      if (editing) {
        const { error } = await supabase
          .from('church_departments')
          .update(payload)
          .eq('id', editing);
        if (error) throw error;
        setSuccess('Department updated!');
      } else {
        const { error } = await supabase
          .from('church_departments')
          .insert([payload]);
        if (error) throw error;
        setSuccess('Department created!');
      }

      resetForm();
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewDeptName('');
    setNewDeptHead('');
    setImageFile(null);
    setImagePreview(null);
    setImageUrlInput('');
    setEditing(null);
    setIsCropping(false);
    setCompletedCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (dept) => {
    setEditing(dept.id);
    setNewDeptName(dept.name);
    setNewDeptHead(dept.head);
    setImagePreview(dept.image_url);
    setImageUrlInput(dept.image_url || '');
    setImageFile(null);
    setIsCropping(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;

    try {
      const { error } = await supabase.from('church_departments').delete().eq('id', id);

      if (error) {
        throw error;
      }
      
      setDepartments(departments.filter(dept => dept.id !== id));
      setSuccess('Deleted.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (blob) {
      const croppedFile = new File([blob], 'image.png', { type: 'image/png' });
      setImageFile(croppedFile);
      setImagePreview(URL.createObjectURL(croppedFile));
      setIsCropping(false);
    }
  }

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => 
      (dept.name && dept.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dept.head && dept.head.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [departments, searchTerm]);

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Department Admin</h2>
          <p className={styles.subtitle}>Manage teams and visual identity</p>
        </div>
        <div className={styles.statCard}>
          <Users size={20} />
          <span>{departments.length} Teams</span>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <aside className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.card}>
            <h3>{editing ? 'Edit Team' : 'New Team'}</h3>
            
            <div className={styles.imageUploadGroup}>
              <div 
                className={styles.previewBox} 
                onClick={() => !isCropping && fileInputRef.current.click()}
              >
                {imagePreview && !isCropping ? (
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                ) : null}
                {isCropping ? (
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={1}
                    >
                        <img ref={imgRef} src={imagePreview} onLoad={onImageLoad} />
                    </ReactCrop>
                ) : !imagePreview && (
                  <div className={styles.uploadPlaceholder}>
                    <Upload size={24} />
                    <span>Upload Photo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                hidden 
              />
            </div>

            {isCropping && <button type="button" className={styles.primaryBtn} onClick={handleCrop}><Crop size={16}/> Crop Image</button>}
            
            <div className={styles.inputGroup}>
              <label>Or Paste Image URL</label>
               <div className={styles.inputIconWrapper}>
                <LinkIcon size={18} />
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setImageFile(null); // When user types a URL, they switch away from file upload mode
                    setIsCropping(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Department Name</label>
              <input
                type="text"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="Worship Team"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Leader Name</label>
              <div className={styles.inputIconWrapper}>
                <UserCheck size={18} />
                <input
                  type="text"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn} disabled={submitting || isCropping}>
                {submitting ? <Loader2 className={styles.spinner} /> : (editing ? 'Update' : 'Add Team')}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <AnimatePresence>
            {success && <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className={styles.successToast}><CheckCircle size={18}/> {success}</motion.div>}
            {error && <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className={styles.errorToast}><AlertCircle size={18}/> {error}</motion.div>}
          </AnimatePresence>
        </aside>

        <main className={styles.listSection}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.listContainer}>
            {loading ? (
              <div className={styles.loadingState}><Loader2 className={styles.spinner} /></div>
            ) : (
              <AnimatePresence>
                {filteredDepartments.map(dept => (
                  <motion.div layout key={dept.id} className={styles.listItem}>
                    <div className={styles.deptFlex}>
                      <div className={styles.avatar}>
                        {dept.image_url ? (
                          <img src={dept.image_url} alt={dept.name} />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>
                      <div className={styles.deptInfo}>
                        <h4>{dept.name}</h4>
                        <p><UserCheck size={14} /> {dept.head}</p>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button onClick={() => handleEdit(dept)} className={styles.editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(dept.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChurchDepartmentAdmin;
