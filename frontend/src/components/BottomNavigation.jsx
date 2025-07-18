import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', labelHindi: 'होम' },
    { path: '/my-farm', icon: '🌾', label: 'My Crops', labelHindi: 'मेरी फसल' },
    { path: '/market-prices', icon: '📊', label: 'Market', labelHindi: 'बाजार' },
    { path: '/government-schemes', icon: '🏛️', label: 'Schemes', labelHindi: 'योजनाएं' },
    { path: '/crop-diagnosis', icon: '👤', label: 'Profile', labelHindi: 'प्रोफाइल' }
  ];

  return (
    <div className="kisan-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`kisan-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className="kisan-nav-icon">{item.icon}</div>
          <div className="kisan-nav-text">{item.label}</div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;