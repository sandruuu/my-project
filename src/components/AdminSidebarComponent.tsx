import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faPlane,
  faHome,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AdminSidebarComponent: React.FC<AdminSidebarProps> = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/admin',
      icon: faHome,
      text: 'Dashboard'
    },
    {
      path: '/admin/schedules',
      icon: faCalendarAlt,
      text: 'Flights Schedule'
    },
    {
      path: '/admin/flightsTracking',
      icon: faPlane,
      text: 'Flights Tracking'
    },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden bg-[#1B3A4B]/90 backdrop-blur-md text-white p-4 relative z-50">
        <div className="flex items-center justify-between">
          <Link to="adminProfile" className="text-xl font-bold">
          <FontAwesomeIcon 
              icon={faUserCircle} 
              className="text-2xl text-white hover:opacity-100 transition-opacity cursor-pointer" 
            />    
          </Link>
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-lg transition-colors ${
                  isActiveRoute(item.path)
                    ? 'text-white'
                    : 'hover:text-white/80'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col bg-[#1B3A4B]/90 backdrop-blur-md text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 w-16">
        <div className="p-4 flex items-center justify-center border-b border-white/10">
          <div className="flex items-center">
            <Link to="adminProfile" className="text-xl font-bold">
            <FontAwesomeIcon 
              icon={faUserCircle} 
              className="text-2xl text-white hover:opacity-100 transition-opacity cursor-pointer" 
            />
            </Link>
          </div>
        </div>

        <div className="flex-1 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center py-3 transition-colors ${
                isActiveRoute(item.path)
                  ? 'text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer'
                  : 'text-white hover:opacity-80 transition-opacity cursor-pointer'
              }`}
              title={item.text}
            >
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:block ml-16" />
    </>
  );
};

export default AdminSidebarComponent; 