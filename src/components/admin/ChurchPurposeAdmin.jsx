import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/AdminGlobal.css';
import Upload from './upload';

const ChurchPurposeAdmin = () => {
    const [points, setPoints] = useState([]);
    const [formState, setFormState] = useState({ title: '', message: '', imageUrl: '' });
    const [editingPoint, setEditingPoint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('church_purpose').select('*');
        if (error) {
            console.error('Error fetching points:', error);
            setError('Could not fetch church purpose points.');
        } else {
            setPoints(data);
        }
        setIsLoading(false);
    };

    const handleEdit = (point) => {
        setEditingPoint(point);
        setFormState({ title: point.title, message: point.message, imageUrl: point.imageUrl });
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setEditingPoint(null);
        setFormState({ title: '', message: '', imageUrl: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, message, imageUrl } = formState;

        const action = editingPoint
            ? supabase.from('church_purpose').update({ title, message, imageUrl }).eq('id', editingPoint.id)
            : supabase.from('church_purpose').insert([{ title, message, imageUrl }]);

        const { error } = await action;

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            alert(`Point ${editingPoint ? 'updated' : 'added'} successfully!`);
            resetForm();
            fetchPoints();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this point?')) {
            const { error } = await supabase.from('church_purpose').delete().eq('id', id);
            if (error) {
                alert(`Error deleting point: ${error.message}`);
            } else {
                alert('Point deleted successfully!');
                fetchPoints();
            }
        }
    };

    if (isLoading && points.length === 0) return <p>Loading points...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="adminCard">
                <div className="adminCardHeader">
                    <h3>{editingPoint ? 'Edit Purpose Point' : 'Add a New Point'}</h3>
                    <p>Manage the points that describe the purpose of the church.</p>
                </div>
                <form onSubmit={handleSubmit} className="adminForm">
                    <div className="formGroup">
                        <label htmlFor="title">Title</label>
                        <input id="title" name="title" type="text" placeholder="Enter a title" value={formState.title} onChange={(e) => setFormState(prev => ({...prev, title: e.target.value}))} required className="input" />
                    </div>
                    <div className="formGroup">
                        <label>Image</label>
                        <Upload 
                            onUpload={(url) => setFormState(prev => ({ ...prev, imageUrl: url }))}
                            onUrlChange={(url) => setFormState(prev => ({ ...prev, imageUrl: url }))}
                            initialUrl={formState.imageUrl} 
                        />
                    </div>
                    <div className="formGroup">
                        <label>Or paste Image URL</label>
                        <input 
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={formState.imageUrl}
                            onChange={(e) => setFormState(prev => ({ ...prev, imageUrl: e.target.value }))}
                            className={styles.urlInput}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" placeholder="Enter the main message" value={formState.message} onChange={(e) => setFormState(prev => ({...prev, message: e.target.value}))} required className="textarea"></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="adminButton">
                            {editingPoint ? 'Update Point' : 'Save New Point'}
                        </button>
                        {editingPoint && (
                            <button type="button" onClick={resetForm} className="adminButton secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="adminCard">
                <div className="adminCardHeader">
                    <h3>Existing Purpose Points</h3>
                </div>
                {isLoading ? <p>Loading...</p> : (
                    <div className="dataGrid">
                        {points.map((point) => (
                            <div key={point.id} className="dataListItem">
                                <h4>{point.title}</h4>
                                <p>{point.message}</p>
                                {point.imageUrl && <img src={point.imageUrl} alt={point.title} style={{ maxWidth: '100px', borderRadius: '8px' }} />}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => handleEdit(point)} className="adminButton" style={{ flex: 1 }}>Edit</button>
                                    <button onClick={() => handleDelete(point.id)} className="adminButton secondary" style={{ flex: 1 }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChurchPurposeAdmin;
