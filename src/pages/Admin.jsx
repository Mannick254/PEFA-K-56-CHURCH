import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DataView from '../components/admin/DataView';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Seo title="Admin" />
      <div style={{ padding: '0 2rem' }}>
        <Breadcrumb />
      </div>
      <DataView />
    </AdminLayout>
  );
};

export default AdminPage;
