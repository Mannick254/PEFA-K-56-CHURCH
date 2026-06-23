import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../../styles/AdminGlobal.css'; // Import the new global stylesheet
import Fireworks from '../Fireworks'; // Import the Fireworks component

const HomeAdmin = () => {
    const [homeContent, setHomeContent] = useState(null);
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHomeContent();
    }, []);

    const fetchHomeContent = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('home_page').select('*').single();
        if (error) {
            console.error('Error fetching home content:', error);
            setError('Could not fetch home page content.');
        } else {
            setHomeContent(data);
            setHeroTitle(data.hero_title);
            setHeroSubtitle(data.hero_subtitle);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!homeContent) return;

        const { error } = await supabase
            .from('home_page')
            .update({ hero_title: heroTitle, hero_subtitle: heroSubtitle })
            .eq('id', homeContent.id);

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            alert('Home page content updated successfully!');
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Fireworks options={{ fullscreen: true }} />
            <div className="adminCard">
                <div className="adminCardHeader">
                    <h3>Welcome Admin!</h3>
                    <p>This is your dashboard to manage the website content.</p>
                </div>
            </div>
            <div className="adminCard">
                <div className="adminCardHeader">
                    <h3>Home Page Hero Section</h3>
                    <p>Update the main title and subtitle displayed on the home page.</p>
                </div>
                <form onSubmit={handleSubmit} className="adminForm">
                    <div className="formGroup">
                        <label htmlFor="heroTitle">Hero Title</label>
                        <input
                            id="heroTitle"
                            type="text"
                            placeholder="Enter the main title"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="heroSubtitle">Hero Subtitle</label>
                        <input
                            id="heroSubtitle"
                            type="text"
                            placeholder="Enter the subtitle"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <button type="submit" className="adminButton">
                        Update Home Page
                    </button>
                </form>
            </div>
        </>
    );
};

export default HomeAdmin;
