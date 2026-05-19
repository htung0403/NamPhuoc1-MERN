// src/layouts/AdminLayout.jsx
import React from 'react';
import AdminHeader from '../admin/components/AdminHeader.jsx';

const AdminLayout = ({ children }) => {
  return (
    <div className="-mt-20">
      <AdminHeader/>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;