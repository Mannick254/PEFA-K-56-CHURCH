import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Youth = () => {
  const [youth, setYouth] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchYouth();
  }, []);

  const fetchYouth = async () => {
    const { data, error } = await supabase
      .from('youth')
      .select('*');
    if (error) {
      console.error('Error fetching youth:', error);
    } else {
      setYouth(data);
    }
  };

  const addYouth = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('youth')
      .insert([{ name, email, phone_number: phone }])
      .select();

    if (error) {
      console.error('Error adding youth member:', error);
    } else if (data) {
      setYouth([...youth, data[0]]);
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <div>
      <h2>Youth</h2>
      
      <h3>Add a new youth member</h3>
      <form onSubmit={addYouth}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Add Youth Member</button>
      </form>

      <h3>Existing Youth Members</h3>
      <ul>
        {youth.map((member) => (
          <li key={member.id}>
            {member.name} - {member.email} - {member.phone_number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Youth;
