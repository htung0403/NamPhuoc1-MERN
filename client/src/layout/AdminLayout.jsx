// src/layouts/AdminLayout.jsx
import React from 'react';
import AdminHeader from '../admin/components/AdminHeader.jsx';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminHeader/>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;