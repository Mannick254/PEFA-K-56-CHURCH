import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const Children = () => {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    const { data, error } = await supabase
      .from('children')
      .select('*');
    if (error) {
      console.error('Error fetching children:', error);
    } else {
      setChildren(data);
    }
  };

  const addChild = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('children')
      .insert([{ name, age }])
      .select();

    if (error) {
      console.error('Error adding child:', error);
    } else if (data) {
      setChildren([...children, data[0]]);
      setName('');
      setAge('');
    }
  };

  return (
    <div>
      <h2>Sunday School</h2>
      
      <h3>Add a new child</h3>
      <form onSubmit={addChild}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Add Child</button>
      </form>

      <h3>Registered Children</h3>
      <ul>
        {children.map((child) => (
          <li key={child.id}>
            {child.name} - {child.age} years old
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Children;
