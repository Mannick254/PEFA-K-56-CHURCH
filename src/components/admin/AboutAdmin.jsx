import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/AdminGlobal.css'; // Import the global styles

const AboutAdmin = () => {
    const [aboutContent, setAboutContent] = useState({
        title: '',
        subtitle: '',
        our_story_title: '',
        our_story_p1: '',
        our_story_p2: '',
        our_mission_title: '',
        our_mission_p1: '',
        digital_age_title: '',
        digital_age_p1: '',
        join_us_title: '',
        join_us_p1: ''
    });
    const [id, setId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase.from('about_us').select('*').single();
            
            if (fetchError) {
                // PGRST116 means no rows found, which is fine for the first setup
                if (fetchError.code === 'PGRST116') {
                    console.log('No about content found. Ready for first entry.');
                } else {
                    throw fetchError;
                }
            } else if (data) {
                setAboutContent(data);
                setId(data.id);
            }
        } catch (err) {
            console.error('Error fetching about content:', err);
            setError(`Could not fetch about content: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutContent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error: submitError } = id
                ? await supabase.from('about_us').update(aboutContent).eq('id', id)
                : await supabase.from('about_us').insert([aboutContent]).select();

            if (submitError) throw submitError;

            alert('About content updated successfully!');
            fetchAboutContent(); // Refresh to get ID if it was an insert
        } catch (err) {
            console.error('Error saving about content:', err);
            alert('Error: ' + err.message);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="adminCard">
            <div className="adminCardHeader">
                <h3>Edit About Us Page</h3>
                {error && <p className="error" style={{ color: 'red' }}>Note: {error}</p>}
                {!id && !error && <p>No existing content found. Fill the form to create it.</p>}
            </div>
            <form onSubmit={handleSubmit} className="adminForm">
                
                <div className="formGroup">
                    <label htmlFor="title">Main Title</label>
                    <input type="text" id="title" name="title" value={aboutContent.title || ''} onChange={handleChange} placeholder="Main Title" className="input" />
                </div>
                
                <div className="formGroup">
                    <label htmlFor="subtitle">Subtitle</label>
                    <input type="text" id="subtitle" name="subtitle" value={aboutContent.subtitle || ''} onChange={handleChange} placeholder="Subtitle" className="input" />
                </div>

                <h4>Our Story Section</h4>
                <div className="formGroup">
                    <label htmlFor="our_story_title">Story Title</label>
                    <input type="text" id="our_story_title" name="our_story_title" value={aboutContent.our_story_title || ''} onChange={handleChange} placeholder="Our Story Title" className="input" />
                </div>
                <div className="formGroup">
                    <label htmlFor="our_story_p1">Story Paragraph 1</label>
                    <textarea id="our_story_p1" name="our_story_p1" value={aboutContent.our_story_p1 || ''} onChange={handleChange} placeholder="Our Story Paragraph 1" className="textarea"></textarea>
                </div>
                <div className="formGroup">
                    <label htmlFor="our_story_p2">Story Paragraph 2</label>
                    <textarea id="our_story_p2" name="our_story_p2" value={aboutContent.our_story_p2 || ''} onChange={handleChange} placeholder="Our Story Paragraph 2" className="textarea"></textarea>
                </div>

                <h4>Our Mission Section</h4>
                <div className="formGroup">
                    <label htmlFor="our_mission_title">Mission Title</label>
                    <input type="text" id="our_mission_title" name="our_mission_title" value={aboutContent.our_mission_title || ''} onChange={handleChange} placeholder="Our Mission Title" className="input" />
                </div>
                <div className="formGroup">
                    <label htmlFor="our_mission_p1">Mission Paragraph</label>
                    <textarea id="our_mission_p1" name="our_mission_p1" value={aboutContent.our_mission_p1 || ''} onChange={handleChange} placeholder="Our Mission Paragraph" className="textarea"></textarea>
                </div>

                <h4>Digital Age Section</h4>
                <div className="formGroup">
                    <label htmlFor="digital_age_title">Digital Age Title</label>
                    <input type="text" id="digital_age_title" name="digital_age_title" value={aboutContent.digital_age_title || ''} onChange={handleChange} placeholder="Digital Age Title" className="input" />
                </div>
                <div className="formGroup">
                    <label htmlFor="digital_age_p1">Digital Age Paragraph</label>
                    <textarea id="digital_age_p1" name="digital_age_p1" value={aboutContent.digital_age_p1 || ''} onChange={handleChange} placeholder="Digital Age Paragraph" className="textarea"></textarea>
                </div>

                <h4>Join Us Section</h4>
                <div className="formGroup">
                    <label htmlFor="join_us_title">Join Us Title</label>
                    <input type="text" id="join_us_title" name="join_us_title" value={aboutContent.join_us_title || ''} onChange={handleChange} placeholder="Join Us Title" className="input" />
                </div>
                <div className="formGroup">
                    <label htmlFor="join_us_p1">Join Us Paragraph</label>
                    <textarea id="join_us_p1" name="join_us_p1" value={aboutContent.join_us_p1 || ''} onChange={handleChange} placeholder="Join Us Paragraph" className="textarea"></textarea>
                </div>

                <button type="submit" className="adminButton">{id ? 'Save Changes' : 'Create Content'}</button>
            </form>
        </div>
    );
};

export default AboutAdmin;