import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebarComponent from '../components/AdminSidebarComponent';

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AdminSidebarComponent isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <div className="min-h-screen relative z-0 transition-all duration-300 lg:ml-16">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 