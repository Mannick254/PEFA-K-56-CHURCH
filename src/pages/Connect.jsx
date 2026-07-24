import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Contact.module.css'; // Reusing styles from Contact page
import Seo from '../components/Seo';

const Connect = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <Seo title="Connect" description="Connect with PEFA Kawangware 56. We'd love to hear from you."/>
        <h2>Thank you!</h2>
        <p>Your message has been sent. We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
    <Seo title="Connect" description="Connect with PEFA Kawangware 56. We'd love to hear from you."/>
      <h2>Connect with us</h2>
      <p>We'd love to hear from you. Fill out the form below to get in touch.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Connect;
