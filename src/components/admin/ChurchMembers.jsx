import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ChurchMembers = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*');
    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('members')
      .insert([{ name, email, phone_number: phone }])
      .select();

    if (error) {
      console.error('Error adding member:', error);
    } else if (data) {
      setMembers([...members, data[0]]);
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <div>
      <h2>Church Members</h2>
      
      <h3>Add a new member</h3>
      <form onSubmit={addMember}>
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
        <button type="submit">Add Member</button>
      </form>

      <h3>Existing Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} - {member.email} - {member.phone_number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChurchMembers;
