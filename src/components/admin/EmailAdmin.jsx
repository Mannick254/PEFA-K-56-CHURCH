
import React, { useState } from 'react';

const EmailAdmin = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const handleSendEmail = async () => {
    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/send-custom-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendStatus('success');
        setSubject('');
        setMessage('');
      } else {
        setSendStatus('error');
        console.error('Error sending email:', data.error);
      }
    } catch (error) {
      setSendStatus('error');
      console.error('Error sending email:', error);
    }

    setIsSending(false);
  };

  return (
    <div>
      <h2>Send Custom Email</h2>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <button onClick={handleSendEmail} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {sendStatus === 'success' && <p>Email sent successfully!</p>}
      {sendStatus === 'error' && <p>Error sending email. Please try again.</p>}
    </div>
  );
};

export default EmailAdmin;
