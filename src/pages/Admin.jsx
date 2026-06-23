import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DataView from '../components/admin/DataView';

const AdminPage = () => {
  return (
    <AdminLayout>
      <DataView />
    </AdminLayout>
  );
};

export default AdminPage;