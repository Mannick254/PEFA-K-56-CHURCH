import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient'; // Import your shared Supabase client
import styles from '../../styles/upload.module.css';

const Uploader = ({ 
  onUploadSuccess, 
  bucket = 'media', 
  folder = 'uploads',
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeMB = 5,
  label = "Upload File"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type.');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File too large (Max ${maxSizeMB}MB).`);
      return false;
    }
    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) {
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');
    setUploadProgress(20); // Initial progress jump

    try {
      // Create a unique file path to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type, // ensure Supabase knows the MIME type
        });

      if (error) throw error;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setStatus('success');
      
      if (onUploadSuccess) {
        onUploadSuccess({
          url: publicUrl,
          path: data.path,
          name: file.name,
          size: file.size
        });
      }
    } catch (error) {
      setErrorMessage(error.message || 'Upload failed');
      setStatus('error');
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div className={styles.uploaderContainer}>
      <div 
        className={`
          ${styles.dropZone} 
          ${isDragging ? styles.dragging : ''} 
          ${status === 'uploading' ? styles.disabled : ''}
          ${status === 'error' ? styles.errorZone : ''}
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])}
          style={{ display: 'none' }}
          accept={allowedTypes.join(',')}
        />

        <div className={styles.content}>
          {status === 'idle' && (
            <>
              <div className={styles.iconCircle}><Upload size={24} /></div>
              <p className={styles.mainText}><strong>{label}</strong> or drag and drop</p>
              <p className={styles.subText}>
                {allowedTypes.map(t => t.split('/')[1]).join(', ')} (max {maxSizeMB}MB)
              </p>
            </>
          )}

          {status === 'uploading' && (
            <div className={styles.progressWrapper}>
              <div className={styles.spinner} />
              <p>Uploading {uploadProgress}%</p>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className={styles.successState}>
              <CheckCircle size={32} color="#10b981" />
              <p>Upload Complete!</p>
              <button 
                className={styles.resetBtn} 
                onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
              >
                Upload another
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className={styles.errorState}>
              <AlertCircle size={32} color="#ef4444" />
              <p>{errorMessage}</p>
              <button 
                className={styles.resetBtn} 
                onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploader;
