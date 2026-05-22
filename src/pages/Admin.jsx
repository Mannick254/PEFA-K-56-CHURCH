import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Admin = () => {
  return (
    <div>
      <h1>Admin</h1>
      <nav>
        <ul>
          <li><Link to="/admin/members">Church Members</Link></li>
          <li><Link to="/admin/youth">Youth</Link></li>
          <li><Link to="/admin/children">Sunday School</Link></li>
          <li><Link to="/admin/attendance">Sunday Service Attendance</Link></li>
          <li><Link to="/admin/visitors">Visitors</Link></li>
          <li><Link to="/admin/sermons">Sermons</Link></li>
          <li><Link to="/admin/events">Events</Link></li>
          <li><Link to="/admin/prayers">Prayers</Link></li>
          <li><Link to="/admin/statement-of-faith">Statement of Faith</Link></li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default Admin;