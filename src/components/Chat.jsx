import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Chat.module.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setError('Error fetching messages');
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: newMessage }]);

    if (error) {
      setError('Error sending message');
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <p>{message.content}</p>
            <span>{new Date(message.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Chat;
