import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { translate } = useLanguage();
  
  const navItems = [
    { path: '/', icon: '🏠', labelKey: 'nav.home' },
    { path: '/my-farm', icon: '🌾', labelKey: 'nav.myFarm' },
    { path: '/market-prices', icon: '📊', labelKey: 'nav.market' },
    { path: '/government-schemes', icon: '🏛️', labelKey: 'nav.schemes' },
    { path: '/crop-diagnosis', icon: '👤', labelKey: 'nav.profile' }
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
          <div className="kisan-nav-text">{translate(item.labelKey)}</div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;