import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Film } from 'lucide-react';
import styles from '../../styles/upload.module.css';

const VideoUploader = ({ onUploadSuccess, onUploadStart, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary credentials are not set in the environment variables. Video upload will not work.');
  }

  const validateFile = (file) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Invalid file type. Please upload a video.');
      return false;
    }
    // You can add size validation here if needed
    return true;
  };

  const uploadFile = async (file) => {
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      setErrorMessage('Cloudinary credentials are not configured.');
      setStatus('error');
      if (onUploadError) onUploadError('Cloudinary credentials are not configured.');
      return;
    }

    if (!validateFile(file)) {
      setStatus('error');
      if (onUploadError) onUploadError('Invalid file type.');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');
    if (onUploadStart) onUploadStart();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setStatus('success');

      if (onUploadSuccess) {
        onUploadSuccess({
          url: data.secure_url,
          public_id: data.public_id,
          name: file.name,
          size: file.size,
        });
      }
    } catch (error) {
      setErrorMessage(error.message || 'Upload failed');
      setStatus('error');
      if (onUploadError) onUploadError(error.message || 'Upload failed');
    }
  };

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
          accept="video/*"
        />

        <div className={styles.content}>
          {status === 'idle' && (
            <>
              <div className={styles.iconCircle}><Film size={24} /></div>
              <p className={styles.mainText}><strong>Upload Video</strong> or drag and drop</p>
              <p className={styles.subText}>Video files (MP4, MOV, etc.)</p>
            </>
          )}

          {status === 'uploading' && (
             <div className={styles.progressWrapper}>
              <div className={styles.spinner} />
              <p>Uploading... </p>
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

export default VideoUploader;
