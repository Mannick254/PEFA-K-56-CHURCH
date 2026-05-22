import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const SundayService = () => {
  const [attendance, setAttendance] = useState([]);
  const [serviceDate, setServiceDate] = useState('');
  const [attendanceCount, setAttendanceCount] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from('sunday_service_attendance')
      .select('*')
      .order('service_date', { ascending: false });
    if (error) {
      console.error('Error fetching attendance:', error);
    } else {
      setAttendance(data);
    }
  };

  const addAttendance = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('sunday_service_attendance')
      .insert([{ service_date: serviceDate, attendance_count: attendanceCount }])
      .select();

    if (error) {
      console.error('Error adding attendance:', error);
    } else if (data) {
      setAttendance([data[0], ...attendance]);
      setServiceDate('');
      setAttendanceCount('');
    }
  };

  return (
    <div>
      <h2>Sunday Service Attendance</h2>
      
      <h3>Record Attendance</h3>
      <form onSubmit={addAttendance}>
        <input
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of attendees"
          value={attendanceCount}
          onChange={(e) => setAttendanceCount(e.target.value)}
          required
        />
        <button type="submit">Record Attendance</button>
      </form>

      <h3>Past Attendance Records</h3>
      <ul>
        {attendance.map((record) => (
          <li key={record.id}>
            {new Date(record.service_date).toLocaleDateString()}: {record.attendance_count} attendees
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SundayService;
